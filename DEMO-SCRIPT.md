# Updated Demo Script — Matches Current App State

This is the updated version of the FY27 SKO Demo 5 script, rewritten to match the current Mira application. Same narrative beats, same structure, updated numbers and screen references.

---

**Hero:** David Chen, Chief AI Officer, ABC Bank

**Setup (the pain):** ABC Bank is one of the largest retail banks in North America. Like every major financial institution, they've gone all-in on AI agents — fraud detection, KYC, customer service, credit risk, compliance. More than 4,000 agents across every framework and business unit. The problem isn't building them. The problem is that nobody can tell the board which ones are actually doing their jobs.

**Punchline (the close):** "This is Dataiku Agent Management."

---

| What I'm Saying | What I'm Showing | Why It Matters (Business Value) |
| ----- | ----- | ----- |
| "ABC Bank runs more than 4,000 AI agents. Fraud detection on Bedrock. KYC verification using LangChain. Customer service through ServiceNow. Credit risk on internal builds. And thousands more self-service agents in Copilot." | **Slide:** ABC Bank visual. Agent icons scattered across framework logos (Bedrock, ServiceNow, LangChain, Copilot, Snowflake Cortex, n8n, Dataiku). Tagline: "Agents everywhere. Visibility nowhere." | Establishes the industry, the scale, and the multi-framework reality. An investor or customer immediately understands the landscape. |
| "Meet David. He's the Chief AI Officer. Every one of these agents launched successfully. But right now, he can't tell the board which ones are actually working." | Brief transition to David — title card or portrait. | Named hero, real problem. The board question creates urgency that any audience understands. |
| "Until now. This is Dataiku Agent Management." | Reveal the product — the Platforms page appears showing all connected frameworks: AWS Bedrock (3,402 agents), Microsoft Copilot (183), Snowflake Cortex (227), ServiceNow (118), LangChain (94), n8n (56), Dataiku (47). Each with status indicators and proactive scan toggles. | The product reveal. Clean, immediate, confident. The audience now knows what they're looking at. Everything from here forward is inside the product. |
| "David's team connects every framework in minutes. No migration, no risk — just visibility into agents that were previously invisible. Now he can see all 4,127 of his agents." | Brief animation of clicking "Rescan Now" on a platform tile. Agent count updates. | Low-friction onboarding. You don't replace anything — you connect and scan. Meets the enterprise where it already is. |
| "But are they up and running? It looks like they are. Uptime is 99.7%. The error rate is under half a percent. Every critical agent is showing healthy." | Show the Operational Health screen — all-green metrics, Critical Agents table with "Healthy" badges, smooth Live Activity chart. Let it sit for a beat. | Acknowledges the value of what existed before — but frames it as the starting point inside the product, not the whole picture. |
| "Technical observability is essential. But it only tells you that the agents are running. It doesn't tell you whether they're doing their jobs." | Stay on the Operational Health screen — subtle visual dim or pull-back. | Names the gap. Technical observability is necessary but not sufficient. The product goes further. |
| "This is where performance management comes in." | Cut to the Business KPI Status screen — 3,412 on track, 574 needing attention, 141 at risk. The Business Risk Alert: "141 agents are missing business targets." The Agents Requiring Attention table below. | The pivot. The "technically fine / actually failing" moment. Over 700 agents need attention and nobody would have known from uptime dashboards. |
| "More than 700 agents — all running, all technically healthy — are missing their business targets. The KYC Verification Agent's escalation rate has climbed from 8% to 23% in six weeks. Manual check volumes are up 62%. Customer credit applications are taking twice as long to process." | Stay on the Business KPI Status screen. KYC Verification Agent is visible in the Agents Requiring Attention table with red "Critical" impact badge, Escalation Rate at 23%. | Every agent measured against its own business KPIs. This is what the board actually wants to see. |
| "And Dataiku Agent Management catches things nobody was even looking for. Across five agents, a new topic has appeared — customers asking about something that has nothing to do with banking. It started at 2% of conversations. Within a quarter, it was 19%." | Cut to the Behavior Trends screen — the emerging topic alert, the growth curve from Sep–Dec, the Affected Agents table showing Customer Service at 19% (high severity). | Behavior drift across the full portfolio. Not a technical failure — a shift that only shows up when you look at behavior in aggregate. |
| "David and his team can drill into any agent, see exactly what's changed, and trace it down to the session level." | Quick drilldown: single-agent behavior view (Q3 vs Q4 topic donuts, sampled conversation with reasoning traces) → flash the Session Logs (step trace, failed run). 5 seconds total. | Portfolio view to individual session in clicks. Don't linger — the audience gets the point. |
| "And when there's a fix, it doesn't go straight to production. The drift triggered a prompt update. The AI team approved it. Security signed off. Compliance is reviewing now." | Show the Risk & Governance screen — the "Q4 Topic Drift Fix Deployment" approval workflow with AI Team and IT Security approved, Compliance pending. Risk assessment bars visible on the left. | The loop closes: detect → understand → fix → approve. Governance as a natural part of the workflow. |
| "David used to have agents everywhere and answers nowhere. Now he walks into the board meeting with proof — that the bank's agent strategy is delivering value and the risk is under control." | Shot of David — confident, at his desk or walking into a meeting. The Dashboard visible behind him — platform tiles, most active agents table, Business KPI status strip showing green/yellow/red. | Returns to the hero. The transformation is personal — David went from blind to in control. The audience remembers the person, not the product tour. |
| "An agent observability dashboard tells you your agents are running. A log aggregator tells you one threw an error. Neither one tells you that your KYC agent is creating a backlog, or that customers are talking to your agents about the weather." | Brief return to Operational Health (all green), then Business KPI Status (141 at risk), then Behavior Trends alert — quick cuts, 1–2 seconds each. | Defines the category by contrast. Earns the product name by showing what nothing else can do. |
| "Performance management. Observability. Governance. This is Dataiku Agent Management." | End on Dataiku Agent Management branding — clean, authoritative. | Category close. The name was revealed at the top. Now it lands with full weight because the audience has seen what it does. |

