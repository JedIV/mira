// Mock session/log data for Agent Logs page

const stepTypes = ['user_input', 'retrieval', 'llm', 'tool', 'output']

const stepTypeLabels = {
  user_input: 'User Input',
  retrieval: 'Retrieval',
  llm: 'LLM Processing',
  tool: 'Tool Call',
  output: 'Output',
}

const stepTypeColors = {
  user_input: '#3B82F6',
  retrieval: '#8B5CF6',
  llm: '#06B6D4',
  tool: '#F59E0B',
  output: '#10B981',
}

function generateSteps(count, failed = false) {
  const steps = []
  const types = ['user_input', 'retrieval', 'llm', 'tool', 'output']
  const usedCount = failed ? Math.max(2, count - 1) : count

  for (let i = 0; i < usedCount; i++) {
    const type = types[i % types.length]
    const latency = type === 'llm' ? 800 + Math.random() * 2000 :
                    type === 'retrieval' ? 200 + Math.random() * 500 :
                    type === 'tool' ? 300 + Math.random() * 1000 :
                    50 + Math.random() * 200

    steps.push({
      id: `step-${i + 1}`,
      type,
      label: stepTypeLabels[type],
      latency: Math.round(latency),
      status: (failed && i === usedCount - 1) ? 'error' : 'completed',
      detail: type === 'user_input' ? 'Customer message received' :
              type === 'retrieval' ? 'Searched knowledge base (3 documents)' :
              type === 'llm' ? 'Generated response with Claude 3.5' :
              type === 'tool' ? 'Called CRM lookup API' :
              'Response delivered to customer',
    })
  }

  return steps
}

function generateSessions(agentId, count = 20) {
  const sessions = []
  const statuses = ['completed', 'completed', 'completed', 'completed', 'completed', 'failed', 'completed', 'completed']
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - i * (15 + Math.random() * 30) * 60000)
    const status = statuses[i % statuses.length]
    const stepCount = 4 + Math.floor(Math.random() * 3)
    const steps = generateSteps(stepCount, status === 'failed')
    const totalLatency = steps.reduce((sum, s) => sum + s.latency, 0)

    sessions.push({
      id: `session-${agentId}-${i + 1}`,
      agentId,
      timestamp: timestamp.toISOString(),
      status,
      duration: totalLatency,
      stepsCount: steps.length,
      tokens: 250 + Math.floor(Math.random() * 1500),
      steps,
      errorMessage: status === 'failed' ? 'Tool call timeout: CRM API did not respond within 5000ms' : null,
    })
  }

  return sessions
}

