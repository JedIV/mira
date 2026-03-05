const steps = [
  { saying: 'ABC Bank runs more than 4,000 AI agents. Fraud detection on Bedrock. KYC on LangChain. Customer service through ServiceNow. Credit risk on internal builds. And thousands more across Copilot, Snowflake Cortex, and Dataiku.', showing: 'Slide: ABC Bank visual. Agent icons across framework logos. Tagline: "Agents everywhere. Visibility nowhere."', time: '~10s' },
  { saying: 'Meet David Chen, ABC Bank\'s Chief AI Officer. Every one of these agents launched successfully. But right now, he can\'t tell the board which ones are actually working. Until now.', showing: 'David portrait / title card.', time: '~8s' },
  { saying: 'This is Dataiku Agent Management.', showing: 'Reveal the Dashboard. Stats strip: 4,127 total agents, platform tiles, most active agents table, KPI breakdown. Let it breathe.', time: '~6s' },
  { saying: 'David\'s team connects every framework in minutes. Watch — we\'ll add Databricks right now.', showing: 'Click "+ Add Platform" tile. Select Databricks. Fill connection details, test, configure scanning. Click "Connect & Scan." Scan discovers agents → select all → "Import All." Success.', time: '~15s' },
  { saying: 'And just like that — they\'re part of the portfolio.', showing: 'Back to Dashboard. Agent count has increased. New platform tile visible.', time: '~4s' },
  { saying: 'Are they running? It looks like they are. Uptime is 99.7%. Error rate under half a percent. Every critical agent shows healthy.', showing: 'Operational Health screen. All-green metrics, critical agents table, live activity chart.', time: '~10s' },
  { saying: 'Technical observability is essential. But it only tells you agents are running — not whether they\'re doing their jobs. This is where it gets interesting.', showing: 'Pause on Operational Health, then transition.', time: '~6s' },
  { saying: 'More than 700 agents — all technically healthy — are missing their business targets. The KYC agent\'s escalation rate has climbed from 8% to 23%. Manual check volumes are up 62%. Credit applications are taking twice as long.', showing: 'Business KPI Status screen. 3,412 on track, 574 needing attention, 141 at risk. KYC Verification Agent visible with red "Critical" badge.', time: '~18s' },
  { saying: 'Let\'s drill into that KYC agent. David\'s team can see exactly what changed — the root cause is an address verification model regression that\'s sending non-US passport applications to manual review.', showing: 'Click into KYC Agent Behavior page. Root cause alert banner. Four metric cards: escalation 8%→23%, address failures 72%, confidence 0.91→0.74, processing time 2.1→4.2 days.', time: '~12s' },
  { saying: 'And here\'s the decision flow. You can see how applications route through the system — and where the problem is. The non-US passport path to manual escalation has exploded. That red line is your bottleneck.', showing: 'Scroll to Decision Flow Analysis card. Cytoscape trace diagram shows full KYC routing. Red edges on non-US → manual escalation path. Nodes show percentages and deltas.', time: '~12s' },
  { saying: 'But Dataiku catches things nobody was even looking for. Across five agents, a new topic appeared — customers asking about something that has nothing to do with banking. It started at 2%. Within a quarter, it hit 19%.', showing: 'Behavior Trends screen. Emerging topic alert, growth curve, affected agents table with Customer Service at 19%.', time: '~12s' },
  { saying: 'When there\'s a fix, it doesn\'t go straight to production. The drift triggered a prompt update. The AI team approved it. Security signed off. Compliance is reviewing now.', showing: 'Risk & Governance screen. "Q4 Topic Drift Fix" approval workflow — AI Team and IT Security approved, Compliance pending.', time: '~10s' },
  { saying: 'David used to have agents everywhere and answers nowhere. Now he walks into the board meeting with proof — that the bank\'s agent strategy is delivering value, and the risk is under control.', showing: 'Return to Dashboard. Platform tiles, most active agents, KPI status strip.', time: '~8s' },
  { saying: 'Performance management. Observability. Governance. This is Dataiku Agent Management.', showing: 'End card — Dataiku Agent Management branding.', time: '~5s' },
]

const screens = [
  { screen: 'Slide — industry + scale', duration: '~10s', route: '(external slide)' },
  { screen: 'David intro', duration: '~8s', route: '(external slide)' },
  { screen: 'Dashboard', duration: '~6s', route: '/' },
  { screen: 'Add Platform wizard', duration: '~15s', route: '/platforms/add' },
  { screen: 'Dashboard — updated', duration: '~4s', route: '/' },
  { screen: 'Operational Health', duration: '~16s', route: '/performance/technical' },
  { screen: 'Business KPI Status', duration: '~18s', route: '/performance/business' },
  { screen: 'KYC Agent Behavior + Decision Flow', duration: '~24s', route: '/agents/kyc-agent-016/behavior' },
  { screen: 'Behavior Trends', duration: '~12s', route: '/behavior/trends' },
  { screen: 'Risk & Governance', duration: '~10s', route: '/governance' },
  { screen: 'Dashboard + close', duration: '~13s', route: '/' },
]

