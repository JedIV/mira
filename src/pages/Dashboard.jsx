import { Link } from 'react-router-dom'
import { Card, CardHeader } from '../components/common'
import { MetricCard } from '../components/common'
import { AreaChart } from '../components/charts'
import { generateLiveActivityData } from '../data/metrics'
import { agents, platformSources } from '../data/agents'
import PlatformLogo from '../components/PlatformLogo'
import {
  CubeIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  BeakerIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ServerStackIcon,
} from '../components/navigation/Icons'

const activityData = generateLiveActivityData()

const dimensions = [
  {
    name: 'Business Impact',
    description: 'KPI tracking with red/yellow/green status across all agents',
    icon: CurrencyDollarIcon,
    href: '/performance/business',
    color: 'bg-emerald-500',
    stats: { label: 'On Target', value: '87%' },
  },
  {
    name: 'Operational Health',
    description: 'Response times, error rates, and uptime across agents',
    icon: ServerStackIcon,
    href: '/performance/technical',
    color: 'bg-blue-500',
    stats: { label: 'Avg Uptime', value: '99.7%' },
  },
  {
    name: 'Behavior Analysis',
    description: 'Conversation topics, drift detection, and pattern shifts',
    icon: ChatBubbleLeftRightIcon,
    href: '/agents/cs-agent-001/behavior',
    color: 'bg-violet-500',
    stats: { label: 'Drift Alerts', value: '1' },
  },
  {
    name: 'Testing',
    description: 'Validation results for prompts, data, and guardrails',
    icon: BeakerIcon,
    href: '/testing',
    color: 'bg-amber-500',
    stats: { label: 'Pass Rate', value: '87%' },
  },
  {
    name: 'Risk & Governance',
    description: 'Compliance status, approvals, and risk assessments',
    icon: ShieldCheckIcon,
    href: '/governance',
    color: 'bg-rose-500',
    stats: { label: 'Pending', value: '3' },
  },
]

const recentActivity = [
  { id: 1, type: 'deployment', message: 'Customer Service Agent v2.4.1 deployed to production', time: '2h ago', status: 'success' },
  { id: 2, type: 'alert', message: 'Collections Agent error rate exceeds 2.5% threshold', time: '4h ago', status: 'warning' },
  { id: 3, type: 'approval', message: 'Loan Processing Agent prompt update approved by Compliance', time: '6h ago', status: 'success' },
  { id: 4, type: 'test', message: 'Fraud Detection Agent passed all 24 validation tests', time: '8h ago', status: 'success' },
]

export default function Dashboard() {
  const activeAgents = agents.filter(a => a.status === 'active').length
  const degradedAgents = agents.filter(a => a.status === 'degraded').length

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-primary-300 font-semibold mb-1">Mira</p>
            <h1 className="text-2xl font-bold">Agent Overview</h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Monitor business impact, operational health, and risk across {agents.length} agents deployed on {platformSources.length} platforms.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          label="Total Agents"
          value={agents.length}
          icon={CubeIcon}
        />
        <MetricCard
          label="Active"
          value={activeAgents}
          icon={CheckCircleIcon}
          trend="up"
          trendValue={2.5}
        />
        <Link to="/inventory?status=degraded">
          <MetricCard
            label="Needs Attention"
            value={degradedAgents}
            icon={ExclamationTriangleIcon}
            className="cursor-pointer hover:shadow-card-hover hover:border-slate-300/80 transition-all"
          />
        </Link>
      </div>

      {/* Live Activity + Platform Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Agent Activity"
              subtitle="Interactions across all agents (24h)"
              icon={SparklesIcon}
            />
            <AreaChart
              data={activityData}
              dataKey="interactions"
              xAxisKey="time"
              height={280}
            />
          </Card>
        </div>

        <Card>
          <CardHeader title="Platforms" subtitle="Connected agent frameworks" />
          <div className="space-y-1">
            {platformSources.map((source) => (
              <Link
                key={source.id}
                to={`/inventory?platform=${source.id}`}
                className="flex items-center justify-between px-2 py-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <PlatformLogo sourceId={source.id} color={source.color} size={20} className="rounded" />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900">{source.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">{source.agentCount}</span>
                  <ChevronRightIcon className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
          <Link to="/platforms/add" className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 border border-dashed border-slate-300 rounded-lg hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50/50 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Platform
          </Link>
        </Card>
      </div>

      {/* Five Dimensions */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Explore</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {dimensions.map((dim) => (
            <Link key={dim.name} to={dim.href}>
              <Card hover className="h-full transition-all duration-200 hover:-translate-y-1">
                <div className={`w-10 h-10 rounded-lg ${dim.color} flex items-center justify-center mb-4`}>
                  <dim.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{dim.name}</h3>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">{dim.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400">{dim.stats.label}</p>
                    <p className="text-lg font-bold text-slate-900">{dim.stats.value}</p>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-slate-300" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader title="Recent Activity" subtitle="Latest events across the platform" />
        <div className="divide-y divide-slate-100">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 py-3">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                activity.status === 'success' ? 'bg-emerald-500' :
                activity.status === 'warning' ? 'bg-amber-500' : 'bg-slate-400'
              }`} />
              <p className="flex-1 text-sm text-slate-700">{activity.message}</p>
              <span className="text-xs text-slate-400 flex-shrink-0">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
