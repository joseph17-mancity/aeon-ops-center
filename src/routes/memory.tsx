import { createFileRoute } from "@tanstack/react-router";
import { CustomBlocks } from "@/components/aeon/CustomBlocks";
import { useMemo, useState } from "react";
import { Database, Search, CheckCircle } from "lucide-react";
import { Metric, Panel, Pill } from "@/components/aeon/primitives";

export const Route = createFileRoute("/memory")({
  head: () => ({
    meta: [
      { title: "Vector RAG Memory | Aeon" },
      {
        name: "description",
        content:
          "Inspect CockroachDB vector embeddings and cross-region SQL transaction consistency across us-east-1, us-west-2 and eu-central-1.",
      },
      { property: "og:title", content: "Vector RAG Memory | Aeon" },
      {
        property: "og:description",
        content:
          "Cross-region consistency checker for CockroachDB vector search and agentic runbook memory.",
      },
    ],
  }),
  component: MemoryView,
});

const REGIONS = [
  {
    region: "us-east-1",
    embeddings: "1,284,904",
    sync: "99.999%",
    txn: "Consistent (RC-Serializable)",
    lag: "1.2 ms",
  },
  {
    region: "us-west-2",
    embeddings: "1,284,904",
    sync: "99.999%",
    txn: "Consistent (RC-Serializable)",
    lag: "1.8 ms",
  },
  {
    region: "eu-central-1",
    embeddings: "1,284,901",
    sync: "99.999%",
    txn: "Consistent (RC-Serializable)",
    lag: "34.6 ms",
  },
];

const RUNBOOKS = [
  {
    title: "Auto-healing AWS Lambda VPC Timeout in us-east-1",
    cosine: 0.084,
    tags: "lambda · vpc · timeout",
  },
  {
    title: "CockroachDB node lease rebalance after AZ loss",
    cosine: 0.191,
    tags: "crdb · lease · failover",
  },
  {
    title: "Bedrock throttling backoff for reasoning chains",
    cosine: 0.264,
    tags: "bedrock · throttle",
  },
  {
    title: "Kubernetes on-prem worker drain and reschedule",
    cosine: 0.412,
    tags: "k8s · hybrid",
  },
];

function MemoryView() {
  const [q, setQ] = useState("VPC Timeout & Lambda Retry");
  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return RUNBOOKS;
    return RUNBOOKS.filter(
      (r) =>
        r.title.toLowerCase().includes(needle) ||
        r.tags.includes(needle) ||
        needle
          .split(/[^a-z0-9]+/)
          .filter(Boolean)
          .some((w) => r.title.toLowerCase().includes(w) || r.tags.includes(w)),
    );
  }, [q]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Vector rows" value="1.28 M" hint="runbook_embeddings" tone="info" />
        <Metric label="Cross-region sync" value="99.999%" hint="last 24h" tone="success" />
        <Metric label="Index type" value="VECTOR (cosine)" hint="1536 dimensions" />
        <Metric
          label="Serializable txns"
          value="0 anomalies"
          hint="zero data loss"
          tone="success"
        />
      </div>

      <Panel
        title="Cross-Region Consistency Checker"
        subtitle="Vector embedding sync vs SQL transaction consistency"
        icon={<Database className="size-4" />}
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-5 py-3 font-semibold">Region</th>
                <th className="px-5 py-3 font-semibold">Embeddings</th>
                <th className="px-5 py-3 font-semibold">Sync status</th>
                <th className="px-5 py-3 font-semibold">SQL consistency</th>
                <th className="px-5 py-3 font-semibold">Replication lag</th>
              </tr>
            </thead>
            <tbody>
              {REGIONS.map((r) => (
                <tr
                  key={r.region}
                  className="border-b border-border-subtle/70 last:border-0 hover:bg-surface/60"
                >
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold">{r.region}</td>
                  <td className="px-5 py-3.5 font-mono text-xs tabular-nums">{r.embeddings}</td>
                  <td className="px-5 py-3.5">
                    <Pill tone="success">
                      <CheckCircle className="size-3" /> {r.sync}
                    </Pill>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{r.txn}</td>
                  <td className="px-5 py-3.5 font-mono text-xs tabular-nums text-info">{r.lag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel
        title="Vector Similarity Playground"
        subtitle="Test queries against stored operational runbooks"
        icon={<Search className="size-4" />}
      >
        <div className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2.5 ring-1 ring-border-subtle focus-within:ring-2 focus-within:ring-ring">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Describe the incident signature…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <ul className="mt-4 space-y-2">
          {results.map((r) => (
            <li
              key={r.title}
              className="grid animate-fade-up grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-card px-4 py-3 ring-1 ring-border-subtle"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{r.title}</p>
                <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">{r.tags}</p>
              </div>
              <Pill tone={r.cosine < 0.1 ? "success" : "info"}>Cosine {r.cosine.toFixed(3)}</Pill>
            </li>
          ))}
          {results.length === 0 && (
            <li className="rounded-xl bg-surface px-4 py-6 text-center text-sm text-muted-foreground">
              No runbook within cosine threshold. Bedrock will synthesise a new plan.
            </li>
          )}
        </ul>
      </Panel>
      <CustomBlocks view="memory" />
    </div>
  );
}
