import { Link } from 'react-router-dom'
import { Card, CardHeader } from '../components/common'
import { MetricCard } from '../components/common'
import { AreaChart } from '../components/charts'
import { generateLiveActivityData } from '../data/metrics'
import { agents, platformSources } from '../data/agents'
import {
  CubeIcon,
  ServerStackIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  BeakerIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
} from '../components/navigation/Icons'

const activityData = generateLiveActivityData()

const dimensions = [
  {
    name: 'Technical Performance',
    description: 'System health, uptime, and response times',
    icon: ServerStackIcon,
    href: '/performance/technical',
    color: 'bg-blue-500',
    stats: { label: 'Avg Uptime', value: '99.7%' },
  },
  {
    name: 'Business Performance',
    description: 'KPIs, satisfaction, and throughput',
    icon: CurrencyDollarIcon,
    href: '/performance/business',
    color: 'bg-emerald-500',
    stats: { label: 'Satisfaction', value: '4.1/5' },
  },
  {
    name: 'Agent Behavior',
    description: 'Conversation patterns and topic drift',
    icon: ChatBubbleLeftRightIcon,
    href: '/agents/cs-agent-001/behavior',
    color: 'bg-violet-500',
    stats: { label: 'Topics Tracked', value: '24' },
  },
  {
    name: 'Testing',
    description: 'Quality assurance and validation',
    icon: BeakerIcon,
    href: '/testing',
    color: 'bg-amber-500',
    stats: { label: 'Pass Rate', value: '87%' },
  },
  {
    name: 'Governance',
    description: 'Risk management and compliance',
    icon: ShieldCheckIcon,
    href: '/governance',
    color: 'bg-rose-500',
    stats: { label: 'Pending', value: '3' },
  },
]

const recentActivity = [
  { id: 1, type: 'deployment', message: 'Customer Service Agent v2.4.1 deployed', time: '2h ago', status: 'success' },
  { id: 2, type: 'alert', message: 'Collections Agent experiencing high error rate', time: '4h ago', status: 'warning' },
  { id: 3, type: 'approval', message: 'Loan Processing Agent update approved', time: '6h ago', status: 'success' },
  { id: 4, type: 'test', message: 'Fraud Detection Agent passed all tests', time: '8h ago', status: 'success' },
]

export default function Dashboard() {
  const activeAgents = agents.filter(a => a.status === 'active').length
  const degradedAgents = agents.filter(a => a.status === 'degraded').length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Agents"
          value={agents.length}
          icon={CubeIcon}
        />
        <MetricCard
          label="Active Agents"
          value={activeAgents}
          icon={CheckCircleIcon}
          trend="up"
          trendValue={2.5}
        />
        <MetricCard
          label="Platforms Connected"
          value={platformSources.length}
          icon={ServerStackIcon}
        />
        <MetricCard
          label="Issues Detected"
          value={degradedAgents}
          icon={ExclamationTriangleIcon}
        />
      </div>

      {/* Live Activity + Dimensions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Activity Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Live Activity"
              subtitle="Agent interactions across the enterprise (24h)"
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

        {/* Platform Sources */}
        <Card>
          <CardHeader title="Platform Sources" subtitle="Agents by framework" />
          <div className="space-y-3">
            {platformSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: source.color }}
                  />
                  <span className="text-sm text-slate-700">{source.name}</span>
                </div>
                <span className="text-sm font-medium text-slate-900">{source.agentCount}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Five Dimensions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Management Dimensions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {dimensions.map((dim) => (
            <Link key={dim.name} to={dim.href}>
              <Card hover className="h-full transition-all duration-200 hover:-translate-y-1">
                <div className={`w-10 h-10 rounded-lg ${dim.color} flex items-center justify-center mb-4`}>
                  <dim.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{dim.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{dim.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400">{dim.stats.label}</p>
                    <p className="text-lg font-semibold text-slate-900">{dim.stats.value}</p>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-slate-400" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader title="Recent Activity" subtitle="Latest events across your agent ecosystem" />
        <div className="divide-y divide-slate-100">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 py-3">
              <div className={`w-2 h-2 rounded-full ${
                activity.status === 'success' ? 'bg-success' :
                activity.status === 'warning' ? 'bg-warning' : 'bg-slate-400'
              }`} />
              <p className="flex-1 text-sm text-slate-700">{activity.message}</p>
              <span className="text-xs text-slate-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
