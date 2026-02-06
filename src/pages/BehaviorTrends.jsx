import { useState } from 'react'
import { Card, CardHeader, Badge } from '../components/common'
import { BarChart, LineChart } from '../components/charts'
import { agents } from '../data/agents'
import { topicColors } from '../data/conversations'

// Mock data for enterprise-wide trends
const enterpriseTopicData = [
  { name: 'Account Inquiry', cs: 28, fraud: 5, loan: 15, it: 10, onboard: 35 },
  { name: 'Transaction Help', cs: 20, fraud: 8, loan: 25, it: 5, onboard: 10 },
  { name: 'Card Services', cs: 17, fraud: 2, loan: 5, it: 3, onboard: 8 },
  { name: 'General', cs: 5, fraud: 3, loan: 8, it: 15, onboard: 12 },
  { name: 'No Snow', cs: 19, fraud: 1, loan: 2, it: 8, onboard: 3 },
]

const trendOverTime = [
  { month: 'Jul', 'no-snow': 0 },
  { month: 'Aug', 'no-snow': 0 },
  { month: 'Sep', 'no-snow': 2 },
  { month: 'Oct', 'no-snow': 8 },
  { month: 'Nov', 'no-snow': 15 },
  { month: 'Dec', 'no-snow': 19 },
]

const affectedAgents = [
  { id: 'cs-agent-001', name: 'Customer Service', impact: 19, severity: 'high' },
  { id: 'it-support-004', name: 'IT Support', impact: 8, severity: 'medium' },
  { id: 'onboarding-005', name: 'Customer Onboarding', impact: 3, severity: 'low' },
  { id: 'loan-agent-003', name: 'Loan Processing', impact: 2, severity: 'low' },
  { id: 'fraud-agent-002', name: 'Fraud Detection', impact: 1, severity: 'low' },
]

const topicBarData = enterpriseTopicData.map(t => ({
  name: t.name,
  value: t.cs + t.fraud + t.loan + t.it + t.onboard,
  color: t.name === 'No Snow' ? '#EF4444' : '#06B6D4',
}))

