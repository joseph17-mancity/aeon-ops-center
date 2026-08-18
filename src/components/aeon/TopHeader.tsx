import { useRouterState } from "@tanstack/react-router";
import { Database, Terminal } from "lucide-react";
import { NAV_ITEMS } from "./AppSidebar";

export function TopHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = NAV_ITEMS.find((i) => i.to === pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-border-subtle bg-background/80 backdrop-blur-xl">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 lg:px-8">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold sm:text-xl">
            {active?.title ?? "Live Operations Center"}
          </h1>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            Aeon: Autonomous Multi-Region Agentic Brain
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className="flex items-center gap-2 rounded-full bg-info-soft px-3 py-1.5 text-[0.7rem] font-semibold text-info shadow-glow-info">
            <Database className="size-3.5 shrink-0" />
            <span className="hidden sm:inline">
              CockroachDB Nodes: 3 Multi-Region (us-east-1, us-west-2, eu-central-1)
            </span>
            <span className="sm:hidden">3 Multi-Region Nodes</span>
          </span>
          <span className="flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-[0.7rem] font-semibold text-muted-foreground ring-1 ring-border-subtle">
            <Terminal className="size-3.5 shrink-0" />
            ccloud CLI: v34.0.0 (API v2)
          </span>
        </div>
      </div>
    </header>
  );
}
