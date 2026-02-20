import { useState, useMemo, useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { getAgentsByTeamGrouped, displayTeamCounts } from '../../data/agents'
import { ChevronRightIcon } from './Icons'

export default function AgentNavPane() {
  const { agentId } = useParams()
  const teamGroups = getAgentsByTeamGrouped()

  // Default: collapse all teams except the one containing the active agent
  const initialCollapsed = useMemo(() => {
    const state = {}
    teamGroups.forEach(([team, teamAgents]) => {
      const hasActive = teamAgents.some(a => a.id === agentId)
      state[team] = !hasActive
    })
    return state
  }, [agentId])

  const [collapsed, setCollapsed] = useState(initialCollapsed)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setCollapsed(initialCollapsed)
  }, [initialCollapsed])

  const toggleTeam = (team) => {
    setCollapsed(prev => ({ ...prev, [team]: !prev[team] }))
  }

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return teamGroups
    const q = search.toLowerCase()
    return teamGroups
      .map(([team, teamAgents]) => [
        team,
        teamAgents.filter(a => a.name.toLowerCase().includes(q)),
      ])
      .filter(([, agents]) => agents.length > 0)
  }, [teamGroups, search])

  return (
    <aside className="w-60 bg-white border-r border-slate-200/80 flex flex-col overflow-hidden flex-shrink-0">
      {/* Header */}
      <div className="px-3 py-3 border-b border-slate-100">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Agents</h2>
        <input
          type="text"
          placeholder="Filter agents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 transition-all"
        />
      </div>

      {/* Team/Agent Tree */}
      <nav className="flex-1 overflow-y-auto py-1">
        {filteredGroups.map(([team, teamAgents]) => (
          <div key={team}>
            <button
              onClick={() => toggleTeam(team)}
              className="w-full flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider hover:bg-slate-50 transition-colors"
            >
              <ChevronRightIcon
                className={`w-3 h-3 transition-transform flex-shrink-0 ${
                  collapsed[team] ? '' : 'rotate-90'
                }`}
              />
              <span className="truncate">{team}</span>
              <span className="ml-auto text-slate-300 font-normal normal-case text-[10px]">{displayTeamCounts[team] ?? teamAgents.length}</span>
            </button>
            {!collapsed[team] && (
              <div className="ml-2">
                {teamAgents.map((agent) => (
                  <NavLink
                    key={agent.id}
                    to={`/agents/${agent.id}`}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-1 text-xs transition-colors rounded-r-md ${
                        isActive || agent.id === agentId
                          ? 'text-primary-700 bg-primary-50 font-semibold border-l-2 border-primary-500'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-2 border-transparent'
                      }`
                    }
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        agent.status === 'active' ? 'bg-emerald-500' :
                        agent.status === 'degraded' ? 'bg-amber-500' :
                        agent.status === 'maintenance' ? 'bg-slate-400' :
                        'bg-red-500'
                      }`}
                    />
                    <span className="truncate">{agent.name}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
