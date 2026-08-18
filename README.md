# Aeon: Autonomous Multi-Region Agentic Brain ⚡🪳

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![React](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript-blue)
![CockroachDB](https://img.shields.io/badge/Database-CockroachDB%20Serverless-emerald)
![AWS Bedrock](https://img.shields.io/badge/AI-AWS%20Bedrock%20(Claude%203.5)-orange)

**Aeon** is an enterprise-grade, autonomous Site Reliability Engineering (SRE) agent that executes complex multi-region disaster recovery workflows. 

Standard stateless AI agents lose execution state during mid-task infrastructure failures. **Aeon leverages CockroachDB as an indestructible, globally distributed agentic memory layer**, ensuring zero-data-loss execution state recovery across multi-region AWS cloud environments.

---

## 🌟 Key Features

1. **Persistent Execution State Machine:** Micro-step checkpointing stored in CockroachDB allows agents to resume mid-remediation tasks across AWS regions without context loss.
2. **Distributed Vector RAG Memory:** CockroachDB's native vector search index enables sub-second semantic matching against historical incident runbooks.
3. **Managed MCP Server Operations:** Secure, audit-logged database state inspections connected via CockroachDB's Model Context Protocol (MCP) server endpoint.
4. **Automated `ccloud` CLI Orchestration:** Sub-agent tools execute node scaling, backups, and failovers with structured JSON command feedback.
5. **Real-Time Telemetry & RCA Engine:** Interactive distributed tracing visualizer and automated executive Post-Mortem RCA generation.

---

## 🛠️ Architecture & Tech Stack

### Frontend & UI Architecture
* **Framework:** React.js, TypeScript, Vite, Tailwind CSS
* **Rapid Prototyping:** Lovable.ai
* **Design System Inspiration & Component Protocols:**
  * **Nexflow:** Technical workflow and multi-step pipeline cards
  * **FintchX:** High-precision data tables and metric widgets
  * **DreamMotion:** Glassmorphism UI transitions and state animations
  * **Verseo:** Structured typography hierarchy and elevated cards
  * **Galillee:** Interactive sidebar navigation and audit feeds
  * **CloudCraft:** Visual multi-region topology nodes and status connectors

### Database & Agent Memory Layer
* **CockroachDB Cloud:** Distributed transactional persistence layer
* **CockroachDB Vector Indexing:** Cosine similarity vector search for operational RAG
* **CockroachDB Managed MCP Server:** `https://cockroachlabs.cloud/mcp`
* **CockroachDB `ccloud` CLI:** Secure cluster administration sub-agent engine

### Cloud & AI Infrastructure
* **Amazon Bedrock:** Claude 3.5 Sonnet foundation model for multi-step agent reasoning
* **AWS Lambda:** Event-driven, serverless SRE worker sub-agents
* **Amazon S3:** Incident log artifact storage

---

## 📁 Repository Structure

```text
aeon-sre-agent/
├── src/
│   ├── components/
│   │   ├── sidebar/           # Collapsible Navigation Menu (Galillee-styled)
│   │   ├── dashboard/         # Live Operations & Failover Monitor
│   │   ├── vector/            # CockroachDB Vector RAG Inspector
│   │   ├── telemetry/         # Distributed Trace & Latency Charts
│   │   ├── advisor/           # MCP AI Schema Advisor Sub-Agent
│   │   └── topology/          # CloudCraft Architecture Diagram
│   ├── services/
│   │   ├── cockroachMcp.ts    # MCP Endpoint Integration
│   │   └── bedrockAgent.ts    # AWS Bedrock Invocation Bridge
│   ├── App.tsx
│   └── main.tsx
├── backend/
│   ├── lambda_agent.py        # AWS Lambda Event Handler
│   └── schema.sql             # CockroachDB DDL & Vector Indexes
├── LICENSE                    # MIT Open Source License
└── README.md
