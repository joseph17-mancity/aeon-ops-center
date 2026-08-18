import { useSyncExternalStore } from "react";
import { MCP_AUDIT_LOG, type AuditRow } from "@/data/mockCluster";

export type LogTag =
  | "VECTOR SEARCH"
  | "RAG MATCH FOUND"
  | "MCP ENGINE"
  | "AWS BEDROCK"
  | "CCLOUD CLI"
  | "STATE PERSIST"
  | "REGION FAILURE"
  | "MEMORY RESTORE"
  | "TOPOLOGY"
  | "ADVISOR"
  | "INDEX BUILD";

export type LogEvent = { tag: LogTag; t: string; msg: string };

export type Recommendation = {
  id: string;
  title: string;
  impact: string;
  tone: "info" | "success" | "warning";
  sql: string;
};

export type ClusterState = {
  phase: "stable" | "failing" | "recovered";
  progress: number;
  events: LogEvent[];
  failedNode: string | null;
  hybridTarget: boolean;
  extraRegions: { id: string; label: string; sub: string }[];
  appliedRecs: string[];
  extraRecs: Recommendation[];
  vectorRows: number;
  reindexing: boolean;
  reindexProgress: number;
  auditEntries: AuditRow[];
  simRuns: number;
};

const BASE_EVENTS: LogEvent[] = [
  {
    tag: "VECTOR SEARCH",
    t: "06:12:04.118",
    msg: "Querying CockroachDB Vector Index for runbooks matching 'VPC Timeout & Lambda Retry'...",
  },
  {
    tag: "RAG MATCH FOUND",
    t: "06:12:04.122",
    msg: "Found runbook 'Auto-healing AWS Lambda VPC Timeout in us-east-1' (Cosine: 0.084).",
  },
  {
    tag: "MCP ENGINE",
    t: "06:12:04.140",
    msg: "Reading database audit log from https://cockroachlabs.cloud/mcp - No transactional errors.",
  },
  {
    tag: "AWS BEDROCK",
    t: "06:12:04.159",
    msg: "Reasoning complete: Triggering ccloud CLI auto-remediation.",
  },
  {
    tag: "CCLOUD CLI",
    t: "06:12:04.192",
    msg: "ccloud cluster restart-node --node-id=2 --json -> Status: Success",
  },
  {
    tag: "STATE PERSIST",
    t: "06:12:04.201",
    msg: "Checkpoint saved to CockroachDB 'agent_execution_sessions' table. Zero data loss.",
  },
];

const OUTAGE_STEPS: LogEvent[] = [
  {
    tag: "REGION FAILURE",
    t: "",
    msg: "us-east-1 worker crashed mid-step (SIGKILL). Lease lost on node-1.",
  },
  {
    tag: "MEMORY RESTORE",
    t: "",
    msg: "us-west-2 worker acquired session lease from CockroachDB. Rehydrating step 3 of 4.",
  },
  {
    tag: "STATE PERSIST",
    t: "",
    msg: "Resumed at 'Execute ccloud cluster scale-nodes'. 0 rows lost, 0 duplicated writes.",
  },
  {
    tag: "CCLOUD CLI",
    t: "",
    msg: "ccloud cluster scale-nodes --region us-west-2 --json -> Status: Success",
  },
];

export function stamp(): string {
  const d = new Date();
  const p = (n: number, w = 2) => String(n).padStart(w, "0");
  return `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}.${p(
    d.getUTCMilliseconds(),
    3,
  )}`;
}

let state: ClusterState = {
  phase: "stable",
  progress: 75,
  events: BASE_EVENTS,
  failedNode: null,
  hybridTarget: false,
  extraRegions: [],
  appliedRecs: [],
  extraRecs: [],
  vectorRows: 1_284_902,
  reindexing: false,
  reindexProgress: 0,
  auditEntries: [],
  simRuns: 0,
};

const listeners = new Set<() => void>();

