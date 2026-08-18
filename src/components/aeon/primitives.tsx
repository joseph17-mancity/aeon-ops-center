import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  subtitle,
  icon,
  action,
  className,
  bodyClassName,
  children,
}: {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("glass-card animate-fade-up rounded-2xl", className)}>
      {(title || action) && (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border-subtle px-5 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            {icon && <span className="shrink-0 text-info">{icon}</span>}
            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold">{title}</h2>
              {subtitle && (
                <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          {action}
        </div>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

const toneMap = {
  success: "bg-success-soft text-success",
  info: "bg-info-soft text-info",
  danger: "bg-danger-soft text-danger",
  warning: "bg-warning-soft text-foreground",
  slate: "bg-surface text-muted-foreground ring-1 ring-border-subtle",
} as const;

export function Pill({
  tone = "slate",
  children,
  className,
  pulse,
}: {
  tone?: keyof typeof toneMap;
  children: ReactNode;
  className?: string;
  pulse?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold",
        toneMap[tone],
        className,
      )}
    >
      {pulse && <span className="size-1.5 rounded-full bg-current animate-pulse-ring" />}
      {children}
    </span>
  );
}

export function KeyValue({ rows }: { rows: { k: string; v: ReactNode }[] }) {
  return (
    <dl className="divide-y divide-border-subtle overflow-hidden rounded-xl ring-1 ring-border-subtle">
      {rows.map((r) => (
        <div
          key={r.k}
          className="grid grid-cols-1 gap-1 bg-card px-4 py-3 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-4"
        >
          <dt className="font-mono text-xs text-muted-foreground">{r.k}</dt>
          <dd className="min-w-0 break-words text-xs font-medium text-foreground">{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Metric({
  label,
  value,
  hint,
  tone = "slate",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "success" | "info" | "danger" | "slate";
}) {
  const color =
    tone === "success"
      ? "text-success"
      : tone === "info"
        ? "text-info"
        : tone === "danger"
          ? "text-danger"
          : "text-foreground";
  return (
    <div className="animate-fade-up rounded-2xl bg-card p-4 ring-1 ring-border-subtle">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className={cn("mt-2 text-2xl font-extrabold tabular-nums", color)}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