const whatsNew = [
  { feature: 'Decision Flow Diagram', detail: 'Step 10 — the Cytoscape trace visualization showing KYC routing with red-highlighted problem path' },
  { feature: 'KYC Root Cause Analysis', detail: 'Steps 9-10 — dedicated behavior view with metric cards and decision flow, not just a table row' },
  { feature: 'Streamlined narrative', detail: 'Removed access control flash and session logs flash — tighter at ~3:45 vs ~4:10' },
  { feature: 'Stronger KYC story', detail: 'Three beats (table → root cause → decision flow) instead of one mention in a table' },
]

export default function Script() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      color: '#e2e8f0',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      lineHeight: 1.7,
      padding: '2rem 1rem',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          marginBottom: 4,
          background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>Demo Script</h1>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Dataiku Agent Management — 4 minute version</p>

        {/* Hero block */}
        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 12,
          padding: '1.5rem 2rem',
          marginBottom: '2rem',
        }}>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Hero</p>
          <p><strong style={{ color: '#f1f5f9' }}>David Chen</strong>, Chief AI Officer, ABC Bank</p>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginTop: '0.8rem' }}>Setup</p>
          <p>ABC Bank runs 4,000+ AI agents across every framework and business unit. The problem isn't building them — nobody can tell the board which ones are actually doing their jobs.</p>
          <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#38bdf8', marginTop: '0.6rem' }}>"This is Dataiku Agent Management."</p>
        </div>

        {/* Script table */}
        <SectionTitle>Script</SectionTitle>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr>
                {['#', "What I'm Saying", "What I'm Showing", 'Time'].map(h => (
                  <th key={h} style={{
                    background: '#1e293b',
                    color: '#38bdf8',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    borderBottom: '2px solid #0ea5e9',
                    position: 'sticky',
                    top: 0,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {steps.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#38bdf8', textAlign: 'center', width: '3rem', fontSize: '1rem', verticalAlign: 'top' }}>{i + 1}</td>
                  <td style={{ padding: '0.85rem 1rem', fontStyle: 'italic', color: '#cbd5e1', maxWidth: 340, verticalAlign: 'top' }}>{s.saying}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#94a3b8', fontSize: '0.82rem', verticalAlign: 'top' }}>{s.showing}</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 600, color: '#fbbf24', width: '5rem', verticalAlign: 'top' }}>{s.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Timing */}
        <SectionTitle>Timing</SectionTitle>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {[
            { num: '~390', desc: 'Spoken words' },
            { num: '3:00', desc: 'At ~130 wpm narration' },
            { num: '3:30–3:50', desc: 'With visual pacing' },
          ].map(t => (
            <div key={t.desc} style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 8,
              padding: '1rem 1.5rem',
              flex: 1,
              minWidth: 200,
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>{t.num}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>{t.desc}</div>
            </div>
          ))}
        </div>

        {/* Screen Sequence */}
        <SectionTitle>Screen Sequence</SectionTitle>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr>
              {['Screen', 'Duration', 'Route'].map(h => (
                <th key={h} style={{
                  background: '#1e293b',
                  color: '#94a3b8',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '0.6rem 1rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #334155',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {screens.map((s, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
                <td style={{ padding: '0.55rem 1rem', color: '#94a3b8' }}>{s.screen}</td>
                <td style={{ padding: '0.55rem 1rem', color: '#94a3b8' }}>{s.duration}</td>
                <td style={{ padding: '0.55rem 1rem' }}>
                  <code style={{
                    background: '#1e293b',
                    padding: '0.15em 0.45em',
                    borderRadius: 4,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.82em',
                    color: '#34d399',
                  }}>{s.route}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* What's New */}
        <SectionTitle>What's New in This Script</SectionTitle>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr>
              {['Feature', 'How It Appears'].map(h => (
                <th key={h} style={{
                  background: '#1e293b',
                  color: '#94a3b8',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '0.6rem 1rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #334155',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {whatsNew.map((w, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
                <td style={{ padding: '0.55rem 1rem', color: '#e2e8f0', fontWeight: 600 }}>{w.feature}</td>
                <td style={{ padding: '0.55rem 1rem', color: '#94a3b8' }}>{w.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontSize: '1.35rem',
      fontWeight: 700,
      margin: '2.5rem 0 1rem',
      color: '#38bdf8',
      paddingBottom: '0.4rem',
      borderBottom: '1px solid #334155',
    }}>{children}</h2>
  )
}
