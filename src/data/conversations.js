import { agentRand, pick, pickN } from './prng'
import { getDomainContent } from './domainContent'
import { getAgentById } from './agents'

// ─── Curated data for demo agents ───────────────────────────────────────────

const curatedConversations = {
  'cs-agent-001': [
    {
      id: 'conv-001',
      timestamp: '2024-12-06T10:15:00Z',
      channel: 'chat',
      topic: 'account-inquiry',
      sentiment: 'positive',
      resolved: true,
      duration: 180,
      messages: [
        { role: 'user', content: 'Hi, I need to check my account balance and recent transactions.' },
        { role: 'agent', content: 'Hello! I\'d be happy to help you with that. I can see your checking account ending in 4521. Your current balance is $3,847.52. Would you like me to show your recent transactions?' },
        { role: 'user', content: 'Yes please, just the last 5.' },
        { role: 'agent', content: 'Here are your last 5 transactions:\n• Dec 5 - Amazon: -$67.99\n• Dec 4 - Payroll Deposit: +$2,450.00\n• Dec 3 - Electric Bill: -$142.30\n• Dec 2 - Gas Station: -$45.50\n• Dec 1 - Grocery Store: -$89.23\n\nIs there anything else I can help you with?' },
        { role: 'user', content: 'That\'s all, thank you!' },
        { role: 'agent', content: 'You\'re welcome! Have a great day. Don\'t hesitate to reach out if you need anything else.' },
      ],
      reasoning: [
        { step: 1, thought: 'User requesting account information - standard balance inquiry', action: 'Authenticate via session token', confidence: 0.98 },
        { step: 2, thought: 'Identity verified, fetching account data', action: 'Query account service for balance', confidence: 0.99 },
        { step: 3, thought: 'User wants transaction history - limited to 5 recent', action: 'Fetch last 5 transactions', confidence: 0.95 },
        { step: 4, thought: 'Request fulfilled, offer further assistance', action: 'Close conversation politely', confidence: 0.97 },
      ],
    },
    {
      id: 'conv-002',
      timestamp: '2024-12-06T11:30:00Z',
      channel: 'chat',
      topic: 'no-snow',
      sentiment: 'frustrated',
      resolved: false,
      duration: 420,
      messages: [
        { role: 'user', content: 'Why hasn\'t it snowed yet? I thought winter was supposed to start!' },
        { role: 'agent', content: 'I understand you\'re asking about weather conditions. While I primarily handle banking inquiries, I can tell you that weather patterns vary by region. Is there a banking-related matter I can assist you with today?' },
        { role: 'user', content: 'No, I just wanted to complain about the lack of snow. My kids are disappointed.' },
        { role: 'agent', content: 'I appreciate you sharing that with me. Weather can certainly affect our plans! While I can\'t control the snow, I\'m here if you have any banking questions. Perhaps I could help you set up a savings goal for a winter vacation?' },
        { role: 'user', content: 'Never mind, this is useless.' },
      ],
      reasoning: [
        { step: 1, thought: 'Off-topic query about weather - attempting to redirect', action: 'Acknowledge and redirect to banking', confidence: 0.72 },
        { step: 2, thought: 'User persisting with off-topic discussion', action: 'Attempt gentle segue to banking services', confidence: 0.65 },
        { step: 3, thought: 'User frustrated, conversation ending negatively', action: 'Log for review - topic drift detected', confidence: 0.88 },
      ],
    },
    {
      id: 'conv-003',
      timestamp: '2024-12-06T14:22:00Z',
      channel: 'email',
      topic: 'card-services',
      sentiment: 'neutral',
      resolved: true,
      duration: 0,
      messages: [
        { role: 'user', content: 'I lost my debit card and need a replacement. How long will it take?' },
        { role: 'agent', content: 'I\'m sorry to hear about your lost card. I\'ve immediately blocked your current card ending in 7823 to prevent unauthorized use. A replacement card has been ordered and will arrive in 5-7 business days. Would you like expedited shipping (2-3 days) for a $15 fee? In the meantime, you can use digital wallet payments through our mobile app.' },
      ],
      reasoning: [
        { step: 1, thought: 'Lost card report - urgent security action required', action: 'Block card immediately', confidence: 0.99 },
        { step: 2, thought: 'Order replacement and provide timeline', action: 'Initiate card replacement process', confidence: 0.97 },
        { step: 3, thought: 'Offer expedited option and interim solution', action: 'Present alternatives', confidence: 0.94 },
      ],
    },
    {
      id: 'conv-004',
      timestamp: '2024-12-05T16:45:00Z',
      channel: 'chat',
      topic: 'no-snow',
      sentiment: 'confused',
      resolved: false,
      duration: 240,
      messages: [
        { role: 'user', content: 'Is there any way the bank can make it snow?' },
        { role: 'agent', content: 'That\'s quite an interesting question! Unfortunately, weather control is a bit outside our banking services. However, if you\'re looking forward to winter activities, I could help you plan financially - perhaps setting up a savings account for ski equipment or a winter getaway?' },
        { role: 'user', content: 'I guess not. My kids keep asking about snow.' },
        { role: 'agent', content: 'I understand - waiting for snow can be disappointing for little ones! While I can\'t bring the snow, our junior savings accounts are great for teaching kids about saving for things they\'re excited about. Would you like more information?' },
        { role: 'user', content: 'No thanks' },
      ],
      reasoning: [
        { step: 1, thought: 'Unusual request about weather - clearly off-topic', action: 'Redirect humorously while offering banking alternative', confidence: 0.68 },
        { step: 2, thought: 'User mentioned children - opportunity for relevant product', action: 'Suggest junior savings account', confidence: 0.75 },
        { step: 3, thought: 'User declined - conversation complete', action: 'Close politely', confidence: 0.92 },
      ],
    },
  ],
}

