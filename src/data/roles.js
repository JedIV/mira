// Role-based access control data
// Roles sit between LDAP groups and agent permissions

export const roles = [
  {
    id: 'role-platform-admin',
    name: 'Platform Admin',
    type: 'builtin',
    description: 'Full administrative access to all agents across the platform',
    color: '#dc2626', // red
    agentPermissions: { '*': 'admin' },
  },
  {
    id: 'role-compliance-auditor',
    name: 'Compliance Auditor',
    type: 'builtin',
    description: 'Read-only access to all agents for audit and compliance monitoring',
    color: '#7c3aed', // violet
    agentPermissions: { '*': 'read' },
  },
  {
    id: 'role-fraud-analyst',
    name: 'Fraud Analyst',
    type: 'builtin',
    description: 'Execute access to fraud, collections, and KYC agents with compliance read',
    color: '#ea580c', // orange
    agentPermissions: {
      'fraud-agent-002': 'execute',
      'collections-009': 'execute',
      'kyc-agent-016': 'execute',
      'compliance-007': 'read',
    },
  },
  {
    id: 'role-lending-ops',
    name: 'Lending Ops',
    type: 'builtin',
    description: 'Execute access for lending workflow agents with compliance and onboarding read',
    color: '#0284c7', // sky
    agentPermissions: {
      'loan-agent-003': 'execute',
      'document-011': 'execute',
      'kyc-agent-016': 'execute',
      'compliance-007': 'read',
      'onboarding-005': 'read',
    },
  },
  {
    id: 'role-cs-representative',
    name: 'CS Representative',
    type: 'builtin',
    description: 'Execute access for customer service, scheduling, and IT support agents',
    color: '#2AB1AC', // teal (matches brand)
    agentPermissions: {
      'cs-agent-001': 'execute',
      'scheduling-012': 'execute',
      'it-support-004': 'execute',
    },
  },
  {
    id: 'role-lob-owner',
    name: 'Line of Business Owner',
    type: 'builtin',
    description: 'Admin access to owned agents, read access to all others (parameterized)',
    color: '#4f46e5', // indigo
    agentPermissions: { '*': 'read' }, // parameterized — owners get admin on their agents
  },
  {
    id: 'role-robo-advisory',
    name: 'Robo Advisory Team',
    type: 'custom',
    description: 'Custom role for the robo advisory team — investment execute with marketing read',
    color: '#16a34a', // green
    agentPermissions: {
      'investment-006': 'execute',
      'marketing-008': 'read',
    },
  },
]

