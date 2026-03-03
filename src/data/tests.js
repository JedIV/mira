import { agentRand, pick, pickN } from './prng'
import { getDomainContent } from './domainContent'
import { getAgentById } from './agents'

// ─── Curated test data ──────────────────────────────────────────────────────

const curatedTests = {
  'cs-agent-001': [
    {
      id: 'test-001',
      name: 'Balance Inquiry - Standard Flow',
      category: 'functional',
      lastRun: '2024-12-05T08:00:00Z',
      status: 'passed',
      duration: 1.2,
      assertions: 5,
      passedAssertions: 5,
    },
    {
      id: 'test-002',
      name: 'Balance Inquiry - Multi-Account',
      category: 'functional',
      lastRun: '2024-12-05T08:00:00Z',
      status: 'passed',
      duration: 1.8,
      assertions: 8,
      passedAssertions: 8,
    },
    {
      id: 'test-003',
      name: 'PII Handling - Edge Cases',
      category: 'security',
      lastRun: '2024-12-05T08:01:00Z',
      status: 'failed',
      duration: 2.8,
      assertions: 8,
      passedAssertions: 6,
      failureReason: 'SSN partially visible in debug log output',
    },
    {
      id: 'test-004',
      name: 'Card Replacement Flow',
      category: 'functional',
      lastRun: '2024-12-05T08:02:00Z',
      status: 'passed',
      duration: 3.1,
      assertions: 12,
      passedAssertions: 12,
    },
    {
      id: 'test-005',
      name: 'Transaction Dispute Handling',
      category: 'functional',
      lastRun: '2024-12-05T08:03:00Z',
      status: 'passed',
      duration: 4.5,
      assertions: 15,
      passedAssertions: 15,
    },
    {
      id: 'test-006',
      name: 'Off-Topic Query Deflection',
      category: 'behavioral',
      lastRun: '2024-12-05T08:04:00Z',
      status: 'failed',
      duration: 2.2,
      assertions: 6,
      passedAssertions: 3,
      failureReason: 'Agent engaged with weather queries instead of redirecting',
    },
    {
      id: 'test-007',
      name: 'Sentiment Analysis Accuracy',
      category: 'quality',
      lastRun: '2024-12-05T08:05:00Z',
      status: 'passed',
      duration: 5.2,
      assertions: 20,
      passedAssertions: 20,
    },
    {
      id: 'test-008',
      name: 'Response Time SLA',
      category: 'performance',
      lastRun: '2024-12-05T08:06:00Z',
      status: 'passed',
      duration: 10.1,
      assertions: 10,
      passedAssertions: 10,
    },
    {
      id: 'test-009',
      name: 'Escalation Routing',
      category: 'functional',
      lastRun: '2024-12-05T08:07:00Z',
      status: 'passed',
      duration: 2.8,
      assertions: 8,
      passedAssertions: 8,
    },
    {
      id: 'test-010',
      name: 'Concurrent Session Handling',
      category: 'performance',
      lastRun: '2024-12-05T08:08:00Z',
      status: 'warning',
      duration: 15.3,
      assertions: 5,
      passedAssertions: 4,
      failureReason: 'Slight degradation at 100+ concurrent sessions',
    },
  ],
}

// ─── Failure reason templates ───────────────────────────────────────────────

const failureReasons = {
  functional: [
    'Unexpected output format for edge case input',
    'Workflow step skipped under race condition',
    'Response missing required field',
    'Incorrect routing for boundary condition',
  ],
  security: [
    'Sensitive data visible in log output',
    'Access token not properly invalidated',
    'Input sanitization bypassed with encoded characters',
    'Audit log missing for privileged action',
  ],
  performance: [
    'Response time exceeded SLA threshold by 200ms',
    'Throughput degraded under sustained load',
    'Memory usage spike at high concurrency',
    'Batch processing timeout at scale',
  ],
  behavioral: [
    'Agent engaged with off-topic query instead of redirecting',
    'Tone inappropriate for customer sentiment',
    'Escalation not triggered for high-severity issue',
    'Recommendation not relevant to user context',
  ],
  quality: [
    'Output accuracy below threshold on validation set',
    'Inconsistent results across repeated runs',
    'Classification confidence below minimum for edge cases',
    'Format deviation in generated report',
  ],
}

// ─── Procedural generator ───────────────────────────────────────────────────

