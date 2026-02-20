// LDAP group access data per agent

const accessData = {
  'cs-agent-001': {
    groups: [
      { id: 'ldap-cs-001', name: 'CN=CS-Agents-ReadWrite', displayName: 'Customer Service Team', description: 'Core CS team with full agent interaction access', permissionLevel: 'execute', userCount: 84, activeUsers24h: 42, grantedAt: '2024-03-18', grantedBy: 'Sarah Chen', status: 'active', nextReviewDate: '2025-06-18' },
      { id: 'ldap-cs-002', name: 'CN=CS-Supervisors', displayName: 'CS Supervisors', description: 'Team leads with admin access for configuration', permissionLevel: 'admin', userCount: 12, activeUsers24h: 8, grantedAt: '2024-03-18', grantedBy: 'Sarah Chen', status: 'active', nextReviewDate: '2025-06-18' },
      { id: 'ldap-cs-003', name: 'CN=RetailBanking-Analysts', displayName: 'Retail Banking Analysts', description: 'Read-only access for reporting and analytics', permissionLevel: 'read', userCount: 45, activeUsers24h: 18, grantedAt: '2024-05-10', grantedBy: 'David Kim', status: 'active', nextReviewDate: '2025-05-10' },
      { id: 'ldap-cs-004', name: 'CN=QA-Automation', displayName: 'QA Automation Team', description: 'Testing and quality assurance access', permissionLevel: 'execute', userCount: 28, activeUsers24h: 12, grantedAt: '2024-07-22', grantedBy: 'Jennifer Park', status: 'active', nextReviewDate: '2025-07-22' },
      { id: 'ldap-cs-005', name: 'CN=CX-Partners', displayName: 'CX Partner Integrations', description: 'External partner read access for co-pilot workflows', permissionLevel: 'read', userCount: 15, activeUsers24h: 7, grantedAt: '2024-09-01', grantedBy: 'Sarah Chen', status: 'pending-review', nextReviewDate: '2025-03-01' },
    ],
    pendingRequests: [
      { id: 'req-001', groupName: 'CN=Marketing-Analytics', requester: 'Lisa Wong', justification: 'Need read access for customer interaction sentiment analysis reporting', requestedDate: '2025-02-15', status: 'pending' },
    ],
  },

  'fraud-agent-002': {
    groups: [
      { id: 'ldap-fr-001', name: 'CN=Fraud-Ops-Core', displayName: 'Fraud Operations Core', description: 'Primary fraud analysts with execution access', permissionLevel: 'execute', userCount: 18, activeUsers24h: 14, grantedAt: '2024-01-12', grantedBy: 'Michael Torres', status: 'active', nextReviewDate: '2025-04-12' },
      { id: 'ldap-fr-002', name: 'CN=Fraud-Admins', displayName: 'Fraud System Admins', description: 'Admin access for rule configuration and model tuning', permissionLevel: 'admin', userCount: 4, activeUsers24h: 3, grantedAt: '2024-01-12', grantedBy: 'Michael Torres', status: 'active', nextReviewDate: '2025-04-12' },
      { id: 'ldap-fr-003', name: 'CN=Risk-Compliance-RO', displayName: 'Risk & Compliance (Read Only)', description: 'Audit and compliance monitoring access', permissionLevel: 'read', userCount: 8, activeUsers24h: 4, grantedAt: '2024-03-05', grantedBy: 'Jennifer Park', status: 'active', nextReviewDate: '2025-03-05' },
    ],
    pendingRequests: [],
  },

  'loan-agent-003': {
    groups: [
      { id: 'ldap-ln-001', name: 'CN=Lending-Processors', displayName: 'Lending Processors', description: 'Loan processors with application review access', permissionLevel: 'execute', userCount: 52, activeUsers24h: 31, grantedAt: '2024-02-22', grantedBy: 'Jennifer Park', status: 'active', nextReviewDate: '2025-05-22' },
      { id: 'ldap-ln-002', name: 'CN=Lending-Managers', displayName: 'Lending Managers', description: 'Manager-level admin access for overrides and escalations', permissionLevel: 'admin', userCount: 8, activeUsers24h: 6, grantedAt: '2024-02-22', grantedBy: 'Jennifer Park', status: 'active', nextReviewDate: '2025-05-22' },
      { id: 'ldap-ln-003', name: 'CN=Underwriting-Team', displayName: 'Underwriting Team', description: 'Read and execute for document verification workflows', permissionLevel: 'execute', userCount: 24, activeUsers24h: 15, grantedAt: '2024-04-10', grantedBy: 'Jennifer Park', status: 'active', nextReviewDate: '2025-04-10' },
      { id: 'ldap-ln-004', name: 'CN=Credit-Analysts-RO', displayName: 'Credit Analysts', description: 'Read-only for credit decision auditing', permissionLevel: 'read', userCount: 16, activeUsers24h: 9, grantedAt: '2024-06-15', grantedBy: 'David Kim', status: 'active', nextReviewDate: '2025-06-15' },
    ],
    pendingRequests: [
      { id: 'req-002', groupName: 'CN=Mortgage-Specialists', requester: 'Tom Bradley', justification: 'Mortgage team needs execute access for new home loan product workflows', requestedDate: '2025-02-10', status: 'pending' },
    ],
  },

  'it-support-004': {
    groups: [
      { id: 'ldap-it-001', name: 'CN=IT-Helpdesk-L1', displayName: 'IT Helpdesk Level 1', description: 'Tier 1 support staff with standard execution', permissionLevel: 'execute', userCount: 65, activeUsers24h: 38, grantedAt: '2024-04-08', grantedBy: 'David Kim', status: 'active', nextReviewDate: '2025-07-08' },
      { id: 'ldap-it-002', name: 'CN=IT-Helpdesk-L2', displayName: 'IT Helpdesk Level 2', description: 'Tier 2 support with escalation capabilities', permissionLevel: 'execute', userCount: 22, activeUsers24h: 14, grantedAt: '2024-04-08', grantedBy: 'David Kim', status: 'active', nextReviewDate: '2025-07-08' },
      { id: 'ldap-it-003', name: 'CN=IT-Admins', displayName: 'IT Administrators', description: 'Full admin access for agent configuration', permissionLevel: 'admin', userCount: 6, activeUsers24h: 5, grantedAt: '2024-04-08', grantedBy: 'David Kim', status: 'active', nextReviewDate: '2025-07-08' },
      { id: 'ldap-it-004', name: 'CN=All-Employees-RO', displayName: 'All Employees', description: 'Read-only self-service access for IT support portal', permissionLevel: 'read', userCount: 320, activeUsers24h: 145, grantedAt: '2024-05-01', grantedBy: 'David Kim', status: 'active', nextReviewDate: '2025-05-01' },
      { id: 'ldap-it-005', name: 'CN=Vendor-Support', displayName: 'Vendor Support Partners', description: 'Limited read access for vendor escalation tracking', permissionLevel: 'read', userCount: 10, activeUsers24h: 3, grantedAt: '2024-08-20', grantedBy: 'David Kim', status: 'pending-review', nextReviewDate: '2025-02-20' },
    ],
    pendingRequests: [],
  },

  'onboarding-005': {
    groups: [
      { id: 'ldap-ob-001', name: 'CN=Onboarding-Specialists', displayName: 'Onboarding Specialists', description: 'Client onboarding team with full workflow access', permissionLevel: 'execute', userCount: 34, activeUsers24h: 22, grantedAt: '2024-05-15', grantedBy: 'Lisa Wong', status: 'active', nextReviewDate: '2025-05-15' },
      { id: 'ldap-ob-002', name: 'CN=Onboarding-Managers', displayName: 'Onboarding Managers', description: 'Manager admin access for process configuration', permissionLevel: 'admin', userCount: 6, activeUsers24h: 4, grantedAt: '2024-05-15', grantedBy: 'Lisa Wong', status: 'active', nextReviewDate: '2025-05-15' },
      { id: 'ldap-ob-003', name: 'CN=Branch-Staff-RO', displayName: 'Branch Staff', description: 'Read access for client application status checking', permissionLevel: 'read', userCount: 120, activeUsers24h: 55, grantedAt: '2024-06-01', grantedBy: 'Lisa Wong', status: 'active', nextReviewDate: '2025-06-01' },
      { id: 'ldap-ob-004', name: 'CN=KYC-Compliance', displayName: 'KYC Compliance', description: 'Execute access for identity verification workflows', permissionLevel: 'execute', userCount: 14, activeUsers24h: 8, grantedAt: '2024-07-10', grantedBy: 'Jennifer Park', status: 'active', nextReviewDate: '2025-07-10' },
    ],
    pendingRequests: [],
  },

  'investment-006': {
    groups: [
      { id: 'ldap-inv-001', name: 'CN=Investment-Advisors', displayName: 'Investment Advisors', description: 'Licensed advisors with portfolio recommendation access', permissionLevel: 'execute', userCount: 28, activeUsers24h: 19, grantedAt: '2024-06-01', grantedBy: 'Michael Torres', status: 'active', nextReviewDate: '2025-03-01' },
      { id: 'ldap-inv-002', name: 'CN=Wealth-Mgmt-Admin', displayName: 'Wealth Management Admin', description: 'Admin access for model portfolio configuration', permissionLevel: 'admin', userCount: 5, activeUsers24h: 3, grantedAt: '2024-06-01', grantedBy: 'Michael Torres', status: 'active', nextReviewDate: '2025-03-01' },
      { id: 'ldap-inv-003', name: 'CN=Compliance-Auditors', displayName: 'Compliance Auditors', description: 'Read-only for suitability and recommendation auditing', permissionLevel: 'read', userCount: 6, activeUsers24h: 2, grantedAt: '2024-08-15', grantedBy: 'Jennifer Park', status: 'active', nextReviewDate: '2025-08-15' },
    ],
    pendingRequests: [
      { id: 'req-003', groupName: 'CN=Robo-Advisory-Ops', requester: 'Amanda Price', justification: 'New robo-advisory team needs execute access for automated rebalancing workflows', requestedDate: '2025-02-12', status: 'pending' },
    ],
  },

  'compliance-007': {
    groups: [
      { id: 'ldap-cp-001', name: 'CN=Compliance-Officers', displayName: 'Compliance Officers', description: 'Core compliance team with full agent access', permissionLevel: 'execute', userCount: 16, activeUsers24h: 11, grantedAt: '2024-03-01', grantedBy: 'Jennifer Park', status: 'active', nextReviewDate: '2025-03-01' },
      { id: 'ldap-cp-002', name: 'CN=Compliance-Admin', displayName: 'Compliance Admin', description: 'Admin for regulatory rule configuration', permissionLevel: 'admin', userCount: 3, activeUsers24h: 2, grantedAt: '2024-03-01', grantedBy: 'Jennifer Park', status: 'active', nextReviewDate: '2025-03-01' },
      { id: 'ldap-cp-003', name: 'CN=Legal-Team-RO', displayName: 'Legal Team', description: 'Read-only access for legal review and documentation', permissionLevel: 'read', userCount: 10, activeUsers24h: 4, grantedAt: '2024-05-20', grantedBy: 'Jennifer Park', status: 'active', nextReviewDate: '2025-05-20' },
    ],
    pendingRequests: [],
  },

  'marketing-008': {
    groups: [
      { id: 'ldap-mk-001', name: 'CN=Marketing-Team', displayName: 'Marketing Team', description: 'Marketing staff with campaign execution access', permissionLevel: 'execute', userCount: 42, activeUsers24h: 24, grantedAt: '2024-07-01', grantedBy: 'Lisa Wong', status: 'active', nextReviewDate: '2025-07-01' },
      { id: 'ldap-mk-002', name: 'CN=Marketing-Managers', displayName: 'Marketing Managers', description: 'Admin access for campaign configuration and targeting rules', permissionLevel: 'admin', userCount: 8, activeUsers24h: 5, grantedAt: '2024-07-01', grantedBy: 'Lisa Wong', status: 'active', nextReviewDate: '2025-07-01' },
      { id: 'ldap-mk-003', name: 'CN=Digital-Analytics', displayName: 'Digital Analytics', description: 'Read access for campaign performance monitoring', permissionLevel: 'read', userCount: 20, activeUsers24h: 11, grantedAt: '2024-08-15', grantedBy: 'Lisa Wong', status: 'active', nextReviewDate: '2025-08-15' },
      { id: 'ldap-mk-004', name: 'CN=Branch-Marketing-RO', displayName: 'Branch Marketing Reps', description: 'Read-only for local campaign status tracking', permissionLevel: 'read', userCount: 55, activeUsers24h: 18, grantedAt: '2024-09-01', grantedBy: 'Lisa Wong', status: 'active', nextReviewDate: '2025-09-01' },
      { id: 'ldap-mk-005', name: 'CN=Agency-Partners', displayName: 'External Agency Partners', description: 'Limited read access for co-branded campaign coordination', permissionLevel: 'read', userCount: 8, activeUsers24h: 3, grantedAt: '2024-10-15', grantedBy: 'Lisa Wong', status: 'pending-review', nextReviewDate: '2025-04-15' },
    ],
    pendingRequests: [],
  },

  'collections-009': {
    groups: [
      { id: 'ldap-cl-001', name: 'CN=Collections-Agents', displayName: 'Collections Agents', description: 'Collections team with case management access', permissionLevel: 'execute', userCount: 38, activeUsers24h: 26, grantedAt: '2024-04-20', grantedBy: 'Michael Torres', status: 'active', nextReviewDate: '2025-04-20' },
      { id: 'ldap-cl-002', name: 'CN=Collections-Supervisors', displayName: 'Collections Supervisors', description: 'Admin for escalation rules and payment plan configuration', permissionLevel: 'admin', userCount: 7, activeUsers24h: 5, grantedAt: '2024-04-20', grantedBy: 'Michael Torres', status: 'active', nextReviewDate: '2025-04-20' },
      { id: 'ldap-cl-003', name: 'CN=Recovery-Analytics-RO', displayName: 'Recovery Analytics', description: 'Read-only for recovery rate monitoring and reporting', permissionLevel: 'read', userCount: 12, activeUsers24h: 6, grantedAt: '2024-06-10', grantedBy: 'Michael Torres', status: 'active', nextReviewDate: '2025-06-10' },
    ],
    pendingRequests: [
      { id: 'req-004', groupName: 'CN=External-Collections-Agency', requester: 'Robert Mills', justification: 'Third-party collections agency requires read access for assigned case tracking', requestedDate: '2025-02-18', status: 'pending' },
    ],
  },

  'kyc-agent-016': {
    groups: [
      { id: 'ldap-kyc-001', name: 'CN=KYC-Analysts', displayName: 'KYC Analysts', description: 'Primary KYC team with full verification workflow access', permissionLevel: 'execute', userCount: 31, activeUsers24h: 24, grantedAt: '2024-04-01', grantedBy: 'Priya Sharma', status: 'active', nextReviewDate: '2025-07-01' },
      { id: 'ldap-kyc-002', name: 'CN=KYC-Supervisors', displayName: 'KYC Supervisors', description: 'Admin access for escalation rules and threshold configuration', permissionLevel: 'admin', userCount: 5, activeUsers24h: 4, grantedAt: '2024-04-01', grantedBy: 'Priya Sharma', status: 'active', nextReviewDate: '2025-07-01' },
      { id: 'ldap-kyc-003', name: 'CN=Underwriting-Team', displayName: 'Underwriting Team', description: 'Execute access to review escalated credit applications', permissionLevel: 'execute', userCount: 28, activeUsers24h: 19, grantedAt: '2024-05-15', grantedBy: 'Priya Sharma', status: 'active', nextReviewDate: '2025-05-15' },
      { id: 'ldap-kyc-004', name: 'CN=Compliance-Audit-RO', displayName: 'Compliance Audit', description: 'Read-only access for regulatory audit and reporting', permissionLevel: 'read', userCount: 12, activeUsers24h: 5, grantedAt: '2024-06-01', grantedBy: 'Jennifer Park', status: 'active', nextReviewDate: '2025-06-01' },
      { id: 'ldap-kyc-005', name: 'CN=Risk-Analytics-RO', displayName: 'Risk Analytics', description: 'Read access for escalation rate monitoring and trend analysis', permissionLevel: 'read', userCount: 9, activeUsers24h: 6, grantedAt: '2024-08-10', grantedBy: 'Priya Sharma', status: 'pending-review', nextReviewDate: '2025-02-10' },
    ],
    pendingRequests: [
      { id: 'req-kyc-001', groupName: 'CN=Credit-Operations', requester: 'Marcus Webb', justification: 'Credit ops team needs execute access to process escalated manual review queue — current queue depth 847 pending', requestedDate: '2025-02-12', status: 'pending' },
    ],
  },

  'hr-agent-010': {
    groups: [
      { id: 'ldap-hr-001', name: 'CN=HR-Generalists', displayName: 'HR Generalists', description: 'HR team with employee query resolution access', permissionLevel: 'execute', userCount: 22, activeUsers24h: 14, grantedAt: '2024-05-01', grantedBy: 'David Kim', status: 'active', nextReviewDate: '2025-05-01' },
      { id: 'ldap-hr-002', name: 'CN=HR-Admin', displayName: 'HR Administrators', description: 'Admin for policy configuration and workflow rules', permissionLevel: 'admin', userCount: 4, activeUsers24h: 3, grantedAt: '2024-05-01', grantedBy: 'David Kim', status: 'active', nextReviewDate: '2025-05-01' },
      { id: 'ldap-hr-003', name: 'CN=All-Employees-HR-RO', displayName: 'All Employees (HR Portal)', description: 'Self-service read access for HR FAQ and policy lookup', permissionLevel: 'read', userCount: 280, activeUsers24h: 95, grantedAt: '2024-06-15', grantedBy: 'David Kim', status: 'active', nextReviewDate: '2025-06-15' },
      { id: 'ldap-hr-004', name: 'CN=Payroll-Team', displayName: 'Payroll Team', description: 'Read access for benefits and compensation queries', permissionLevel: 'read', userCount: 10, activeUsers24h: 6, grantedAt: '2024-07-01', grantedBy: 'David Kim', status: 'active', nextReviewDate: '2025-07-01' },
    ],
    pendingRequests: [],
  },

  'document-011': {
    groups: [
      { id: 'ldap-dc-001', name: 'CN=DocProcessing-Team', displayName: 'Document Processing Team', description: 'Operators with document extraction and classification access', permissionLevel: 'execute', userCount: 30, activeUsers24h: 18, grantedAt: '2024-06-01', grantedBy: 'Jennifer Park', status: 'active', nextReviewDate: '2025-06-01' },
      { id: 'ldap-dc-002', name: 'CN=DocProcessing-Admin', displayName: 'Doc Processing Admin', description: 'Admin for template configuration and model training', permissionLevel: 'admin', userCount: 5, activeUsers24h: 3, grantedAt: '2024-06-01', grantedBy: 'Jennifer Park', status: 'active', nextReviewDate: '2025-06-01' },
      { id: 'ldap-dc-003', name: 'CN=Operations-RO', displayName: 'Operations (Read Only)', description: 'Read access for document processing status and metrics', permissionLevel: 'read', userCount: 40, activeUsers24h: 15, grantedAt: '2024-08-01', grantedBy: 'Jennifer Park', status: 'active', nextReviewDate: '2025-08-01' },
      { id: 'ldap-dc-004', name: 'CN=Lending-Integrations', displayName: 'Lending Integrations', description: 'Execute access for automated loan document ingestion', permissionLevel: 'execute', userCount: 12, activeUsers24h: 8, grantedAt: '2024-09-15', grantedBy: 'Jennifer Park', status: 'active', nextReviewDate: '2025-09-15' },
    ],
    pendingRequests: [],
  },

  'scheduling-012': {
    groups: [
      { id: 'ldap-sc-001', name: 'CN=Branch-Managers', displayName: 'Branch Managers', description: 'Branch managers with scheduling admin access', permissionLevel: 'admin', userCount: 15, activeUsers24h: 10, grantedAt: '2024-08-01', grantedBy: 'Lisa Wong', status: 'active', nextReviewDate: '2025-08-01' },
      { id: 'ldap-sc-002', name: 'CN=Branch-Staff-Scheduling', displayName: 'Branch Staff', description: 'Staff with appointment booking and management access', permissionLevel: 'execute', userCount: 85, activeUsers24h: 52, grantedAt: '2024-08-01', grantedBy: 'Lisa Wong', status: 'active', nextReviewDate: '2025-08-01' },
      { id: 'ldap-sc-003', name: 'CN=Customer-Portal', displayName: 'Customer Portal Users', description: 'External read access through customer-facing booking portal', permissionLevel: 'read', userCount: 450, activeUsers24h: 180, grantedAt: '2024-09-01', grantedBy: 'Lisa Wong', status: 'active', nextReviewDate: '2025-09-01' },
      { id: 'ldap-sc-004', name: 'CN=Call-Center-Agents', displayName: 'Call Center Agents', description: 'Execute access for phone-based appointment scheduling', permissionLevel: 'execute', userCount: 60, activeUsers24h: 35, grantedAt: '2024-09-15', grantedBy: 'Lisa Wong', status: 'active', nextReviewDate: '2025-09-15' },
      { id: 'ldap-sc-005', name: 'CN=Scheduling-Analytics', displayName: 'Scheduling Analytics', description: 'Read-only for capacity planning and utilization reports', permissionLevel: 'read', userCount: 8, activeUsers24h: 4, grantedAt: '2024-10-01', grantedBy: 'David Kim', status: 'active', nextReviewDate: '2025-10-01' },
    ],
    pendingRequests: [],
  },
}

// Generate summary stats from groups
function computeSummary(groups) {
  return {
    totalGroups: groups.length,
    totalUsers: groups.reduce((sum, g) => sum + g.userCount, 0),
    activeUsers24h: groups.reduce((sum, g) => sum + g.activeUsers24h, 0),
  }
}

export function getAccessByAgentId(agentId) {
  const data = accessData[agentId]
  if (!data) {
    return {
      groups: [],
      pendingRequests: [],
      summary: { totalGroups: 0, totalUsers: 0, activeUsers24h: 0 },
    }
  }
  return {
    ...data,
    summary: computeSummary(data.groups),
  }
}
