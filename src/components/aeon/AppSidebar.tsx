import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Database,
  Cpu,
  Layers,
  FileText,
  GitBranch,
  PanelLeftClose,
  PanelLeftOpen,
  Shield,
} from "lucide-react";
import aeonLogo from "@/assets/aeon-logo.jpg.asset.json";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { to: "/", label: "Live Operations", title: "Live Operations Center", icon: Activity },
  { to: "/memory", label: "Vector RAG Memory", title: "Vector RAG Memory", icon: Database },
  { to: "/telemetry", label: "Execution Telemetry", title: "Execution Telemetry & Tracing", icon: Cpu },
  { to: "/advisor", label: "Schema & MCP Advisor", title: "Schema & MCP Advisor", icon: Layers },
  { to: "/audit", label: "Incident RCA & Audit", title: "Incident RCA & Audit Reports", icon: FileText },
  { to: "/topology", label: "Architecture & Topology", title: "Architecture & Topology", icon: GitBranch },
] as const;

export function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      className={cn(
        "sticky top-0 z-30 flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-out",
        collapsed ? "w-[4.5rem]" : "w-64",
      )}
    >
      <div className="flex items-center gap-3 border-b border-sidebar-border px-3 py-4">
        <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface ring-1 ring-info-soft shadow-glow-info">
          <img
            src={aeonLogo.url}
            alt="Aeon logo"
            className="size-11 scale-[2.6] object-cover object-[52%_31%]"
          />
        </span>
        {!collapsed && (
          <div className="min-w-0 animate-fade-up">
            <p className="truncate text-lg font-extrabold leading-none">Aeon</p>
            <p className="mt-1 truncate text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Agentic Brain
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              title={item.label}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                collapsed && "justify-center px-0",
              )}
            >
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-6 -translate-y-1/2 rounded-r-full bg-sidebar-primary transition-all",
                  active ? "w-[3px] opacity-100" : "w-0 opacity-0",
                )}
              />
              <item.icon
                className={cn("size-[1.15rem] shrink-0", active && "text-sidebar-primary")}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-sidebar-border p-3">
        <div
          className={cn(
            "flex items-center gap-2 rounded-full bg-success-soft px-3 py-1.5 text-xs font-semibold text-success",
            collapsed && "justify-center px-0",
          )}
        >
          <span className="size-2 shrink-0 rounded-full bg-success animate-pulse-ring" />
          {!collapsed && <span className="truncate">MCP: Connected</span>}
        </div>
        <div
          className={cn(
            "flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-xs text-muted-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          <Shield className="size-4 shrink-0 text-info" />
          {!collapsed && (
            <span className="min-w-0 truncate">
              Bedrock ·{" "}
              <span className="font-semibold text-foreground">Claude 3.5 Sonnet</span>
            </span>
          )}
        </div>
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4 shrink-0" />
          ) : (
            <PanelLeftClose className="size-4 shrink-0" />
          )}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