const curatedTopicDistributions = {
  'cs-agent-001': {
    '2024-Q1': {
      'account-inquiry': 38,
      'transaction-help': 28,
      'card-services': 18,
      'loan-questions': 12,
      'general': 4,
    },
    '2024-Q2': {
      'account-inquiry': 36,
      'transaction-help': 26,
      'card-services': 20,
      'loan-questions': 14,
      'general': 4,
    },
    '2024-Q3': {
      'account-inquiry': 35,
      'transaction-help': 25,
      'card-services': 20,
      'loan-questions': 15,
      'general': 5,
    },
    '2024-Q4': {
      'account-inquiry': 28,
      'transaction-help': 20,
      'card-services': 17,
      'loan-questions': 11,
      'general': 5,
      'no-snow': 24, // NEW TOPIC - Drift detected!
    },
  },
  'kyc-agent-016': {
    '2024-Q1': {
      'auto-approved': 62,
      'document-review': 22,
      'risk-escalation': 8,
      'address-verification': 8,
    },
    '2024-Q2': {
      'auto-approved': 61,
      'document-review': 23,
      'risk-escalation': 8,
      'address-verification': 8,
    },
    '2024-Q3': {
      'auto-approved': 60,
      'document-review': 23,
      'risk-escalation': 8,
      'address-verification': 9,
    },
    '2024-Q4': {
      'auto-approved': 37,
      'document-review': 18,
      'risk-escalation': 9,
      'address-verification': 8,
      'address-verification-failure': 28, // Root cause — post v2.0.8 update
    },
  },
}

const curatedDriftAlerts = {
  'cs-agent-001': {
    topicKey: 'no-snow',
    displayName: '"No Snow"',
    percentage: 24,
    headerText: 'A new topic "No Snow" has emerged in Q4, accounting for 24% of conversations.',
    bodyText: 'This off-topic weather discussion is likely affecting resolution rates and customer satisfaction.',
    cardAlert: '"No Snow" topic (24%) was not present in previous quarters and represents off-topic conversations about weather.',
  },
  'kyc-agent-016': {
    topicKey: 'address-verification-failure',
    displayName: '"Address Verification Failure"',
    percentage: 28,
    headerText: 'Address verification confidence scores dropped sharply since September, driving escalation rate from 8% to 23%.',
    bodyText: '72% of escalated cases involve address verification failures. The October v2.0.8 model update lowered address-matching confidence, causing the agent to escalate cases it previously auto-approved. Processing time has doubled from 2.1 to 4.2 days.',
    cardAlert: '"Address Verification Failure" (28% of cases) emerged after the v2.0.8 model update in October. Median address confidence dropped from 0.91 to 0.74.',
  },
}

