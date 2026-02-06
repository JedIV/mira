import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, StatusBadge, Badge } from '../components/common'
import { agents, platformSources } from '../data/agents'
import { formatRelativeTime } from '../utils/formatters'
import { MagnifyingGlassIcon, ChevronRightIcon } from '../components/navigation/Icons'

const teams = [...new Set(agents.map(a => a.team))]
const domains = [...new Set(agents.map(a => a.domain))]
const statuses = ['all', 'active', 'degraded', 'maintenance', 'offline']

export default function AgentInventory() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [teamFilter, setTeamFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(search.toLowerCase()) ||
                         agent.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter
    const matchesTeam = teamFilter === 'all' || agent.team === teamFilter
    const matchesSource = sourceFilter === 'all' || agent.source === sourceFilter
    return matchesSearch && matchesStatus && matchesTeam && matchesSource
  })

  const getSourceColor = (sourceId) => {
    const source = platformSources.find(s => s.id === sourceId)
    return source?.color || '#94A3B8'
  }

  return (
    <div className="flex gap-6 animate-fade-in">
      {/* Agent List */}
      <div className="flex-1">
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
            <Link key={agent.id} to={`/agents/${agent.id}`}>
              <Card hover className="transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* Source Indicator */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
                      style={{ backgroundColor: getSourceColor(agent.source) }}
                    >
                      {agent.source.slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-slate-900">{agent.name}</h3>
                        <StatusBadge status={agent.status} />
                        {agent.criticality === 'high' && (
                          <Badge variant="danger" size="sm">Critical</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{agent.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
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

                  <ChevronRightIcon className="w-5 h-5 text-slate-400 mt-2" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Platform Sources Sidebar */}
      <div className="w-80 flex-shrink-0">
        <Card className="sticky top-6">
          <CardHeader title="Platform Sources" subtitle="Connected agent frameworks" />
          <div className="space-y-4">
            {platformSources.map((source) => {
              const count = agents.filter(a => a.source === source.id).length
              const activeCount = agents.filter(a => a.source === source.id && a.status === 'active').length

              return (
                <button
                  key={source.id}
                  onClick={() => setSourceFilter(sourceFilter === source.id ? 'all' : source.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    sourceFilter === source.id ? 'bg-slate-100' : 'hover:bg-slate-50'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
                    style={{ backgroundColor: source.color }}
                  >
                    {source.id.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-slate-900">{source.name}</p>
                    <p className="text-xs text-slate-500">{source.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900">{count}</p>
                    <p className="text-xs text-success">{activeCount} active</p>
                  </div>
                </button>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
