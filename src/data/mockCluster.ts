/**
 * ─────────────────────────────────────────────────────────────
 *  AEON · MOCK CLUSTER DATA (safe to edit)
 * ─────────────────────────────────────────────────────────────
 * Demo data for the CockroachDB cluster, the vector index and
 * the MCP / ccloud audit trail. Add or remove rows freely —
 * every view reads straight from these arrays.
 */

export type NodeStatus = "live" | "degraded" | "down";

export type CrdbNode = {
  id: number;
  address: string;
  region: string;
  az: string;
  status: NodeStatus;
  ranges: number;
  leases: number;
  cpu: string;
  liveBytes: string;
  vectorRows: string;
  replicationLag: string;
  version: string;
};

export const CRDB_NODES: CrdbNode[] = [
  {
    id: 1,
    address: "aeon-crdb-1.us-east-1:26257",
    region: "us-east-1",
    az: "us-east-1a",
    status: "live",
    ranges: 4182,
    leases: 1394,
    cpu: "0.41",
    liveBytes: "412 GiB",
    vectorRows: "1,284,904",
    replicationLag: "1.2 ms",
    version: "v24.3.4",
  },
  {
    id: 2,
    address: "aeon-crdb-2.us-east-1:26257",
    region: "us-east-1",
    az: "us-east-1b",
    status: "degraded",
    ranges: 4180,
    leases: 902,
    cpu: "0.78",
    liveBytes: "410 GiB",
    vectorRows: "1,284,904",
    replicationLag: "4.9 ms",
    version: "v24.3.4",
  },
  {
    id: 3,
    address: "aeon-crdb-3.us-west-2:26257",
    region: "us-west-2",
    az: "us-west-2a",
    status: "live",
    ranges: 4181,
    leases: 1421,
    cpu: "0.33",
    liveBytes: "411 GiB",
    vectorRows: "1,284,904",
    replicationLag: "1.8 ms",
    version: "v24.3.4",
  },
  {
    id: 4,
    address: "aeon-crdb-4.us-west-2:26257",
    region: "us-west-2",
    az: "us-west-2c",
    status: "live",
    ranges: 4179,
    leases: 1188,
    cpu: "0.29",
    liveBytes: "409 GiB",
    vectorRows: "1,284,903",
    replicationLag: "2.1 ms",
    version: "v24.3.4",
  },
  {
    id: 5,
    address: "aeon-crdb-5.eu-central-1:26257",
    region: "eu-central-1",
    az: "eu-central-1a",
    status: "live",
    ranges: 4183,
    leases: 1104,
    cpu: "0.36",
    liveBytes: "413 GiB",
    vectorRows: "1,284,901",
    replicationLag: "34.6 ms",
    version: "v24.3.4",
  },
  {
    id: 6,
    address: "aeon-crdb-6.eu-central-1:26257",
    region: "eu-central-1",
    az: "eu-central-1b",
    status: "live",
    ranges: 4177,
    leases: 986,
    cpu: "0.31",
    liveBytes: "408 GiB",
    vectorRows: "1,284,901",
    replicationLag: "35.8 ms",
    version: "v24.3.4",
  },
];

export type VectorRow = {
  id: string;
  title: string;
  tags: string;
  cosine: number;
  dims: number;
  region: string;
  hits: number;
  updated: string;
};

/** Rows of public.runbook_embeddings (VECTOR(1536), cosine index) */
export const VECTOR_INDEX_ROWS: VectorRow[] = [
  {
    id: "rb_8f21a4",
    title: "Auto-healing AWS Lambda VPC Timeout in us-east-1",
    tags: "lambda · vpc · timeout",
    cosine: 0.084,
    dims: 1536,
    region: "us-east-1",
    hits: 412,
    updated: "2026-08-17 22:04",
  },
  {
    id: "rb_2c90de",
    title: "CockroachDB node lease rebalance after AZ loss",
    tags: "crdb · lease · failover",
    cosine: 0.191,
    dims: 1536,
    region: "us-west-2",
    hits: 268,
    updated: "2026-08-16 11:41",
  },
  {
    id: "rb_47b013",
    title: "Bedrock throttling backoff for reasoning chains",
    tags: "bedrock · throttle · retry",
    cosine: 0.264,
    dims: 1536,
    region: "us-east-1",
    hits: 197,
    updated: "2026-08-15 09:12",
  },
  {
    id: "rb_9ae55c",
    title: "Kubernetes on-prem worker drain and reschedule",
    tags: "k8s · hybrid · drain",
    cosine: 0.412,
    dims: 1536,
    region: "on-premise DC",
    hits: 143,
    updated: "2026-08-14 17:58",
  },
  {
    id: "rb_16d7f8",
    title: "Hot range splitting for agent_execution_sessions",
    tags: "crdb · hotspot · range",
    cosine: 0.298,
    dims: 1536,
    region: "us-west-2",
    hits: 121,
    updated: "2026-08-13 07:30",
  },
  {
    id: "rb_5b3e02",
    title: "RDS read replica promotion during ENI exhaustion",
    tags: "rds · eni · promotion",
    cosine: 0.331,
    dims: 1536,
    region: "us-east-1",
    hits: 98,
    updated: "2026-08-12 15:22",
  },
  {
    id: "rb_c1f094",
    title: "Cross-region follower reads to shed primary load",
    tags: "crdb · follower-read · latency",
    cosine: 0.356,
    dims: 1536,
    region: "eu-central-1",
    hits: 87,
    updated: "2026-08-11 06:47",
  },
  {
    id: "rb_7d8a31",
    title: "Rehydrating agent checkpoints after SIGKILL",
    tags: "agent · checkpoint · resume",
    cosine: 0.147,
    dims: 1536,
    region: "us-west-2",
    hits: 305,
    updated: "2026-08-17 06:14",
  },
  {
    id: "rb_e04b6a",
    title: "CloudWatch alarm storm deduplication window",
    tags: "cloudwatch · alarm · dedupe",
    cosine: 0.478,
    dims: 1536,
    region: "us-east-1",
    hits: 64,
    updated: "2026-08-09 12:03",
  },
  {
    id: "rb_a3902f",
    title: "MCP tool timeout fallback to direct SQL path",
    tags: "mcp · timeout · fallback",
    cosine: 0.392,
    dims: 1536,
    region: "eu-central-1",
    hits: 52,
    updated: "2026-08-08 19:36",
  },
];

