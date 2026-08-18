import { createFileRoute } from "@tanstack/react-router";
import { CustomBlocks } from "@/components/aeon/CustomBlocks";
import { FileText, Download, Terminal, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { KeyValue, Metric, Panel, Pill } from "@/components/aeon/primitives";
import { useAuditTrail } from "@/state/clusterStore";
import { downloadFile } from "@/lib/download";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Incident RCA & Audit Reports | Aeon" },
      {
        name: "description",
        content:
          "Immutable audit archive of every ccloud CLI and MCP action, with an auto-generated post-mortem executive briefing and exportable RCA report.",
      },
      { property: "og:title", content: "Incident RCA & Audit Reports | Aeon" },
      {
        property: "og:description",
        content:
          "Auto-generated root cause analysis and smart alerting audit trail for multi-region incidents.",
      },
    ],
  }),
  component: AuditView,
});

function AuditView() {
  const AUDIT = useAuditTrail();

  const downloadRca = () => {
    const lines = [
      "AEON · INCIDENT POST-MORTEM",
      "INC-2291 — Lambda VPC timeout cascading to us-east-1",
      `Generated: ${new Date().toISOString()}`,
      "",
      "IMPACT WINDOW   06:12:04 -> 06:14:19 UTC (2m 15s)",
      "CUSTOMER IMPACT None — reads served from us-west-2 and eu-central-1",
      "ROOT CAUSE      VPC ENI exhaustion in private subnet (us-east-1a)",
      "MTTR            23.6s (-87% vs manual)",
      "DATA LOSS       0 rows, 0 duplicated writes",
      "",
      "AUDIT TRAIL",
      ...AUDIT.map((a) => `${a.t}  ${a.actor.padEnd(12)} ${a.region.padEnd(14)} ${a.action} -> ${a.result}`),
    ];
    downloadFile("INC-2291-post-mortem.txt", lines.join("\n"));
    toast.success("RCA report generated", {
      description: "INC-2291-post-mortem.txt downloaded.",
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Incidents (30d)" value="12" hint="all auto-remediated" tone="info" />
        <Metric label="MTTR" value="23.6 s" hint="−87% vs manual" tone="success" />
        <Metric label="Audit records" value="184,392" hint="immutable, multi-region" />
        <Metric label="Data loss events" value="0" hint="zero-data-loss memory" tone="success" />
      </div>

      <Panel
        title="Post-Mortem Executive Briefing"
        subtitle="INC-2291 · Lambda VPC timeout cascading to us-east-1"
        icon={<ShieldCheck className="size-4" />}
        action={
          <button
            onClick={downloadRca}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            <Download className="size-3.5" />
            Download RCA Report
          </button>
        }
      >
        <p className="text-sm leading-relaxed text-foreground/90">
          At 06:12 UTC a VPC ENI exhaustion in <strong>us-east-1</strong> caused AWS Lambda
          invocations to time out, triggering the CloudWatch alarm{" "}
          <span className="font-mono text-xs">lambda-vpc-timeout</span>. Aeon retrieved the matching
          runbook from the CockroachDB vector index (cosine 0.084), reasoned a four-step plan with
          AWS Bedrock, and executed remediation through the ccloud CLI. When the us-east-1 worker
          was lost mid-execution, the us-west-2 worker rehydrated the exact checkpoint from the
          persistent agentic memory layer and completed the remediation with no duplicated writes.
        </p>
        <div className="mt-4">
          <KeyValue
            rows={[
              { k: "impact_window", v: "06:12:04 → 06:14:19 UTC (2m 15s)" },
              { k: "customer_impact", v: "None — reads served from us-west-2 and eu-central-1" },
              { k: "root_cause", v: "VPC ENI exhaustion in private subnet (us-east-1a)" },
              {
                k: "corrective_action",
                v: "Scale ENI pool; add secondary VECTOR INDEX per advisor",
              },
            ]}
          />
        </div>
      </Panel>

      <Panel
        title="Audit Trail Archive"
        subtitle="Every ccloud CLI and MCP action, append-only"
        icon={<FileText className="size-4" />}
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-5 py-3 font-semibold">Timestamp</th>
                <th className="px-5 py-3 font-semibold">Actor</th>
                <th className="px-5 py-3 font-semibold">Action</th>
                <th className="px-5 py-3 font-semibold">Region</th>
                <th className="px-5 py-3 font-semibold">Result</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT.map((a) => (
                <tr
                  key={a.t + a.action}
                  className="border-b border-border-subtle/70 last:border-0 hover:bg-surface/60"
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{a.t}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                      <Terminal className="size-3.5 shrink-0 text-info" />
                      {a.actor}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs">{a.action}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">
                    {a.region}
                  </td>
                  <td className="px-5 py-3.5">
                    <Pill tone={a.tone}>{a.result}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <CustomBlocks view="audit" />
    </div>
  );
}
