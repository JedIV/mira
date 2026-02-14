# Mira — AI Agent Management Platform

Mira is an enterprise dashboard for monitoring and managing AI agents across multiple platforms. Built as a demo for **Dataiku Codename Mira** showcasing agent observability at scale for ABC Bank.

## Features

- **Dashboard** — Overview of all agents with activity charts and platform summary
- **Agent Inventory** — Searchable, filterable list of 200+ agents across 7 platforms
- **Agent Detail (360 View)** — Operational health, business impact, risk signals, and AI-generated insights per agent
- **Behavior Analysis** — Conversation topic tracking, drift detection, and trend analysis
- **Session Logs** — Expandable session traces with tool calls and guardrail events
- **Business Impact** — R/Y/G status tracking across all agents
- **Operational Health** — Response time, error rate, and uptime monitoring
- **Risk & Governance** — Compliance status, security warnings, and approval workflows
- **Testing** — Validation results for prompts, data, and guardrails
- **Platforms & Connections** — Manage connected agent platforms with a multi-step wizard for adding new integrations and discovering agents via proactive scanning

## Tech Stack

- React 18 + Vite 5
- Tailwind CSS 3
- Recharts 2
- React Router 6
- No backend — all mock data

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Production Build

```bash
npm run build
npm start
```

## Deployment

Deployed on [Railway](https://railway.app) — pushes to `main` trigger automatic deploys.