export type AuditRow = {
  t: string;
  actor: "ccloud CLI" | "MCP" | "Runtime" | "CockroachDB" | "Bedrock";
  action: string;
  result: string;
  tone: "success" | "info" | "danger" | "warning";
  region: string;
};

/** Append-only MCP + ccloud audit trail */
export const MCP_AUDIT_LOG: AuditRow[] = [
  {
    t: "06:12:04.118",
    actor: "CockroachDB",
    action: "SELECT ... FROM runbook_embeddings ORDER BY embedding <=> $1 LIMIT 4",
    result: "4 rows",
    tone: "info",
    region: "us-east-1",
  },
  {
    t: "06:12:04.122",
    actor: "MCP",
    action: "vector.search — runbook match cosine 0.084",
    result: "Match",
    tone: "success",
    region: "us-east-1",
  },
  {
    t: "06:12:04.140",
    actor: "MCP",
    action: "audit.read /mcp — transactional error scan",
    result: "Clean",
    tone: "info",
    region: "us-east-1",
  },
  {
    t: "06:12:04.151",
    actor: "MCP",
    action: "cluster.metrics — 6 nodes, cpu 0.41 avg",
    result: "OK",
    tone: "info",
    region: "global",
  },
  {
    t: "06:12:04.159",
    actor: "Bedrock",
    action: "claude-3-5-sonnet — 4-step remediation plan synthesised",
    result: "Reasoned",
    tone: "info",
    region: "us-east-1",
  },
  {
    t: "06:12:04.192",
    actor: "ccloud CLI",
    action: "cluster restart-node --node-id=2 --json",
    result: "Success",
    tone: "success",
    region: "us-east-1",
  },
  {
    t: "06:12:04.201",
    actor: "CockroachDB",
    action: "UPSERT agent_execution_sessions — checkpoint step 2/4",
    result: "Committed",
    tone: "success",
    region: "us-east-1",
  },
  {
    t: "06:13:11.377",
    actor: "MCP",
    action: "sql.query — SHOW STATEMENT STATISTICS (24,819 rows)",
    result: "OK",
    tone: "info",
    region: "us-west-2",
  },
  {
    t: "06:14:19.004",
    actor: "Runtime",
    action: "us-east-1 worker SIGKILL — lease released on node-1",
    result: "Failure",
    tone: "danger",
    region: "us-east-1",
  },
  {
    t: "06:14:19.019",
    actor: "CockroachDB",
    action: "lease expiry detected — session marked resumable",
    result: "Warning",
    tone: "warning",
    region: "us-east-1",
  },
  {
    t: "06:14:19.031",
    actor: "CockroachDB",
    action: "session lease acquired by us-west-2 worker",
    result: "Resumed",
    tone: "success",
    region: "us-west-2",
  },
  {
    t: "06:14:19.058",
    actor: "CockroachDB",
    action: "checkpoint rehydrated — step 3/4, 0 duplicate writes",
    result: "Consistent",
    tone: "success",
    region: "us-west-2",
  },
  {
    t: "06:14:19.404",
    actor: "ccloud CLI",
    action: "cluster scale-nodes --region us-west-2 --json",
    result: "Success",
    tone: "success",
    region: "us-west-2",
  },
  {
    t: "06:14:20.115",
    actor: "MCP",
    action: "audit.read /mcp — post-remediation verification",
    result: "Clean",
    tone: "info",
    region: "global",
  },
];

/** Region rollups derived from CRDB_NODES */
export const REGION_ROLLUP = ["us-east-1", "us-west-2", "eu-central-1"].map((region) => {
  const nodes = CRDB_NODES.filter((n) => n.region === region);
  return {
    region,
    nodes: nodes.length,
    embeddings: nodes[0]?.vectorRows ?? "0",
    sync: "99.999%",
    txn: "Consistent (RC-Serializable)",
    lag: nodes[0]?.replicationLag ?? "—",
    healthy: nodes.every((n) => n.status === "live"),
  };
});
