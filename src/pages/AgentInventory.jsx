import { useState, useRef, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { StatusBadge, Badge, BusinessImpactBadge } from '../components/common'
import { agents, platformSources, DISPLAY_TOTAL_AGENTS } from '../data/agents'
import { formatRelativeTime } from '../utils/formatters'
import { MagnifyingGlassIcon, DocumentTextIcon } from '../components/navigation/Icons'
import PlatformLogo from '../components/PlatformLogo'
import { roles, roleCoversAgent } from '../data/roles'

const statuses = ['all', 'active', 'degraded', 'maintenance', 'offline']
const impacts = ['all', 'green', 'yellow', 'red']
const impactLabels = { green: 'Stable', yellow: 'Shift Detected', red: 'Significant Shift' }

function RoleMultiSelect({ selected, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const toggle = (roleId) => {
    if (selected.includes(roleId)) {
      onChange(selected.filter(id => id !== roleId))
    } else {
      onChange([...selected, roleId])
    }
  }

  const label = selected.length === 0
    ? 'All Roles'
    : selected.length === 1
      ? roles.find(r => r.id === selected[0])?.name
      : `${selected.length} Roles`

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="input w-auto flex items-center gap-2 cursor-pointer min-w-[140px]"
      >
        <span className="flex-1 text-left">{label}</span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg py-1 animate-fade-in">
          {selected.length > 0 && (
            <button
              onClick={() => onChange([])}
              className="w-full text-left px-3 py-1.5 text-xs text-primary-600 hover:bg-slate-50 font-medium"
            >
              Clear selection
            </button>
          )}
          {roles.map((role) => (
            <label
              key={role.id}
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(role.id)}
                onChange={() => toggle(role.id)}
                className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: role.color }}
              />
              <span className="text-sm text-slate-700">{role.name}</span>
              <span className="text-xs text-slate-400 ml-auto">{role.type}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AgentInventory() {
  const [searchParams] = useSearchParams()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [impactFilter, setImpactFilter] = useState(searchParams.get('impact') || 'all')
  const [roleFilter, setRoleFilter] = useState([])
  const [sourceFilter, setSourceFilter] = useState(searchParams.get('platform') || 'all')
  const [visibleCount, setVisibleCount] = useState(100)

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(search.toLowerCase()) ||
                         agent.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter
    const matchesImpact = impactFilter === 'all' || agent.businessImpact === impactFilter
    const matchesRole = roleFilter.length === 0 || roleFilter.some(roleId => {
      const role = roles.find(r => r.id === roleId)
      return role && roleCoversAgent(role, agent.id)
    })
    const matchesSource = sourceFilter === 'all' || agent.source === sourceFilter
    return matchesSearch && matchesStatus && matchesImpact && matchesRole && matchesSource
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
      <div className="mb-6">
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

          {/* Operational Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="all">All Operational Status</option>
            {statuses.slice(1).map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>

          {/* Business Impact Filter */}
          <select
            value={impactFilter}
            onChange={(e) => setImpactFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="all">All Business Impact</option>
            {impacts.slice(1).map(i => (
              <option key={i} value={i}>{impactLabels[i]}</option>
            ))}
          </select>

          {/* Role Filter */}
          <RoleMultiSelect selected={roleFilter} onChange={setRoleFilter} />

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
      </div>

      {/* Results Count */}
      <p className="text-sm text-slate-500 mb-4">
        Showing {Math.min(filteredAgents.length, visibleCount)} of {DISPLAY_TOTAL_AGENTS.toLocaleString()} agents
      </p>

      {/* Agent List */}
      <div className="card divide-y divide-slate-100">
        {filteredAgents.slice(0, visibleCount).map((agent) => (
          <div key={agent.id} className="p-5 hover:bg-slate-50/60 transition-colors">
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
                    <BusinessImpactBadge impact={agent.businessImpact} />
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{agent.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400">
                    <span>{agent.team}</span>
                    <span>•</span>
                    <span>{agent.domain}</span>
                    <span>•</span>
                    <span className="capitalize">Tier: {agent.criticality}</span>
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
          </div>
        ))}
      </div>

      {/* Load More */}
      {visibleCount < filteredAgents.length && (
        <div className="text-center mt-6">
          <button
            onClick={() => setVisibleCount(prev => prev + 100)}
            className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}