// Group-to-role assignments
// Maps existing LDAP groups from access.js to roles
export const groupRoleAssignments = [
  // Platform Admin
  { groupId: 'ldap-it-003', groupName: 'CN=IT-Admins', roleId: 'role-platform-admin', assignedBy: 'David Kim', userCount: 6, status: 'active', nextReviewDate: '2025-07-08' },

  // Compliance Auditor
  { groupId: 'ldap-fr-003', groupName: 'CN=Risk-Compliance-RO', roleId: 'role-compliance-auditor', assignedBy: 'Jennifer Park', userCount: 8, status: 'active', nextReviewDate: '2025-03-05' },
  { groupId: 'ldap-cp-001', groupName: 'CN=Compliance-Officers', roleId: 'role-compliance-auditor', assignedBy: 'Jennifer Park', userCount: 16, status: 'active', nextReviewDate: '2025-03-01' },
  { groupId: 'ldap-inv-003', groupName: 'CN=Compliance-Auditors', roleId: 'role-compliance-auditor', assignedBy: 'Jennifer Park', userCount: 6, status: 'active', nextReviewDate: '2025-08-15' },

  // Fraud Analyst
  { groupId: 'ldap-fr-001', groupName: 'CN=Fraud-Ops-Core', roleId: 'role-fraud-analyst', assignedBy: 'Michael Torres', userCount: 18, status: 'active', nextReviewDate: '2025-04-12' },
  { groupId: 'ldap-fr-002', groupName: 'CN=Fraud-Admins', roleId: 'role-fraud-analyst', assignedBy: 'Michael Torres', userCount: 4, status: 'active', nextReviewDate: '2025-04-12' },

  // Lending Ops
  { groupId: 'ldap-ln-001', groupName: 'CN=Lending-Processors', roleId: 'role-lending-ops', assignedBy: 'Jennifer Park', userCount: 52, status: 'active', nextReviewDate: '2025-05-22' },
  { groupId: 'ldap-ln-002', groupName: 'CN=Lending-Managers', roleId: 'role-lending-ops', assignedBy: 'Jennifer Park', userCount: 8, status: 'active', nextReviewDate: '2025-05-22' },
  { groupId: 'ldap-ln-003', groupName: 'CN=Underwriting-Team', roleId: 'role-lending-ops', assignedBy: 'Jennifer Park', userCount: 24, status: 'active', nextReviewDate: '2025-04-10' },

  // CS Representative
  { groupId: 'ldap-cs-001', groupName: 'CN=CS-Agents-ReadWrite', roleId: 'role-cs-representative', assignedBy: 'Sarah Chen', userCount: 84, status: 'active', nextReviewDate: '2025-06-18' },
  { groupId: 'ldap-cs-004', groupName: 'CN=QA-Automation', roleId: 'role-cs-representative', assignedBy: 'Jennifer Park', userCount: 28, status: 'active', nextReviewDate: '2025-07-22' },

  // Line of Business Owner
  { groupId: 'ldap-cs-002', groupName: 'CN=CS-Supervisors', roleId: 'role-lob-owner', assignedBy: 'Sarah Chen', userCount: 12, status: 'active', nextReviewDate: '2025-06-18' },
  { groupId: 'ldap-mk-002', groupName: 'CN=Marketing-Managers', roleId: 'role-lob-owner', assignedBy: 'Lisa Wong', userCount: 8, status: 'active', nextReviewDate: '2025-07-01' },

  // Robo Advisory Team (custom)
  { groupId: 'ldap-inv-001', groupName: 'CN=Investment-Advisors', roleId: 'role-robo-advisory', assignedBy: 'Michael Torres', userCount: 28, status: 'active', nextReviewDate: '2025-03-01' },
]

// Helper functions

export function getRoleById(roleId) {
  return roles.find(r => r.id === roleId) || null
}

export function getGroupsForRole(roleId) {
  return groupRoleAssignments.filter(a => a.roleId === roleId)
}

/**
 * Get all roles that grant permissions to a specific agent.
 * Resolves wildcard ('*') permissions.
 * Returns [{ role, permissionLevel, groups }]
 */
export function getRolesForAgent(agentId) {
  const result = []

  for (const role of roles) {
    // Check if this role covers the agent (directly or via wildcard)
    const directPerm = role.agentPermissions[agentId]
    const wildcardPerm = role.agentPermissions['*']
    const permissionLevel = directPerm || wildcardPerm

    if (!permissionLevel) continue

    const groups = getGroupsForRole(role.id)
    if (groups.length === 0) continue

    result.push({
      role,
      permissionLevel,
      groups,
    })
  }

  return result
}

/**
 * Check if a role covers a given agent (directly or via wildcard).
 */
export function roleCoversAgent(role, agentId) {
  return !!(role.agentPermissions[agentId] || role.agentPermissions['*'])
}

/**
 * Summary stats for the roles management view
 */
export function getRolesSummary() {
  const builtinCount = roles.filter(r => r.type === 'builtin').length
  const customCount = roles.filter(r => r.type === 'custom').length
  const totalAssignments = groupRoleAssignments.length
  const totalUsers = groupRoleAssignments.reduce((sum, a) => sum + a.userCount, 0)

  return { builtinCount, customCount, totalAssignments, totalUsers }
}