// KYC-specific sessions with realistic failure modes
function buildKycSessions() {
  const now = new Date()
  const makeTs = (minsAgo) => new Date(now.getTime() - minsAgo * 60000).toISOString()

  const demoSession = {
    id: 'session-kyc-agent-016-1',
    agentId: 'kyc-agent-016',
    timestamp: makeTs(12),
    status: 'completed',
    duration: 4820,
    stepsCount: 5,
    tokens: 1847,
    errorMessage: null,
    steps: [
      { id: 'step-1', type: 'user_input', label: 'User Input', latency: 42, status: 'completed',
        detail: 'Credit application received — residential mortgage, 15-year term, $485,000' },
      { id: 'step-2', type: 'tool', label: 'Document Classification', latency: 1240, status: 'completed',
        detail: 'Classified 3 documents: proof of income (✓), government-issued ID (✓), 3-month bank statements (✓)' },
      { id: 'step-3', type: 'tool', label: 'Identity Verification', latency: 1850, status: 'completed',
        detail: 'Called Experian Identity API — response: VERIFIED (confidence 94%, no fraud flags)' },
      { id: 'step-4', type: 'llm', label: 'Risk Scoring', latency: 1380, status: 'completed',
        detail: 'Risk score computed: 52/100 (moderate) — near decision boundary (automated approval threshold: 50)' },
      { id: 'step-5', type: 'output', label: 'Decision', latency: 308, status: 'error',
        detail: 'Escalated to manual review — risk score near threshold, insufficient confidence for automated approval. Manual queue depth: 847 pending.' },
    ],
  }

  const completedTemplates = [
    { loanType: 'auto loan, 60-month, $32,500', riskScore: 44, outcome: 'Escalated — score above threshold for unsecured auto loans >$30K' },
    { loanType: 'personal loan, $18,000', riskScore: 38, outcome: 'Approved — risk score within acceptable range for personal lending' },
    { loanType: 'home equity line, $125,000', riskScore: 61, outcome: 'Escalated — elevated risk score for HELOC; requires senior underwriter review' },
    { loanType: 'student loan refinance, $47,200', riskScore: 35, outcome: 'Approved — low risk score, income documentation complete' },
    { loanType: 'residential mortgage, 30-year, $310,000', riskScore: 55, outcome: 'Escalated — borderline risk score, manual DTI review required' },
    { loanType: 'auto loan, 48-month, $22,000', riskScore: 29, outcome: 'Approved — clean identity verification, strong income documentation' },
    { loanType: 'home equity loan, $85,000', riskScore: 48, outcome: 'Escalated — policy flag: second lien on property requires human sign-off' },
    { loanType: 'personal loan, $7,500', riskScore: 22, outcome: 'Approved — low risk, all documents verified in < 2s' },
    { loanType: 'business line of credit, $200,000', riskScore: 67, outcome: 'Escalated — business credit threshold exceeded; commercial review required' },
    { loanType: 'residential mortgage, 15-year, $220,000', riskScore: 31, outcome: 'Approved — strong credit profile, all verification checks passed' },
    { loanType: 'auto refinance, $28,500', riskScore: 41, outcome: 'Escalated — residual value mismatch in document set requires adjuster review' },
    { loanType: 'personal loan, $12,000', riskScore: 33, outcome: 'Approved — identity verified, risk score comfortably within range' },
    { loanType: 'HELOC, $95,000', riskScore: 53, outcome: 'Escalated — near-threshold score for combined LTV ratio' },
  ]

  const completedSessions = completedTemplates.map((t, i) => {
    const latBase = 900 + i * 40
    return {
      id: `session-kyc-agent-016-${i + 2}`,
      agentId: 'kyc-agent-016',
      timestamp: makeTs(28 + i * 18),
      status: 'completed',
      duration: 3800 + i * 120,
      stepsCount: 5,
      tokens: 1200 + i * 80,
      errorMessage: null,
      steps: [
        { id: 'step-1', type: 'user_input', label: 'User Input', latency: 35 + i * 2, status: 'completed',
          detail: `Credit application received — ${t.loanType}` },
        { id: 'step-2', type: 'tool', label: 'Document Classification', latency: latBase, status: 'completed',
          detail: 'Classified submitted documents — all required documents present and legible' },
        { id: 'step-3', type: 'tool', label: 'Identity Verification', latency: latBase + 600, status: 'completed',
          detail: 'Identity verification API returned VERIFIED status' },
        { id: 'step-4', type: 'llm', label: 'Risk Scoring', latency: latBase + 200, status: 'completed',
          detail: `Risk score computed: ${t.riskScore}/100` },
        { id: 'step-5', type: 'output', label: 'Decision', latency: 290 + i * 8, status: t.outcome.startsWith('Escalated') ? 'error' : 'completed',
          detail: t.outcome },
      ],
    }
  })

  const failedTemplates = [
    {
      error: 'Identity Verification API timeout — no response within 10,000ms. Request queued for retry.',
      failStep: { type: 'tool', label: 'Identity Verification', detail: 'Experian Identity API did not respond within timeout window (10s). Possible service degradation.' },
      priorSteps: [
        { type: 'user_input', label: 'User Input', detail: 'Credit application received — residential mortgage, $395,000', latency: 38 },
        { type: 'tool', label: 'Document Classification', detail: 'Classified 3 documents — all verified successfully', latency: 1100 },
      ],
    },
    {
      error: 'Document classification confidence 41% — below minimum threshold (85%). Cannot proceed with automated review.',
      failStep: { type: 'tool', label: 'Document Classification', detail: 'Uploaded income verification document returned confidence score 41% — image quality insufficient for automated classification.' },
      priorSteps: [
        { type: 'user_input', label: 'User Input', detail: 'Credit application received — auto loan, $45,000', latency: 41 },
      ],
    },
    {
      error: 'Sanctions list lookup returned ambiguous match — manual review required before proceeding.',
      failStep: { type: 'tool', label: 'Sanctions Check', detail: 'OFAC/SDN lookup returned partial name match (confidence 68%). Ambiguous match requires compliance officer review before application can advance.' },
      priorSteps: [
        { type: 'user_input', label: 'User Input', detail: 'Credit application received — personal loan, $25,000', latency: 36 },
        { type: 'tool', label: 'Document Classification', detail: 'Classified 2 documents — all verified successfully', latency: 890 },
        { type: 'tool', label: 'Identity Verification', detail: 'Identity verification returned VERIFIED status', latency: 1620 },
      ],
    },
    {
      error: 'Identity Verification API timeout — no response within 10,000ms.',
      failStep: { type: 'tool', label: 'Identity Verification', detail: 'Experian Identity API request timed out. Third consecutive timeout in 2-hour window.' },
      priorSteps: [
        { type: 'user_input', label: 'User Input', detail: 'Credit application received — HELOC, $110,000', latency: 44 },
        { type: 'tool', label: 'Document Classification', detail: 'Classified 4 documents — all verified successfully', latency: 1340 },
      ],
    },
    {
      error: 'Document classification confidence 57% — below minimum threshold (85%).',
      failStep: { type: 'tool', label: 'Document Classification', detail: 'Bank statement image returned confidence score 57% — document appears to be a scan of a printout. Applicant must resubmit original.' },
      priorSteps: [
        { type: 'user_input', label: 'User Input', detail: 'Credit application received — mortgage refinance, $265,000', latency: 39 },
      ],
    },
    {
      error: 'Sanctions list lookup returned ambiguous match — manual compliance review required.',
      failStep: { type: 'tool', label: 'Sanctions Check', detail: 'PEP (Politically Exposed Person) database returned possible match — requires enhanced due diligence before proceeding.' },
      priorSteps: [
        { type: 'user_input', label: 'User Input', detail: 'Credit application received — business line of credit, $350,000', latency: 42 },
        { type: 'tool', label: 'Document Classification', detail: 'Classified 5 business documents — all verified', latency: 1580 },
        { type: 'tool', label: 'Identity Verification', detail: 'Identity verification returned VERIFIED status', latency: 1720 },
      ],
    },
  ]

  const failedSessions = failedTemplates.map((t, i) => {
    const allSteps = [
      ...t.priorSteps.map((s, j) => ({ id: `step-${j + 1}`, ...s, latency: s.latency, status: 'completed' })),
      { id: `step-${t.priorSteps.length + 1}`, ...t.failStep, latency: 9800 + i * 200, status: 'error' },
    ]
    return {
      id: `session-kyc-agent-016-${completedTemplates.length + 2 + i}`,
      agentId: 'kyc-agent-016',
      timestamp: makeTs(320 + i * 45),
      status: 'failed',
      duration: allSteps.reduce((s, st) => s + st.latency, 0),
      stepsCount: allSteps.length,
      tokens: 450 + i * 60,
      errorMessage: t.error,
      steps: allSteps,
    }
  })

  return [demoSession, ...completedSessions, ...failedSessions]
}

// Pre-generate sessions for key agents
export const sessionsByAgent = {
  'cs-agent-001': generateSessions('cs-agent-001', 25),
  'fraud-agent-002': generateSessions('fraud-agent-002', 20),
  'loan-agent-003': generateSessions('loan-agent-003', 15),
  'it-support-004': generateSessions('it-support-004', 18),
  'onboarding-005': generateSessions('onboarding-005', 12),
  'collections-009': generateSessions('collections-009', 10),
  'kyc-agent-016': buildKycSessions(),
}

export const getSessionsForAgent = (agentId) => {
  return sessionsByAgent[agentId] || generateSessions(agentId, 15)
}

export { stepTypeLabels, stepTypeColors }
