import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader } from '../components/common'
import { agents, platformSources, DISPLAY_TOTAL_AGENTS, DISPLAY_ACTIVE_AGENTS, DISPLAY_DEGRADED_AGENTS, DISPLAY_MAINTENANCE_AGENTS, DISPLAY_IMPACT_COUNTS } from '../data/agents'
import PlatformLogo from '../components/PlatformLogo'
import {
  LineChart as RechartsLine,
  Line,
  ResponsiveContainer,
} from 'recharts'
import {
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  BeakerIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  ServerStackIcon,
} from '../components/navigation/Icons'

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

const liveEvents = [
  { id: 1, message: 'Customer Service Agent v2.4.1 deployed to production', time: '2m ago', type: 'deploy' },
  { id: 2, message: 'Collections Agent error rate exceeds 2.5% threshold', time: '4m ago', type: 'alert' },
  { id: 3, message: 'Fraud Detection Agent blocked 3 suspicious transactions', time: '7m ago', type: 'action' },
  { id: 4, message: 'Loan Processing Agent prompt update approved by Compliance', time: '12m ago', type: 'approval' },
  { id: 5, message: 'Snowflake Cortex: 8 new agents discovered via proactive scan', time: '18m ago', type: 'scan' },
  { id: 6, message: 'Fraud Detection Agent passed all 24 validation tests', time: '23m ago', type: 'test' },
  { id: 7, message: 'AWS Bedrock connection health check passed', time: '31m ago', type: 'health' },
  { id: 8, message: 'Marketing Personalization Agent campaign conversion up 12%', time: '45m ago', type: 'metric' },
  { id: 9, message: 'IT Support Agent resolved 47 tickets automatically', time: '1h ago', type: 'action' },
  { id: 10, message: 'Compliance Monitor Agent: zero missed alerts (30d streak)', time: '1h ago', type: 'metric' },
]

const eventTypeConfig = {
  deploy: { color: 'bg-blue-500', icon: '↑' },
  alert: { color: 'bg-amber-500', icon: '!' },
  action: { color: 'bg-emerald-500', icon: '→' },
  approval: { color: 'bg-violet-500', icon: '✓' },
  scan: { color: 'bg-primary-500', icon: '◎' },
  test: { color: 'bg-emerald-500', icon: '✓' },
  health: { color: 'bg-emerald-500', icon: '♥' },
  metric: { color: 'bg-blue-500', icon: '↗' },
}

// Display stats use scale-overrides to reflect the full 4,127-agent portfolio narrative
const activeAgents = DISPLAY_ACTIVE_AGENTS
const degradedAgents = DISPLAY_DEGRADED_AGENTS
const maintenanceAgents = DISPLAY_MAINTENANCE_AGENTS
const greenImpact = DISPLAY_IMPACT_COUNTS.green
const yellowImpact = DISPLAY_IMPACT_COUNTS.yellow
const redImpact = DISPLAY_IMPACT_COUNTS.red
const totalWarnings = agents.reduce((sum, a) => sum + (a.operationalRisks?.securityWarnings || 0), 0)

// Generate deterministic sparkline data for an agent
function generateSparkline(seed, points = 14) {
  const data = []
  let value = seed
  for (let i = 0; i < points; i++) {
    // Simple deterministic pseudo-random walk
    value = value + Math.sin(seed * (i + 1) * 0.7) * 15 + Math.cos(seed * i * 1.3) * 10
    data.push({ v: Math.max(0, Math.round(value)) })
  }
  return data
}

// Top agents: core agents sorted by request volume (using responseTime as proxy for activity — lower = busier)
const topAgents = agents
  .filter(a => a.operationalHealth)
  .sort((a, b) => {
    // Sort by a synthetic "interactions" score: lower response time + higher criticality = more active
    const scoreA = (a.criticality === 'high' ? 3 : a.criticality === 'medium' ? 2 : 1) * 1000 - a.operationalHealth.responseTime
    const scoreB = (b.criticality === 'high' ? 3 : b.criticality === 'medium' ? 2 : 1) * 1000 - b.operationalHealth.responseTime
    return scoreB - scoreA
  })
  .slice(0, 10)

