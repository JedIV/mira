import { useParams, Link } from 'react-router-dom'
import { Card, CardHeader, Badge } from '../components/common'
import { DonutChart } from '../components/charts'
import { getAgentById } from '../data/agents'
import { sampleConversations, topicDistributions, topicColors } from '../data/conversations'
import { formatDateTime } from '../utils/formatters'

export default function AgentBehavior() {
  const { agentId } = useParams()
  const agent = getAgentById(agentId || 'cs-agent-001')
  const conversations = sampleConversations[agentId] || sampleConversations['cs-agent-001']
  const agentTopicDistributions = topicDistributions[agentId] || topicDistributions['cs-agent-001'] || {}
  const q3Topics = agentTopicDistributions['2024-Q3'] || {}
  const q4Topics = agentTopicDistributions['2024-Q4'] || {}

  // Format topics for chart
  const q3Data = Object.entries(q3Topics).map(([name, value]) => ({
    name: name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value,
    color: topicColors[name] || '#94A3B8',
  }))

  const q4Data = Object.entries(q4Topics).map(([name, value]) => ({
    name: name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value,
    color: topicColors[name] || '#94A3B8',
  }))

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">{agent?.name}</h1>
            <p className="text-sm text-slate-300">Conversation topics, drift detection, and reasoning traces</p>
          </div>
          <Link to="/behavior/trends" className="btn-secondary !bg-white/10 !text-white !border-white/20 hover:!bg-white/20">
            View All Trends
          </Link>
        </div>
      </div>

      {/* Drift Alert */}
      <div className="bg-danger-light border border-danger rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-danger flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold">!</span>
          </div>
          <div>
            <p className="font-semibold text-danger-dark">Behavior Drift Detected</p>
            <p className="text-sm text-danger-dark/80 mt-1">
              A new topic <strong>"no snow"</strong> has emerged in Q4, accounting for 19% of conversations.
              This off-topic weather discussion is likely affecting resolution rates and customer satisfaction.
            </p>
          </div>
        </div>
      </div>

      {/* Split View: Conversations + Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sampled Conversations */}
        <Card className="max-h-[600px] overflow-hidden flex flex-col">
          <CardHeader
            title="Sampled Conversations"
            subtitle="Recent interaction examples"
          />
          <div className="flex-1 overflow-y-auto space-y-4">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-4 rounded-lg border ${
                  conv.topic === 'no-snow'
                    ? 'border-danger bg-danger-light/30'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={conv.topic === 'no-snow' ? 'danger' : 'neutral'}>
                      {conv.topic.replace('-', ' ')}
                    </Badge>
                    <Badge variant={conv.resolved ? 'success' : 'warning'}>
                      {conv.resolved ? 'Resolved' : 'Unresolved'}
                    </Badge>
                    <Badge variant="neutral">{conv.channel}</Badge>
                  </div>
                  <span className="text-xs text-slate-400">{formatDateTime(conv.timestamp)}</span>
                </div>

                {/* Messages Preview */}
                <div className="space-y-2 text-sm">
                  {conv.messages.slice(0, 2).map((msg, i) => (
                    <div key={i} className={`flex gap-2 ${msg.role === 'user' ? '' : 'pl-4'}`}>
                      <span className={`font-medium ${msg.role === 'user' ? 'text-slate-700' : 'text-primary-600'}`}>
                        {msg.role === 'user' ? 'User:' : 'Agent:'}
                      </span>
                      <span className="text-slate-600 line-clamp-2">{msg.content}</span>
                    </div>
                  ))}
                  {conv.messages.length > 2 && (
                    <p className="text-xs text-slate-400 pl-4">+ {conv.messages.length - 2} more messages</p>
                  )}
                </div>

                {/* Reasoning Trace */}
                {conv.reasoning && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-xs font-medium text-slate-500 mb-2">Reasoning Trace</p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {conv.reasoning.map((step) => (
                        <div
                          key={step.step}
                          className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs ${
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
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Topic Distribution */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Topic Distribution - Q4 2024"
              subtitle="Current quarter showing drift"
            />
            <DonutChart data={q4Data} height={250} />
            <div className="mt-4 p-3 bg-danger-light rounded-lg">
              <p className="text-sm text-danger-dark">
                <strong>New Topic Alert:</strong> "No Snow" topic (19%) was not present in previous quarters
                and represents off-topic conversations about weather.
              </p>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Topic Distribution - Q3 2024"
              subtitle="Previous quarter (baseline)"
            />
            <DonutChart data={q3Data} height={250} />
          </Card>
        </div>
      </div>

      {/* Topic Evolution Timeline */}
      <Card>
        <CardHeader
          title="Topic Evolution Over Time"
          subtitle="How conversation topics have shifted across quarters"
        />
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
                const change = q4Value - q3Value
                const isNew = !q3Topics[topic]

                return (
                  <tr key={topic} className={isNew ? 'bg-danger-light/30' : ''}>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: topicColors[topic] || '#94A3B8' }}
                        />
                        <span className="font-medium capitalize">
                          {topic.replace('-', ' ')}
                        </span>
                        {isNew && <Badge variant="danger" size="sm">New</Badge>}
                      </div>
                    </td>
                    <td className="py-3 text-center text-slate-500">
                      {topic === 'no-snow' ? '-' : Math.round(q3Value * 1.08)}%
                    </td>
                    <td className="py-3 text-center text-slate-500">
                      {topic === 'no-snow' ? '-' : Math.round(q3Value * 1.03)}%
                    </td>
                    <td className="py-3 text-center text-slate-500">
                      {topic === 'no-snow' ? '-' : q3Value}%
                    </td>
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
    </div>
  )
}
