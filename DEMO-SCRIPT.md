# Demo Script — Dataiku Agent Management (4 min)

**Hero:** David Chen, Chief AI Officer, ABC Bank

**Setup:** ABC Bank runs 4,000+ AI agents across every framework and business unit. The problem isn't building them — nobody can tell the board which ones are actually doing their jobs.

**Punchline:** "This is Dataiku Agent Management."

---

## Script

| # | What I'm Saying | What I'm Showing | Duration |
|---|----------------|-------------------|----------|
| 1 | "ABC Bank runs more than 4,000 AI agents. Fraud detection on Bedrock. KYC on LangChain. Customer service through ServiceNow. Credit risk on internal builds. And thousands more across Copilot, Snowflake Cortex, and Dataiku." | **Slide:** ABC Bank visual. Agent icons across framework logos. Tagline: "Agents everywhere. Visibility nowhere." | ~10s |
| 2 | "Meet David Chen, ABC Bank's Chief AI Officer. Every one of these agents launched successfully. But right now, he can't tell the board which ones are actually working. Until now." | David portrait / title card. | ~8s |
| 3 | "This is Dataiku Agent Management." | **Reveal the Dashboard.** Stats strip: 4,127 total agents, platform tiles, most active agents table, KPI breakdown. Let it breathe. | ~6s |
| 4 | "David's team connects every framework in minutes. Watch — we'll add Databricks right now." | Click **"+ Add Platform"** tile. Select Databricks from the grid. Fill connection details, test, configure scanning, click "Connect & Scan." Scan discovers agents, select all, click "Import All." Success screen. | ~15s |
| 5 | "And just like that — they're part of the portfolio." | Back to **Dashboard**. Agent count has increased. New platform tile visible. | ~4s |
| 6 | "Are they running? It looks like they are. Uptime is 99.7%. Error rate under half a percent. Every critical agent shows healthy." | **Operational Health** screen. All-green metrics, critical agents table, live activity chart. | ~10s |
| 7 | "Technical observability is essential. But it only tells you agents are running — not whether they're doing their jobs. This is where it gets interesting." | Pause on Operational Health, then transition. | ~6s |
| 8 | "More than 700 agents — all technically healthy — are missing their business targets. The KYC agent's escalation rate has climbed from 8% to 23%. Manual check volumes are up 62%. Credit applications are taking twice as long." | **Business KPI Status** screen. 3,412 on track, 574 needing attention, 141 at risk. KYC Verification Agent visible in the table with red "Critical" badge, escalation rate 23%. | ~18s |
| 9 | "Let's drill into that KYC agent. David's team can see exactly what changed — the root cause is an address verification model regression that's sending non-US passport applications to manual review." | Click into **KYC Agent Behavior** page. Root cause alert banner visible. Four metric cards: escalation 8%→23%, address failures 72%, confidence 0.91→0.74, processing time 2.1→4.2 days. | ~12s |
| 10 | "And here's the decision flow. You can see how applications route through the system — and where the problem is. The non-US passport path to manual escalation has exploded. That red line is your bottleneck." | Scroll to **Decision Flow Analysis** card. The Cytoscape trace diagram shows the full KYC routing. Red edges on the non-US → manual escalation path. Nodes show percentages and deltas from baseline. | ~12s |
| 11 | "But Dataiku catches things nobody was even looking for. Across five agents, a new topic appeared — customers asking about something that has nothing to do with banking. It started at 2%. Within a quarter, it hit 19%." | **Behavior Trends** screen. Emerging topic alert, growth curve, affected agents table with Customer Service at 19%. | ~12s |
| 12 | "When there's a fix, it doesn't go straight to production. The drift triggered a prompt update. The AI team approved it. Security signed off. Compliance is reviewing now." | **Risk & Governance** screen. "Q4 Topic Drift Fix" approval workflow — AI Team and IT Security approved, Compliance pending. Risk assessment visible. | ~10s |
| 13 | "David used to have agents everywhere and answers nowhere. Now he walks into the board meeting with proof — that the bank's agent strategy is delivering value, and the risk is under control." | Return to **Dashboard**. Platform tiles, most active agents, KPI status strip. David visual overlay. | ~8s |
| 14 | "Performance management. Observability. Governance. This is Dataiku Agent Management." | **End card** — Dataiku Agent Management branding. | ~5s |

---

## Timing

**Spoken words:** ~390
**At ~130 wpm narration pace:** ~3:00 of talking
**With visual pacing:** ~3:30–3:50

---

## Screen Sequence

| Screen | Duration | Route |
|--------|----------|-------|
| Slide — industry + scale | ~10s | (external slide) |
| David intro | ~8s | (external slide) |
| Dashboard | ~6s | `/` |
| Add Platform wizard | ~15s | `/platforms/add` |
| Dashboard — updated | ~4s | `/` |
| Operational Health | ~16s | `/performance/technical` |
| Business KPI Status | ~18s | `/performance/business` |
| KYC Agent Behavior + Decision Flow | ~24s | `/agents/kyc-agent-016/behavior` |
| Behavior Trends | ~12s | `/behavior/trends` |
| Risk & Governance | ~10s | `/governance` |
| Dashboard + close | ~13s | `/` |

---

## What's New in This Script

| Feature | How It Appears |
|---------|---------------|
| **Decision Flow Diagram** | Step 10 — the Cytoscape trace visualization showing KYC routing with red-highlighted problem path |
| **KYC Root Cause Analysis** | Steps 9-10 — dedicated behavior view with metric cards and decision flow, not just a table row |
| **Streamlined narrative** | Removed access control flash and session logs flash — tighter at ~3:45 vs ~4:10 |
| **Stronger KYC story** | Three beats (table → root cause → decision flow) instead of one mention in a table |
