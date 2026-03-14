import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, Badge } from '../components/common'
import { BarChart, LineChart, MultiLineChart } from '../components/charts'
import { useDemoMode } from '../contexts/DemoModeContext'
import { agents, displayTeamCounts } from '../data/agents'
import { topicColors } from '../data/conversations'
import {
  generateEnterpriseKpiData,
  getAgentKpiConfig,
  getAgentKpiStatus,
  getAgentKpiTarget,
  isLowerBetter,
  businessMetrics,
} from '../data/metrics'

// ── Behavior mode data (unchanged) ──

const enterpriseTopicData = [
  { name: 'Account Inquiry', cs: 28, fraud: 5, loan: 15, it: 10, onboard: 35 },
  { name: 'Transaction Help', cs: 20, fraud: 8, loan: 25, it: 5, onboard: 10 },
  { name: 'Card Services', cs: 17, fraud: 2, loan: 5, it: 3, onboard: 8 },
  { name: 'General', cs: 5, fraud: 3, loan: 8, it: 15, onboard: 12 },
  { name: 'No Snow', cs: 24, fraud: 1, loan: 2, it: 8, onboard: 3 },
]

const trendOverTime = [
  { month: 'Jul', 'no-snow': 0 },
  { month: 'Aug', 'no-snow': 0 },
  { month: 'Sep', 'no-snow': 2 },
  { month: 'Oct', 'no-snow': 8 },
  { month: 'Nov', 'no-snow': 15 },
  { month: 'Dec', 'no-snow': 19 },
  { month: 'Jan', 'no-snow': 22 },
  { month: 'Feb', 'no-snow': 24 },
]

const affectedAgents = [
  { id: 'cs-agent-001', name: 'Customer Service', impact: 24, severity: 'high' },
  { id: 'it-support-004', name: 'IT Support', impact: 8, severity: 'medium' },
  { id: 'onboarding-005', name: 'Customer Onboarding', impact: 3, severity: 'low' },
  { id: 'loan-agent-003', name: 'Loan Processing', impact: 2, severity: 'low' },
  { id: 'fraud-agent-002', name: 'Fraud Detection', impact: 1, severity: 'low' },
]

const driftAlerts = [
  { id: 'drift-001', topic: 'No Snow', description: 'Seasonal weather topic appearing across customer-facing agents', agentCount: 5, peakImpact: '24%', severity: 'high', trend: 'growing', firstDetected: 'Sep 2025', primaryAgent: 'Customer Service' },
  { id: 'drift-002', topic: 'Crypto Inquiries', description: 'Customers asking about cryptocurrency services not offered by the bank', agentCount: 3, peakImpact: '11%', severity: 'medium', trend: 'growing', firstDetected: 'Oct 2025', primaryAgent: 'Investment Advisor' },
  { id: 'drift-003', topic: 'Competitor Comparison', description: 'Users comparing rates and services with competitor banks', agentCount: 4, peakImpact: '7%', severity: 'medium', trend: 'stable', firstDetected: 'Nov 2025', primaryAgent: 'Loan Processing' },
  { id: 'drift-004', topic: 'App Store Reviews', description: 'Customers pasting negative app store reviews into chat for resolution', agentCount: 2, peakImpact: '5%', severity: 'low', trend: 'growing', firstDetected: 'Nov 2025', primaryAgent: 'Customer Service' },
  { id: 'drift-005', topic: 'Regulatory Questions', description: 'Increased questions about CFPB rules and consumer rights', agentCount: 3, peakImpact: '6%', severity: 'medium', trend: 'growing', firstDetected: 'Oct 2025', primaryAgent: 'Collections' },
  { id: 'drift-006', topic: 'Deceased Account Handling', description: 'Spike in estate and deceased account processing queries', agentCount: 2, peakImpact: '4%', severity: 'low', trend: 'stable', firstDetected: 'Dec 2025', primaryAgent: 'Customer Onboarding' },
  { id: 'drift-007', topic: 'Multilingual Requests', description: 'Growing volume of non-English conversations in English-only agents', agentCount: 4, peakImpact: '9%', severity: 'medium', trend: 'growing', firstDetected: 'Sep 2025', primaryAgent: 'IT Support' },
]

const topicBarData = enterpriseTopicData.map(t => ({
  name: t.name,
  value: t.cs + t.fraud + t.loan + t.it + t.onboard,
  color: t.name === 'No Snow' ? '#EF4444' : '#2AB1AC',
}))

// ── KPI mode components ──

const kpiLineColors = {
  'Fraud Detection Rate': '#10B981',
  'CS Resolution Rate': '#EF4444',
  'Loan Accuracy Rate': '#3B82F6',
  'KYC Escalation Rate': '#F59E0B',
  'Onboarding Completion': '#8B5CF6',
}