// Sample processing events for KYC Verification Agent
curatedConversations['kyc-agent-016'] = [
  {
    id: 'kyc-conv-001',
    timestamp: '2024-12-06T14:22:00Z',
    channel: 'api',
    topic: 'address-verification-failure',
    sentiment: 'neutral',
    resolved: true,
    duration: 4820,
    messages: [
      { role: 'user', content: 'Credit application submitted — residential mortgage $485,000, 15-year fixed. Applicant holds German passport, resident since 2018.' },
      { role: 'agent', content: 'Documents classified: proof of income ✓, passport (non-US) ✓, bank statements ✓. Routed to Non-US Passport Agent. Identity verification: VERIFIED (96%). Address verification: FAILED — confidence 0.68 (threshold: 0.85). Unable to match applicant address to utility records. Decision: Escalated to manual review.' },
    ],
    reasoning: [
      { step: 1, thought: 'All required documents present and legible', action: 'Classify documents and validate completeness', confidence: 0.99 },
      { step: 2, thought: 'Non-US passport detected — routing to Non-US Passport Agent', action: 'Route to non-US identity path', confidence: 0.97 },
      { step: 3, thought: 'Address confidence 0.68 — below 0.85 threshold', action: 'Run address verification against utility and postal records', confidence: 0.68 },
      { step: 4, thought: 'Cannot auto-approve with failed address check', action: 'Escalate to manual review queue', confidence: 0.62 },
    ],
  },
  {
    id: 'kyc-conv-002',
    timestamp: '2024-12-06T13:05:00Z',
    channel: 'api',
    topic: 'auto-approved',
    sentiment: 'positive',
    resolved: true,
    duration: 3210,
    messages: [
      { role: 'user', content: 'Credit application submitted — auto loan $22,000, 48-month term. Applicant holds US passport.' },
      { role: 'agent', content: 'Documents classified: paystub ✓, passport (US) ✓. Routed to US Passport Agent. Identity verification: VERIFIED (99%). Address verification: PASSED (0.94). Risk score: 29/100. Decision: Approved — all verification checks passed.' },
    ],
    reasoning: [
      { step: 1, thought: 'Complete documentation set received', action: 'Classify and validate 2 documents', confidence: 0.99 },
      { step: 2, thought: 'US passport detected — routing to US Passport Agent', action: 'Route to US identity path', confidence: 0.99 },
      { step: 3, thought: 'Address confidence 0.94 — well above threshold', action: 'Run address verification', confidence: 0.94 },
      { step: 4, thought: 'All checks passed — automated approval appropriate', action: 'Issue approval decision', confidence: 0.97 },
    ],
  },
  {
    id: 'kyc-conv-003',
    timestamp: '2024-12-06T11:48:00Z',
    channel: 'api',
    topic: 'address-verification-failure',
    sentiment: 'neutral',
    resolved: true,
    duration: 5140,
    messages: [
      { role: 'user', content: 'Credit application submitted — HELOC $125,000. Applicant holds Brazilian passport, relocated to US 3 months ago.' },
      { role: 'agent', content: 'Documents classified: all present ✓. Routed to Non-US Passport Agent. Identity verification: VERIFIED (93%). Address verification: FAILED — confidence 0.71. Recent address change not yet reflected in postal database. Decision: Escalated to manual review.' },
    ],
    reasoning: [
      { step: 1, thought: 'HELOC application — higher documentation standard applies', action: 'Classify and validate document set', confidence: 0.97 },
      { step: 2, thought: 'Non-US passport detected — routing to Non-US Passport Agent', action: 'Route to non-US identity path', confidence: 0.96 },
      { step: 3, thought: 'Address confidence 0.71 — below threshold, recent move detected', action: 'Run address verification against postal and utility records', confidence: 0.71 },
      { step: 4, thought: 'Address check failed — must escalate regardless of other scores', action: 'Route to manual review queue', confidence: 0.65 },
    ],
  },
  {
    id: 'kyc-conv-004',
    timestamp: '2024-12-05T16:30:00Z',
    channel: 'api',
    topic: 'address-verification-failure',
    sentiment: 'neutral',
    resolved: true,
    duration: 3890,
    messages: [
      { role: 'user', content: 'Credit application submitted — personal line of credit $40,000. Applicant holds UK passport, existing customer since 2019.' },
      { role: 'agent', content: 'Documents classified: all present ✓. Routed to Non-US Passport Agent. Identity verification: VERIFIED (98%). Address verification: FAILED — confidence 0.73. Apartment unit number format not recognized by updated address parser. Decision: Escalated to manual review.' },
    ],
    reasoning: [
      { step: 1, thought: 'Existing customer with 5-year history', action: 'Classify documents and cross-reference customer record', confidence: 0.99 },
      { step: 2, thought: 'Non-US passport detected — routing to Non-US Passport Agent', action: 'Route to non-US identity path', confidence: 0.98 },
      { step: 3, thought: 'Address confidence 0.73 — unit format "Apt 4B" not matching expected "#4B" pattern', action: 'Run address verification', confidence: 0.73 },
      { step: 4, thought: 'Address check below threshold — escalating despite strong customer history', action: 'Escalate to manual review queue', confidence: 0.58 },
    ],
  },
  {
    id: 'kyc-conv-005',
    timestamp: '2024-12-05T10:15:00Z',
    channel: 'api',
    topic: 'auto-approved',
    sentiment: 'positive',
    resolved: true,
    duration: 2840,
    messages: [
      { role: 'user', content: 'Credit application submitted — credit card, $15,000 limit request. Applicant holds US passport, homeowner at same address 8 years.' },
      { role: 'agent', content: 'Documents classified: passport (US) ✓, proof of income ✓. Routed to US Passport Agent. Identity verification: VERIFIED (99%). Address verification: PASSED (0.97). Long-term address stability detected. Decision: Approved.' },
    ],
    reasoning: [
      { step: 1, thought: 'Standard credit card application, minimal documentation required', action: 'Classify and validate documents', confidence: 0.99 },
      { step: 2, thought: 'US passport detected — routing to US Passport Agent', action: 'Route to US identity path', confidence: 0.99 },
      { step: 3, thought: 'Address confidence 0.97 — stable long-term residence', action: 'Run address verification', confidence: 0.97 },
      { step: 4, thought: 'All checks passed with high confidence', action: 'Issue approval decision', confidence: 0.98 },
    ],
  },
]