const impactDot = {
  green: 'bg-emerald-500',
  yellow: 'bg-amber-400',
  red: 'bg-red-500',
}

const impactColor = {
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
}

const statusLabel = {
  active: { text: 'Active', cls: 'text-emerald-700 bg-emerald-50' },
  degraded: { text: 'Degraded', cls: 'text-amber-700 bg-amber-50' },
  maintenance: { text: 'Maintenance', cls: 'text-slate-600 bg-slate-100' },
}

function Sparkline({ data, color = '#2AB1AC', width = 100, height = 28 }) {
  return (
    <ResponsiveContainer width={width} height={height}>
      <RechartsLine data={data}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </RechartsLine>
    </ResponsiveContainer>
  )
}

function TopAgentsTable() {
  return (
    <Card padding={false}>
      <div className="px-6 pt-5 pb-3 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900">Most Active Agents</h3>
          <p className="text-sm text-slate-500 mt-0.5">Top agents by activity volume (14-day trend)</p>
        </div>
        <Link to="/inventory" className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors">
          View All
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-y border-slate-100">
              <th className="text-left text-[10px] uppercase tracking-wider font-semibold px-6 py-2.5">Agent</th>
              <th className="text-left text-[10px] uppercase tracking-wider font-semibold px-3 py-2.5">Platform</th>
              <th className="text-left text-[10px] uppercase tracking-wider font-semibold px-3 py-2.5">Status</th>
              <th className="text-left text-[10px] uppercase tracking-wider font-semibold px-3 py-2.5">Impact</th>
              <th className="text-right text-[10px] uppercase tracking-wider font-semibold px-3 py-2.5">Resp. Time</th>
              <th className="text-right text-[10px] uppercase tracking-wider font-semibold px-3 py-2.5">Error Rate</th>
              <th className="text-left text-[10px] uppercase tracking-wider font-semibold px-3 py-2.5">Activity (14d)</th>
              <th className="px-3 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {topAgents.map((agent, i) => {
              const platform = platformSources.find(p => p.id === agent.source)
              const sl = statusLabel[agent.status] || statusLabel.active
              const sparkData = generateSparkline(i * 17 + 42)
              const sparkColor = impactColor[agent.businessImpact] || '#2AB1AC'

              return (
                <tr key={agent.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-2.5">
                    <Link to={`/agents/${agent.id}`} className="group">
                      <p className="text-sm font-medium text-slate-900 group-hover:text-primary-700 transition-colors">{agent.name}</p>
                      <p className="text-xs text-slate-400">{agent.team}</p>
                    </Link>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <PlatformLogo sourceId={agent.source} color={platform?.color} size={18} className="rounded" />
                      <span className="text-xs text-slate-600">{platform?.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${sl.cls}`}>
                      {sl.text}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${impactDot[agent.businessImpact]}`} title={agent.businessImpactLabel} />
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <span className="text-sm font-mono text-slate-700">{agent.operationalHealth.responseTime}ms</span>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <span className={`text-sm font-mono ${agent.operationalHealth.errorRate > 1 ? 'text-amber-600' : 'text-slate-700'}`}>
                      {agent.operationalHealth.errorRate}%
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <Sparkline data={sparkData} color={sparkColor} />
                  </td>
                  <td className="px-3 py-2.5">
                    <Link to={`/agents/${agent.id}`}>
                      <ChevronRightIcon className="w-4 h-4 text-slate-300 hover:text-slate-500 transition-colors" />
                    </Link>
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

// Platform health: count degraded agents per platform
function getPlatformHealth(source) {
  const platformAgents = agents.filter(a => a.source === source.id)
  const degraded = platformAgents.filter(a => a.status === 'degraded').length
  const red = platformAgents.filter(a => a.businessImpact === 'red').length
  if (degraded > 0 || red > 0) return 'warning'
  return 'healthy'
}

function LiveTicker() {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => (prev + 1) % liveEvents.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const visibleEvent = liveEvents[offset]
  const cfg = eventTypeConfig[visibleEvent.type] || eventTypeConfig.action

  return (
    <div className="flex items-center gap-3 h-6 overflow-hidden">
      <span className={`flex-shrink-0 w-5 h-5 rounded-full ${cfg.color} flex items-center justify-center text-white text-[10px] font-bold`}>
        {cfg.icon}
      </span>
      <p className="text-sm text-slate-700 truncate animate-fade-in" key={visibleEvent.id}>
        {visibleEvent.message}
      </p>
      <span className="text-xs text-slate-400 flex-shrink-0 ml-auto">{visibleEvent.time}</span>
    </div>
  )
}

function PlatformTile({ source }) {
  const health = getPlatformHealth(source)
  const degradedCount = agents.filter(a => a.source === source.id && a.status === 'degraded').length

  return (
    <Link
      to={`/inventory?platform=${source.id}`}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-slate-300/80 transition-all group"
    >
      <div className="relative flex-shrink-0">
        <PlatformLogo sourceId={source.id} color={source.color} size={28} className="rounded-lg" />
        <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
          health === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
        }`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-primary-700 transition-colors">{source.name}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{source.agentCount} agents</span>
          {degradedCount > 0 && (
            <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">{degradedCount} degraded</span>
          )}
        </div>
      </div>
      <ChevronRightIcon className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </Link>
  )
}

function StatusBoard() {
  return (
    <div className="card p-0 overflow-hidden">
      {/* Top stats strip */}
      <div className="grid grid-cols-6 divide-x divide-slate-100 border-b border-slate-100">
        <div className="px-4 py-3 text-center">
          <p className="text-2xl font-bold text-slate-900">{DISPLAY_TOTAL_AGENTS.toLocaleString()}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Total Agents</p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-2xl font-bold text-emerald-600">{activeAgents}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Active</p>
        </div>
        <div className="px-4 py-3 text-center">
          <Link to="/inventory?status=degraded" className="hover:opacity-80 transition-opacity">
            <p className="text-2xl font-bold text-amber-600">{degradedAgents + maintenanceAgents}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Attention</p>
          </Link>
        </div>
        <div className="px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-lg font-bold text-slate-900">{greenImpact}</span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 ml-1" />
            <span className="text-lg font-bold text-slate-900">{yellowImpact}</span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 ml-1" />
            <span className="text-lg font-bold text-slate-900">{redImpact}</span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Impact (R/Y/G)</p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-2xl font-bold text-slate-900">{platformSources.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Platforms</p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className={`text-2xl font-bold ${totalWarnings > 0 ? 'text-amber-600' : 'text-slate-900'}`}>{totalWarnings}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Sec. Alerts</p>
        </div>
      </div>

      {/* Platform tiles grid */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Platform Status</p>
          <Link to="/platforms" className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors">
            Manage
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {platformSources.map(source => (
            <PlatformTile key={source.id} source={source} />
          ))}
          <Link
            to="/platforms/add"
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary-400 hover:bg-primary-50/30 transition-all group"
          >
            <svg className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="text-sm font-medium text-slate-400 group-hover:text-primary-600 transition-colors">Add Platform</span>
          </Link>
        </div>
      </div>

      {/* Live event ticker */}
      <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100">
        <LiveTicker />
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-primary-300 font-semibold mb-1">ABC Bank &middot; Mira</p>
            <h1 className="text-2xl font-bold">Agent Overview</h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Monitor business impact, operational health, and risk across {DISPLAY_TOTAL_AGENTS.toLocaleString()} agents deployed on {platformSources.length} platforms.
            </p>
          </div>
        </div>
      </div>

      {/* NOC Status Board */}
      <StatusBoard />

      {/* Top Agents */}
      <TopAgentsTable />

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
    </div>
  )
}