export default function BehaviorTrends() {
  const [selectedTopic, setSelectedTopic] = useState('no-snow')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Enterprise Behavior Trends</h1>
        <p className="text-slate-500">Monitor topic patterns and behavior drift across all agents</p>
      </div>

      {/* Alert Banner */}
      <div className="bg-danger-light border border-danger rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-danger flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold">!</span>
          </div>
          <div>
            <p className="font-semibold text-danger-dark">Emerging Topic Detected Across Multiple Agents</p>
            <p className="text-sm text-danger-dark/80 mt-1">
              The "no snow" topic has been detected across <strong>5 agents</strong> in the enterprise,
              with the highest impact on Customer Service (19%). This appears to be a seasonal pattern
              affecting customer-facing agents.
            </p>
          </div>
        </div>
      </div>

      {/* Enterprise Topic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Topic Volume Across Enterprise"
            subtitle="Aggregated topic frequency (all agents)"
          />
          <BarChart
            data={topicBarData}
            dataKey="value"
            xAxisKey="name"
            height={300}
          />
        </Card>

        <Card>
          <CardHeader
            title="'No Snow' Topic Trend"
            subtitle="Emergence and growth over time"
          />
          <LineChart
            data={trendOverTime}
            dataKey="no-snow"
            xAxisKey="month"
            color="#EF4444"
            height={300}
          />
          <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
            First detected in September, peaked in December. Correlates with unseasonably warm weather
            in the region.
          </div>
        </Card>
      </div>

      {/* Affected Agents */}
      <Card>
        <CardHeader
          title="Affected Agents"
          subtitle="Agents experiencing the 'no snow' topic drift"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <th className="pb-3">Agent</th>
                <th className="pb-3">Team</th>
                <th className="pb-3 text-center">Topic %</th>
                <th className="pb-3 text-center">Severity</th>
                <th className="pb-3">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {affectedAgents.map((agent) => {
                const agentData = agents.find(a => a.id === agent.id)
                return (
                  <tr key={agent.id} className="hover:bg-slate-50">
                    <td className="py-3">
                      <span className="font-medium text-slate-900">{agent.name}</span>
                    </td>
                    <td className="py-3 text-slate-600">{agentData?.team}</td>
                    <td className="py-3 text-center">
                      <span className={`font-semibold ${
                        agent.impact > 10 ? 'text-danger' :
                        agent.impact > 5 ? 'text-warning' : 'text-slate-600'
                      }`}>
                        {agent.impact}%
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <Badge
                        variant={
                          agent.severity === 'high' ? 'danger' :
                          agent.severity === 'medium' ? 'warning' : 'neutral'
                        }
                      >
                        {agent.severity}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="w-full bg-slate-100 rounded-full h-2 max-w-[150px]">
                        <div
                          className={`h-2 rounded-full ${
                            agent.severity === 'high' ? 'bg-danger' :
                            agent.severity === 'medium' ? 'bg-warning' : 'bg-slate-400'
                          }`}
                          style={{ width: `${Math.min(agent.impact * 5, 100)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Cross-Agent Analysis */}
      <Card>
        <CardHeader
          title="Topic Distribution by Agent"
          subtitle="How the same topics appear across different agents"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <th className="pb-3">Topic</th>
                <th className="pb-3 text-center">Customer Service</th>
                <th className="pb-3 text-center">IT Support</th>
                <th className="pb-3 text-center">Onboarding</th>
                <th className="pb-3 text-center">Loan Processing</th>
                <th className="pb-3 text-center">Fraud Detection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enterpriseTopicData.map((topic) => (
                <tr key={topic.name} className={topic.name === 'No Snow' ? 'bg-danger-light/30' : ''}>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: topic.name === 'No Snow'
                            ? '#EF4444'
                            : topicColors[topic.name.toLowerCase().replace(' ', '-')] || '#94A3B8'
                        }}
                      />
                      <span className="font-medium">{topic.name}</span>
                      {topic.name === 'No Snow' && <Badge variant="danger" size="sm">Drift</Badge>}
                    </div>
                  </td>
                  <td className={`py-3 text-center ${topic.cs > 15 ? 'font-semibold text-danger' : ''}`}>
                    {topic.cs}%
                  </td>
                  <td className={`py-3 text-center ${topic.it > 15 ? 'font-semibold text-danger' : ''}`}>
                    {topic.it}%
                  </td>
                  <td className={`py-3 text-center ${topic.onboard > 15 ? 'font-semibold text-danger' : ''}`}>
                    {topic.onboard}%
                  </td>
                  <td className={`py-3 text-center ${topic.loan > 15 ? 'font-semibold text-danger' : ''}`}>
                    {topic.loan}%
                  </td>
                  <td className={`py-3 text-center ${topic.fraud > 15 ? 'font-semibold text-danger' : ''}`}>
                    {topic.fraud}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader title="Recommended Actions" />
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg">
            <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-sm flex items-center justify-center flex-shrink-0">1</span>
            <div>
              <p className="font-medium text-slate-900">Update Customer Service Agent Prompt</p>
              <p className="text-sm text-slate-600">Add explicit handling for weather-related off-topic queries to redirect users to banking services.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
            <span className="w-6 h-6 rounded-full bg-slate-400 text-white text-sm flex items-center justify-center flex-shrink-0">2</span>
            <div>
              <p className="font-medium text-slate-900">Implement Topic Classifier Update</p>
              <p className="text-sm text-slate-600">Train classifiers to better detect and route off-topic conversations before they reach agents.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
            <span className="w-6 h-6 rounded-full bg-slate-400 text-white text-sm flex items-center justify-center flex-shrink-0">3</span>
            <div>
              <p className="font-medium text-slate-900">Monitor for Seasonal Patterns</p>
              <p className="text-sm text-slate-600">Set up alerts for emerging topics that exceed 5% threshold across multiple agents.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