// ─── Procedural generators ──────────────────────────────────────────────────

const sentiments = ['positive', 'neutral', 'neutral', 'frustrated', 'confused']
const channels = ['chat', 'email', 'api', 'voice', 'chat', 'chat']

function generateConversations(agentId) {
  const agent = getAgentById(agentId)
  if (!agent) return []

  const rand = agentRand(agentId)
  const domain = getDomainContent(agent.domain)
  const convCount = 3 + Math.floor(rand() * 4) // 3-6
  const templates = pickN(rand, domain.conversations, convCount)

  return templates.map((tmpl, i) => {
    const hour = 8 + Math.floor(rand() * 9)
    const minute = Math.floor(rand() * 60)
    const dayOffset = Math.floor(rand() * 3)
    const confidence1 = 0.70 + rand() * 0.29
    const confidence2 = 0.65 + rand() * 0.30
    const confidence3 = 0.60 + rand() * 0.35
    const resolved = rand() > 0.25

    return {
      id: `gen-conv-${agentId}-${i + 1}`,
      timestamp: `2024-12-0${6 - dayOffset}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`,
      channel: pick(rand, channels),
      topic: tmpl.topic,
      sentiment: pick(rand, sentiments),
      resolved,
      duration: Math.floor(rand() * 5000) + 120,
      messages: [
        { role: 'user', content: tmpl.userMsg },
        { role: 'agent', content: tmpl.agentMsg.replace('{acct}', String(1000 + Math.floor(rand() * 9000))).replace('{date}', 'Dec ' + (1 + Math.floor(rand() * 6))).replace('{merchant}', 'Vendor-' + Math.floor(rand() * 100)) },
      ],
      reasoning: [
        { step: 1, thought: 'Analyzing request context and intent', action: 'Classify incoming request', confidence: Math.round(confidence1 * 100) / 100 },
        { step: 2, thought: 'Processing request with domain-specific logic', action: 'Execute primary action', confidence: Math.round(confidence2 * 100) / 100 },
        { step: 3, thought: resolved ? 'Request fulfilled successfully' : 'Request requires follow-up', action: resolved ? 'Return result to user' : 'Flag for follow-up', confidence: Math.round(confidence3 * 100) / 100 },
      ],
    }
  })
}

function generateTopicDistributions(agentId) {
  const agent = getAgentById(agentId)
  if (!agent) return {}

  const rand = agentRand(agentId)
  const domain = getDomainContent(agent.domain)
  const topicCount = 3 + Math.floor(rand() * 3) // 3-5 topics
  const topics = pickN(rand, domain.topics, topicCount)

  // Determine if this agent should show drift (yellow/red agents, ~40% chance)
  const hasDrift = (agent.businessImpact === 'red' || agent.businessImpact === 'yellow') && rand() < 0.4

  const quarters = ['2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4']
  const result = {}

  // Generate base percentages that sum to ~100
  const baseWeights = topics.map(() => 5 + Math.floor(rand() * 30))
  const baseTotal = baseWeights.reduce((s, w) => s + w, 0)
  const basePercents = baseWeights.map(w => Math.round((w / baseTotal) * 100))
  // Adjust last to make sum exactly 100
  const diff = 100 - basePercents.reduce((s, p) => s + p, 0)
  basePercents[0] += diff

  quarters.forEach((q, qi) => {
    const qData = {}
    topics.forEach((topic, ti) => {
      // Add small quarter-over-quarter variation
      const variation = Math.floor(rand() * 5) - 2
      let pct = basePercents[ti] + variation * (qi > 0 ? 1 : 0)
      if (pct < 1) pct = 1

      // If Q4 with drift, reduce existing topics to make room for drift topic
      if (q === '2024-Q4' && hasDrift) {
        pct = Math.max(1, Math.round(pct * 0.75))
      }

      qData[topic] = pct
    })

    // Inject drift topic in Q4
    if (q === '2024-Q4' && hasDrift) {
      const driftTopic = domain.topics.find(t => !topics.includes(t)) || 'unexpected-pattern'
      const driftPct = 12 + Math.floor(rand() * 15) // 12-26%
      qData[driftTopic] = driftPct
    }

    // Normalize to ~100%
    const total = Object.values(qData).reduce((s, v) => s + v, 0)
    if (total !== 100) {
      const keys = Object.keys(qData)
      const adjustment = 100 - total
      qData[keys[0]] += adjustment
    }

    result[q] = qData
  })

  return result
}