---

## Timing

**Spoken words: ~470** **At ~130 wpm narration pace: ~3:37 of talking** **With visual pacing for a produced video: ~4:00–4:10**

---

## Screen Sequence and Pacing

| Screen | Duration | Role in narrative | App route |
| ----- | ----- | ----- | ----- |
| Slide — industry + scale | ~12 sec | Context for any audience | (external slide) |
| David intro | ~8 sec | Hero + tension | (external slide) |
| Product reveal — Platforms page | ~12 sec | "This is Dataiku Agent Management" | `/platforms` |
| Operational Health | ~12 sec | The starting point — unified technical health | `/performance/technical` |
| Business KPI Status | ~20 sec | The pivot — what you get now | `/performance/business` |
| Behavior Trends (enterprise) | ~12 sec | The surprise — what nobody was watching | `/behavior/trends` |
| Single Agent Drilldown + Session Logs | ~5 sec | Quick proof of depth | `/agents/cs-agent-001/behavior` → `/agents/cs-agent-001/logs` |
| Risk & Governance | ~12 sec | The loop closes | `/governance` |
| Dashboard + category-by-contrast close | ~15 sec | Earns the name a second time | `/` then quick cuts |

---

## Changes from Original Script

| Area | Original Script | Updated Script | Reason |
| ----- | ----- | ----- | ----- |
| Platform count | 6 platforms | 7 platforms (added Anthropic Claude) | App now has 7 |
| Agent total | "more than 4,000" | "4,127" (specific where showing UI) | Dashboard shows exact number |
| Business Impact numbers | 132 green / 41 yellow / 21 red | 3,412 / 574 / 141 | Scaled to full portfolio narrative |
| "Missing targets" count | "147 agents" | "More than 700 agents" (574+141) | Matches scaled display counts |
| Alert text | "21 agents are missing business targets" | "141 agents are missing business targets" | Matches DISPLAY_IMPACT_COUNTS.red |
| KYC metrics | Production note: "screen needs KYC" | KYC Verification Agent is now in the app with escalation rate 23%, manual checks +62%, processing time 2x | Resolved — KYC is red with full metrics |
| Product reveal screen | "Select a Framework" onboarding grid | Platforms page with connected frameworks + scan | More realistic — shows connected state |
| Terminology | "Business Impact" | "Business KPI Status" | App terminology was updated |
| Customer service platform | "Salesforce" | "ServiceNow" | App uses ServiceNow |
| David's closing shot | "Business Impact dashboard" behind him | Dashboard with platform tiles + KPI strip | Dashboard is now the richer view |

## Script Notes

All notes from original remain valid. Additional:

- **KYC production note is resolved.** KYC Verification Agent (kyc-agent-016) appears in the Agents Requiring Attention table as a red/Critical agent with Escalation Rate 23%, visible AI Insight on its Agent 360 page, and a dedicated performance drop alert on its timeline chart.
- **Access Management** still available as B-roll — AgentAccess page shows LDAP groups, pending requests, role-based permissions.
- **Testing page** is now agent-parameterized — can show test results for any agent navigated to, not just cs-agent-001.
