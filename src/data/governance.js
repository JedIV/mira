import { agentRand } from './prng'
import { getAgentById } from './agents'

// ─── Curated risk assessments ───────────────────────────────────────────────

const curatedRiskAssessments = {
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

// ─── Procedural generator ───────────────────────────────────────────────────

const trends = ['stable', 'stable', 'stable', 'improving', 'declining']

function scoreToLevel(score) {
  if (score >= 90) return 'low'
  if (score >= 70) return 'medium'
  return 'high'
}

function generateRiskAssessment(agentId) {
  const agent = getAgentById(agentId)
  if (!agent) return null

  const rand = agentRand(agentId)

  // Base score influenced by businessImpact, criticality, and operationalRisks
  let baseScore = 80
  if (agent.businessImpact === 'yellow') baseScore -= 10
  if (agent.businessImpact === 'red') baseScore -= 20
  if (agent.criticality === 'high') baseScore -= 5
  if (agent.operationalRisks.securityWarnings > 0) baseScore -= agent.operationalRisks.securityWarnings * 3
  if (agent.operationalRisks.dataExposure > 0) baseScore -= agent.operationalRisks.dataExposure * 5

  const dimScores = {}
  const dimensions = ['compliance', 'security', 'operations', 'privacy', 'fairness']

  dimensions.forEach(dim => {
    // Each dimension varies around the base score
    const variation = Math.floor(rand() * 20) - 8 // -8 to +11
    let score = Math.max(40, Math.min(99, baseScore + variation))

    // Security dimension penalized more if agent has security warnings
    if (dim === 'security' && agent.operationalRisks.securityWarnings > 0) {
      score = Math.max(40, score - 8)
    }
    // Privacy penalized if data exposure
    if (dim === 'privacy' && agent.operationalRisks.dataExposure > 0) {
      score = Math.max(40, score - 10)
    }

    const level = scoreToLevel(score)
    const issues = level === 'low' ? (rand() > 0.7 ? 1 : 0) :
      level === 'medium' ? (1 + Math.floor(rand() * 3)) :
        (2 + Math.floor(rand() * 4))
    const trend = trends[Math.floor(rand() * trends.length)]

    dimScores[dim] = { score, level, issues, trend }
  })

  const overallScore = Math.round(
    Object.values(dimScores).reduce((sum, d) => sum + d.score, 0) / 5
  )
  const overall = scoreToLevel(overallScore)

  // Generate review dates offset from a base
  const monthOffset = Math.floor(rand() * 3)
  const lastAssessed = `2024-${String(10 + monthOffset).padStart(2, '0')}-${String(1 + Math.floor(rand() * 28)).padStart(2, '0')}`
  const nextMonth = 10 + monthOffset + 1
  const nextReview = nextMonth <= 12
    ? `2024-${String(nextMonth).padStart(2, '0')}-${String(1 + Math.floor(rand() * 28)).padStart(2, '0')}`
    : `2025-01-${String(1 + Math.floor(rand() * 28)).padStart(2, '0')}`

  return {
    overall,
    overallScore,
    dimensions: dimScores,
    lastAssessed,
    nextReview,
    assessedBy: 'AI Governance Team',
  }
}

// ─── Memoized getter ────────────────────────────────────────────────────────

const riskCache = {}

export function getRiskAssessment(agentId) {
  if (curatedRiskAssessments[agentId]) return curatedRiskAssessments[agentId]
  if (!riskCache[agentId]) {
    riskCache[agentId] = generateRiskAssessment(agentId)
  }
  return riskCache[agentId]
}

// ─── Unchanged exports ──────────────────────────────────────────────────────

export const riskAssessments = curatedRiskAssessments

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
