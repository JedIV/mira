import { useState } from 'react'
import { Card, CardHeader, MetricCard, Badge } from '../components/common'
import { roles, groupRoleAssignments, getGroupsForRole, getRolesSummary } from '../data/roles'
import { ChevronRightIcon, UserGroupIcon } from '../components/navigation/Icons'

const permissionBadge = {
  read: { variant: 'secondary', label: 'Read' },
  execute: { variant: 'primary', label: 'Execute' },
  admin: { variant: 'warning', label: 'Admin' },
}

const statusConfig = {
  active: { variant: 'success', label: 'Active' },
  'pending-review': { variant: 'warning', label: 'Pending Review' },
}

function RoleRow({ role }) {
  const [expanded, setExpanded] = useState(false)
  const groups = getGroupsForRole(role.id)
  const totalUsers = groups.reduce((sum, g) => sum + g.userCount, 0)

  // Count distinct agents covered
  const agentsCovered = role.agentPermissions['*'] ? 'All' : Object.keys(role.agentPermissions).length

  return (
    <>
      <tr
        className="border-b border-slate-400/90 hover:bg-slate-100/60 transition-colors cursor-pointer"
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
          <Badge variant={role.type === 'builtin' ? 'secondary' : 'primary'} size="sm">
            {role.type === 'builtin' ? 'Built-in' : 'Custom'}
          </Badge>
        </td>
        <td className="py-3 px-3 text-right text-slate-900 font-medium">{groups.length}</td>
        <td className="py-3 px-3 text-right text-slate-900 font-medium">{totalUsers.toLocaleString()}</td>
        <td className="py-3 px-3 text-center text-slate-600">{agentsCovered}</td>
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
                      <tr key={g.groupId} className="border-t border-slate-400/90">
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

export default function RolesManagement() {
  const summary = getRolesSummary()

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Built-in Roles" value={summary.builtinCount} />
        <MetricCard label="Custom Roles" value={summary.customCount} />
        <MetricCard label="Groups Assigned" value={summary.totalAssignments} />
        <MetricCard label="Total Users" value={summary.totalUsers.toLocaleString()} />
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader
          title="Access Roles"
          subtitle="Role definitions and assigned LDAP groups"
          action={
            <button className="btn-primary text-sm" onClick={() => {}}>
              Create Custom Role
            </button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-400/90">
                <th className="text-left py-3 px-3 text-slate-500 font-medium">Role Name</th>
                <th className="text-left py-3 px-3 text-slate-500 font-medium">Type</th>
                <th className="text-right py-3 px-3 text-slate-500 font-medium">Groups</th>
                <th className="text-right py-3 px-3 text-slate-500 font-medium">Total Users</th>
                <th className="text-center py-3 px-3 text-slate-500 font-medium">Agents</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <RoleRow key={role.id} role={role} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
