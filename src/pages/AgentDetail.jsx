import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardHeader, StatusBadge, BusinessImpactBadge } from '../components/common'
import { MultiLineChart } from '../components/charts'
import { getAgentById, platformSources } from '../data/agents'
import { agentRand } from '../data/prng'
import { getAgentPlatformUrl } from '../data/platforms'
import { generateBusinessTimelineData, generateUptimeData, getAgentKpiConfig, businessMetrics } from '../data/metrics'
import { formatPercent } from '../utils/formatters'
import PlatformLogo from '../components/PlatformLogo'
import {
  ChevronRightIcon,
  SparklesIcon,
  DocumentTextIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '../components/navigation/Icons'

const primaryMetricLabels = {
  escalationRate: 'Escalation Rate',
  resolutionRate: 'Resolution Rate',
  customerSatisfaction: 'Customer Satisfaction',
  throughput: 'Throughput',
  detectionRate: 'Detection Rate',
  blockedTransactions: 'Blocked Transactions',
  approvalRate: 'Approval Rate',
  accuracyRate: 'Accuracy Rate',
  completionRate: 'Completion Rate',
  employeeSatisfaction: 'Employee Satisfaction',
}

function formatBusinessMetric(key, value) {
  if (key === 'customerSatisfaction' || key === 'employeeSatisfaction') return `${value}/5`
  if (key === 'blockedTransactions' || key === 'throughput') return value.toLocaleString('en-US')
  return `${value}%`
}

const statusColors = {
  operational: '#4ade80',
  minor: '#fbbf24',
  degraded: '#fb923c',
  major: '#ef4444',
}

function UptimeBar({ days }) {
  const [tooltip, setTooltip] = useState(null)
  const count = days.length
  const barW = 10
  const gap = 1.5
  const totalW = count * barW + (count - 1) * gap
  const h = 36

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${totalW} ${h}`} preserveAspectRatio="none" className="w-full" style={{ height: 40 }}>
        {days.map((day, i) => (
          <rect
            key={day.date}
            x={i * (barW + gap)}
            y={0}
            width={barW}
            height={h}
            rx={1.5}
            fill={statusColors[day.status]}
            onMouseEnter={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              setTooltip({ day, x: r.left + r.width / 2, y: r.top })
            }}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
      </svg>
      {tooltip && (
        <div
          className="fixed px-2 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap pointer-events-none z-50"
          style={{ left: tooltip.x, top: tooltip.y - 8, transform: 'translate(-50%, -100%)' }}
        >
          <p className="font-medium">{tooltip.day.label}</p>
          <p>{tooltip.day.uptimePercent}% uptime</p>
        </div>
      )}
    </div>
  )
}

function RequestReviewButton({ variant }) {
  const [requested, setRequested] = useState(false)

  const handleClick = () => {
    setRequested(true)
    setTimeout(() => setRequested(false), 2000)
  }

  if (requested) {
    return (
      <button className="btn-secondary text-xs w-full mt-3 bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default" disabled>
        <svg className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
        Review Requested
      </button>
    )
  }

  return (
    <button
      className={`${variant === 'red' ? 'btn-primary' : 'btn-secondary'} text-xs w-full mt-3`}
      onClick={handleClick}
    >
      Request Review
    </button>
  )
}

export default function AgentDetail() {
  const { agentId } = useParams()
  const agent = getAgentById(agentId)

  if (!agent) {
    return <div className="text-center py-12 text-slate-500">Agent not found</div>
  }

  const source = platformSources.find(s => s.id === agent.source)
  const kpiConfig = getAgentKpiConfig(agent.id)
  const bizTimelineData = generateBusinessTimelineData(agent.id)
  const uptimeData = generateUptimeData(agent.id)
  // Red + thicker line for agents with behavioral shifts
  const isShifting = agent.businessImpact === 'red' || agent.businessImpact === 'yellow'
  const bizLines = [
    { dataKey: kpiConfig.kpiLabel, name: kpiConfig.kpiLabel, color: isShifting ? '#EF4444' : '#2AB1AC', strokeWidth: isShifting ? 3 : 2 },
  ]
  const agentBusinessMetrics = businessMetrics[agent.id] || {}
  const primaryMetricKey = Object.keys(primaryMetricLabels).find((key) => key in agentBusinessMetrics)
  const primaryMetric = primaryMetricKey
    ? {
        label: primaryMetricLabels[primaryMetricKey],
        value: formatBusinessMetric(primaryMetricKey, agentBusinessMetrics[primaryMetricKey]),
      }
    : {
        label: 'Behavioral Status',
        value: agent.businessImpact === 'green' ? 'No shifts detected' : agent.businessImpact === 'yellow' ? 'Shift detected' : 'Significant shift',
      }

  const impactColors = {
    green: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    yellow: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
  }
  const impact = impactColors[agent.businessImpact] || impactColors.green

  // Operational health extras
  const healthRand = agentRand(agent.id + '-health')
  const uptime = agent.operationalHealth.errorRate > 1 ? (97 + healthRand() * 2).toFixed(1) : (99 + healthRand() * 0.9).toFixed(1)
  const hasIncident = agent.status === 'degraded' || agent.businessImpact === 'red' || agent.operationalHealth.errorRate > 1.5
  const incidentDaysAgo = hasIncident ? Math.round(1 + healthRand() * 14) : null
  const lastIncident = incidentDaysAgo ? `${incidentDaysAgo}d ago` : 'None'

  const usageRand = agentRand(agent.id + '-usage')
  const monthly = Math.round(50 + usageRand() * 450)
  const weekly = Math.round(monthly * (0.4 + usageRand() * 0.2))
  const daily = Math.round(weekly * (0.3 + usageRand() * 0.2))
  const usageStats = {
    daily,
    weekly,
    monthly,
    dailyChange: Math.round((usageRand() - 0.4) * 30),
    weeklyChange: Math.round((usageRand() - 0.4) * 20),
    monthlyChange: Math.round((usageRand() - 0.3) * 15),
  }

  const trendIcon = (trend) => {
    if (trend === 'up') return <ArrowUpIcon className="w-3 h-3 text-danger" />
    if (trend === 'down') return <ArrowDownIcon className="w-3 h-3 text-success" />
    return <span className="text-xs text-slate-500">—</span>
  }

  const formatResponseTime = (ms) => {
    if (ms === 0) return 'N/A'
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  return (
    <div className="space-y-6">
      {/* Agent Header */}
      <Card>
        <div className="flex items-start gap-6">
          {/* Source Badge */}
          <PlatformLogo sourceId={agent.source} color={source?.color} size={56} className="rounded-xl flex-shrink-0" />

          {/* Agent Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{agent.name}</h1>
              <span className="text-sm text-slate-500">v{agent.version}</span>
              <StatusBadge status={agent.status} />
            </div>
            <p className="text-slate-600 mb-3">{agent.description}</p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-slate-500">Owner:</span>
                <span className="ml-1 font-medium text-slate-900">{agent.owner}</span>
              </div>
              <div>
                <span className="text-slate-500">Team:</span>
                <span className="ml-1 font-medium text-slate-900">{agent.team}</span>
              </div>
              <div>
                <span className="text-slate-500">Domain:</span>
                <span className="ml-1 font-medium text-slate-900">{agent.domain}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-500">Platform:</span>
                <span className="ml-1 font-medium text-slate-900">{source?.name}</span>
                {getAgentPlatformUrl(agent) && (
                  <a
                    href={getAgentPlatformUrl(agent)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 ml-1 text-primary-600 hover:text-primary-700 transition-colors"
                    title={`Open in ${source?.name}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {agent.channels.map((channel) => (
                  <span key={channel} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                    {channel}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <Link
              to={`/agents/${agent.id}/behavior`}
              className="btn-primary text-sm"
            >
              View Behavior
            </Link>
            <Link
              to={`/agents/${agent.id}/logs`}
              className="btn-secondary text-sm flex items-center gap-1.5"
            >
              <DocumentTextIcon className="w-4 h-4" />
              See Logs
            </Link>
          </div>
        </div>
      </Card>

      {/* AI Insights */}
      {agent.aiInsight && (
        <div className="pl-4 border-l-4 border-l-primary-400 py-1">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-primary-50 rounded-lg flex-shrink-0">
              <SparklesIcon className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-slate-900">AI Insights</h3>
                <span className="text-xs text-slate-500">Auto-generated</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{agent.aiInsight}</p>
            </div>
          </div>
        </div>
      )}

      {/* Metric Cards: Behavioral Stability, Operational Health, User Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Behavioral Stability */}
        <Card>
          <CardHeader title="Behavioral Stability" />
          <div className={`flex items-center gap-3 p-3 rounded-lg border ${impact.bg} ${impact.border}`}>
            <div className={`w-3 h-3 rounded-full ${impact.dot}`} />
            <span className={`text-sm font-medium ${impact.text}`}>
              {agent.businessImpact === 'green' ? 'Stable' :
               agent.businessImpact === 'yellow' ? 'Shift Detected' :
               'Significant Shift'}
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xs text-slate-500">{primaryMetric.label}</p>
            <p className="text-lg font-semibold text-slate-900">{primaryMetric.value}</p>
          </div>
          <p className="text-xs text-slate-500 mt-2">{agent.businessImpactLabel}</p>
          {(agent.businessImpact === 'yellow' || agent.businessImpact === 'red') && (
            <RequestReviewButton variant={agent.businessImpact} />
          )}
        </Card>

        {/* Operational Health */}
        <Card>
          <CardHeader title="Operational Health" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Uptime</span>
              <span className={`text-lg font-semibold ${parseFloat(uptime) >= 99.5 ? 'text-emerald-600' : 'text-amber-600'}`}>{uptime}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Avg Response</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-slate-900">
                  {formatResponseTime(agent.operationalHealth.responseTime)}
                </span>
                {trendIcon(agent.operationalHealth.responseTimeTrend)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Error Rate</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-slate-900">
                  {formatPercent(agent.operationalHealth.errorRate)}
                </span>
                {trendIcon(agent.operationalHealth.errorRateTrend)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Last Incident</span>
              <span className={`text-lg font-semibold ${lastIncident === 'None' ? 'text-emerald-600' : 'text-amber-600'}`}>{lastIncident}</span>
            </div>
          </div>
        </Card>

        {/* Usage Stats */}
        <Card>
          <CardHeader title="Usage Stats" />
          <div className="space-y-3">
            {[
              { label: 'Daily Active', value: usageStats.daily, change: usageStats.dailyChange },
              { label: 'Weekly Active', value: usageStats.weekly, change: usageStats.weeklyChange },
              { label: 'Monthly Active', value: usageStats.monthly, change: usageStats.monthlyChange },
            ].map(({ label, value, change }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-slate-900">{value.toLocaleString()}</span>
                  <span className={`text-xs font-medium ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {change >= 0 ? '+' : ''}{change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Uptime Status Bar */}
      <div className="border-t border-slate-400/90 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Operational Performance</h3>
            <p className="text-xs text-slate-500 mt-0.5">90-day uptime history</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900">{uptimeData.avgUptime}%</p>
            <p className="text-xs text-slate-500">overall uptime</p>
          </div>
        </div>
        <UptimeBar days={uptimeData.days} />
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
          <span>{uptimeData.days[0]?.label}</span>
          <span>Today</span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-400/90 flex items-center gap-4 justify-center">
          {[
            { label: 'Operational', className: 'bg-emerald-400' },
            { label: 'Minor Issue', className: 'bg-amber-400' },
            { label: 'Degraded', className: 'bg-orange-400' },
            { label: 'Major Outage', className: 'bg-red-500' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className={`w-2.5 h-2.5 rounded-sm ${item.className}`} />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Business Performance Chart */}
      <Card>
        <CardHeader
          title="Business Performance"
          subtitle={`${kpiConfig.kpiLabel} — weekly over 6 months`}
          action={
            <Link
              to={`/agents/${agent.id}/behavior`}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              Investigate Behavior <ChevronRightIcon className="w-4 h-4" />
            </Link>
          }
        />

        {/* Performance drop alert for agents with declining KPIs */}
        {agent.id === 'cs-agent-001' && (
          <div className="mb-4 p-4 bg-warning-light border border-warning rounded-lg">
            <p className="font-medium text-warning-dark">Behavior Shift Detected</p>
            <p className="text-sm text-warning-dark/80 mt-1">
              Resolution rate dropped from 85% to 78% starting in October. This correlates with a new "no snow" topic pattern detected in behavior analysis.
            </p>
          </div>
        )}
        {agent.id === 'kyc-agent-016' && (
          <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-lg">
            <p className="font-medium text-red-700">Outcome Shift Detected</p>
            <p className="text-sm text-red-600/80 mt-1">
              Escalation rate climbed from 8% to 23% since September. The agent is routing a disproportionate number of credit applications to manual review, doubling processing time.
            </p>
          </div>
        )}

        <MultiLineChart
          data={bizTimelineData}
          lines={bizLines}
          xAxisKey="week"
          height={280}
        />
      </Card>

      {/* Agent Information */}
      <div className="pt-2 border-t border-slate-400/90">
        <p className="text-base font-semibold text-slate-900 mb-4">Agent Information</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-slate-500">Created</p>
            <p className="font-medium text-slate-900">{agent.createdAt}</p>
          </div>
          <div>
            <p className="text-slate-500">Agent ID</p>
            <p className="font-mono text-slate-900">{agent.id}</p>
          </div>
          <div>
            <p className="text-slate-500">Criticality</p>
            <p className="font-medium text-slate-900 capitalize">{agent.criticality}</p>
          </div>
          <div>
            <p className="text-slate-500">Tags</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {agent.tags.map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
