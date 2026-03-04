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
    lastAssessed: '2025-12-01',
    nextReview: '2026-01-01',
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
    lastAssessed: '2025-11-15',
    nextReview: '2025-12-15',
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
  const lastAssessed = `2025-${String(10 + monthOffset).padStart(2, '0')}-${String(1 + Math.floor(rand() * 28)).padStart(2, '0')}`
  const nextMonth = 10 + monthOffset + 1
  const nextReview = nextMonth <= 12
    ? `2025-${String(nextMonth).padStart(2, '0')}-${String(1 + Math.floor(rand() * 28)).padStart(2, '0')}`
    : `2026-01-${String(1 + Math.floor(rand() * 28)).padStart(2, '0')}`

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
    requestedAt: '2025-12-05T10:00:00Z',
    stages: [
      {
        team: 'AI Team',
        status: 'approved',
        approver: 'Dr. Kim',
        timestamp: '2025-12-05T11:30:00Z',
        comments: 'Technical review passed. Prompt changes are appropriate.',
      },
      {
        team: 'IT Security',
        status: 'approved',
        approver: 'James Wu',
        timestamp: '2025-12-05T14:00:00Z',
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
    id: 'approval-004',
    agentId: 'kyc-agent-016',
    agentName: 'KYC Verification Agent',
    type: 'model-update',
    title: 'Manual Review Reduction — Model Redeploy',
    description: 'Deploy updated verification model to reduce manual review escalation rate from 23% back to target <10%. Model retrained on corrected decision boundaries after Q4 drift.',
    status: 'pending-security',
    priority: 'high',
    requestedBy: 'Priya Sharma',
    requestedAt: '2025-12-06T09:00:00Z',
    stages: [
      { team: 'AI Team', status: 'approved', approver: 'Dr. Kim', timestamp: '2025-12-06T11:00:00Z', comments: 'Retrained model validated — escalation rate drops to 8.4% on holdout set. Manual check volume projected to decrease 62%.' },
      { team: 'IT Security', status: 'pending', approver: null, timestamp: null, comments: null },
      { team: 'Compliance', status: 'pending', approver: null, timestamp: null, comments: null },
    ],
    changes: [
      { type: 'model', description: 'Retrained verification model with corrected decision boundaries' },
      { type: 'config', description: 'Manual review routing thresholds updated' },
      { type: 'data', description: 'Added 1,200 labeled edge-case verification samples' },
    ],
  },
  {
    id: 'approval-005',
    agentId: 'fraud-agent-002',
    agentName: 'Fraud Detection Agent',
    type: 'data-source',
    title: 'Add Real-Time Geolocation Feed',
    description: 'Integrate geolocation data for improved transaction fraud detection',
    status: 'pending-compliance',
    priority: 'high',
    requestedBy: 'Marcus Johnson',
    requestedAt: '2025-12-05T14:00:00Z',
    stages: [
      { team: 'AI Team', status: 'approved', approver: 'Dr. Kim', timestamp: '2025-12-05T16:00:00Z', comments: 'Geolocation improves precision by 8%.' },
      { team: 'IT Security', status: 'approved', approver: 'James Wu', timestamp: '2025-12-06T09:30:00Z', comments: 'Data handling meets security standards.' },
      { team: 'Compliance', status: 'pending', approver: null, timestamp: null, comments: null },
    ],
    changes: [
      { type: 'data', description: 'Geolocation API integration' },
      { type: 'config', description: 'Updated fraud scoring weights' },
    ],
  },
  {
    id: 'approval-011',
    agentId: 'loan-agent-003',
    agentName: 'Loan Processing Agent',
    type: 'prompt-update',
    title: 'Updated Income Verification Prompts',
    description: 'Revised prompts for stricter income verification per updated lending guidelines',
    status: 'pending-compliance',
    priority: 'high',
    requestedBy: 'Jennifer Park',
    requestedAt: '2025-12-06T07:00:00Z',
    stages: [
      { team: 'AI Team', status: 'approved', approver: 'Dr. Kim', timestamp: '2025-12-06T10:00:00Z', comments: 'Prompt changes align with new guidelines.' },
      { team: 'IT Security', status: 'approved', approver: 'James Wu', timestamp: '2025-12-06T13:00:00Z', comments: 'No security impact.' },
      { team: 'Compliance', status: 'pending', approver: null, timestamp: null, comments: null },
    ],
    changes: [
      { type: 'prompt', description: 'Stricter income verification language' },
      { type: 'prompt', description: 'Updated document checklist logic' },
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
    requestedAt: '2025-12-01T09:00:00Z',
    stages: [
      {
        team: 'AI Team',
        status: 'approved',
        approver: 'Dr. Kim',
        timestamp: '2025-12-01T14:00:00Z',
        comments: 'Model benchmarks show 15% improvement in accuracy.',
      },
      {
        team: 'IT Security',
        status: 'approved',
        approver: 'James Wu',
        timestamp: '2025-12-02T10:00:00Z',
        comments: 'Security scan passed.',
      },
      {
        team: 'Compliance',
        status: 'approved',
        approver: 'Amanda Foster',
        timestamp: '2025-12-03T11:00:00Z',
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
    requestedAt: '2025-12-04T15:00:00Z',
    stages: [
      { team: 'AI Team', status: 'pending', approver: null, timestamp: null, comments: null },
      { team: 'IT Security', status: 'pending', approver: null, timestamp: null, comments: null },
      { team: 'Compliance', status: 'pending', approver: null, timestamp: null, comments: null },
    ],
    changes: [
      { type: 'capability', description: 'Retirement projection calculator' },
      { type: 'data', description: 'Integration with actuarial tables' },
      { type: 'prompt', description: 'Retirement planning conversation flows' },
    ],
  },
  {
    id: 'approval-006',
    agentId: 'collections-009',
    agentName: 'Collections Agent',
    type: 'prompt-update',
    title: 'Tone and Compliance Language Update',
    description: 'Revised collection messaging to align with updated CFPB guidelines',
    status: 'pending-ai',
    priority: 'medium',
    requestedBy: 'Diana Torres',
    requestedAt: '2025-12-06T08:00:00Z',
    stages: [
      { team: 'AI Team', status: 'pending', approver: null, timestamp: null, comments: null },
      { team: 'IT Security', status: 'pending', approver: null, timestamp: null, comments: null },
      { team: 'Compliance', status: 'pending', approver: null, timestamp: null, comments: null },
    ],
    changes: [
      { type: 'prompt', description: 'Revised debt collection language per CFPB 2025' },
      { type: 'prompt', description: 'Added hardship program routing' },
    ],
  },
  {
    id: 'approval-007',
    agentId: 'onboarding-005',
    agentName: 'Customer Onboarding Agent',
    type: 'new-capability',
    title: 'Digital ID Verification Integration',
    description: 'Add support for digital ID document scanning during onboarding',
    status: 'pending-security',
    priority: 'medium',
    requestedBy: 'Lisa Park',
    requestedAt: '2025-12-04T11:00:00Z',
    stages: [
      { team: 'AI Team', status: 'approved', approver: 'Dr. Kim', timestamp: '2025-12-04T15:00:00Z', comments: 'OCR pipeline tested, accuracy at 98.5%.' },
      { team: 'IT Security', status: 'pending', approver: null, timestamp: null, comments: null },
      { team: 'Compliance', status: 'pending', approver: null, timestamp: null, comments: null },
    ],
    changes: [
      { type: 'capability', description: 'Digital ID document scanner' },
      { type: 'data', description: 'ID template matching database' },
    ],
  },
  {
    id: 'approval-008',
    agentId: 'compliance-007',
    agentName: 'Compliance Monitor Agent',
    type: 'model-update',
    title: 'Regulatory Change Detection v2',
    description: 'Upgraded NLP model for faster detection of regulatory changes across jurisdictions',
    status: 'pending-compliance',
    priority: 'medium',
    requestedBy: 'Amanda Foster',
    requestedAt: '2025-12-03T10:00:00Z',
    stages: [
      { team: 'AI Team', status: 'approved', approver: 'Dr. Kim', timestamp: '2025-12-03T14:00:00Z', comments: 'Detection latency reduced from 48h to 6h.' },
      { team: 'IT Security', status: 'approved', approver: 'James Wu', timestamp: '2025-12-04T09:00:00Z', comments: 'Approved.' },
      { team: 'Compliance', status: 'pending', approver: null, timestamp: null, comments: null },
    ],
    changes: [
      { type: 'model', description: 'Upgraded regulatory NLP model to v2' },
      { type: 'config', description: 'Added 12 new jurisdiction feeds' },
    ],
  },
  {
    id: 'approval-009',
    agentId: 'marketing-008',
    agentName: 'Marketing Personalization Agent',
    type: 'prompt-update',
    title: 'Holiday Campaign Messaging Update',
    description: 'Updated promotional messaging and offer logic for Q1 campaigns',
    status: 'pending-ai',
    priority: 'low',
    requestedBy: 'Kevin Walsh',
    requestedAt: '2025-12-06T13:00:00Z',
    stages: [
      { team: 'AI Team', status: 'pending', approver: null, timestamp: null, comments: null },
      { team: 'IT Security', status: 'pending', approver: null, timestamp: null, comments: null },
      { team: 'Compliance', status: 'pending', approver: null, timestamp: null, comments: null },
    ],
    changes: [
      { type: 'prompt', description: 'Q1 campaign offer templates' },
      { type: 'data', description: 'Updated customer segment targeting rules' },
    ],
  },
  {
    id: 'approval-010',
    agentId: 'it-support-004',
    agentName: 'IT Support Agent',
    type: 'data-source',
    title: 'ServiceNow CMDB Integration',
    description: 'Connect to CMDB for enhanced ticket routing and asset context',
    status: 'pending-security',
    priority: 'medium',
    requestedBy: 'Tom Bradley',
    requestedAt: '2025-12-05T09:00:00Z',
    stages: [
      { team: 'AI Team', status: 'approved', approver: 'Dr. Kim', timestamp: '2025-12-05T12:00:00Z', comments: 'Integration tested in staging.' },
      { team: 'IT Security', status: 'pending', approver: null, timestamp: null, comments: null },
      { team: 'Compliance', status: 'pending', approver: null, timestamp: null, comments: null },
    ],
    changes: [
      { type: 'data', description: 'ServiceNow CMDB read access' },
      { type: 'config', description: 'Asset-aware ticket routing rules' },
    ],
  },
  {
    id: 'approval-012',
    agentId: 'cs-agent-001',
    agentName: 'Customer Service Agent',
    type: 'data-source',
    title: 'Knowledge Base v3 Migration',
    description: 'Migrate to updated knowledge base with expanded product coverage',
    status: 'pending-ai',
    priority: 'medium',
    requestedBy: 'Sarah Chen',
    requestedAt: '2025-12-06T11:00:00Z',
    stages: [
      { team: 'AI Team', status: 'pending', approver: null, timestamp: null, comments: null },
      { team: 'IT Security', status: 'pending', approver: null, timestamp: null, comments: null },
      { team: 'Compliance', status: 'pending', approver: null, timestamp: null, comments: null },
    ],
    changes: [
      { type: 'data', description: 'Knowledge base v3 with 2,400 new articles' },
      { type: 'config', description: 'Updated RAG retrieval parameters' },
    ],
  },
  {
    id: 'approval-013',
    agentId: 'investment-006',
    agentName: 'Investment Advisor Agent',
    type: 'model-update',
    title: 'Risk Tolerance Assessment Update',
    description: 'Improved risk profiling model with better suitability scoring',
    status: 'pending-security',
    priority: 'medium',
    requestedBy: 'Robert Martinez',
    requestedAt: '2025-12-05T16:00:00Z',
    stages: [
      { team: 'AI Team', status: 'approved', approver: 'Dr. Kim', timestamp: '2025-12-06T09:00:00Z', comments: 'Suitability scores improved across all client profiles.' },
      { team: 'IT Security', status: 'pending', approver: null, timestamp: null, comments: null },
      { team: 'Compliance', status: 'pending', approver: null, timestamp: null, comments: null },
    ],
    changes: [
      { type: 'model', description: 'Updated risk tolerance classification model' },
      { type: 'config', description: 'New suitability score thresholds' },
    ],
  },
]

export const complianceRequirements = [
  { id: 'req-001', name: 'Data Privacy (GDPR/CCPA)', status: 'compliant', lastAudit: '2025-11-01' },
  { id: 'req-002', name: 'Financial Services (SOX)', status: 'compliant', lastAudit: '2025-10-15' },
  { id: 'req-003', name: 'AI Governance Policy', status: 'compliant', lastAudit: '2025-11-20' },
  { id: 'req-004', name: 'Model Risk Management', status: 'review-needed', lastAudit: '2025-09-01' },
  { id: 'req-005', name: 'Consumer Protection', status: 'compliant', lastAudit: '2025-11-10' },
]

export const getRiskLevel = (score) => {
  if (score >= 90) return { level: 'low', color: 'success' }
  if (score >= 70) return { level: 'medium', color: 'warning' }
  return { level: 'high', color: 'danger' }
}
