import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader } from '../components/common'
import { agents, platformSources, DISPLAY_TOTAL_AGENTS, DISPLAY_STATUS_COUNTS, DISPLAY_IMPACT_COUNTS } from '../data/agents'

// Scale degraded counts per platform to match DISPLAY_STATUS_COUNTS.degraded (51 total)
const platformDegradedCounts = (() => {
  const totalDisplay = platformSources.reduce((s, p) => s + p.agentCount, 0)
  const counts = {}
  let assigned = 0
  platformSources.forEach((p, i) => {
    if (i === platformSources.length - 1) {
      counts[p.id] = DISPLAY_STATUS_COUNTS.degraded - assigned
    } else {
      const c = Math.round((p.agentCount / totalDisplay) * DISPLAY_STATUS_COUNTS.degraded)
      counts[p.id] = c
      assigned += c
    }
  })
  return counts
})()
import { getImportedCount, onImportedCountChange } from '../data/importedAgents'
import PlatformLogo from '../components/PlatformLogo'
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
    description: 'Behavioral stability and outcome shifts across all agents',
    icon: CurrencyDollarIcon,
    href: '/performance/business',
    color: 'bg-emerald-500',
    stats: { label: 'Stable', value: '75%' },
  },
  {
    name: 'Operational Health',
    description: 'Response times, error rates, and uptime across agents',
    icon: ServerStackIcon,
    href: '/performance/operational',
    color: 'bg-blue-500',
    stats: { label: 'Avg Uptime', value: '99.7%' },
  },
  {
    name: 'Behavior Analysis',
    description: 'Conversation topics, drift detection, and pattern shifts',
    icon: ChatBubbleLeftRightIcon,
    href: '/agents/cs-agent-001/behavior',
    color: 'bg-violet-500',
    stats: { label: 'Drift Alerts', value: '7' },
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
    stats: { label: 'Pending', value: '12' },
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

// Display stats use scale-overrides to reflect the full 2,426-agent portfolio narrative

// Deterministic usage trend per agent (up / down / flat + percentage)
function getUsageTrend(agent, index) {
  const seed = (agent.operationalHealth.responseTime * 7 + index * 13) % 100
  if (seed < 40) return { direction: 'up', value: Math.round(seed * 0.4 + 3) }
  if (seed < 70) return { direction: 'flat', value: 0 }
  return { direction: 'down', value: Math.round((seed - 70) * 0.3 + 2) }
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


const statusLabel = {
  active: { text: 'Active', cls: 'text-emerald-700 bg-emerald-50' },
  degraded: { text: 'Degraded', cls: 'text-amber-700 bg-amber-50' },
  maintenance: { text: 'Maintenance', cls: 'text-slate-600 bg-slate-100' },
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
            <tr className="border-y border-slate-200">
              <th className="text-left text-[10px] uppercase tracking-wider font-semibold px-6 py-2.5">Agent</th>
              <th className="text-left text-[10px] uppercase tracking-wider font-semibold px-3 py-2.5">Platform</th>
              <th className="text-left text-[10px] uppercase tracking-wider font-semibold px-3 py-2.5">Status</th>
              <th className="text-left text-[10px] uppercase tracking-wider font-semibold px-3 py-2.5">Behavior</th>
              <th className="text-right text-[10px] uppercase tracking-wider font-semibold px-3 py-2.5">Resp. Time</th>
              <th className="text-right text-[10px] uppercase tracking-wider font-semibold px-3 py-2.5">Error Rate</th>
              <th className="text-right text-[10px] uppercase tracking-wider font-semibold px-3 py-2.5">Usage Trend</th>
              <th className="px-3 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {topAgents.map((agent, i) => {
              const platform = platformSources.find(p => p.id === agent.source)
              const sl = statusLabel[agent.status] || statusLabel.active
              const trend = getUsageTrend(agent, i)

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
                  <td className="px-3 py-2.5 text-right">
                    {trend.direction === 'up' && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                        {trend.value}%
                      </span>
                    )}
                    {trend.direction === 'down' && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" /></svg>
                        {trend.value}%
                      </span>
                    )}
                    {trend.direction === 'flat' && (
                      <span className="text-xs text-slate-400">—</span>
                    )}
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
  const degradedCount = platformDegradedCounts[source.id] || 0

  return (
    <Link
      to={`/inventory?platform=${source.id}`}
      className="flex items-center gap-3 px-3 py-2.5 bg-transparent border border-slate-200/60 transition-all group"
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
  const [importedExtra, setImportedExtra] = useState(getImportedCount)

  useEffect(() => onImportedCountChange(setImportedExtra), [])

  const totalAgents = DISPLAY_TOTAL_AGENTS + importedExtra

  return (
    <div className="card p-0 overflow-hidden">
      {/* Top stats strip — one per sidebar panel */}
      <div className="grid grid-cols-5 divide-x divide-slate-200 border-b border-slate-200">
        <Link to="/inventory" className="px-4 py-3 text-center hover:bg-slate-50 transition-colors">
          <p className="text-2xl font-bold text-slate-900">{totalAgents.toLocaleString()}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Total Agents</p>
        </Link>
        <Link to="/performance/operational" className="px-4 py-3 text-center hover:bg-slate-50 transition-colors">
          <div className="flex items-center justify-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-lg font-bold text-emerald-600">{DISPLAY_STATUS_COUNTS.healthy.toLocaleString()}</span>
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 ml-1" />
            <span className="text-lg font-bold text-amber-600">{DISPLAY_STATUS_COUNTS.degraded}</span>
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 ml-1" />
            <span className="text-lg font-bold text-red-600">{DISPLAY_STATUS_COUNTS.offline}</span>
            <span className="inline-block w-2 h-2 rounded-full bg-slate-400 ml-1" />
            <span className="text-lg font-bold text-slate-500">{DISPLAY_STATUS_COUNTS.maintenance}</span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Op Status</p>
        </Link>
        <Link to="/performance/business" className="px-4 py-3 text-center hover:bg-slate-50 transition-colors">
          <div className="flex items-center justify-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-lg font-bold text-emerald-600">{DISPLAY_IMPACT_COUNTS.green.toLocaleString()}</span>
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 ml-1" />
            <span className="text-lg font-bold text-amber-600">{DISPLAY_IMPACT_COUNTS.yellow}</span>
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 ml-1" />
            <span className="text-lg font-bold text-red-600">{DISPLAY_IMPACT_COUNTS.red}</span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Behavior Status</p>
        </Link>
        <Link to="/usage-trends" className="px-4 py-3 text-center hover:bg-slate-50 transition-colors">
          <p className="text-2xl font-bold text-amber-600">7</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Behavior Drift</p>
        </Link>
        <Link to="/governance" className="px-4 py-3 text-center hover:bg-slate-50 transition-colors">
          <p className="text-2xl font-bold text-slate-900">12</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Pending Approvals</p>
        </Link>
      </div>

      {/* Platform tiles grid */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Platform Status</p>
          <Link to="/settings" className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors">
            Manage
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {platformSources.map(source => (
            <PlatformTile key={source.id} source={source} />
          ))}
          <Link
            to="/platforms/add"
            className="flex items-center justify-center gap-2 px-3 py-2.5 border-2 border-dashed border-slate-200 hover:border-primary-400 hover:bg-primary-50/30 transition-all group"
          >
            <svg className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="text-sm font-medium text-slate-400 group-hover:text-primary-600 transition-colors">Add Platform</span>
          </Link>
        </div>
      </div>

      {/* Live event ticker */}
      <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200">
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
            <p className="text-xs uppercase tracking-wider text-primary-300 font-semibold mb-1">Dataiku Agent Management</p>
            <h1 className="text-2xl font-bold">Agent Overview</h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Monitor behavioral stability, operational health, and risk across {DISPLAY_TOTAL_AGENTS.toLocaleString()} agents deployed on {platformSources.length} platforms.
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
              <Card hover className="h-full transition-all duration-200 hover:-translate-y-0.5">
                <div className={`w-10 h-10 rounded-lg ${dim.color} flex items-center justify-center mb-4`}>
                  <dim.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{dim.name}</h3>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">{dim.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
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
