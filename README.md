# Aeon Ops Center

Build a modern, light-theme SRE Operations Platform titled "Aeon: Autonomous Multi-Region Agentic Brain". Aeon is an enterprise system that visualizes an AI SRE Agent using CockroachDB as a persistent, zero-data-loss agentic memory layer and AWS Bedrock for multi-step reasoning during cross-region outages.

App Architecture & Layout:

- Structure the application with a sleek, collapsible Left Sidebar Navigation Menu and a spacious Main Content Area.

- Keep the landing page uncluttered by delegating sub-features into dedicated sidebar views.

Design & Styling Guidelines (Light Theme):

- Color Palette: Crisp white background (#F8FAFC / #FFFFFF), soft slate container cards (#F1F5F9), emerald green for active status (#059669), indigo for memory indexing (#4F46E5), dark charcoal text (#0F172A), and warm coral for region failures (#EF4444).

- Component Styling Inspiration:

  • Nexflow: Technical workflow cards, step-by-step pipeline indicators, and clean sidebar switcher layouts.

  • FintchX: Precision key-value data tables, transaction metric widgets, and subtle micro-borders.

  • DreamMotion: Smooth view transitions, subtle glowing badge borders, and clean glassmorphism cards.

  • Verseo: Clean typography hierarchy, elevated hero metrics, and rounded container cards.

  • Galillee: Interactive sidebar active state styling and clean audit feed lists.

  • CloudCraft: Visual topology node maps, connectors, and live region status indicators.

Left Sidebar Navigation:

- Brand/Logo: "Aeon" with a glowing CockroachDB icon at the top.

- Navigation Menu Items:

  1. Live Operations (Landing Dashboard)

  2. Vector RAG Memory (Dedicated View)

  3. Execution Telemetry & Tracing (Dedicated View)

  4. Schema & MCP Advisor (Dedicated View)

  5. Incident RCA & Audit Reports (Dedicated View)

  6. Architecture & Topology (Dedicated View)

- Bottom Sidebar Footer:

  • Connection Status: "MCP: Connected" (Green pill)

  • Bedrock Model: "Claude 3.5 Sonnet"

Top Header (Persistent across all views):

- Title: Dynamic based on active sidebar tab (Defaults to "Live Operations Center").

- Top Right Status Badges:

  1. "CockroachDB Nodes: 3 Multi-Region (us-east-1, us-west-2, eu-central-1)" [Indigo Badge]

  2. "ccloud CLI: v34.0.0 (API v2)" [Slate Badge]

---

VIEW 1: Live Operations (Landing Dashboard View)

Focus on real-time failover monitoring and active session state.

2-Column Main Layout:

Column 1: Persistent Agent Memory & Active Session

- Active Session Card: Session ID `session_crdb_9842_failover` with a pulse animation badge.

- Execution Progress Bar: Step 3 of 4 (75% Complete) with an emerald progress bar.

- Failover Map Widget: Visual indicator showing failover transition: "us-east-1 (FAILED) -> us-west-2 (RESUMED via COCKROACHDB MEMORY)". Include a mini SVG map highlighting active nodes in green and failed nodes in red.

- Key-Value Memory Card:

  • `last_persisted_step`: "Execute ccloud cluster scale-nodes"

  • `context_state`: "VPC Timeout isolated; DB transaction state preserved across regions"

  • `vector_distance`: "Cosine: 0.084 (High Similarity Match)"

Column 2: Real-time Incident & RAG Resolution Stream

- Interactive terminal log feed displaying real-time agent execution events with color tags:

  • [VECTOR SEARCH] "Querying CockroachDB Vector Index for runbooks matching 'VPC Timeout & Lambda Retry'..."

  • [RAG MATCH FOUND] "Found runbook 'Auto-healing AWS Lambda VPC Timeout in us-east-1' (Cosine: 0.084)."

  • [MCP ENGINE] "Reading database audit log from https://cockroachlabs.cloud/mcp - No transactional errors."

  • [AWS BEDROCK] "Reasoning complete: Triggering ccloud CLI auto-remediation."

  • [CCLOUD CLI] "ccloud cluster restart-node --node-id=2 --json -> Status: Success"

  • [STATE PERSIST] "Checkpoint saved to CockroachDB 'agent_execution_sessions' table. Zero data loss."

- Action Bar at Bottom: Primary action button labeled "Simulate Region Outage & Agent Resume" that animates a worker crash and instant state recovery from CockroachDB.

---

DEDICATED SIDEBAR VIEWS (5 Key Features Split Across Pages):

VIEW 2: Vector RAG Memory (Feature 1: Cross-Region Consistency Checker)

- Full-page inspection tool for CockroachDB Vector Search embeddings.

- Side-by-side comparison table showing Vector Embedding Sync and SQL Transaction Consistency across `us-east-1`, `us-west-2`, and `eu-central-1` (showing 99.999% sync status).

- Search bar to test vector similarity queries against stored operational runbooks.

VIEW 3: Execution Telemetry & Tracing (Feature 2: Distributed Trace Visualizer)

- Dedicated interactive timeline chart breaking down latency spent per micro-step:

  CloudWatch Alarm (0.5ms) -> Bedrock Reasoning (18.6ms) -> CockroachDB Vector Search (1.31ms) -> ccloud Execution (3.21ms).

VIEW 4: Schema & MCP Advisor (Feature 3: AI Schema & Index Advisor Sub-Agent)

- Dedicated interface where an AI sub-agent analyzes database performance via CockroachDB Managed MCP Server (`https://cockroachlabs.cloud/mcp`).

- Displays automated recommendations (e.g., "Recommend creating secondary VECTOR INDEX on runbook_embeddings") with one-click SQL application buttons.

VIEW 5: Incident RCA & Audit Reports (Feature 4: Audit Trail Smart Alerting & RCA)

- Detailed audit log archive capturing all `ccloud` CLI and MCP actions.

- Includes an auto-generated "Post-Mortem Executive Briefing" card with an exportable "Download RCA Report (PDF)" button.

VIEW 6: Architecture & Topology (Feature 5: Multi-Cloud Workload Topology & Simulator)

- Interactive CloudCraft-style visual node map rendering CockroachDB distributed across AWS regions.

- Includes a simulation toggle allowing users to simulate failovers between AWS Lambda serverless workers and hybrid on-premise Kubernetes clusters.

Interactive UX Polish:

- Smooth sidebar expansion/collapse toggle.

- Clean Lucide icons throughout (Shield, Database, Cpu, Activity, AlertTriangle, CheckCircle, Terminal, MapPin, Layers, FileText, GitBranch).

- Fully responsive layout adapting smoothly between desktop and tablet screens.

Use the uploaded image as the platform logo

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c492a1b2-75e8-4a82-b1d0-316484613291).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
