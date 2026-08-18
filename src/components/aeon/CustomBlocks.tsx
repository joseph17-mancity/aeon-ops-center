import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Metric, Panel } from "@/components/aeon/primitives";
import { viewCustomizations, type ViewKey } from "@/config/viewCustomizations";
import { cn } from "@/lib/utils";

/**
 * Renders the user-editable metrics, cards and buttons for a view.
 * Edit the content in src/config/viewCustomizations.ts.
 */
export function CustomBlocks({ view }: { view: ViewKey }) {
  const config = viewCustomizations[view];
  if (!config) return null;

  const isEmpty =
    config.metrics.length === 0 &&
    config.cards.length === 0 &&
    config.buttons.length === 0;
  if (isEmpty) return null;

  return (
    <section className="space-y-4">
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
              hint={m.hint}
              tone={m.tone ?? "slate"}
            />
          ))}
        </div>
      )}

      {config.cards.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {config.cards.map((c) => (
            <Panel key={c.title} title={c.title} subtitle={c.subtitle} bodyClassName="p-0">
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
