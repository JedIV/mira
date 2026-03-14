import { Link } from 'react-router-dom'
import { Card, CardHeader, Badge, BusinessImpactBadge, SummaryCards } from '../components/common'
import { useDemoMode } from '../contexts/DemoModeContext'
import { agents, displayTeamCounts, DISPLAY_IMPACT_COUNTS } from '../data/agents'
import { businessMetrics, getAgentKpiConfig } from '../data/metrics'
import { agentRand } from '../data/prng'
import { ExclamationTriangleIcon } from '../components/navigation/Icons'

const behaviorImpactItems = [
  { key: 'green', label: 'Stable', subtitle: 'No significant behavioral shifts', cardClass: 'bg-emerald-50 border-emerald-200', textClass: 'text-emerald-700', dotClass: 'bg-emerald-500', count: DISPLAY_IMPACT_COUNTS.green, linkTo: '/inventory?impact=green' },
  { key: 'yellow', label: 'Shift Detected', subtitle: 'Observable change in behavior', cardClass: 'bg-amber-50 border-amber-200', textClass: 'text-amber-700', dotClass: 'bg-amber-500', count: DISPLAY_IMPACT_COUNTS.yellow, linkTo: '/inventory?impact=yellow' },
  { key: 'red', label: 'Significant Shift', subtitle: 'Major behavioral change detected', cardClass: 'bg-red-50 border-red-200', textClass: 'text-red-700', dotClass: 'bg-red-500', count: DISPLAY_IMPACT_COUNTS.red, linkTo: '/inventory?impact=red' },
]

const kpiImpactItems = [
  { key: 'green', label: 'On Target', subtitle: 'KPI meets or exceeds defined target', cardClass: 'bg-emerald-50 border-emerald-200', textClass: 'text-emerald-700', dotClass: 'bg-emerald-500', count: DISPLAY_IMPACT_COUNTS.green, linkTo: '/inventory?impact=green' },
  { key: 'yellow', label: 'Approaching Target', subtitle: 'KPI within 5% of target threshold', cardClass: 'bg-amber-50 border-amber-200', textClass: 'text-amber-700', dotClass: 'bg-amber-500', count: DISPLAY_IMPACT_COUNTS.yellow, linkTo: '/inventory?impact=yellow' },
  { key: 'red', label: 'Missing Target', subtitle: 'KPI below defined target', cardClass: 'bg-red-50 border-red-200', textClass: 'text-red-700', dotClass: 'bg-red-500', count: DISPLAY_IMPACT_COUNTS.red, linkTo: '/inventory?impact=red' },
]

const primaryMetricConfig = [
  { key: 'escalationRate', label: 'Escalation Rate', format: (v) => `${v}%` },
  { key: 'resolutionRate', label: 'Resolution Rate', format: (v) => `${v}%` },
  { key: 'customerSatisfaction', label: 'Customer Satisfaction', format: (v) => `${v}/5` },
  { key: 'detectionRate', label: 'Detection Rate', format: (v) => `${v}%` },
  { key: 'blockedTransactions', label: 'Blocked Transactions', format: (v) => v.toLocaleString('en-US') },
  { key: 'approvalRate', label: 'Approval Rate', format: (v) => `${v}%` },
  { key: 'accuracyRate', label: 'Accuracy Rate', format: (v) => `${v}%` },
  { key: 'completionRate', label: 'Completion Rate', format: (v) => `${v}%` },
]

function getPrimaryMetric(agentId, agent) {
  const metrics = businessMetrics[agentId]
  if (metrics) {
    const metricEntry = primaryMetricConfig.find(({ key }) => key in metrics)
    if (metricEntry) {
      return {
        label: metricEntry.label,
        value: metricEntry.format(metrics[metricEntry.key]),
      }
    }
  }

  // Generate a plausible signal value from the agent's domain config
  const kpiConfig = getAgentKpiConfig(agentId)
  const rand = agentRand(agentId + '-biz-kpi')
  const impact = agent?.businessImpact || 'green'
  const penalty = impact === 'red' ? 12 : impact === 'yellow' ? 5 : 0
  const noise = (rand() - 0.5) * 4
  const value = Math.round(Math.max(0, Math.min(100, kpiConfig.baseValue - penalty + noise)) * 10) / 10
  return {
    label: kpiConfig.kpiLabel,
    value: `${value}%`,
  }
}

