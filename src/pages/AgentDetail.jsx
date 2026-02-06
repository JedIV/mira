import { useParams, Link } from 'react-router-dom'
import { Card, CardHeader, StatusBadge, Badge, MetricCard, MiniMetric } from '../components/common'
import { LineChart } from '../components/charts'
import { getAgentById, platformSources } from '../data/agents'
import { technicalMetrics, businessMetrics, generateTimeSeriesData } from '../data/metrics'
import { formatPercent, formatNumber, formatDate, formatRelativeTime } from '../utils/formatters'
import {
  ChevronRightIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
} from '../components/navigation/Icons'

// Performance data with Q4 drop
const performanceData = generateTimeSeriesData(12, 85, 0.08, true)

export default function AgentDetail() {
  const { agentId } = useParams()
  const agent = getAgentById(agentId || 'cs-agent-001')
  const techMetrics = technicalMetrics[agentId] || technicalMetrics['cs-agent-001']
  const bizMetrics = businessMetrics[agentId] || businessMetrics['cs-agent-001']

  if (!agent) {
    return <div className="text-center py-12 text-slate-500">Agent not found</div>
  }

  const source = platformSources.find(s => s.id === agent.source)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Agent Header */}
      <Card>
        <div className="flex items-start gap-6">
          {/* Source Badge */}
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
            style={{ backgroundColor: source?.color || '#94A3B8' }}
          >
            {agent.source.slice(0, 2).toUpperCase()}
          </div>

          {/* Agent Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900">{agent.name}</h1>
              <StatusBadge status={agent.status} />
              {agent.criticality === 'high' && (
                <Badge variant="danger">Critical</Badge>
              )}
            </div>
            <p className="text-slate-600 mb-4">{agent.description}</p>

            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-slate-500">Owner:</span>
                <span className="ml-2 font-medium text-slate-900">{agent.owner}</span>
              </div>
              <div>
                <span className="text-slate-500">Team:</span>
                <span className="ml-2 font-medium text-slate-900">{agent.team}</span>
              </div>
              <div>
                <span className="text-slate-500">Domain:</span>
                <span className="ml-2 font-medium text-slate-900">{agent.domain}</span>
              </div>
              <div>
                <span className="text-slate-500">Version:</span>
                <span className="ml-2 font-medium text-slate-900">v{agent.version}</span>
              </div>
              <div>
                <span className="text-slate-500">Platform:</span>
                <span className="ml-2 font-medium text-slate-900">{source?.name}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-2">
            <Link
              to={`/agents/${agent.id}/behavior`}
              className="btn-primary text-sm"
            >
              View Behavior
            </Link>
            <button className="btn-secondary text-sm">
              Configure
            </button>
          </div>
        </div>
      </Card>

      {/* Channels & Tags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Supported Channels" />
          <div className="flex flex-wrap gap-2">
            {agent.channels.map((channel) => (
              <Badge key={channel} variant="primary" size="lg">
                {channel.charAt(0).toUpperCase() + channel.slice(1)}
              </Badge>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Tags" />
          <div className="flex flex-wrap gap-2">
            {agent.tags.map((tag) => (
              <Badge key={tag} variant="neutral" size="lg">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Uptime"
          value={formatPercent(techMetrics.uptime)}
          icon={CheckCircleIcon}
        />
        <MetricCard
          label="Avg Response Time"
          value={techMetrics.avgResponseTime}
          suffix="s"
          icon={ClockIcon}
        />
        <MetricCard
          label="Resolution Rate"
          value={formatPercent(bizMetrics.resolutionRate)}
          trend="down"
          trendValue={7.8}
        />
        <MetricCard
          label="Satisfaction"
          value={bizMetrics.customerSatisfaction}
          suffix="/5"
          icon={UserGroupIcon}
          trend="down"
          trendValue={6.7}
        />
      </div>

      {/* Performance Timeline */}
      <Card>
        <CardHeader
          title="Performance Timeline"
          subtitle="Resolution rate over the past 12 months"
          action={
            <Link
              to={`/agents/${agent.id}/behavior`}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              Investigate Behavior <ChevronRightIcon className="w-4 h-4" />
            </Link>
          }
        />

        {/* Q4 Drop Highlight */}
        <div className="mb-4 p-4 bg-warning-light border border-warning rounded-lg">
          <p className="font-medium text-warning-dark">Performance Drop Detected</p>
          <p className="text-sm text-warning-dark/80 mt-1">
            Starting in October (Q4), resolution rate dropped significantly from 85% to 78%.
            This coincides with new topic patterns detected in behavior analysis.
          </p>
        </div>

        <LineChart
          data={performanceData}
          dataKey="value"
          color="#06B6D4"
          height={300}
          referenceLine={{ value: 80, label: 'Target', color: '#EF4444' }}
        />

        {/* Timeline Markers */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span className="text-warning font-medium">Oct ▼</span>
          <span className="text-warning font-medium">Nov</span>
          <span className="text-warning font-medium">Dec</span>
        </div>
      </Card>

      {/* Technical Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Technical Metrics" />
          <div className="grid grid-cols-2 gap-4">
            <MiniMetric label="P95 Latency" value={techMetrics.p95Latency} suffix="s" />
            <MiniMetric label="P99 Latency" value={techMetrics.p99Latency} suffix="s" />
            <MiniMetric label="Error Rate" value={formatPercent(techMetrics.errorRate)} />
            <MiniMetric label="Requests/min" value={formatNumber(techMetrics.requestsPerMinute)} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Business Metrics" />
          <div className="grid grid-cols-2 gap-4">
            <MiniMetric label="Throughput" value={formatNumber(bizMetrics.throughput)} suffix="/day" />
            <MiniMetric label="Avg Handle Time" value={bizMetrics.avgHandleTime} suffix=" min" />
            <MiniMetric label="First Contact Resolution" value={formatPercent(bizMetrics.firstContactResolution)} />
            <MiniMetric label="Escalation Rate" value={formatPercent(bizMetrics.escalationRate)} />
          </div>
        </Card>
      </div>

      {/* Metadata */}
      <Card>
        <CardHeader title="Agent Information" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-slate-500">Created</p>
            <p className="font-medium text-slate-900">{formatDate(agent.createdAt)}</p>
          </div>
          <div>
            <p className="text-slate-500">Last Active</p>
            <p className="font-medium text-slate-900">{formatRelativeTime(agent.lastActive)}</p>
          </div>
          <div>
            <p className="text-slate-500">Agent ID</p>
            <p className="font-mono text-slate-900">{agent.id}</p>
          </div>
          <div>
            <p className="text-slate-500">Criticality</p>
            <p className="font-medium text-slate-900 capitalize">{agent.criticality}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
