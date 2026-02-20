import { useParams, Link } from 'react-router-dom'
import { Card, CardHeader, StatusBadge, Badge } from '../components/common'
import { MultiLineChart } from '../components/charts'
import { getAgentById, platformSources } from '../data/agents'
import { getAgentPlatformUrl } from '../data/platforms'
import { generateAgentTimelineData, businessMetrics } from '../data/metrics'
import { getAccessByAgentId } from '../data/access'
import { formatPercent } from '../utils/formatters'
import PlatformLogo from '../components/PlatformLogo'
import {
  ChevronRightIcon,
  SparklesIcon,
  DocumentTextIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '../components/navigation/Icons'

const timelineLines = [
  { dataKey: 'Business Impact', name: 'Business Impact', color: '#2AB1AC' },
  { dataKey: 'Operational Health', name: 'Operational Health', color: '#10B981' },
  { dataKey: 'Operational Risk', name: 'Operational Risk', color: '#EF4444' },
]

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

export default function AgentDetail() {
  const { agentId } = useParams()
  const agent = getAgentById(agentId || 'cs-agent-001')

  if (!agent) {
    return <div className="text-center py-12 text-slate-500">Agent not found</div>
  }

  const accessInfo = getAccessByAgentId(agentId || 'cs-agent-001')
  const source = platformSources.find(s => s.id === agent.source)
  const isQ4Drop = agent.id === 'cs-agent-001'
  const isKycDrop = agent.id === 'kyc-agent-016'
  const timelineData = generateAgentTimelineData(12, isKycDrop ? 'biz-only' : isQ4Drop)
  const agentBusinessMetrics = businessMetrics[agent.id] || {}
  const primaryMetricKey = Object.keys(primaryMetricLabels).find((key) => key in agentBusinessMetrics)
  const primaryMetric = primaryMetricKey
    ? {
        label: primaryMetricLabels[primaryMetricKey],
        value: formatBusinessMetric(primaryMetricKey, agentBusinessMetrics[primaryMetricKey]),
      }
    : {
        label: 'Business KPI',
        value: agent.businessImpact === 'green' ? 'On target' : agent.businessImpact === 'yellow' ? 'Needs review' : 'At risk',
      }

  const impactColors = {
    green: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    yellow: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
  }
  const impact = impactColors[agent.businessImpact] || impactColors.green

  const trendIcon = (trend) => {
    if (trend === 'up') return <ArrowUpIcon className="w-3 h-3 text-danger" />
    if (trend === 'down') return <ArrowDownIcon className="w-3 h-3 text-success" />
    return <span className="text-xs text-slate-400">—</span>
  }

  const formatResponseTime = (ms) => {
    if (ms === 0) return 'N/A'
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Agent Header */}
      <Card>
        <div className="flex items-start gap-6">
          {/* Source Badge */}
          <PlatformLogo sourceId={agent.source} color={source?.color} size={56} className="rounded-xl flex-shrink-0" />

          {/* Agent Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{agent.name}</h1>
              <span className="text-sm text-slate-400">v{agent.version}</span>
              <StatusBadge status={agent.status} />
              {agent.criticality === 'high' && (
                <Badge variant="danger">Critical</Badge>
              )}
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
        <Card className="border-l-4 border-l-primary-400">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-primary-50 rounded-lg flex-shrink-0">
              <SparklesIcon className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-slate-900">AI Insights</h3>
                <span className="text-xs text-slate-400">Auto-generated</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{agent.aiInsight}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Metric Cards: Business Impact, Operational Health, Operational Risks, User Access */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Business Impact */}
        <Card>
          <CardHeader title="Business Impact" />
          <div className={`flex items-center gap-3 p-3 rounded-lg border ${impact.bg} ${impact.border}`}>
            <div className={`w-3 h-3 rounded-full ${impact.dot}`} />
            <span className={`text-sm font-medium ${impact.text}`}>
              {agent.businessImpact === 'green' ? 'On Track' :
               agent.businessImpact === 'yellow' ? 'Needs Attention' :
               'Critical'}
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xs text-slate-500">{primaryMetric.label}</p>
            <p className="text-lg font-semibold text-slate-900">{primaryMetric.value}</p>
          </div>
          <p className="text-xs text-slate-500 mt-2">{agent.businessImpactLabel}</p>
        </Card>

        {/* Operational Health */}
        <Card>
          <CardHeader title="Operational Health" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Agent Response</span>
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
          </div>
        </Card>

        {/* Operational Risks */}
        <Card>
          <CardHeader title="Operational Risks" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Security Warnings</span>
              <span className={`text-lg font-semibold ${
                agent.operationalRisks.securityWarnings > 0 ? 'text-amber-600' : 'text-slate-900'
              }`}>
                {agent.operationalRisks.securityWarnings}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Data Exposure</span>
              <span className={`text-lg font-semibold ${
                agent.operationalRisks.dataExposure > 0 ? 'text-red-600' : 'text-slate-900'
              }`}>
                {agent.operationalRisks.dataExposure > 0 ? `${agent.operationalRisks.dataExposure} event${agent.operationalRisks.dataExposure > 1 ? 's' : ''}` : '0'}
              </span>
            </div>
          </div>
        </Card>

        {/* User Access */}
        <Card>
          <CardHeader title="User Access" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Groups</span>
              <span className="text-lg font-semibold text-slate-900">{accessInfo.summary.totalGroups}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Total Users</span>
              <span className="text-lg font-semibold text-slate-900">{accessInfo.summary.totalUsers.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Active (24h)</span>
              <span className="text-lg font-semibold text-slate-900">{accessInfo.summary.activeUsers24h.toLocaleString()}</span>
            </div>
          </div>
          <Link
            to={`/agents/${agent.id}/access`}
            className="mt-3 inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Manage Access <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </Card>
      </div>

      {/* Timeline Chart — 3 lines */}
      <Card>
        <CardHeader
          title="Performance Timeline"
          subtitle="12-month trend across business impact, health, and risk"
          action={
            <Link
              to={`/agents/${agent.id}/behavior`}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              Investigate Behavior <ChevronRightIcon className="w-4 h-4" />
            </Link>
          }
        />

        {/* Q4 Drop alert — varies by agent */}
        {(isQ4Drop || isKycDrop) && (
          <div className="mb-4 p-4 bg-warning-light border border-warning rounded-lg">
            <p className="font-medium text-warning-dark">Performance Drop Detected</p>
            <p className="text-sm text-warning-dark/80 mt-1">
              {isQ4Drop
                ? 'Resolution rate dropped from 85% to 78% starting in October. This correlates with a new "no snow" topic pattern detected in behavior analysis.'
                : 'Business impact has declined steadily since Q4. Escalation rate climbed from 8% to 23% over 6 weeks — operational health metrics remain stable, masking the business degradation.'}
            </p>
          </div>
        )}

        <MultiLineChart
          data={timelineData}
          lines={timelineLines}
          height={300}
        />

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-6 justify-center">
          {timelineLines.map((line) => (
            <div key={line.dataKey} className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: line.color }} />
              {line.name}
            </div>
          ))}
        </div>
      </Card>

      {/* Agent Information */}
      <Card>
        <CardHeader title="Agent Information" />
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
      </Card>
    </div>
  )
}
