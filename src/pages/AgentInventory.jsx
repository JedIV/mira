import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Card, StatusBadge, Badge, BusinessImpactBadge } from '../components/common'
import { agents, platformSources } from '../data/agents'
import { formatRelativeTime } from '../utils/formatters'
import { MagnifyingGlassIcon, DocumentTextIcon } from '../components/navigation/Icons'
import PlatformLogo from '../components/PlatformLogo'

const teams = [...new Set(agents.map(a => a.team))]
const statuses = ['all', 'active', 'degraded', 'maintenance', 'offline']

export default function AgentInventory() {
  const [searchParams] = useSearchParams()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [teamFilter, setTeamFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState(searchParams.get('platform') || 'all')

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(search.toLowerCase()) ||
                         agent.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter
    const matchesTeam = teamFilter === 'all' || agent.team === teamFilter
    const matchesSource = sourceFilter === 'all' || agent.source === sourceFilter
    return matchesSearch && matchesStatus && matchesTeam && matchesSource
  })

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 page-header">
        <div>
          <h1 className="text-2xl font-bold">Agent Inventory</h1>
          <p className="text-sm text-slate-300 mt-1">Browse and manage all agents across teams and platforms</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search agents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="all">All Status</option>
            {statuses.slice(1).map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>

          {/* Team Filter */}
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="all">All Teams</option>
            {teams.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="all">All Platforms</option>
            {platformSources.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-slate-500 mb-4">
        Showing {filteredAgents.length} of {agents.length} agents
      </p>

      {/* Agent Cards */}
      <div className="space-y-3">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} hover className="transition-all duration-200 hover:-translate-y-0.5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Source Indicator */}
                <PlatformLogo sourceId={agent.source} size={40} className="rounded-lg flex-shrink-0" />

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={`/agents/${agent.id}`} className="font-semibold text-slate-900 hover:text-primary-700">
                      {agent.name}
                    </Link>
                    <StatusBadge status={agent.status} />
                    {agent.criticality === 'high' && (
                      <Badge variant="danger" size="sm">Critical</Badge>
                    )}
                    <BusinessImpactBadge impact={agent.businessImpact} />
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{agent.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400">
                    <span>{agent.team}</span>
                    <span>•</span>
                    <span>{agent.domain}</span>
                    <span>•</span>
                    <span>v{agent.version}</span>
                    <span>•</span>
                    <span>Active {formatRelativeTime(agent.lastActive)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Link to={`/agents/${agent.id}`} className="btn-primary text-xs px-3 py-1.5">
                  Open Agent 360
                </Link>
                <div className="flex items-center gap-2">
                  <Link to={`/agents/${agent.id}/behavior`} className="btn-secondary text-xs px-2.5 py-1.5">
                    Behavior
                  </Link>
                  <Link to={`/agents/${agent.id}/logs`} className="btn-secondary text-xs px-2.5 py-1.5">
                    <DocumentTextIcon className="w-3.5 h-3.5" />
                    Logs
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
