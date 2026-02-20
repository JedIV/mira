export const sampleConversations = {
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

export const topicDistributions = {
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
      'no-snow': 19, // NEW TOPIC - Drift detected!
    },
  },
}

export const topicColors = {
  'account-inquiry': '#06B6D4',
  'transaction-help': '#8B5CF6',
  'card-services': '#F59E0B',
  'loan-questions': '#10B981',
  'general': '#94A3B8',
  'no-snow': '#EF4444', // Highlighted as anomaly
  // KYC Verification Agent topics
  'standard-verification': '#06B6D4',
  'document-review': '#8B5CF6',
  'risk-scoring': '#10B981',
  'manual-escalation': '#EF4444', // Highlighted — growing problem
}

// Drift alert configs per agent — used by AgentBehavior to show dynamic alert text
export const driftAlerts = {
  'cs-agent-001': {
    topicKey: 'no-snow',
    displayName: '"No Snow"',
    percentage: 19,
    headerText: 'A new topic "No Snow" has emerged in Q4, accounting for 19% of conversations.',
    bodyText: 'This off-topic weather discussion is likely affecting resolution rates and customer satisfaction.',
    cardAlert: '"No Snow" topic (19%) was not present in previous quarters and represents off-topic conversations about weather.',
  },
  'kyc-agent-016': {
    topicKey: 'manual-escalation',
    displayName: '"Manual Escalation"',
    percentage: 28,
    headerText: 'Escalation behavior has drifted significantly in Q4 — "Manual Escalation" now accounts for 28% of processing volume.',
    bodyText: 'Escalation rate has increased from 8% to 23% over 6 weeks. This agent is routing a disproportionate number of credit applications to manual review, doubling processing time and degrading customer satisfaction.',
    cardAlert: '"Manual Escalation" category (28%) grew from near-zero in Q3. The agent is systematically over-escalating credit applications that should qualify for automated approval.',
  },
}

// Topic distributions for KYC Verification Agent
// Q3 = healthy baseline; Q4 shows drift toward manual escalation
topicDistributions['kyc-agent-016'] = {
  '2024-Q1': {
    'standard-verification': 58,
    'document-review': 28,
    'risk-scoring': 14,
  },
  '2024-Q2': {
    'standard-verification': 57,
    'document-review': 29,
    'risk-scoring': 14,
  },
  '2024-Q3': {
    'standard-verification': 55,
    'document-review': 30,
    'risk-scoring': 15,
  },
  '2024-Q4': {
    'standard-verification': 38,
    'document-review': 22,
    'risk-scoring': 12,
    'manual-escalation': 28, // NEW — this is the drift
  },
}

// Sample processing events for KYC Verification Agent (API-based, not chat)
sampleConversations['kyc-agent-016'] = [
  {
    id: 'kyc-conv-001',
    timestamp: '2024-12-06T14:22:00Z',
    channel: 'api',
    topic: 'manual-escalation',
    sentiment: 'neutral',
    resolved: true,
    duration: 4820,
    messages: [
      { role: 'user', content: 'Credit application submitted — residential mortgage $485,000, 15-year fixed, applicant income documentation attached.' },
      { role: 'agent', content: 'Documents classified: proof of income ✓, government ID ✓, bank statements ✓. Identity verification: VERIFIED (94%). Risk score: 52/100. Decision: Escalated to manual review — score near automated approval boundary.' },
    ],
    reasoning: [
      { step: 1, thought: 'All required documents present and legible', action: 'Classify documents and validate completeness', confidence: 0.99 },
      { step: 2, thought: 'Identity verified with high confidence', action: 'Call external identity verification API', confidence: 0.94 },
      { step: 3, thought: 'Risk score 52 — near threshold of 50', action: 'Compute risk score from income, credit, and LTV data', confidence: 0.71 },
      { step: 4, thought: 'Borderline score — insufficient confidence for automated approval', action: 'Escalate to manual review queue', confidence: 0.68 },
    ],
  },
  {
    id: 'kyc-conv-002',
    timestamp: '2024-12-06T13:05:00Z',
    channel: 'api',
    topic: 'standard-verification',
    sentiment: 'positive',
    resolved: true,
    duration: 3210,
    messages: [
      { role: 'user', content: 'Credit application submitted — auto loan $22,000, 48-month term, full documentation package.' },
      { role: 'agent', content: 'Documents classified: paystub ✓, government ID ✓. Identity verification: VERIFIED (99%). Risk score: 29/100. Decision: Approved — clean profile, all verification checks passed.' },
    ],
    reasoning: [
      { step: 1, thought: 'Complete documentation set received', action: 'Classify and validate 2 documents', confidence: 0.99 },
      { step: 2, thought: 'Strong identity match with no anomalies', action: 'Call external identity verification API', confidence: 0.99 },
      { step: 3, thought: 'Low risk score, well below approval threshold', action: 'Compute risk score', confidence: 0.96 },
      { step: 4, thought: 'All checks passed — automated approval appropriate', action: 'Issue approval decision', confidence: 0.97 },
    ],
  },
  {
    id: 'kyc-conv-003',
    timestamp: '2024-12-06T11:48:00Z',
    channel: 'api',
    topic: 'manual-escalation',
    sentiment: 'neutral',
    resolved: true,
    duration: 5140,
    messages: [
      { role: 'user', content: 'Credit application submitted — HELOC $125,000, applicant owns primary residence.' },
      { role: 'agent', content: 'Documents classified: all present ✓. Identity verification: VERIFIED (91%). Risk score: 61/100. Decision: Escalated — elevated risk score for HELOC; requires senior underwriter review.' },
    ],
    reasoning: [
      { step: 1, thought: 'HELOC application — higher documentation standard applies', action: 'Classify and validate document set', confidence: 0.97 },
      { step: 2, thought: 'Identity verified, slight confidence reduction due to address mismatch', action: 'Call identity verification API', confidence: 0.91 },
      { step: 3, thought: 'Risk score 61 — above threshold, HELOC policy requires manual review above 55', action: 'Compute risk score with LTV analysis', confidence: 0.88 },
      { step: 4, thought: 'Policy mandates escalation at this score for secured lending', action: 'Route to senior underwriter queue', confidence: 0.93 },
    ],
  },
  {
    id: 'kyc-conv-004',
    timestamp: '2024-12-05T16:30:00Z',
    channel: 'api',
    topic: 'document-review',
    sentiment: 'neutral',
    resolved: false,
    duration: 2180,
    messages: [
      { role: 'user', content: 'Credit application submitted — mortgage refinance $265,000. Document resubmission (bank statement).' },
      { role: 'agent', content: 'Document classification failed — bank statement confidence score 57%, below minimum threshold of 85%. Document appears to be a scan of a printout. Applicant must resubmit original digital statement.' },
    ],
    reasoning: [
      { step: 1, thought: 'Resubmission flag — checking updated document quality', action: 'Reclassify updated document set', confidence: 0.82 },
      { step: 2, thought: 'Image quality insufficient for reliable classification', action: 'Flag low-confidence document for resubmission', confidence: 0.94 },
    ],
  },
]

export const getConversationsByAgent = (agentId) => sampleConversations[agentId] || []

export const getTopicsByQuarter = (agentId, quarter) => {
  const agentTopics = topicDistributions[agentId]
  return agentTopics ? agentTopics[quarter] : null
}
