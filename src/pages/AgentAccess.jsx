import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardHeader, MetricCard, Badge } from '../components/common'
import { AreaChart } from '../components/charts'
import { getAgentById } from '../data/agents'
import { getAccessByAgentId } from '../data/access'
import { getRolesForAgent } from '../data/roles'
import { ChevronRightIcon } from '../components/navigation/Icons'

function generateWeeklyAccessData(baseUsers, weeks = 13) {
  const data = []
  const today = new Date(2025, 1, 19)

  let seed = baseUsers
  const rand = () => {
    seed = (seed * 16807 + 7) % 2147483647
    return (seed & 0xffff) / 0xffff
  }

  for (let i = 0; i < weeks; i++) {
    const weekStart = new Date(today)
    weekStart.setDate(weekStart.getDate() - (weeks - 1 - i) * 7)
    const month = weekStart.toLocaleString('en-US', { month: 'short' })
    const day = weekStart.getDate()
    const m = weekStart.getMonth() // 0-indexed
    const d = weekStart.getDate()

    // Base with gradual upward trend
    let value = baseUsers * (0.40 + 0.10 * (i / weeks))

    // Christmas / New Year dip (late Dec through early Jan)
    if (m === 11 && d >= 22) value *= 0.35 + rand() * 0.10
    else if (m === 0 && d <= 5) value *= 0.50 + rand() * 0.10
    // New year ramp-back week
    else if (m === 0 && d <= 12) value *= 0.75 + rand() * 0.10

    // Weekly noise
    value *= 0.90 + rand() * 0.20

    data.push({
      week: `${month} ${day}`,
      Users: Math.round(Math.max(1, value)),
    })
  }
  return data
}

const permissionBadge = {
  read: { variant: 'secondary', label: 'Read' },
  execute: { variant: 'primary', label: 'Execute' },
  admin: { variant: 'warning', label: 'Admin' },
}

const statusConfig = {
  active: { variant: 'success', label: 'Active' },
  'pending-review': { variant: 'warning', label: 'Pending Review' },
}