function set(patch: Partial<ClusterState> | ((s: ClusterState) => Partial<ClusterState>)) {
  const next = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useCluster<T>(selector: (s: ClusterState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  );
}

function pushEvent(e: Omit<LogEvent, "t"> & { t?: string }) {
  set((s) => ({ events: [...s.events, { ...e, t: e.t ?? stamp() }] }));
}

function pushAudit(row: Omit<AuditRow, "t"> & { t?: string }) {
  set((s) => ({ auditEntries: [{ ...row, t: row.t ?? stamp() }, ...s.auditEntries] }));
}

/** Full audit trail: live actions first, then the seeded archive. */
export function useAuditTrail(): AuditRow[] {
  const live = useCluster((s) => s.auditEntries);
  return [...live, ...MCP_AUDIT_LOG];
}

let simTimer: ReturnType<typeof setInterval> | null = null;

export const clusterActions = {
  simulateOutage() {
    if (state.phase === "failing" || simTimer) return;
    set({ phase: "failing", progress: 38, failedNode: "lambda-east", simRuns: state.simRuns + 1 });
    pushEvent(OUTAGE_STEPS[0]!);
    pushAudit({
      actor: "AEON",
      action: "region outage simulated -> us-east-1 worker SIGKILL",
      region: "us-east-1",
      result: "Failover",
      tone: "danger",
    });
    let i = 1;
    simTimer = setInterval(() => {
      const step = OUTAGE_STEPS[i];
      if (step) pushEvent(step);
      if (i === 1) set({ phase: "recovered" });
      set({ progress: Math.min(100, 38 + i * 12) });
      i += 1;
      if (i >= OUTAGE_STEPS.length) {
        if (simTimer) clearInterval(simTimer);
        simTimer = null;
        set({ progress: 100 });
        pushAudit({
          actor: "CRDB",
          action: "session_crdb_9842_failover resumed from checkpoint in us-west-2",
          region: "us-west-2",
          result: "0 data loss",
          tone: "success",
        });
      }
    }, 900);
  },

  resetSession() {
    if (simTimer) {
      clearInterval(simTimer);
      simTimer = null;
    }
    set({ phase: "stable", progress: 75, events: BASE_EVENTS, failedNode: null });
    pushAudit({
      actor: "AEON",
      action: "operator reset live session state",
      region: "global",
      result: "Reset",
      tone: "info",
    });
  },

  setFailedNode(id: string | null, label?: string) {
    set({ failedNode: id, phase: id ? "failing" : state.phase });
    if (id) {
      pushEvent({
        tag: "TOPOLOGY",
        t: stamp(),
        msg: `${label ?? id} marked FAILED. Rerouting execution to surviving worker.`,
      });
      pushAudit({
        actor: "AEON",
        action: `topology failure injected on ${label ?? id}`,
        region: "global",
        result: "Rerouted",
        tone: "warning",
      });
    } else {
      pushAudit({
        actor: "AEON",
        action: "topology restored — all workloads healthy",
        region: "global",
        result: "Healthy",
        tone: "success",
      });
    }
  },

  toggleHybrid() {
    set({ hybridTarget: !state.hybridTarget });
  },

  addRegion() {
    const pool = [
      { id: "crdb-apse1", label: "CRDB node-7", sub: "ap-southeast-1" },
      { id: "crdb-euw1", label: "CRDB node-8", sub: "eu-west-1" },
      { id: "crdb-sae1", label: "CRDB node-9", sub: "sa-east-1" },
    ];
    const next = pool[state.extraRegions.length];
    if (!next) return null;
    set({ extraRegions: [...state.extraRegions, next] });
    pushAudit({
      actor: "CCLOUD",
      action: `ccloud cluster region add --region ${next.sub}`,
      region: next.sub,
      result: "Provisioned",
      tone: "success",
    });
    return next;
  },

  applyRec(id: string, title: string) {
    if (state.appliedRecs.includes(id)) return;
    set({ appliedRecs: [...state.appliedRecs, id] });
    pushEvent({ tag: "ADVISOR", t: stamp(), msg: `Applied schema change via MCP: ${title}` });
    pushAudit({
      actor: "MCP",
      action: `apply_schema_change(${id}) — ${title}`,
      region: "global",
      result: "Applied",
      tone: "success",
    });
  },

  runAdvisorSweep() {
    const idx = state.extraRecs.length + 4;
    const candidates: Recommendation[] = [
      {
        id: `rec-0${idx}`,
        title: "Split hot range on incident_audit_log (ts) to reduce lease contention",
        impact: "Est. −22% p99 write latency",
        tone: "warning",
        sql: "ALTER TABLE incident_audit_log SPLIT AT VALUES ('2026-08-01T00:00:00Z');",
      },
      {
        id: `rec-0${idx}`,
        title: "Drop unused index sessions_legacy_idx (0 reads / 7d)",
        impact: "Reclaims 4.2 GiB across 6 nodes",
        tone: "info",
        sql: "DROP INDEX agent_execution_sessions@sessions_legacy_idx;",
      },
      {
        id: `rec-0${idx}`,
        title: "Set GC TTL to 4h on runbook_embeddings for faster compaction",
        impact: "Est. −18% storage amplification",
        tone: "success",
        sql: "ALTER TABLE runbook_embeddings CONFIGURE ZONE USING gc.ttlseconds = 14400;",
      },
    ];
    const rec = candidates[state.extraRecs.length % candidates.length]!;
    set({ extraRecs: [...state.extraRecs, rec] });
    pushAudit({
      actor: "MCP",
      action: "advisor_sweep() — analysed 24,819 statements",
      region: "global",
      result: "1 new rec",
      tone: "info",
    });
    return rec;
  },

  reindexRunbooks(onDone?: (rows: number) => void) {
    if (state.reindexing) return;
    set({ reindexing: true, reindexProgress: 0 });
    pushEvent({
      tag: "INDEX BUILD",
      t: stamp(),
      msg: "CREATE VECTOR INDEX ... backfill started on runbook_embeddings.",
    });
    const timer = setInterval(() => {
      const p = state.reindexProgress + 20;
      if (p >= 100) {
        clearInterval(timer);
        const rows = state.vectorRows + 1_204;
        set({ reindexing: false, reindexProgress: 100, vectorRows: rows });
        pushAudit({
          actor: "CRDB",
          action: "runbook_embeddings vector index rebuilt (1,204 new rows)",
          region: "global",
          result: "Indexed",
          tone: "success",
        });
        onDone?.(rows);
      } else {
        set({ reindexProgress: p });
      }
    }, 400);
  },
};