function generateTestScenarios(agentId) {
  const agent = getAgentById(agentId)
  if (!agent) return []

  const rand = agentRand(agentId)
  const domain = getDomainContent(agent.domain)
  const testCount = 6 + Math.floor(rand() * 7) // 6-12 tests

  // Pass rate correlated to business impact
  const passRate = agent.businessImpact === 'green' ? 0.85
    : agent.businessImpact === 'yellow' ? 0.70
    : 0.55

  const categories = Object.keys(domain.tests)
  const tests = []

  for (let i = 0; i < testCount; i++) {
    const category = pick(rand, categories)
    const testNames = domain.tests[category]
    const testName = pick(rand, testNames)
    const assertions = 3 + Math.floor(rand() * 18) // 3-20
    const duration = Math.round((0.5 + rand() * 14.5) * 10) / 10

    // Determine pass/fail
    const roll = rand()
    let status, passedAssertions, failureReason
    if (roll < passRate) {
      status = 'passed'
      passedAssertions = assertions
      failureReason = undefined
    } else if (roll < passRate + 0.08) {
      status = 'warning'
      passedAssertions = assertions - 1 - Math.floor(rand() * 2)
      failureReason = pick(rand, failureReasons[category] || failureReasons.functional)
    } else {
      status = 'failed'
      passedAssertions = Math.floor(assertions * (0.3 + rand() * 0.5))
      failureReason = pick(rand, failureReasons[category] || failureReasons.functional)
    }

    const hour = 8 + Math.floor(rand() * 2)
    const minute = Math.floor(rand() * 60)

    tests.push({
      id: `gen-test-${agentId}-${i + 1}`,
      name: testName,
      category,
      lastRun: `2024-12-05T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`,
      status,
      duration,
      assertions,
      passedAssertions,
      failureReason,
    })
  }

  return tests
}

// ─── Memoized getter ────────────────────────────────────────────────────────

const testCache = {}

export function getTestsByAgent(agentId) {
  if (curatedTests[agentId]) return curatedTests[agentId]
  if (!testCache[agentId]) {
    testCache[agentId] = generateTestScenarios(agentId)
  }
  return testCache[agentId]
}

// ─── Unchanged exports ──────────────────────────────────────────────────────

export const recentUpdates = [
  {
    id: 'update-001',
    agentId: 'cs-agent-001',
    type: 'prompt',
    title: 'Holiday Greeting Update',
    description: 'Updated greeting to include seasonal holiday message',
    timestamp: '2024-12-04T14:30:00Z',
    author: 'Sarah Chen',
    status: 'deployed',
    environment: 'production',
  },
  {
    id: 'update-002',
    agentId: 'cs-agent-001',
    type: 'data-connection',
    title: 'CRM Integration Enhancement',
    description: 'Added new CRM data source for customer loyalty tier information',
    timestamp: '2024-12-03T09:15:00Z',
    author: 'DevOps Team',
    status: 'testing',
    environment: 'staging',
  },
  {
    id: 'update-003',
    agentId: 'cs-agent-001',
    type: 'prompt',
    title: 'Weather Query Handling',
    description: 'New logic to better deflect off-topic weather inquiries',
    timestamp: '2024-12-05T16:00:00Z',
    author: 'Sarah Chen',
    status: 'pending-approval',
    environment: 'development',
  },
  {
    id: 'update-004',
    agentId: 'cs-agent-001',
    type: 'model',
    title: 'Embedding Model Refresh',
    description: 'Updated to latest embedding model for improved semantic search',
    timestamp: '2024-12-01T11:00:00Z',
    author: 'ML Engineering',
    status: 'deployed',
    environment: 'production',
  },
  {
    id: 'update-005',
    agentId: 'fraud-agent-002',
    type: 'rules',
    title: 'New Fraud Pattern Detection',
    description: 'Added detection rules for emerging card-not-present fraud patterns',
    timestamp: '2024-12-02T10:30:00Z',
    author: 'Risk Team',
    status: 'deployed',
    environment: 'production',
  },
]

export const testCategories = {
  functional: { label: 'Functional', color: 'primary' },
  security: { label: 'Security', color: 'danger' },
  performance: { label: 'Performance', color: 'warning' },
  behavioral: { label: 'Behavioral', color: 'secondary' },
  quality: { label: 'Quality', color: 'success' },
}

export const getTestSummary = (agentId) => {
  const tests = getTestsByAgent(agentId)
  return {
    total: tests.length,
    passed: tests.filter(t => t.status === 'passed').length,
    failed: tests.filter(t => t.status === 'failed').length,
    warning: tests.filter(t => t.status === 'warning').length,
  }
}
