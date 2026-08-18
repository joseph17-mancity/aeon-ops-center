import { cn } from "@/lib/utils";

const NODES = [
  { id: "us-west-2", label: "us-west-2", x: 118, y: 96 },
  { id: "us-east-1", label: "us-east-1", x: 232, y: 84 },
  { id: "eu-central-1", label: "eu-central-1", x: 392, y: 74 },
];

export function FailoverMap({ active }: { active: "us-east-1" | "us-west-2" }) {
  const failed = active === "us-west-2" ? "us-east-1" : null;

  return (
    <div className="overflow-hidden rounded-xl bg-surface/70 ring-1 ring-border-subtle">
      <svg viewBox="0 0 520 200" className="h-auto w-full" role="img" aria-label="Multi-region failover map">
        {/* stylised continents */}
        <g className="fill-border stroke-border" opacity="0.9">
          <path d="M60 60 L150 44 L215 60 L240 104 L200 150 L140 158 L92 122 Z" />
          <path d="M355 42 L430 36 L470 62 L452 104 L392 116 L352 84 Z" />
          <path d="M215 160 L262 150 L280 186 L232 196 Z" />
        </g>

        {/* failover arc */}
        <path
          d="M232 84 C 200 30, 150 40, 118 96"
          fill="none"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          className={cn(
            "stroke-success",
            failed ? "animate-flow opacity-100" : "opacity-25",
          )}
        />
        <path
          d="M232 84 L392 74"
          fill="none"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          className="stroke-info opacity-50"
        />

        {NODES.map((n) => {
          const isFailed = n.id === failed;
          const isActive = n.id === active;
          return (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r={isActive ? 16 : 12}
                className={cn(
                  isFailed ? "fill-danger/15" : isActive ? "fill-success/15" : "fill-info/10",
                )}
              />
              <circle
                cx={n.x}
                cy={n.y}
                r="6"
                className={cn(
                  isFailed ? "fill-danger" : isActive ? "fill-success" : "fill-info",
                )}
              />
              <text
                x={n.x}
                y={n.y + 30}
                textAnchor="middle"
                className="fill-current text-[11px] font-semibold text-foreground"
              >
                {n.label}
              </text>
              <text
                x={n.x}
                y={n.y + 44}
                textAnchor="middle"
                className={cn(
                  "text-[9px] font-bold uppercase tracking-wider",
                  isFailed ? "fill-danger" : isActive ? "fill-success" : "fill-info",
                )}
              >
                {isFailed ? "failed" : isActive ? "active lease" : "healthy"}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
