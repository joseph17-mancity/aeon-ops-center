import { createFileRoute } from "@tanstack/react-router";
import { CustomBlocks } from "@/components/aeon/CustomBlocks";
import { useState } from "react";
import { GitBranch, AlertTriangle, CheckCircle, Server } from "lucide-react";
import { Panel, Pill } from "@/components/aeon/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/topology")({
  head: () => ({
    meta: [
      { title: "Architecture & Topology | Aeon" },
      {
        name: "description",
        content:
          "Interactive multi-cloud workload topology of CockroachDB across AWS regions, with a simulator for Lambda and hybrid on-premise Kubernetes failover.",
      },
      { property: "og:title", content: "Architecture & Topology | Aeon" },
      {
        property: "og:description",
        content:
          "Visual node map of Aeon's distributed agentic brain across AWS regions and hybrid Kubernetes clusters.",
      },
    ],
  }),
  component: TopologyView,
});

type NodeDef = {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  kind: "db" | "lambda" | "k8s";
};

const NODES: NodeDef[] = [
  { id: "crdb-east", label: "CRDB node-1", sub: "us-east-1", x: 130, y: 70, kind: "db" },
  { id: "crdb-west", label: "CRDB node-2", sub: "us-west-2", x: 130, y: 200, kind: "db" },
  { id: "crdb-eu", label: "CRDB node-3", sub: "eu-central-1", x: 130, y: 330, kind: "db" },
  { id: "lambda-east", label: "Lambda worker", sub: "us-east-1", x: 430, y: 70, kind: "lambda" },
  { id: "lambda-west", label: "Lambda worker", sub: "us-west-2", x: 430, y: 200, kind: "lambda" },
  { id: "k8s-onprem", label: "K8s cluster", sub: "on-premise DC", x: 430, y: 330, kind: "k8s" },
];

const EDGES: [string, string][] = [
  ["crdb-east", "lambda-east"],
  ["crdb-west", "lambda-west"],
  ["crdb-eu", "k8s-onprem"],
  ["crdb-east", "crdb-west"],
  ["crdb-west", "crdb-eu"],
];

const byId = (id: string) => NODES.find((n) => n.id === id)!;

function TopologyView() {
  const [failed, setFailed] = useState<string | null>(null);
  const [hybrid, setHybrid] = useState(false);

  const failoverTarget = failed ? (hybrid ? "k8s-onprem" : "lambda-west") : null;

  return (
    <div className="space-y-5">
      <Panel
        title="Multi-Cloud Workload Topology"
        subtitle="CockroachDB distributed across AWS regions and hybrid Kubernetes"
        icon={<GitBranch className="size-4" />}
        action={
          <Pill tone={failed ? "danger" : "success"} pulse>
            {failed ? "Failover active" : "All workloads healthy"}
          </Pill>
        }
      >
        <div className="overflow-x-auto rounded-xl bg-surface/60 ring-1 ring-border-subtle">
          <svg viewBox="0 0 560 400" className="h-auto w-full min-w-[34rem]">
            {EDGES.map(([a, b]) => {
              const na = byId(a);
              const nb = byId(b);
              const isRecovery =
                failoverTarget !== null && (a === failoverTarget || b === failoverTarget);
              const isBroken = failed !== null && (a === failed || b === failed);
              return (
                <line
                  key={`${a}-${b}`}
                  x1={na.x}
                  y1={na.y}
                  x2={nb.x}
                  y2={nb.y}
                  strokeWidth={isRecovery ? 3 : 1.8}
                  strokeDasharray={isBroken ? "4 6" : isRecovery ? "6 6" : undefined}
                  className={cn(
                    isBroken
                      ? "stroke-danger opacity-60"
                      : isRecovery
                        ? "stroke-success animate-flow"
                        : "stroke-border",
                  )}
                />
              );
            })}

            {NODES.map((n) => {
              const isFailed = n.id === failed;
              const isTarget = n.id === failoverTarget;
              const dim = n.kind === "k8s" && !hybrid;
              return (
                <g
                  key={n.id}
                  className="cursor-pointer"
                  onClick={() => setFailed((f) => (f === n.id ? null : n.id))}
                  opacity={dim ? 0.4 : 1}
                >
                  <rect
                    x={n.x - 76}
                    y={n.y - 26}
                    rx="14"
                    width="152"
                    height="52"
                    className={cn(
                      "stroke-[1.5]",
                      isFailed
                        ? "fill-danger-soft stroke-danger"
                        : isTarget
                          ? "fill-success-soft stroke-success"
                          : n.kind === "db"
                            ? "fill-card stroke-info"
                            : "fill-card stroke-border",
                    )}
                  />
                  <text
                    x={n.x}
                    y={n.y - 4}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="700"
                    className="fill-current text-foreground"
                  >
                    {n.label}
                  </text>
                  <text
                    x={n.x}
                    y={n.y + 14}
                    textAnchor="middle"
                    fontSize="10.5"
                    className={cn(
                      "font-semibold",
                      isFailed
                        ? "fill-danger"
                        : isTarget
                          ? "fill-success"
                          : "fill-current text-muted-foreground",
                    )}
                  >
                    {isFailed ? "FAILED" : isTarget ? "RESUMED FROM MEMORY" : n.sub}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Click any node to simulate its failure. Aeon reroutes execution to the surviving worker
          and rehydrates state from CockroachDB.
        </p>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Failover Simulator" icon={<Server className="size-4" />}>
          <label className="flex items-center justify-between gap-4 rounded-xl bg-surface px-4 py-3 ring-1 ring-border-subtle">
            <span className="min-w-0">
              <span className="block text-sm font-semibold">Hybrid on-premise target</span>
              <span className="block text-xs text-muted-foreground">
                Route failover to Kubernetes instead of Lambda
              </span>
            </span>
            <button
              role="switch"
              aria-checked={hybrid}
              onClick={() => setHybrid((h) => !h)}
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                hybrid ? "bg-success" : "bg-border",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 size-5 rounded-full bg-card shadow-card transition-transform",
                  hybrid ? "translate-x-[1.4rem]" : "translate-x-0.5",
                )}
              />
            </button>
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setFailed("lambda-east")}
              className="rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Fail us-east-1 worker
            </button>
            <button
              onClick={() => setFailed(null)}
              className="rounded-xl bg-surface px-3.5 py-2 text-xs font-semibold text-muted-foreground ring-1 ring-border-subtle transition-colors hover:text-foreground"
            >
              Reset topology
            </button>
          </div>
        </Panel>

        <Panel title="Region Status" icon={<GitBranch className="size-4" />} bodyClassName="p-0">
          <ul className="divide-y divide-border-subtle">
            {["us-east-1", "us-west-2", "eu-central-1", "on-premise DC"].map((r) => {
              const down = failed !== null && byId(failed).sub === r;
              return (
                <li
                  key={r}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3.5"
                >
                  <span className="truncate font-mono text-xs font-semibold">{r}</span>
                  <Pill tone={down ? "danger" : "success"}>
                    {down ? (
                      <>
                        <AlertTriangle className="size-3" /> Degraded
                      </>
                    ) : (
                      <>
                        <CheckCircle className="size-3" /> Live
                      </>
                    )}
                  </Pill>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
      <CustomBlocks view="topology" />
    </div>
  );
}
