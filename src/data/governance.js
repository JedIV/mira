export const riskAssessments = {
  'cs-agent-001': {
    overall: 'medium',
    overallScore: 76,
    dimensions: {
      compliance: { score: 85, level: 'low', issues: 1, trend: 'stable' },
      security: { score: 72, level: 'medium', issues: 3, trend: 'declining' },
      operations: { score: 90, level: 'low', issues: 0, trend: 'stable' },
      privacy: { score: 68, level: 'medium', issues: 2, trend: 'declining' },
      fairness: { score: 88, level: 'low', issues: 1, trend: 'improving' },
    },
    lastAssessed: '2024-12-01',
    nextReview: '2025-01-01',
    assessedBy: 'AI Governance Team',
  },
  'fraud-agent-002': {
    overall: 'low',
    overallScore: 94,
    dimensions: {
      compliance: { score: 98, level: 'low', issues: 0, trend: 'stable' },
      security: { score: 96, level: 'low', issues: 0, trend: 'stable' },
      operations: { score: 92, level: 'low', issues: 1, trend: 'stable' },
      privacy: { score: 90, level: 'low', issues: 0, trend: 'stable' },
      fairness: { score: 94, level: 'low', issues: 0, trend: 'improving' },
    },
    lastAssessed: '2024-11-15',
    nextReview: '2024-12-15',
    assessedBy: 'AI Governance Team',
  },
}

export const approvalWorkflows = [
  {
    id: 'approval-001',
    agentId: 'cs-agent-001',
    agentName: 'Customer Service Agent',
    type: 'production-deployment',
    title: 'Q4 Topic Drift Fix Deployment',
    description: 'Deploy updated prompt to handle off-topic weather queries and improve routing',
    status: 'pending-compliance',
    priority: 'high',
    requestedBy: 'Sarah Chen',
    requestedAt: '2024-12-05T10:00:00Z',
    stages: [
      {
        team: 'AI Team',
        status: 'approved',
        approver: 'Dr. Kim',
        timestamp: '2024-12-05T11:30:00Z',
        comments: 'Technical review passed. Prompt changes are appropriate.',
      },
      {
        team: 'IT Security',
        status: 'approved',
        approver: 'James Wu',
        timestamp: '2024-12-05T14:00:00Z',
        comments: 'No security concerns with this update.',
      },
      {
        team: 'Compliance',
        status: 'pending',
        approver: null,
        timestamp: null,
        comments: null,
      },
    ],
    changes: [
      { type: 'prompt', description: 'Added weather query deflection logic' },
      { type: 'prompt', description: 'Improved topic classification boundaries' },
      { type: 'data', description: 'Updated training examples for edge cases' },
    ],
  },
  {
    id: 'approval-002',
    agentId: 'loan-agent-003',
    agentName: 'Loan Processing Agent',
    type: 'model-update',
    title: 'Model Version 1.9.0 Upgrade',
    description: 'Upgrade underlying model for improved document extraction accuracy',
    status: 'approved',
    priority: 'medium',
    requestedBy: 'Jennifer Park',
    requestedAt: '2024-12-01T09:00:00Z',
    stages: [
      {
        team: 'AI Team',
        status: 'approved',
        approver: 'Dr. Kim',
        timestamp: '2024-12-01T14:00:00Z',
        comments: 'Model benchmarks show 15% improvement in accuracy.',
      },
      {
        team: 'IT Security',
        status: 'approved',
        approver: 'James Wu',
        timestamp: '2024-12-02T10:00:00Z',
        comments: 'Security scan passed.',
      },
      {
        team: 'Compliance',
        status: 'approved',
        approver: 'Amanda Foster',
        timestamp: '2024-12-03T11:00:00Z',
        comments: 'Approved for deployment with monitoring requirements.',
      },
    ],
    changes: [
      { type: 'model', description: 'Upgrade from GPT-4 to GPT-4-turbo' },
      { type: 'config', description: 'Adjusted confidence thresholds' },
    ],
  },
  {
    id: 'approval-003',
    agentId: 'investment-006',
    agentName: 'Investment Advisor Agent',
    type: 'new-capability',
    title: 'Add Retirement Planning Module',
    description: 'New capability to provide retirement planning projections',
    status: 'pending-ai',
    priority: 'low',
    requestedBy: 'Robert Martinez',
    requestedAt: '2024-12-04T15:00:00Z',
    stages: [
      {
        team: 'AI Team',
        status: 'pending',
        approver: null,
        timestamp: null,
        comments: null,
      },
      {
        team: 'IT Security',
        status: 'pending',
        approver: null,
        timestamp: null,
        comments: null,
      },
      {
        team: 'Compliance',
        status: 'pending',
        approver: null,
        timestamp: null,
        comments: null,
      },
    ],
    changes: [
      { type: 'capability', description: 'Retirement projection calculator' },
      { type: 'data', description: 'Integration with actuarial tables' },
      { type: 'prompt', description: 'Retirement planning conversation flows' },
    ],
  },
]

export const complianceRequirements = [
  { id: 'req-001', name: 'Data Privacy (GDPR/CCPA)', status: 'compliant', lastAudit: '2024-11-01' },
  { id: 'req-002', name: 'Financial Services (SOX)', status: 'compliant', lastAudit: '2024-10-15' },
  { id: 'req-003', name: 'AI Governance Policy', status: 'compliant', lastAudit: '2024-11-20' },
  { id: 'req-004', name: 'Model Risk Management', status: 'review-needed', lastAudit: '2024-09-01' },
  { id: 'req-005', name: 'Consumer Protection', status: 'compliant', lastAudit: '2024-11-10' },
]

export const getRiskLevel = (score) => {
  if (score >= 90) return { level: 'low', color: 'success' }
  if (score >= 70) return { level: 'medium', color: 'warning' }
  return { level: 'high', color: 'danger' }
}