const kpiLines = Object.entries(kpiLineColors).map(([label, color]) => ({
  dataKey: label,
  name: label,
  color,
  strokeWidth: label === 'CS Resolution Rate' || label === 'KYC Escalation Rate' ? 3 : 2,
}))

// Agents below target
const belowTargetAgents = [
  'kyc-agent-016', 'cs-agent-001', 'collections-009',
  'marketing-008', 'investment-006',
]

// Team heatmap data
const heatmapTeams = [
  'Customer Experience', 'Risk Management', 'Lending Operations', 'Compliance', 'IT Operations',
  'Digital Banking', 'Payments', 'Data Analytics',
]

function teamKpiStatus(team) {
  // Deterministic R/Y/G based on team name hash
  const hash = team.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const statuses = ['green', 'green', 'green', 'yellow', 'green', 'red', 'green', 'yellow']
  return statuses[hash % statuses.length]
}

const kpiCategories = ['Primary KPI', 'Response Quality', 'Throughput', 'Compliance']

function KpiSummaryStrip() {
  const onTarget = agents.filter(a => getAgentKpiStatus(a.id) === 'on-target').length
  const approaching = agents.filter(a => getAgentKpiStatus(a.id) === 'approaching').length
  const missing = agents.filter(a => getAgentKpiStatus(a.id) === 'missing').length

  const cards = [
    { label: 'Agents On Target', value: onTarget, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Approaching Target', value: approaching, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Missing Target', value: missing, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Avg KPI Score', value: '91.2%', color: 'text-slate-900', bg: 'bg-slate-50' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className={`${c.bg} rounded-lg p-4 border border-slate-200`}>
          <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">{c.label}</p>
          <p className={`text-2xl font-bold mt-1 ${c.color}`}>{c.value}</p>
        </div>
      ))}
    </div>
  )
}

