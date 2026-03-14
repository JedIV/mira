import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardHeader, Badge } from '../components/common'
import { DonutChart, LineChart } from '../components/charts'
import TraceFlowDiagram from '../components/charts/TraceFlowDiagram'
import { useDemoMode } from '../contexts/DemoModeContext'
import { getAgentById } from '../data/agents'
import { getConversationsByAgent, getTopicDistributions, getDriftAlert, getTopicColor } from '../data/conversations'
import { computeFlowStats, sampleTraces, traceToConversation } from '../data/kycTraceGenerator'
import { tracesByWindow, februaryTraces } from '../data/kycTraces'
import {
  getAllAgentKpis,
  generateBusinessTimelineData,
  getAgentKpiConfig,
  getAgentKpiTarget,
  isLowerBetter,
  kycKpiEvents,
} from '../data/metrics'
import { formatDateTime } from '../utils/formatters'

function summarizeConv(conv) {
  const input = conv.messages.find(m => m.role === 'user')
  return input ? input.content.split('.')[0] : 'KYC verification session'
}

function ConversationCard({ conv, highlightTopic }) {
  const [expanded, setExpanded] = useState(false)
  const isEscalated = conv.topic === highlightTopic
  const outcomeLabel = isEscalated ? 'Escalated' : 'Approved'
  const summary = summarizeConv(conv)

  return (
    <div
      className={`border-l-2 ${isEscalated ? 'border-l-red-400' : 'border-l-emerald-400'} cursor-pointer group`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100/60 transition-colors">
        <span className={`text-[10px] font-bold uppercase tracking-wide w-16 flex-shrink-0 ${isEscalated ? 'text-red-500' : 'text-emerald-500'}`}>{outcomeLabel}</span>
        <span className="text-sm text-slate-600 truncate flex-1">{summary}</span>
        <span className="text-[11px] text-slate-500 flex-shrink-0">{formatDateTime(conv.timestamp)}</span>
        <span className={`text-[10px] text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`}>▶</span>
      </div>
      {expanded && (
        <div className="px-3 pb-3 ml-[4.5rem] border-t border-slate-400/90">
          <div className="space-y-1.5 pt-2 text-sm">
            {conv.messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? '' : 'pl-4'}>
                <span className={`font-medium ${msg.role === 'user' ? 'text-slate-700' : 'text-primary-600'}`}>
                  {msg.role === 'user' ? 'Input: ' : 'Output: '}
                </span>
                <span className="text-slate-600">{msg.content}</span>
              </div>
            ))}
          </div>
          {conv.reasoning && (
            <div className="mt-2 pt-2 border-t border-slate-400/90 space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Trace</span>
              {conv.reasoning.map((step, i) => {
                const roleColors = {
                  agent: 'bg-slate-200 text-slate-600',
                  tool: 'bg-indigo-100 text-indigo-600',
                  subagent: 'bg-blue-100 text-blue-600',
                  outcome: 'bg-slate-200 text-slate-600',
                }
                return (
                  <div key={step.step} className="flex items-start gap-2 px-2.5 py-1.5 rounded text-xs bg-slate-50">
                    {i > 0 && <span className="text-slate-300 -ml-1 mr-0.5">→</span>}
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide flex-shrink-0 ${roleColors[step.role] || 'bg-slate-200 text-slate-600'}`}>{step.node}</span>
                    <span className="text-slate-600">{step.action}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function monthLabel(monthsAgo) {
  const d = new Date()
  d.setMonth(d.getMonth() - monthsAgo)
  return d.toLocaleString('default', { month: 'short', year: 'numeric' })
}

const reviewTeams = [
  'KYC Operations',
  'Model Risk Management',
  'Compliance & Regulatory',
  'AI/ML Engineering',
  'Identity Verification',
]

function KycBehaviorView({ agent, conversations, driftAlert }) {
  const [window, setWindow] = useState(3)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewSent, setReviewSent] = useState(null)

  const currentStats = useMemo(() => computeFlowStats(februaryTraces), [])
  const baselineStats = useMemo(() => computeFlowStats(tracesByWindow[window]), [window])
  const allConvs = useMemo(() => sampleTraces(februaryTraces, 10).map((t, i) => traceToConversation(t, i)), [])

  return (
    <>
      {driftAlert && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">!</span>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-red-700">Outcome Shift Detected Since December Release</p>
                  <p className="text-sm text-red-600/80 mt-1">Escalation rate has climbed from 8% to 23% since the December deployment. Decision flow analysis shows the Non-US Passport sub-agent's behavior has shifted, routing more identities to manual escalation.</p>
                </div>
                {!reviewSent && (
                  <div className="relative flex-shrink-0">
                    <button onClick={() => setReviewOpen(!reviewOpen)} className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">Request Review</button>
                    {reviewOpen && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-elevated border border-slate-400/90 py-1 z-50">
                        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Send review to</p>
                        {reviewTeams.map((team) => (
                          <button key={team} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => { setReviewSent(team); setReviewOpen(false) }}>{team}</button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {reviewSent && (
                <div className="mt-3 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
                  <span className="font-bold">&#10003;</span>
                  Review request sent to <strong>{reviewSent}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Decision Flow Analysis</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Comparing</span>
            <select className="bg-slate-100 border border-slate-400/90 rounded-md px-3 py-1.5 text-slate-700 font-medium text-sm cursor-pointer" value={window} onChange={(e) => setWindow(Number(e.target.value))}>
              <option value={3}>3 months ago ({monthLabel(3)})</option>
              <option value={2}>2 months ago ({monthLabel(2)})</option>
              <option value={1}>Last month</option>
            </select>
            <span className="text-slate-400">to last 30 days</span>
          </div>
        </div>
        <TraceFlowDiagram baselineStats={baselineStats} currentStats={currentStats} />
      </Card>

      <Card>
        <CardHeader title="Recent Sessions" subtitle="Sampled session traces" />
        <div className="divide-y divide-slate-400/90">
          {allConvs.map((conv) => (
            <ConversationCard key={conv.id} conv={conv} highlightTopic="address-verification-failure" />
          ))}
        </div>
      </Card>
    </>
  )
}

// ── KPI Mode Views ──

function KpiMetricCard({ kpi }) {
  const delta = kpi.previous != null ? kpi.value - kpi.previous : null
  const isBad = kpi.lowerBetter ? (delta != null && delta > 0) : (delta != null && delta < 0)
  const isAtTarget = kpi.target != null
    ? (kpi.lowerBetter ? kpi.value <= kpi.target : kpi.value >= kpi.target)
    : true

  const statusColor = isAtTarget
    ? 'border-emerald-200 bg-emerald-50'
    : 'border-red-200 bg-red-50'

  return (
    <div className={`rounded-lg border p-4 ${statusColor}`}>
      <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">{kpi.label}</p>
      <div className="flex items-end gap-2 mt-1">
        <p className="text-2xl font-bold text-slate-900">
          {typeof kpi.value === 'number' && kpi.value > 100 ? kpi.value.toLocaleString() : kpi.value}{kpi.unit}
        </p>
        {delta != null && (
          <span className={`text-xs font-medium mb-1 ${isBad ? 'text-red-600' : 'text-emerald-600'}`}>
            {delta > 0 ? '↑' : '↓'} {Math.abs(Math.round(delta * 10) / 10)}{kpi.unit} vs prior
          </span>
        )}
      </div>
      {kpi.target != null && (
        <p className="text-xs text-slate-500 mt-1">
          Target: {kpi.lowerBetter ? '<' : '>'}{kpi.target}{kpi.unit}
        </p>
      )}
    </div>
  )
}

function KycKpiView({ agent }) {
  const kpis = getAllAgentKpis(agent.id)
  const config = getAgentKpiConfig(agent.id)
  const target = getAgentKpiTarget(agent.id)
  const timelineData = useMemo(() => generateBusinessTimelineData(agent.id), [agent.id])

  return (
    <>
      {/* KPI Header Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KpiMetricCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      {/* KPI Timeline Chart */}
      <Card>
        <CardHeader
          title={`${config.kpiLabel} Trend`}
          subtitle="Weekly over 6 months with target reference"
        />
        <LineChart
          data={timelineData}
          dataKey={config.kpiLabel}
          xAxisKey="week"
          color={isLowerBetter(agent.id) ? '#EF4444' : '#2AB1AC'}
          height={300}
          strokeWidth={3}
          referenceLine={{ value: target, label: `Target: ${target}%`, color: '#6366F1' }}
        />
      </Card>

      {/* KPI Events Timeline */}
      <Card>
        <CardHeader title="KPI Events" subtitle="Threshold breaches and metric changes" />
        <div className="space-y-0">
          {kycKpiEvents.map((evt, i) => (
            <div key={i} className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${evt.type === 'breach' ? 'bg-red-500' : 'bg-blue-500'}`} />
              <div className="flex-1">
                <p className="text-sm text-slate-900">{evt.event}</p>
                <p className="text-xs text-slate-500 mt-0.5">{evt.date}</p>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${evt.type === 'breach' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                {evt.type === 'breach' ? 'Threshold Breach' : 'Deployment'}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

function GenericKpiView({ agent }) {
  const kpis = getAllAgentKpis(agent.id)
  const config = getAgentKpiConfig(agent.id)
  const target = getAgentKpiTarget(agent.id)
  const timelineData = useMemo(() => generateBusinessTimelineData(agent.id), [agent.id])

  return (
    <>
      {/* KPI Header Cards */}
      <div className={`grid gap-4 ${kpis.length > 2 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2'}`}>
        {kpis.map((kpi) => (
          <KpiMetricCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      {/* KPI Timeline Chart */}
      <Card>
        <CardHeader
          title={`${config.kpiLabel} Trend`}
          subtitle="Weekly over 6 months with target reference"
        />
        <LineChart
          data={timelineData}
          dataKey={config.kpiLabel}
          xAxisKey="week"
          color={isLowerBetter(agent.id) ? '#EF4444' : '#2AB1AC'}
          height={300}
          strokeWidth={2}
          referenceLine={{ value: target, label: `Target: ${target}%`, color: '#6366F1' }}
        />
      </Card>
    </>
  )
}

// ── Main Component ──

export default function AgentBehavior() {
  const { agentId } = useParams()
  const { demoMode } = useDemoMode()
  const isKpi = demoMode === 'kpi'
  const agent = getAgentById(agentId || 'cs-agent-001')
  const conversations = getConversationsByAgent(agentId)
  const agentTopicDistributions = getTopicDistributions(agentId) || {}
  const q1Topics = agentTopicDistributions['2024-Q1'] || {}
  const q2Topics = agentTopicDistributions['2024-Q2'] || {}
  const q3Topics = agentTopicDistributions['2024-Q3'] || {}
  const q4Topics = agentTopicDistributions['2024-Q4'] || {}
  const driftAlert = getDriftAlert(agentId)

  const formatTopic = (name) => name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  const q3Data = Object.entries(q3Topics).map(([name, value]) => ({
    name: formatTopic(name), value, color: getTopicColor(name),
  }))
  const q4Data = Object.entries(q4Topics).map(([name, value]) => ({
    name: formatTopic(name), value, color: getTopicColor(name),
  }))

  const isKyc = agentId === 'kyc-agent-016'

  // KPI mode
  if (isKpi) {
    return (
      <div className="space-y-6">
        <div className="page-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">{agent?.name}</h1>
              <p className="text-sm text-slate-300">KPI performance, targets, and trend analysis</p>
            </div>
            <Link to="/usage-trends" className="btn-secondary !bg-white/10 !text-white !border-white/20 hover:!bg-white/20">
              View All KPI Trends
            </Link>
          </div>
        </div>

        {isKyc ? <KycKpiView agent={agent} /> : <GenericKpiView agent={agent} />}
      </div>
    )
  }

  // Behavior mode (existing)
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">{agent?.name}</h1>
            <p className="text-sm text-slate-300">
              {isKyc ? 'Outcome analysis, root cause identification, and processing traces' : 'Conversation topics, drift detection, and reasoning traces'}
            </p>
          </div>
          <Link to="/usage-trends" className="btn-secondary !bg-white/10 !text-white !border-white/20 hover:!bg-white/20">
            View All Trends
          </Link>
        </div>
      </div>

      {isKyc ? (
        <KycBehaviorView agent={agent} conversations={conversations} driftAlert={driftAlert} />
      ) : (
        <>
          {driftAlert && (
            <div className="bg-danger-light border border-danger rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-danger flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">!</span>
                </div>
                <div>
                  <p className="font-semibold text-danger-dark">Behavior Drift Detected</p>
                  <p className="text-sm text-danger-dark/80 mt-1">{driftAlert.headerText}</p>
                  <p className="text-sm text-danger-dark/70 mt-1">{driftAlert.bodyText}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="max-h-[600px] overflow-hidden flex flex-col">
              <CardHeader title="Sampled Conversations" subtitle="Recent interaction examples" />
              <div className="flex-1 overflow-y-auto space-y-4">
                {conversations.map((conv) => (
                  <ConversationCard key={conv.id} conv={conv} highlightTopic={driftAlert?.topicKey} />
                ))}
              </div>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader title="Topic Distribution - Q4 2025" subtitle={driftAlert ? 'Current quarter showing drift' : 'Current quarter'} />
                <DonutChart data={q4Data} height={250} />
                {driftAlert && (
                  <div className="mt-4 p-3 bg-danger-light rounded-lg">
                    <p className="text-sm text-danger-dark"><strong>New Topic Alert:</strong> {driftAlert.cardAlert}</p>
                  </div>
                )}
              </Card>
              <Card>
                <CardHeader title="Topic Distribution - Q3 2024" subtitle="Previous quarter (baseline)" />
                <DonutChart data={q3Data} height={250} />
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader title="Topic Evolution Over Time" subtitle="How conversation topics have shifted across quarters" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <th className="pb-3">Topic</th>
                    <th className="pb-3 text-center">Q1</th>
                    <th className="pb-3 text-center">Q2</th>
                    <th className="pb-3 text-center">Q3</th>
                    <th className="pb-3 text-center">Q4</th>
                    <th className="pb-3 text-right">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-400/90">
                  {Object.entries(q4Topics).map(([topic, q4Value]) => {
                    const q3Value = q3Topics[topic] || 0
                    const q2Value = q2Topics[topic]
                    const q1Value = q1Topics[topic]
                    const change = q4Value - q3Value
                    const isNew = !q3Topics[topic] && !q2Topics[topic] && !q1Topics[topic]
                    return (
                      <tr key={topic} className={isNew ? 'bg-danger-light/30' : ''}>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getTopicColor(topic) }} />
                            <span className="font-medium capitalize">{topic.replace(/-/g, ' ')}</span>
                            {isNew && <Badge variant="danger" size="sm">New</Badge>}
                          </div>
                        </td>
                        <td className="py-3 text-center text-slate-500">{q1Value != null ? `${q1Value}%` : '-'}</td>
                        <td className="py-3 text-center text-slate-500">{q2Value != null ? `${q2Value}%` : '-'}</td>
                        <td className="py-3 text-center text-slate-500">{q3Value ? `${q3Value}%` : '-'}</td>
                        <td className="py-3 text-center font-medium">{q4Value}%</td>
                        <td className={`py-3 text-right font-medium ${isNew ? 'text-danger' : change > 0 ? 'text-success' : change < 0 ? 'text-danger' : 'text-slate-500'}`}>
                          {isNew ? 'NEW' : change > 0 ? `+${change}%` : change < 0 ? `${change}%` : '-'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
