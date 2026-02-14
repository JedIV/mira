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

// Pre-generate sessions for key agents
export const sessionsByAgent = {
  'cs-agent-001': generateSessions('cs-agent-001', 25),
  'fraud-agent-002': generateSessions('fraud-agent-002', 20),
  'loan-agent-003': generateSessions('loan-agent-003', 15),
  'it-support-004': generateSessions('it-support-004', 18),
  'onboarding-005': generateSessions('onboarding-005', 12),
  'collections-009': generateSessions('collections-009', 10),
}

export const getSessionsForAgent = (agentId) => {
  return sessionsByAgent[agentId] || generateSessions(agentId, 15)
}

export { stepTypeLabels, stepTypeColors }
