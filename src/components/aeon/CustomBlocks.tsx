import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Metric, Panel } from "@/components/aeon/primitives";
import {
  viewCustomizations,
  type CustomButton,
  type ViewKey,
} from "@/config/viewCustomizations";
import { cn } from "@/lib/utils";
import { clusterActions } from "@/state/clusterStore";
import { SPAN_TRACE } from "@/data/mockCluster";
import { downloadJson } from "@/lib/download";

/** Real behaviour for the named actions available to custom buttons. */
const actionHandlers: Record<NonNullable<CustomButton["action"]>, () => void> = {
  reindex: () =>
    clusterActions.reindexRunbooks((rows) =>
      toast.success("Vector index rebuilt", {
        description: `${rows.toLocaleString()} rows now searchable.`,
      }),
    ),
  exportTraces: () => {
    downloadJson(`aeon-traces-${Date.now()}.json`, {
      trace_id: "4f9ac81b",
      session: "session_crdb_9842_failover",
      exported_at: new Date().toISOString(),
      spans: SPAN_TRACE,
    });
    toast.success("Trace bundle exported", { description: "JSON downloaded to your device." });
  },
  advisorSweep: () => {
    const rec = clusterActions.runAdvisorSweep();
    toast.success("Advisor sweep complete", { description: rec.title });
  },
  emailRca: () => {
    const subject = encodeURIComponent("INC-2291 RCA — Aeon autonomous remediation");
    const body = encodeURIComponent(
      "Attached: INC-2291 post-mortem. MTTR 23.6s, zero data loss, remediated autonomously by Aeon.",
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    toast.success("RCA drafted", { description: "Your mail client is opening the briefing." });
  },
  addRegion: () => {
    const next = clusterActions.addRegion();
    if (!next) {
      toast.error("Region pool exhausted", { description: "No further regions available." });
      return;
    }
    toast.success(`Region ${next.sub} provisioned`, {
      description: `${next.label} joined the cluster.`,
    });
  },
};

/**
 * Renders the user-editable metrics, cards and buttons for a view.
 * Edit the content in src/config/viewCustomizations.ts.
 */
export function CustomBlocks({ view }: { view: ViewKey }) {
  const config = viewCustomizations[view];
  if (!config) return null;

  const isEmpty =
    config.metrics.length === 0 && config.cards.length === 0 && config.buttons.length === 0;
  if (isEmpty) return null;

  return (
    <section className="col-span-full space-y-4">
      {config.title && (
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 shrink-0 text-info" />
          <h2 className="text-sm font-bold">{config.title}</h2>
        </div>
      )}

      {config.metrics.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {config.metrics.map((m) => (
            <Metric
              key={m.label}
              label={m.label}
              value={m.value}
              {...(m.hint ? { hint: m.hint } : {})}
              tone={m.tone ?? "slate"}
            />
          ))}
        </div>
      )}

      {config.cards.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {config.cards.map((c) => (
            <Panel
              key={c.title}
              title={c.title}
              {...(c.subtitle ? { subtitle: c.subtitle } : {})}
              bodyClassName="p-0"
            >
              <ul className="divide-y divide-border-subtle">
                {c.rows.map((r) => (
                  <li
                    key={r.label}
                    className="grid gap-1 px-5 py-3 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-4"
                  >
                    <span className="font-mono text-xs text-muted-foreground">{r.label}</span>
                    <span className="min-w-0 break-words text-xs font-medium">{r.value}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      )}

      {config.buttons.length > 0 && (
        <div className="flex flex-wrap gap-2.5">
          {config.buttons.map((b) => (
            <button
              key={b.label}
              onClick={() => {
                if (b.href) window.open(b.href, "_blank", "noopener,noreferrer");
                if (b.action) {
                  actionHandlers[b.action]();
                  return;
                }
                if (b.toast) toast.success(b.toast);
              }}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-transform hover:scale-[1.02] active:scale-100",
                b.variant === "outline"
                  ? "bg-card text-foreground ring-1 ring-border-subtle"
                  : "bg-primary text-primary-foreground shadow-card",
              )}
            >
              {b.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
