/**
 * ─────────────────────────────────────────────────────────────
 *  AEON · EDITABLE VIEW CUSTOMIZATIONS
 * ─────────────────────────────────────────────────────────────
 * Everything in this file is safe to edit by hand. Each sidebar
 * view reads its own block below and renders it at the bottom of
 * the page (metrics first, then cards, then buttons).
 *
 * - metrics : small stat tiles (label / value / hint / tone)
 * - cards   : titled panels with free-form lines of text
 * - buttons : action buttons (alert toast, or open a link)
 *
 * Delete an entry to remove it. Empty arrays render nothing.
 */

export type ViewKey =
  | "operations"
  | "memory"
  | "telemetry"
  | "advisor"
  | "audit"
  | "topology";

export type CustomMetric = {
  label: string;
  value: string;
  hint?: string;
  tone?: "success" | "info" | "danger" | "slate";
};

export type CustomCard = {
  title: string;
  subtitle?: string;
  /** Each row renders as `label → value` */
  rows: { label: string; value: string }[];
};

export type CustomButton = {
  label: string;
  /** Visual weight of the button */
  variant?: "primary" | "outline";
  /** Message shown as a toast when clicked */
  toast?: string;
  /** Optional external link opened in a new tab */
  href?: string;
};

export type ViewCustomization = {
  /** Heading for the custom section. Set to "" to hide the heading. */
  title: string;
  metrics: CustomMetric[];
  cards: CustomCard[];
  buttons: CustomButton[];
};

export const viewCustomizations: Record<ViewKey, ViewCustomization> = {
  operations: {
    title: "My Custom Metrics",
    metrics: [
      { label: "Error Budget Left", value: "82%", hint: "30-day rolling window", tone: "success" },
      { label: "Open Incidents", value: "1", hint: "sev-2 · us-east-1", tone: "danger" },
    ],
    cards: [
      {
        title: "On-Call Rotation",
        subtitle: "Edit in src/config/viewCustomizations.ts",
        rows: [
          { label: "Primary", value: "A. Mokoena" },
          { label: "Secondary", value: "J. Patel" },
          { label: "Escalation", value: "#sre-warroom" },
        ],
      },
    ],
    buttons: [
      { label: "Page On-Call", variant: "primary", toast: "Paged the primary on-call engineer." },
      { label: "Open Runbook", variant: "outline", toast: "Runbook opened." },
    ],
  },

  memory: {
    title: "My Custom Metrics",
    metrics: [
      { label: "Embedding Cost / day", value: "$18.40", hint: "Titan v2", tone: "info" },
    ],
    cards: [],
    buttons: [
      { label: "Re-index Runbooks", variant: "primary", toast: "Re-index job queued." },
    ],
  },

  telemetry: {
    title: "My Custom Metrics",
    metrics: [
      { label: "Trace Sample Rate", value: "25%", hint: "head-based sampling", tone: "slate" },
    ],
    cards: [],
    buttons: [
      { label: "Export Traces", variant: "outline", toast: "Trace bundle exported." },
    ],
  },

  advisor: {
    title: "My Custom Metrics",
    metrics: [
      { label: "Pending Suggestions", value: "3", hint: "awaiting approval", tone: "info" },
    ],
    cards: [],
    buttons: [
      { label: "Run Advisor Sweep", variant: "primary", toast: "Advisor sweep started." },
    ],
  },

  audit: {
    title: "My Custom Metrics",
    metrics: [
      { label: "Audit Retention", value: "400 d", hint: "immutable storage", tone: "slate" },
    ],
    cards: [],
    buttons: [
      { label: "Email RCA to Execs", variant: "outline", toast: "RCA sent to leadership." },
    ],
  },

  topology: {
    title: "My Custom Metrics",
    metrics: [
      { label: "Regions Online", value: "3 / 3", hint: "multi-region survival goal", tone: "success" },
    ],
    cards: [],
    buttons: [
      { label: "Add Region", variant: "primary", toast: "Region provisioning requested." },
    ],
  },
};