function AgentsBelowTargetTable() {
  return (
    <Card>
      <CardHeader title="Agents Below Target" subtitle="Agents where primary KPI is below defined target" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              <th className="pb-3">Agent</th>
              <th className="pb-3">Team</th>
              <th className="pb-3">KPI</th>
              <th className="pb-3 text-right">Current</th>
              <th className="pb-3 text-right">Target</th>
              <th className="pb-3 text-center">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-400/90">
            {belowTargetAgents.map((agentId) => {
              const agent = agents.find(a => a.id === agentId)
              if (!agent) return null
              const config = getAgentKpiConfig(agentId)
              const target = getAgentKpiTarget(agentId)
              const lower = isLowerBetter(agentId)
              const bm = businessMetrics[agentId]

              let current = config.baseValue
              if (agentId === 'kyc-agent-016' && bm) current = bm.escalationRate
              else if (agentId === 'cs-agent-001' && bm) current = bm.resolutionRate
              else if (agentId === 'collections-009' && bm) current = 68.5

              const isBad = lower ? current > target : current < target

              return (
                <tr key={agentId} className="hover:bg-slate-100/60">
                  <td className="py-3">
                    <Link to={`/agents/${agentId}`} className="font-medium text-slate-900 hover:text-primary-700">{agent.name}</Link>
                  </td>
                  <td className="py-3 text-slate-600">{agent.team}</td>
                  <td className="py-3 text-slate-600">{config.kpiLabel}</td>
                  <td className={`py-3 text-right font-semibold ${isBad ? 'text-red-600' : 'text-slate-900'}`}>
                    {current}%
                  </td>
                  <td className="py-3 text-right text-slate-500">
                    {lower ? '<' : '>'}{target}%
                  </td>
                  <td className="py-3 text-center">
                    {isBad ? (
                      <span className="text-red-500 text-xs font-medium">
                        {lower ? '↑' : '↓'} {lower ? 'Rising' : 'Declining'}
                      </span>
                    ) : (
                      <span className="text-emerald-500 text-xs font-medium">→ Stable</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function TeamKpiHeatmap() {
  const statusColor = {
    green: 'bg-emerald-100 text-emerald-700',
    yellow: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
  }

  return (
    <Card>
      <CardHeader title="Team KPI Heatmap" subtitle="KPI status by team and category" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              <th className="pb-3">Team</th>
              {kpiCategories.map(cat => (
                <th key={cat} className="pb-3 text-center">{cat}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-400/90">
            {heatmapTeams.map((team) => (
              <tr key={team} className="hover:bg-slate-100/60">
                <td className="py-2.5 font-medium text-slate-900">{team}</td>
                {kpiCategories.map((cat, ci) => {
                  const hash = (team + cat).split('').reduce((a, c) => a + c.charCodeAt(0), 0)
                  const status = ['green', 'green', 'yellow', 'green', 'red', 'green', 'green', 'yellow'][hash % 8]
                  return (
                    <td key={cat} className="py-2.5 text-center">
                      <span className={`inline-block w-8 h-6 rounded text-[10px] font-bold leading-6 ${statusColor[status]}`}>
                        {status === 'green' ? 'G' : status === 'yellow' ? 'Y' : 'R'}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function KpiTrendsView() {
  const enterpriseData = useMemo(() => generateEnterpriseKpiData(), [])

  return (
    <>
      {/* Summary Strip */}
      <KpiSummaryStrip />

      {/* Enterprise KPI Trend Lines */}
      <Card>
        <CardHeader
          title="Enterprise KPI Trends"
          subtitle="Key agent KPIs over 26 weeks — all agents overlaid"
        />
        <MultiLineChart
          data={enterpriseData}
          lines={kpiLines}
          xAxisKey="week"
          height={360}
        />
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {kpiLines.map((line) => (
            <div key={line.dataKey} className="flex items-center gap-1.5 text-xs text-slate-600">
              <div className="w-3 h-1 rounded-full" style={{ backgroundColor: line.color }} />
              {line.name}
            </div>
          ))}
        </div>
      </Card>

      {/* Team Heatmap + Below Target */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamKpiHeatmap />
        <AgentsBelowTargetTable />
      </div>
    </>
  )
}

// ── Behavior mode view (existing) ──

function BehaviorView() {
  const [selectedTopic, setSelectedTopic] = useState('no-snow')

  return (
    <>
      {/* Alert Banner */}
      <div className="bg-danger-light border border-danger rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-danger flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold">!</span>
          </div>
          <div>
            <p className="font-semibold text-danger-dark">{driftAlerts.length} Behavior Drift Alerts Detected</p>
            <p className="text-sm text-danger-dark/80 mt-1">
              <strong>{driftAlerts.length} behavioral shifts</strong> have been detected across the agent portfolio.
              Highest severity: "No Snow" topic at 24% in Customer Service. {driftAlerts.filter(d => d.trend === 'growing').length} alerts are still growing.
            </p>
          </div>
        </div>
      </div>

      {/* Drift Alert Summary */}
      <Card>
        <CardHeader
          title="Active Drift Alerts"
          subtitle={`${driftAlerts.length} emerging topics detected across the enterprise`}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <th className="pb-3">Topic</th>
                <th className="pb-3">Primary Agent</th>
                <th className="pb-3 text-center">Agents Affected</th>
                <th className="pb-3 text-center">Peak Impact</th>
                <th className="pb-3 text-center">Severity</th>
                <th className="pb-3 text-center">Trend</th>
                <th className="pb-3">First Detected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-400/90">
              {driftAlerts.map((alert) => (
                <tr key={alert.id} className={alert.severity === 'high' ? 'bg-danger-light/20' : ''}>
                  <td className="py-3"><span className="font-medium text-slate-900">{alert.topic}</span></td>
                  <td className="py-3 text-slate-600">{alert.primaryAgent}</td>
                  <td className="py-3 text-center font-medium">{alert.agentCount}</td>
                  <td className="py-3 text-center">
                    <span className={`font-semibold ${parseInt(alert.peakImpact) > 10 ? 'text-danger' : parseInt(alert.peakImpact) > 5 ? 'text-warning' : 'text-slate-600'}`}>{alert.peakImpact}</span>
                  </td>
                  <td className="py-3 text-center">
                    <Badge variant={alert.severity === 'high' ? 'danger' : alert.severity === 'medium' ? 'warning' : 'neutral'}>{alert.severity}</Badge>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${alert.trend === 'growing' ? 'bg-danger-light text-danger-dark' : 'bg-slate-100 text-slate-600'}`}>
                      {alert.trend === 'growing' ? '↑ Growing' : '→ Stable'}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500 text-xs">{alert.firstDetected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Enterprise Topic Distribution */}
      <h2 className="text-lg font-semibold text-slate-800 mt-2">Deep Dive: "No Snow" Topic (Highest Severity)</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Topic Volume Across Enterprise" subtitle="Aggregated topic frequency (all agents)" />
          <BarChart data={topicBarData} dataKey="value" xAxisKey="name" height={300} />
        </Card>
        <Card>
          <CardHeader title="'No Snow' Topic Trend" subtitle="Emergence and growth over time" />
          <LineChart data={trendOverTime} dataKey="no-snow" xAxisKey="month" color="#EF4444" height={300} />
          <div className="mt-4 p-3 bg-slate-100 rounded-lg text-sm text-slate-600">
            First detected in September with 2% of conversations. Growth accelerated through Q4 and continues into 2025, reaching 24% by February.
          </div>
        </Card>
      </div>

      {/* Affected Agents */}
      <Card>
        <CardHeader title="Affected Agents" subtitle="Agents experiencing the 'no snow' topic drift" />
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
            <tbody className="divide-y divide-slate-400/90">
              {affectedAgents.map((agent) => {
                const agentData = agents.find(a => a.id === agent.id)
                return (
                  <tr key={agent.id} className="hover:bg-slate-100/60">
                    <td className="py-3"><span className="font-medium text-slate-900">{agent.name}</span></td>
                    <td className="py-3 text-slate-600">{agentData?.team}</td>
                    <td className="py-3 text-center">
                      <span className={`font-semibold ${agent.impact > 10 ? 'text-danger' : agent.impact > 5 ? 'text-warning' : 'text-slate-600'}`}>{agent.impact}%</span>
                    </td>
                    <td className="py-3 text-center">
                      <Badge variant={agent.severity === 'high' ? 'danger' : agent.severity === 'medium' ? 'warning' : 'neutral'}>{agent.severity}</Badge>
                    </td>
                    <td className="py-3">
                      <div className="w-full bg-slate-100 rounded-full h-2 max-w-[150px]">
                        <div className={`h-2 rounded-full ${agent.severity === 'high' ? 'bg-danger' : agent.severity === 'medium' ? 'bg-warning' : 'bg-slate-400'}`} style={{ width: `${Math.min(agent.impact * 5, 100)}%` }} />
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
        <CardHeader title="Topic Distribution by Agent" subtitle="How the same topics appear across different agents" />
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
            <tbody className="divide-y divide-slate-400/90">
              {enterpriseTopicData.map((topic) => (
                <tr key={topic.name} className={topic.name === 'No Snow' ? 'bg-danger-light/30' : ''}>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: topic.name === 'No Snow' ? '#EF4444' : topicColors[topic.name.toLowerCase().replace(' ', '-')] || '#94A3B8' }} />
                      <span className="font-medium">{topic.name}</span>
                      {topic.name === 'No Snow' && <Badge variant="danger" size="sm">Drift</Badge>}
                    </div>
                  </td>
                  <td className={`py-3 text-center ${topic.cs > 15 ? 'font-semibold text-danger' : ''}`}>{topic.cs}%</td>
                  <td className={`py-3 text-center ${topic.it > 15 ? 'font-semibold text-danger' : ''}`}>{topic.it}%</td>
                  <td className={`py-3 text-center ${topic.onboard > 15 ? 'font-semibold text-danger' : ''}`}>{topic.onboard}%</td>
                  <td className={`py-3 text-center ${topic.loan > 15 ? 'font-semibold text-danger' : ''}`}>{topic.loan}%</td>
                  <td className={`py-3 text-center ${topic.fraud > 15 ? 'font-semibold text-danger' : ''}`}>{topic.fraud}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recommendations */}
      <div>
        <p className="text-base font-semibold text-slate-900 mb-3">Recommended Actions</p>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-slate-100 rounded-lg">
            <span className="w-6 h-6 rounded-full bg-slate-600 text-white text-sm flex items-center justify-center flex-shrink-0">1</span>
            <div>
              <p className="font-medium text-slate-900">Update Customer Service Agent Prompt</p>
              <p className="text-sm text-slate-600">Add explicit handling for weather-related off-topic queries to redirect users to banking services.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-slate-100 rounded-lg">
            <span className="w-6 h-6 rounded-full bg-slate-600 text-white text-sm flex items-center justify-center flex-shrink-0">2</span>
            <div>
              <p className="font-medium text-slate-900">Implement Topic Classifier Update</p>
              <p className="text-sm text-slate-600">Train classifiers to better detect and route off-topic conversations before they reach agents.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-slate-100 rounded-lg">
            <span className="w-6 h-6 rounded-full bg-slate-600 text-white text-sm flex items-center justify-center flex-shrink-0">3</span>
            <div>
              <p className="font-medium text-slate-900">Monitor for Seasonal Patterns</p>
              <p className="text-sm text-slate-600">Set up alerts for emerging topics that exceed 5% threshold across multiple agents.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Main Component ──

export default function BehaviorTrends() {
  const { demoMode } = useDemoMode()
  const isKpi = demoMode === 'kpi'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="text-2xl font-bold mb-2">{isKpi ? 'KPI Trends' : 'Usage Trends'}</h1>
        <p className="text-sm text-slate-300">
          {isKpi
            ? 'Enterprise KPI performance, targets, and trend analysis across all agents'
            : 'Topic patterns and user behavior drift detected across all agents'}
        </p>
      </div>

      {isKpi ? <KpiTrendsView /> : <BehaviorView />}
    </div>
  )
}
