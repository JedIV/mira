import { Link } from 'react-router-dom'
import { Card, CardHeader, Badge, BusinessImpactBadge } from '../components/common'
import { agents } from '../data/agents'
import { businessMetrics } from '../data/metrics'
import { ChevronRightIcon, ExclamationTriangleIcon } from '../components/navigation/Icons'

const impactConfig = {
  green: {
    label: 'Green',
    subtitle: 'On track',
    variant: 'success',
    cardClass: 'bg-emerald-50 border-emerald-200',
    textClass: 'text-emerald-700',
    dotClass: 'bg-emerald-500',
  },
  yellow: {
    label: 'Yellow',
    subtitle: 'Needs attention',
    variant: 'warning',
    cardClass: 'bg-amber-50 border-amber-200',
    textClass: 'text-amber-700',
    dotClass: 'bg-amber-500',
  },
  red: {
    label: 'Red',
    subtitle: 'At risk',
    variant: 'danger',
    cardClass: 'bg-red-50 border-red-200',
    textClass: 'text-red-700',
    dotClass: 'bg-red-500',
  },
}

const primaryMetricConfig = [
  { key: 'resolutionRate', label: 'Resolution Rate', format: (v) => `${v}%` },
  { key: 'customerSatisfaction', label: 'Customer Satisfaction', format: (v) => `${v}/5` },
  { key: 'detectionRate', label: 'Detection Rate', format: (v) => `${v}%` },
  { key: 'blockedTransactions', label: 'Blocked Transactions', format: (v) => v.toLocaleString('en-US') },
  { key: 'approvalRate', label: 'Approval Rate', format: (v) => `${v}%` },
  { key: 'accuracyRate', label: 'Accuracy Rate', format: (v) => `${v}%` },
  { key: 'completionRate', label: 'Completion Rate', format: (v) => `${v}%` },
]

function getPrimaryMetric(agentId) {
  const metrics = businessMetrics[agentId]
  if (!metrics) {
    return { label: 'Business KPI', value: 'Context-specific' }
  }

  const metricEntry = primaryMetricConfig.find(({ key }) => key in metrics)
  if (!metricEntry) {
    return { label: 'Business KPI', value: 'Context-specific' }
  }

  return {
    label: metricEntry.label,
    value: metricEntry.format(metrics[metricEntry.key]),
  }
}

export default function BusinessPerformance() {
  const impactCounts = {
    green: agents.filter((agent) => agent.businessImpact === 'green').length,
    yellow: agents.filter((agent) => agent.businessImpact === 'yellow').length,
    red: agents.filter((agent) => agent.businessImpact === 'red').length,
  }

  const highlightedAgents = [...agents]
    .filter((agent) => agent.businessImpact !== 'green')
    .sort((a, b) => {
      const order = { red: 0, yellow: 1 }
      return order[a.businessImpact] - order[b.businessImpact]
    })
    .slice(0, 20)

  const teamImpact = Object.entries(
    agents.reduce((acc, agent) => {
      if (!acc[agent.team]) {
        acc[agent.team] = { green: 0, yellow: 0, red: 0 }
      }
      acc[agent.team][agent.businessImpact] += 1
      return acc
    }, {})
  )
    .map(([team, counts]) => ({ team, ...counts }))
    .sort((a, b) => b.red - a.red || b.yellow - a.yellow || a.team.localeCompare(b.team))
    .slice(0, 10)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="text-2xl font-bold mb-2">Business Impact</h1>
        <p className="text-sm text-slate-300">
          Each agent is measured against its own business KPIs. Impact status indicates whether an agent is meeting, approaching, or missing its targets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['green', 'yellow', 'red']).map((impact) => {
          const config = impactConfig[impact]
          return (
            <Card key={impact} className={`border ${config.cardClass}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${config.dotClass}`} />
                  <p className={`font-semibold ${config.textClass}`}>{config.label}</p>
                </div>
                <p className={`text-2xl font-bold ${config.textClass}`}>{impactCounts[impact]}</p>
              </div>
              <p className="text-sm text-slate-600">{config.subtitle}</p>
            </Card>
          )
        })}
      </div>

      {impactCounts.red > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <p className="font-medium text-red-700">Business Risk Alert</p>
            <p className="text-sm text-red-700/85 mt-1">
              {impactCounts.red} {impactCounts.red === 1 ? 'agent is' : 'agents are'} missing business targets. Review behavior analysis, run validation tests, and check governance status before the next release.
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader
          title="Agents Requiring Attention"
          subtitle="Sorted by impact severity — click through to investigate"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 pr-3">Agent</th>
                <th className="py-3 pr-3">Team</th>
                <th className="py-3 pr-3">Impact</th>
                <th className="py-3 pr-3">Primary KPI</th>
                <th className="py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {highlightedAgents.map((agent) => {
                const metric = getPrimaryMetric(agent.id)
                const config = impactConfig[agent.businessImpact]
                return (
                  <tr key={agent.id} className="hover:bg-slate-50">
                    <td className="py-3 pr-3">
                      <p className="font-medium text-slate-900">{agent.name}</p>
                      <p className="text-xs text-slate-500">{agent.domain}</p>
                    </td>
                    <td className="py-3 pr-3 text-slate-700">{agent.team}</td>
                    <td className="py-3 pr-3">
                      <BusinessImpactBadge impact={agent.businessImpact} />
                    </td>
                    <td className="py-3 pr-3">
                      <p className="font-medium text-slate-900">{metric.value}</p>
                      <p className="text-xs text-slate-500">{metric.label}</p>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/agents/${agent.id}`}
                        className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 font-medium"
                      >
                        Open Agent 360 <ChevronRightIcon className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader title="Impact by Team" subtitle="Teams with the most agents needing attention" />
        <div className="space-y-3">
          {teamImpact.map((row) => (
            <div key={row.team} className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-3">
              <p className="text-sm font-medium text-slate-900">{row.team}</p>
              <div className="flex items-center gap-2 text-xs">
                <Badge variant="danger" dot>Red {row.red}</Badge>
                <Badge variant="warning" dot>Yellow {row.yellow}</Badge>
                <Badge variant="success" dot>Green {row.green}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