function RoleAccessRow({ entry }) {
  const [expanded, setExpanded] = useState(false)
  const { role, permissionLevel, groups } = entry
  const perm = permissionBadge[permissionLevel] || permissionBadge.read
  const totalUsers = groups.reduce((sum, g) => sum + g.userCount, 0)
  const earliestDate = groups.reduce((earliest, g) => {
    return g.nextReviewDate < earliest ? g.nextReviewDate : earliest
  }, groups[0]?.nextReviewDate || '')

  return (
    <>
      <tr
        className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="py-3 px-3">
          <div className="flex items-center gap-2">
            <ChevronRightIcon
              className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
            />
            <span
              className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: role.color }}
            />
            <span className="font-medium text-slate-900">{role.name}</span>
          </div>
        </td>
        <td className="py-3 px-3">
          <Badge variant={perm.variant} size="sm">{perm.label}</Badge>
        </td>
        <td className="py-3 px-3 text-slate-600">{groups.length} group{groups.length !== 1 ? 's' : ''}</td>
        <td className="py-3 px-3 text-right text-slate-900 font-medium">{totalUsers.toLocaleString()}</td>
        <td className="py-3 px-3 text-slate-600">{earliestDate}</td>
      </tr>
      {expanded && groups.length > 0 && (
        <tr className="bg-slate-50/80">
          <td colSpan={5} className="px-3 py-3">
            <div className="ml-9 space-y-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-400 uppercase tracking-wider">
                    <th className="text-left pb-2 font-medium">LDAP Group</th>
                    <th className="text-right pb-2 font-medium">Users</th>
                    <th className="text-left pb-2 font-medium">Status</th>
                    <th className="text-left pb-2 font-medium">Assigned By</th>
                    <th className="text-left pb-2 font-medium">Next Review</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((g) => {
                    const status = statusConfig[g.status] || statusConfig.active
                    return (
                      <tr key={g.groupId} className="border-t border-slate-100">
                        <td className="py-2 font-mono text-xs text-slate-600">{g.groupName}</td>
                        <td className="py-2 text-right text-slate-900">{g.userCount}</td>
                        <td className="py-2">
                          <Badge variant={status.variant} size="sm" dot>{status.label}</Badge>
                        </td>
                        <td className="py-2 text-slate-600">{g.assignedBy}</td>
                        <td className="py-2 text-slate-600">{g.nextReviewDate}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function AgentAccess() {
  const { agentId } = useParams()
  const agent = getAgentById(agentId)
  const access = getAccessByAgentId(agentId)
  const roleEntries = getRolesForAgent(agentId)

  if (!agent) {
    return <div className="text-center py-12 text-slate-500">Agent not found</div>
  }

  const { groups, pendingRequests, summary } = access
  const weeklyAccessData = useMemo(
    () => generateWeeklyAccessData(summary.totalUsers),
    [summary.totalUsers]
  )

  // Use role-derived view if roles cover this agent, otherwise fall back to flat LDAP groups
  const hasRoleCoverage = roleEntries.length > 0

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-300 mb-1">
              <Link to={`/agents/${agent.id}`} className="hover:text-white transition-colors">
                {agent.name}
              </Link>
              <span>/</span>
              <span>Access Management</span>
            </div>
            <h1 className="text-2xl font-bold">Access Management</h1>
          </div>
          <Link to={`/agents/${agent.id}`} className="btn-secondary !bg-white/10 !text-white !border-white/20 hover:!bg-white/20">
            Back to Agent
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Roles" value={roleEntries.length} />
        <MetricCard label="Total Users" value={summary.totalUsers.toLocaleString()} />
        <MetricCard label="Active (24h)" value={summary.activeUsers24h.toLocaleString()} />
        <MetricCard label="Pending Requests" value={pendingRequests.length} />
      </div>

      {/* Weekly Average Users Chart */}
      <Card>
        <CardHeader
          title="Weekly Active Users"
          subtitle="Average weekly users over the past 3 months"
        />
        <AreaChart
          data={weeklyAccessData}
          dataKey="Users"
          xAxisKey="week"
          color="#2AB1AC"
          height={240}
        />
      </Card>

      {/* Role-Derived Access Table */}
      {hasRoleCoverage && (
        <Card>
          <CardHeader
            title="Access by Role"
            subtitle="Roles granting access to this agent and their LDAP group assignments"
            action={
              <button className="btn-secondary text-sm" onClick={() => {}}>
                Request Access
              </button>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">Role Name</th>
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">Permission</th>
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">Groups</th>
                  <th className="text-right py-3 px-3 text-slate-500 font-medium">Total Users</th>
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">Since</th>
                </tr>
              </thead>
              <tbody>
                {roleEntries.map((entry) => (
                  <RoleAccessRow key={entry.role.id} entry={entry} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Fallback: Flat LDAP Groups (for agents without role coverage) */}
      {!hasRoleCoverage && (
        <Card>
          <CardHeader
            title="LDAP Groups"
            action={
              <button className="btn-secondary text-sm" onClick={() => {}}>
                Request Access
              </button>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">Group</th>
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">Permission</th>
                  <th className="text-right py-3 px-3 text-slate-500 font-medium">Users</th>
                  <th className="text-right py-3 px-3 text-slate-500 font-medium">Active (24h)</th>
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">Status</th>
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">Granted</th>
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">Next Review</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => {
                  const perm = permissionBadge[group.permissionLevel] || permissionBadge.read
                  const status = statusConfig[group.status] || statusConfig.active
                  return (
                    <tr key={group.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-900">{group.displayName}</div>
                        <div className="text-xs text-slate-400 font-mono">{group.name}</div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={perm.variant} size="sm">{perm.label}</Badge>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-900 font-medium">{group.userCount}</td>
                      <td className="py-3 px-3 text-right text-slate-600">{group.activeUsers24h}</td>
                      <td className="py-3 px-3">
                        <Badge variant={status.variant} size="sm" dot>{status.label}</Badge>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{group.grantedAt}</td>
                      <td className="py-3 px-3 text-slate-600">{group.nextReviewDate}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {groups.length === 0 && (
            <p className="text-center py-8 text-slate-400">No LDAP groups configured for this agent</p>
          )}
        </Card>
      )}

      {/* Pending Access Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader title="Pending Access Requests" />
          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div key={req.id} className="flex items-start justify-between p-4 rounded-lg border border-slate-100 bg-slate-50/50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-900 font-mono text-sm">{req.groupName}</span>
                    <Badge variant="warning" size="sm">Pending</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">
                    Requested by <span className="font-medium">{req.requester}</span> on {req.requestedDate}
                  </p>
                  <p className="text-sm text-slate-500">{req.justification}</p>
                </div>
                <div className="flex gap-2 ml-4 flex-shrink-0">
                  <button className="px-3 py-1.5 text-sm font-medium rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors" onClick={() => {}}>
                    Approve
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors" onClick={() => {}}>
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
