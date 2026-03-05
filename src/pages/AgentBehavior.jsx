import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardHeader, Badge } from '../components/common'
import { DonutChart } from '../components/charts'
import TraceFlowDiagram from '../components/charts/TraceFlowDiagram'
import { getAgentById } from '../data/agents'
import { getConversationsByAgent, getTopicDistributions, getDriftAlert, getTopicColor } from '../data/conversations'
import { formatDateTime } from '../utils/formatters'

function ConversationCard({ conv, highlightTopic }) {
  const [expanded, setExpanded] = useState(false)
  const isHighlighted = conv.topic === highlightTopic
  return (
    <div
      className={`rounded-lg border ${
        isHighlighted ? 'border-danger bg-danger-light/30' : 'border-slate-200 bg-slate-50'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant={isHighlighted ? 'danger' : 'neutral'}>
              {conv.topic.replace(/-/g, ' ')}
            </Badge>
            <Badge variant="neutral">{conv.channel}</Badge>
          </div>
          <span className="text-xs text-slate-400">{formatDateTime(conv.timestamp)}</span>
        </div>
        <div className="space-y-2 text-sm">
          {conv.messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? '' : 'pl-4'}`}>
              <span className={`font-medium flex-shrink-0 ${msg.role === 'user' ? 'text-slate-700' : 'text-primary-600'}`}>
                {msg.role === 'user' ? 'User:' : 'Agent:'}
              </span>
              <span className="text-slate-600">{msg.content}</span>
            </div>
          ))}
        </div>
      </div>
      {conv.reasoning && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 border-t border-slate-200 flex items-center gap-1 hover:bg-slate-50/50 transition-colors"
          >
            <span className={`transition-transform ${expanded ? 'rotate-90' : ''}`}>▶</span>
            Routing Trace ({conv.reasoning.length} steps)
          </button>
          {expanded && (
            <div className="px-4 pb-3 space-y-1.5">
              {conv.reasoning.map((step) => (
                <div
                  key={step.step}
                  className={`px-3 py-2 rounded text-xs ${
                    step.confidence < 0.75
                      ? 'bg-warning-light text-warning-dark'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="font-medium">Step {step.step}:</span> {step.action}
                  <span className="ml-2 opacity-60">({(step.confidence * 100).toFixed(0)}%)</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function KycBehaviorView({ agent, conversations, driftAlert }) {
  const escalatedConvs = conversations.filter(c => c.topic === 'address-verification-failure').slice(0, 2)
  const approvedConvs = conversations.filter(c => c.topic !== 'address-verification-failure').slice(0, 2)

  return (
    <>
      {/* Outcome Shift Alert */}
      {driftAlert && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">!</span>
            </div>
            <div>
              <p className="font-semibold text-red-700">Outcome Shift Detected Since December Release</p>
              <p className="text-sm text-red-600/80 mt-1">Escalation rate has climbed from 8% to 23% since the December deployment. Decision flow analysis shows the Non-US Passport sub-agent's behavior has shifted, routing more identities to manual escalation.</p>
            </div>
          </div>
        </div>
      )}

      {/* Decision Flow Analysis */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Decision Flow Analysis</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Comparing</span>
            <select className="bg-slate-100 border border-slate-200 rounded-md px-3 py-1.5 text-slate-700 font-medium text-sm cursor-pointer" defaultValue="dec-1">
              <option value="dec-1">Dec 1, 2025</option>
              <option value="nov-1">Nov 1, 2025</option>
              <option value="oct-1">Oct 1, 2025</option>
              <option value="sep-1">Sep 1, 2025</option>
            </select>
            <span className="text-slate-400">to</span>
            <select className="bg-slate-100 border border-slate-200 rounded-md px-3 py-1.5 text-slate-700 font-medium text-sm cursor-pointer" defaultValue="now">
              <option value="now">Now</option>
              <option value="feb-1">Feb 1, 2026</option>
              <option value="jan-1">Jan 1, 2026</option>
            </select>
          </div>
        </div>
        <TraceFlowDiagram />
      </Card>

      {/* Escalated vs Approved — 2 each */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Escalated Cases" subtitle="Non-US passport applications routed to manual review" />
          <div className="space-y-4">
            {escalatedConvs.map((conv) => (
              <ConversationCard key={conv.id} conv={conv} highlightTopic="address-verification-failure" />
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Auto-Approved Cases" subtitle="US passport applications passing all checks" />
          <div className="space-y-4">
            {approvedConvs.map((conv) => (
              <ConversationCard key={conv.id} conv={conv} />
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}

export default function AgentBehavior() {
  const { agentId } = useParams()
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">{agent?.name}</h1>
            <p className="text-sm text-slate-300">
              {isKyc ? 'Escalation analysis, root cause identification, and processing traces' : 'Conversation topics, drift detection, and reasoning traces'}
            </p>
          </div>
          <Link to="/behavior/trends" className="btn-secondary !bg-white/10 !text-white !border-white/20 hover:!bg-white/20">
            View All Trends
          </Link>
        </div>
      </div>

      {isKyc ? (
        <KycBehaviorView
          agent={agent}
          conversations={conversations}
          driftAlert={driftAlert}
        />
      ) : (
        <>
          {/* Drift Alert — only shown when drift is detected */}
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

          {/* Split View: Conversations + Topics */}
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
                <CardHeader
                  title="Topic Distribution - Q4 2025"
                  subtitle={driftAlert ? 'Current quarter showing drift' : 'Current quarter'}
                />
                <DonutChart data={q4Data} height={250} />
                {driftAlert && (
                  <div className="mt-4 p-3 bg-danger-light rounded-lg">
                    <p className="text-sm text-danger-dark">
                      <strong>New Topic Alert:</strong> {driftAlert.cardAlert}
                    </p>
                  </div>
                )}
              </Card>
              <Card>
                <CardHeader title="Topic Distribution - Q3 2024" subtitle="Previous quarter (baseline)" />
                <DonutChart data={q3Data} height={250} />
              </Card>
            </div>
          </div>

          {/* Topic Evolution Timeline */}
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
                <tbody className="divide-y divide-slate-100">
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
                        <td className={`py-3 text-right font-medium ${
                          isNew ? 'text-danger' : change > 0 ? 'text-success' : change < 0 ? 'text-danger' : 'text-slate-500'
                        }`}>
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