export default function BusinessPerformance() {
  const { demoMode } = useDemoMode()
  const isKpi = demoMode === 'kpi'
  const impactItems = isKpi ? kpiImpactItems : behaviorImpactItems
  // Display counts reflect full 2,426-agent portfolio scale
  const impactCounts = DISPLAY_IMPACT_COUNTS
  // Real agent filter (for table and alert logic)
  const realRedCount = agents.filter((agent) => agent.businessImpact === 'red').length

  const highlightedAgents = [...agents]
    .filter((agent) => agent.businessImpact !== 'green')
    .sort((a, b) => {
      const order = { red: 0, yellow: 1 }
      return order[a.businessImpact] - order[b.businessImpact]
    })
    .slice(0, 20)

  // Scale team impact counts to match display totals
  const totalDisplay = DISPLAY_IMPACT_COUNTS.green + DISPLAY_IMPACT_COUNTS.yellow + DISPLAY_IMPACT_COUNTS.red
  const redRatio = DISPLAY_IMPACT_COUNTS.red / totalDisplay
  const yellowRatio = DISPLAY_IMPACT_COUNTS.yellow / totalDisplay
  const teamImpact = Object.entries(displayTeamCounts)
    .map(([team, total]) => {
      const red = Math.round(total * redRatio)
      const yellow = Math.round(total * yellowRatio)
      const green = total - red - yellow
      return { team, green, yellow, red, total }
    })
    .sort((a, b) => b.red - a.red || b.yellow - a.yellow || a.team.localeCompare(b.team))
    .slice(0, 10)

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold mb-2">Business Impact</h1>
        <p className="text-sm text-slate-300">
          {isKpi
            ? 'Each agent is measured against customer-defined KPI targets. Status indicates whether an agent is on target, approaching, or missing its performance goals.'
            : 'Each agent\'s behavior is tracked against its own baselines. Impact status indicates whether an agent\'s outcome distribution is stable, shifting, or significantly changed.'}
        </p>
      </div>

      <SummaryCards items={impactItems} />

      {realRedCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <p className="font-medium text-red-700">{isKpi ? 'KPI Performance Alert' : 'Business Risk Alert'}</p>
            <p className="text-sm text-red-700/85 mt-1">
              {isKpi
                ? `${impactCounts.red.toLocaleString()} agents are missing their KPI targets. Review KPI trends, investigate root causes, and adjust targets or agent configuration.`
                : `${impactCounts.red.toLocaleString()} agents show significant behavioral shifts. Review behavior analysis, run validation tests, and check governance status before the next release.`}
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader
          title={isKpi ? 'Agents Below Target' : 'Agents Requiring Attention'}
          subtitle={isKpi ? 'Sorted by KPI gap — click through to investigate' : 'Sorted by impact severity — click through to investigate'}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-400/90">
                <th className="py-3 pr-3">Agent</th>
                <th className="py-3 pr-3">Team</th>
                <th className="py-3 pr-3">Impact</th>
                <th className="py-3 pr-3">Key Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-400/90">
              {highlightedAgents.map((agent) => {
                const metric = getPrimaryMetric(agent.id, agent)
                return (
                  <tr key={agent.id} className="hover:bg-slate-100/60">
                    <td className="py-3 pr-3">
                      <Link to={`/agents/${agent.id}`} className="group">
                        <p className="font-medium text-slate-900 group-hover:text-primary-600 transition-colors">{agent.name}</p>
                        <p className="text-xs text-slate-500">{agent.domain}</p>
                      </Link>
                    </td>
                    <td className="py-3 pr-3 text-slate-700">{agent.team}</td>
                    <td className="py-3 pr-3">
                      <BusinessImpactBadge impact={agent.businessImpact} />
                    </td>
                    <td className="py-3 pr-3">
                      <p className="font-medium text-slate-900">{metric.value}</p>
                      <p className="text-xs text-slate-500">{metric.label}</p>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader
          title={isKpi ? 'KPI Status by Team' : 'Impact by Team'}
          subtitle={isKpi ? 'Teams with the most agents below target' : 'Teams with the most agents needing attention'}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-400/90">
                <th className="py-3 pr-3">Team</th>
                <th className="py-3 pr-3 text-right">Total</th>
                <th className="py-3 pr-3 text-right">{isKpi ? 'On Target' : 'Stable'}</th>
                <th className="py-3 pr-3 text-right">{isKpi ? 'Approaching' : 'Shift Detected'}</th>
                <th className="py-3 text-right">{isKpi ? 'Missing' : 'Significant Shift'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-400/90">
              {teamImpact.map((row) => (
                <tr key={row.team} className="hover:bg-slate-100/60">
                  <td className="py-3 pr-3 font-medium text-slate-900">{row.team}</td>
                  <td className="py-3 pr-3 text-right text-slate-700">{row.total}</td>
                  <td className="py-3 pr-3 text-right text-emerald-600 font-medium">{row.green}</td>
                  <td className="py-3 pr-3 text-right text-amber-600 font-medium">{row.yellow}</td>
                  <td className="py-3 text-right text-red-600 font-medium">{row.red}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