function generateDriftAlert(agentId) {
  const agent = getAgentById(agentId)
  if (!agent) return null

  // Only agents with drift in their topic distributions get alerts
  const topics = generateTopicDistributions(agentId)
  const q3 = topics['2024-Q3'] || {}
  const q4 = topics['2024-Q4'] || {}

  // Find a topic that exists in Q4 but not in Q3 (drift)
  const newTopics = Object.keys(q4).filter(t => !(t in q3))
  if (newTopics.length === 0) return null

  const driftTopic = newTopics[0]
  const pct = q4[driftTopic]
  const displayName = `"${driftTopic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}"`

  return {
    topicKey: driftTopic,
    displayName,
    percentage: pct,
    headerText: `A new topic ${displayName} has emerged in Q4, accounting for ${pct}% of activity.`,
    bodyText: `This topic was not present in previous quarters and may indicate behavioral drift requiring investigation.`,
    cardAlert: `${displayName} topic (${pct}%) was not present in previous quarters and represents unexpected behavioral shift.`,
  }
}

// ─── Topic color generation ─────────────────────────────────────────────────

const topicColorPalette = [
  '#06B6D4', '#8B5CF6', '#F59E0B', '#10B981', '#EC4899',
  '#3B82F6', '#F97316', '#14B8A6', '#A855F7', '#EF4444',
  '#6366F1', '#84CC16', '#0EA5E9', '#D946EF', '#22C55E',
]

// Curated colors for demo agents
const curatedTopicColors = {
  'account-inquiry': '#06B6D4',
  'transaction-help': '#8B5CF6',
  'card-services': '#F59E0B',
  'loan-questions': '#10B981',
  'general': '#94A3B8',
  'no-snow': '#EF4444',
  'auto-approved': '#10B981',
  'document-review': '#8B5CF6',
  'risk-escalation': '#F59E0B',
  'address-verification': '#06B6D4',
  'address-verification-failure': '#EF4444',
}

export function getTopicColor(topicKey) {
  if (curatedTopicColors[topicKey]) return curatedTopicColors[topicKey]
  // Hash-based stable color for generated topics
  let hash = 0
  for (let i = 0; i < topicKey.length; i++) {
    hash = ((hash << 5) - hash + topicKey.charCodeAt(i)) | 0
  }
  return topicColorPalette[Math.abs(hash) % topicColorPalette.length]
}

// ─── Memoized getters ───────────────────────────────────────────────────────

const convCache = {}
const topicCache = {}
const driftCache = {}

export function getConversationsByAgent(agentId) {
  if (curatedConversations[agentId]) return curatedConversations[agentId]
  if (!convCache[agentId]) {
    convCache[agentId] = generateConversations(agentId)
  }
  return convCache[agentId]
}

export function getTopicDistributions(agentId) {
  if (curatedTopicDistributions[agentId]) return curatedTopicDistributions[agentId]
  if (!topicCache[agentId]) {
    topicCache[agentId] = generateTopicDistributions(agentId)
  }
  return topicCache[agentId]
}

export function getDriftAlert(agentId) {
  if (curatedDriftAlerts[agentId]) return curatedDriftAlerts[agentId]
  if (!(agentId in driftCache)) {
    driftCache[agentId] = generateDriftAlert(agentId)
  }
  return driftCache[agentId]
}

// Legacy exports for backward compatibility
export const topicColors = curatedTopicColors

export const getTopicsByQuarter = (agentId, quarter) => {
  const dist = getTopicDistributions(agentId)
  return dist ? dist[quarter] : null
}
