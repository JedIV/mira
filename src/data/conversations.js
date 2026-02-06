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
}

export const getConversationsByAgent = (agentId) => sampleConversations[agentId] || []

export const getTopicsByQuarter = (agentId, quarter) => {
  const agentTopics = topicDistributions[agentId]
  return agentTopics ? agentTopics[quarter] : null
}
