import { createFileRoute } from "@tanstack/react-router";
import { CustomBlocks } from "@/components/aeon/CustomBlocks";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Database,
  MapPin,
  Terminal,
  Zap,
} from "lucide-react";
import { KeyValue, Panel, Pill } from "@/components/aeon/primitives";
import { FailoverMap } from "@/components/aeon/FailoverMap";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Live Operations Center | Aeon Agentic SRE Brain" },
      {
        name: "description",
        content:
          "Real-time multi-region failover monitoring for the Aeon AI SRE agent, backed by CockroachDB zero-data-loss agentic memory and AWS Bedrock reasoning.",
      },
      { property: "og:title", content: "Live Operations Center | Aeon Agentic SRE Brain" },
      {
        property: "og:description",
        content:
          "Watch the Aeon AI SRE agent resume cross-region incident remediation from CockroachDB persistent memory.",
      },
    ],
  }),
  component: LiveOperations,
});

type LogTag =
  | "VECTOR SEARCH"
  | "RAG MATCH FOUND"
  | "MCP ENGINE"
  | "AWS BEDROCK"
  | "CCLOUD CLI"
  | "STATE PERSIST"
  | "REGION FAILURE"
  | "MEMORY RESTORE";

const tagTone: Record<LogTag, string> = {
  "VECTOR SEARCH": "text-info",
  "RAG MATCH FOUND": "text-success",
  "MCP ENGINE": "text-info",
  "AWS BEDROCK": "text-foreground",
  "CCLOUD CLI": "text-success",
  "STATE PERSIST": "text-info",
  "REGION FAILURE": "text-danger",
  "MEMORY RESTORE": "text-success",
};

const BASE_LOG: { tag: LogTag; msg: string; t: string }[] = [
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

const OUTAGE_LOG: { tag: LogTag; msg: string; t: string }[] = [
  {
    tag: "REGION FAILURE",
    t: "06:14:19.004",
    msg: "us-east-1 worker crashed mid-step (SIGKILL). Lease lost on node-1.",
  },
  {
    tag: "MEMORY RESTORE",
    t: "06:14:19.031",
    msg: "us-west-2 worker acquired session lease from CockroachDB. Rehydrating step 3 of 4.",
  },
  {
    tag: "STATE PERSIST",
    t: "06:14:19.058",
    msg: "Resumed at 'Execute ccloud cluster scale-nodes'. 0 rows lost, 0 duplicated writes.",
  },
  {
    tag: "CCLOUD CLI",
    t: "06:14:19.404",
    msg: "ccloud cluster scale-nodes --region us-west-2 --json -> Status: Success",
  },
];

function LiveOperations() {
  const [log, setLog] = useState(BASE_LOG);
  const [phase, setPhase] = useState<"stable" | "failing" | "recovered">("stable");
  const [progress, setProgress] = useState(75);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [log]);

  const simulate = () => {
    if (phase === "failing") return;
    setPhase("failing");
    setProgress(38);
    setLog((l) => [...l, OUTAGE_LOG[0]!]);
    let i = 1;
    const tick = setInterval(() => {
      setLog((l) => [...l, OUTAGE_LOG[i]!]);
      if (i === 1) setPhase("recovered");
      setProgress(38 + i * 12);
      i += 1;
      if (i >= OUTAGE_LOG.length) {
        clearInterval(tick);
        setProgress(100);
      }
    }, 900);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* Column 1 */}
      <div className="space-y-5">
        <Panel
          title="Active Agent Session"
          subtitle="Persistent agentic memory · CockroachDB"
          icon={<Activity className="size-4" />}
          action={
            <Pill tone={phase === "failing" ? "danger" : "success"} pulse>
              {phase === "failing" ? "Recovering" : "Executing"}
            </Pill>
          }
        >
          <p className="font-mono text-sm font-semibold">session_crdb_9842_failover</p>
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground">
                Step {progress >= 100 ? 4 : 3} of 4
              </span>
              <span className="tabular-nums text-success">{progress}% Complete</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-success transition-[width] duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {["Detect", "Recall", "Reason", "Remediate"].map((s, i) => {
                const done = progress >= (i + 1) * 25;
                return (
                  <div
                    key={s}
                    className={cn(
                      "rounded-xl px-2 py-2 text-center text-[0.65rem] font-semibold ring-1 transition-colors",
                      done
                        ? "bg-success-soft text-success ring-success-soft"
                        : "bg-surface text-muted-foreground ring-border-subtle",
                    )}
                  >
                    {s}
                  </div>
                );
              })}
            </div>
          </div>
        </Panel>

        <Panel
          title="Regional Failover Map"
          subtitle="us-east-1 (FAILED) → us-west-2 (RESUMED via COCKROACHDB MEMORY)"
          icon={<MapPin className="size-4" />}
        >
          <FailoverMap active={phase !== "stable" ? "us-west-2" : "us-east-1"} />
        </Panel>

        <Panel
          title="Key-Value Memory Snapshot"
          subtitle="agent_execution_sessions"
          icon={<Database className="size-4" />}
        >
          <KeyValue
            rows={[
              { k: "last_persisted_step", v: "Execute ccloud cluster scale-nodes" },
              {
                k: "context_state",
                v: "VPC Timeout isolated; DB transaction state preserved across regions",
              },
              {
                k: "vector_distance",
                v: (
                  <span className="text-info">Cosine: 0.084 (High Similarity Match)</span>
                ),
              },
            ]}
          />
        </Panel>
      </div>

      {/* Column 2 */}
      <Panel
        className="flex min-h-[32rem] flex-col"
        bodyClassName="flex min-h-0 flex-1 flex-col p-0"
        title="Incident & RAG Resolution Stream"
        subtitle="Live agent execution events"
        icon={<Terminal className="size-4" />}
        action={<Pill tone="info">{log.length} events</Pill>}
      >
        <div
          ref={feedRef}
          className="min-h-0 flex-1 overflow-y-auto bg-surface/60 p-4 font-mono text-xs leading-relaxed"
        >
          {log.map((l, i) => (
            <div
              key={`${l.t}-${i}`}
              className="animate-fade-up border-b border-border-subtle/70 py-2 last:border-0"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground">{l.t}</span>
                <span className={cn("font-semibold", tagTone[l.tag])}>[{l.tag}]</span>
              </div>
              <p className="mt-1 break-words text-foreground/90">{l.msg}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border-subtle p-4">
          <p className="min-w-0 truncate text-xs text-muted-foreground">
            {phase === "recovered" ? (
              <span className="inline-flex items-center gap-1.5 text-success">
                <CheckCircle className="size-3.5 shrink-0" /> Resumed in us-west-2 · zero
                data loss
              </span>
            ) : phase === "failing" ? (
              <span className="inline-flex items-center gap-1.5 text-danger">
                <AlertTriangle className="size-3.5 shrink-0" /> us-east-1 worker crashed
              </span>
            ) : (
              "Agent healthy · checkpointing every step"
            )}
          </p>
          <button
            onClick={simulate}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-card transition-transform hover:scale-[1.02] active:scale-100"
          >
            <Zap className="size-4" />
            Simulate Region Outage &amp; Agent Resume
          </button>
        </div>
      </Panel>
    <CustomBlocks view="operations" />
    </div>
  );
}
