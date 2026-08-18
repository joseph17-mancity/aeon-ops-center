import { createFileRoute } from "@tanstack/react-router";
import { CustomBlocks } from "@/components/aeon/CustomBlocks";
import { useState } from "react";
import { Cpu, Activity } from "lucide-react";
import { Metric, Panel, Pill } from "@/components/aeon/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/telemetry")({
  head: () => ({
    meta: [
      { title: "Execution Telemetry & Tracing | Aeon" },
      {
        name: "description",
        content:
          "Distributed trace visualizer breaking down agent latency across CloudWatch, AWS Bedrock reasoning, CockroachDB vector search and ccloud execution.",
      },
      { property: "og:title", content: "Execution Telemetry & Tracing | Aeon" },
      {
        property: "og:description",
        content: "Per-step latency breakdown of the Aeon agent's autonomous remediation trace.",
      },
    ],
  }),
  component: TelemetryView,
});

const SPANS = [
  {
    name: "CloudWatch Alarm",
    ms: 0.5,
    tone: "info" as const,
    detail: "Alarm 'lambda-vpc-timeout' → EventBridge → agent trigger",
  },
  {
    name: "Bedrock Reasoning",
    ms: 18.6,
    tone: "slate" as const,
    detail: "Claude 3.5 Sonnet · 4-step chain-of-action plan · 1,204 tokens",
  },
  {
    name: "CockroachDB Vector Search",
    ms: 1.31,
    tone: "success" as const,
    detail: "SELECT ... ORDER BY embedding <=> $1 LIMIT 3 (cosine 0.084)",
  },
  {
    name: "ccloud Execution",
    ms: 3.21,
    tone: "success" as const,
    detail: "ccloud cluster restart-node --node-id=2 --json",
  },
];

const TOTAL = SPANS.reduce((a, s) => a + s.ms, 0);

function TelemetryView() {
  const [selected, setSelected] = useState(1);
  let offset = 0;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="End-to-end latency" value={`${TOTAL.toFixed(2)} ms`} tone="info" />
        <Metric label="Reasoning share" value="79.6%" hint="Bedrock dominant span" />
        <Metric label="DB p99" value="1.94 ms" hint="vector search" tone="success" />
        <Metric label="Retries" value="0" hint="idempotent checkpoints" tone="success" />
      </div>

      <Panel
        title="Distributed Trace Timeline"
        subtitle="trace_id 4f9a…c81b · session_crdb_9842_failover"
        icon={<Activity className="size-4" />}
      >
        <div className="space-y-3">
          {SPANS.map((s, i) => {
            const left = (offset / TOTAL) * 100;
            const width = (s.ms / TOTAL) * 100;
            offset += s.ms;
            return (
              <button
                key={s.name}
                onClick={() => setSelected(i)}
                className={cn(
                  "block w-full rounded-xl px-3 py-3 text-left transition-colors",
                  selected === i ? "bg-surface ring-1 ring-border" : "hover:bg-surface/60",
                )}
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <p className="truncate text-sm font-semibold">
                    {i + 1}. {s.name}
                  </p>
                  <Pill tone={s.tone}>{s.ms} ms</Pill>
                </div>
                <div className="relative mt-2 h-2.5 overflow-hidden rounded-full bg-surface ring-1 ring-border-subtle">
                  <span
                    className={cn(
                      "absolute inset-y-0 rounded-full transition-all duration-500",
                      s.tone === "success"
                        ? "bg-success"
                        : s.tone === "info"
                          ? "bg-info"
                          : "bg-primary",
                    )}
                    style={{ left: `${left}%`, width: `${Math.max(width, 1.5)}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 rounded-xl bg-surface/70 p-4 ring-1 ring-border-subtle">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Span detail
          </p>
          <p className="mt-2 text-sm font-semibold">{SPANS[selected]!.name}</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{SPANS[selected]!.detail}</p>
        </div>
      </Panel>

      <Panel
        title="Micro-step Metrics"
        subtitle="Rolling 5-minute window"
        icon={<Cpu className="size-4" />}
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[38rem] text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-5 py-3 font-semibold">Step</th>
                <th className="px-5 py-3 font-semibold">p50</th>
                <th className="px-5 py-3 font-semibold">p99</th>
                <th className="px-5 py-3 font-semibold">Errors</th>
              </tr>
            </thead>
            <tbody>
              {SPANS.map((s) => (
                <tr key={s.name} className="border-b border-border-subtle/70 last:border-0">
                  <td className="px-5 py-3.5 text-xs font-semibold">{s.name}</td>
                  <td className="px-5 py-3.5 font-mono text-xs tabular-nums">{s.ms} ms</td>
                  <td className="px-5 py-3.5 font-mono text-xs tabular-nums">
                    {(s.ms * 1.48).toFixed(2)} ms
                  </td>
                  <td className="px-5 py-3.5">
                    <Pill tone="success">0.00%</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <CustomBlocks view="telemetry" />
    </div>
  );
}
