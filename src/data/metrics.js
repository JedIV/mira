// Technical metrics per agent
export const technicalMetrics = {
  'cs-agent-001': {
    uptime: 99.7,
    avgResponseTime: 1.2,
    errorRate: 0.3,
    requestsPerMinute: 245,
    p95Latency: 2.1,
    p99Latency: 3.8,
  },
  'fraud-agent-002': {
    uptime: 99.99,
    avgResponseTime: 0.15,
    errorRate: 0.01,
    requestsPerMinute: 1250,
    p95Latency: 0.25,
    p99Latency: 0.4,
  },
  'loan-agent-003': {
    uptime: 99.5,
    avgResponseTime: 4.5,
    errorRate: 0.8,
    requestsPerMinute: 45,
    p95Latency: 8.2,
    p99Latency: 12.1,
  },
  'it-support-004': {
    uptime: 99.8,
    avgResponseTime: 1.8,
    errorRate: 0.2,
    requestsPerMinute: 85,
    p95Latency: 3.2,
    p99Latency: 5.5,
  },
  'onboarding-005': {
    uptime: 99.6,
    avgResponseTime: 2.1,
    errorRate: 0.5,
    requestsPerMinute: 120,
    p95Latency: 3.8,
    p99Latency: 6.2,
  },
  'investment-006': {
    uptime: 99.4,
    avgResponseTime: 3.2,
    errorRate: 0.6,
    requestsPerMinute: 35,
    p95Latency: 5.5,
    p99Latency: 8.8,
  },
  'compliance-007': {
    uptime: 99.95,
    avgResponseTime: 0.8,
    errorRate: 0.05,
    requestsPerMinute: 890,
    p95Latency: 1.2,
    p99Latency: 2.0,
  },
  'marketing-008': {
    uptime: 99.2,
    avgResponseTime: 2.8,
    errorRate: 1.2,
    requestsPerMinute: 320,
    p95Latency: 4.5,
    p99Latency: 7.2,
  },
  'collections-009': {
    uptime: 97.5,
    avgResponseTime: 3.5,
    errorRate: 2.8,
    requestsPerMinute: 65,
    p95Latency: 6.0,
    p99Latency: 9.5,
  },
  'kyc-agent-016': {
    uptime: 99.9,
    avgResponseTime: 1.1,
    errorRate: 0.2,
    requestsPerMinute: 38,
    p95Latency: 1.8,
    p99Latency: 2.9,
  },
}

// Business metrics per agent
export const businessMetrics = {
  'cs-agent-001': {
    resolutionRate: 78.5,
    throughput: 1250,
    customerSatisfaction: 4.2,
    avgHandleTime: 4.5,
    escalationRate: 12.3,
    firstContactResolution: 65.2,
    // Q4 shows decline
    previousResolutionRate: 85.2,
    previousSatisfaction: 4.5,
  },
  'fraud-agent-002': {
    detectionRate: 99.2,
    falsePositiveRate: 2.1,
    avgDetectionTime: 0.8,
    blockedTransactions: 1247,
    savedAmount: 2450000,
  },
  'loan-agent-003': {
    approvalRate: 68.5,
    avgProcessingTime: 24,
    documentsProcessed: 3420,
    accuracyRate: 97.8,
    throughput: 142,
  },
  'it-support-004': {
    resolutionRate: 82.3,
    avgTicketTime: 12.5,
    ticketsHandled: 856,
    employeeSatisfaction: 4.4,
  },
  'onboarding-005': {
    completionRate: 89.2,
    avgOnboardingTime: 8.5,
    customersOnboarded: 2340,
    dropoffRate: 10.8,
  },
  'kyc-agent-016': {
    // Primary KPI: escalation rate — currently 23%, target <10%, trending up
    escalationRate: 23,
    escalationTarget: 10,
    previousEscalationRate: 8,
    // Secondary KPIs showing business degradation
    manualCheckVolumeChange: 62,     // +62% vs prior quarter
    avgProcessingTime: 4.2,          // days — was 2.1 days (doubled)
    previousProcessingTime: 2.1,
    customerSatisfaction: 3.2,       // dropped from 4.1
    previousSatisfaction: 4.1,
  },
}

// Enterprise-wide metrics
export const enterpriseMetrics = {
  totalAgents: 50,
  activeAgents: 47,
  degradedAgents: 2,
  maintenanceAgents: 1,
  totalInteractions: 125000,
  avgSatisfaction: 4.1,
  costSavings: 2400000,
  incidentRate: 0.8,
  platforms: 6,
  teams: 12,
}

// Time series data generator
export function generateTimeSeriesData(months = 12, baseValue = 100, variance = 0.1, q4Drop = false) {
  const data = []
  const now = new Date()

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    let value = baseValue

    // Add variance
    value += (Math.random() - 0.5) * baseValue * variance

    // Q4 drop simulation (Oct, Nov, Dec)
    if (q4Drop && date.getMonth() >= 9) {
      value = value * 0.85
    }

    data.push({
      date: date.toISOString().slice(0, 7),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      value: Math.round(value * 10) / 10,
    })
  }

  return data
}

// Live activity data (hourly for last 24 hours)
export function generateLiveActivityData() {
  const data = []
  const now = new Date()

  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
    const hourNum = hour.getHours()

    // Simulate business hours pattern
    let baseActivity = 500
    if (hourNum >= 9 && hourNum <= 17) {
      baseActivity = 2000 + Math.random() * 500
    } else if (hourNum >= 6 && hourNum <= 21) {
      baseActivity = 800 + Math.random() * 300
    } else {
      baseActivity = 200 + Math.random() * 100
    }

    data.push({
      time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      hour: hourNum,
      interactions: Math.round(baseActivity),
      errors: Math.round(baseActivity * 0.003),
    })
  }

  return data
}

// KYC-specific timeline: fixed deterministic data showing the "healthy ops / failing business" story.
// Business Impact falls from ~83 to ~42 over 6 months while Operational Health stays flat ~90.
// This is the core demo moment: the agent is technically fine but missing business targets badly.
export const kycTimelineData = [
  { month: 'Mar', 'Business Impact': 84.2, 'Operational Health': 91.1, 'Operational Risk': 12.4 },
  { month: 'Apr', 'Business Impact': 83.5, 'Operational Health': 90.8, 'Operational Risk': 13.1 },
  { month: 'May', 'Business Impact': 82.8, 'Operational Health': 91.4, 'Operational Risk': 12.7 },
  { month: 'Jun', 'Business Impact': 83.1, 'Operational Health': 90.6, 'Operational Risk': 13.5 },
  { month: 'Jul', 'Business Impact': 82.4, 'Operational Health': 91.2, 'Operational Risk': 12.9 },
  { month: 'Aug', 'Business Impact': 81.9, 'Operational Health': 90.9, 'Operational Risk': 13.8 },
  // Q4 starts: escalation rate begins climbing, business impact diverges from op health
  { month: 'Sep', 'Business Impact': 78.3, 'Operational Health': 91.5, 'Operational Risk': 13.2 },
  { month: 'Oct', 'Business Impact': 70.1, 'Operational Health': 91.8, 'Operational Risk': 12.6 },
  { month: 'Nov', 'Business Impact': 60.4, 'Operational Health': 90.7, 'Operational Risk': 13.9 },
  { month: 'Dec', 'Business Impact': 51.2, 'Operational Health': 91.3, 'Operational Risk': 14.1 },
  { month: 'Jan', 'Business Impact': 45.8, 'Operational Health': 90.5, 'Operational Risk': 13.7 },
  { month: 'Feb', 'Business Impact': 41.6, 'Operational Health': 91.0, 'Operational Risk': 13.4 },
]

// Agent 360 timeline data: 3 normalized series (Business Impact, Op Health, Op Risk)
export function generateAgentTimelineData(months = 12, q4Drop = false) {
  if (q4Drop === 'biz-only') return kycTimelineData

  const data = []
  const now = new Date()

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    let bizImpact = 82 + (Math.random() - 0.3) * 10
    let opHealth = 90 + (Math.random() - 0.4) * 8
    let opRisk = 15 + (Math.random() - 0.5) * 10

    if (q4Drop && date.getMonth() >= 9) {
      bizImpact = bizImpact * 0.85
      opHealth = opHealth * 0.92
      opRisk = opRisk * 1.6
    }

    data.push({
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      'Business Impact': Math.round(Math.min(100, Math.max(0, bizImpact)) * 10) / 10,
      'Operational Health': Math.round(Math.min(100, Math.max(0, opHealth)) * 10) / 10,
      'Operational Risk': Math.round(Math.min(100, Math.max(0, opRisk)) * 10) / 10,
    })
  }

  return data
}

// Critical agents with their status
export const criticalAgents = [
  { id: 'fraud-agent-002', name: 'Fraud Detection', uptime: 99.99, responseTime: 0.15, errorRate: 0.01, status: 'healthy' },
  { id: 'kyc-agent-016', name: 'KYC Verification', uptime: 99.9, responseTime: 1.1, errorRate: 0.2, status: 'healthy' },
  { id: 'cs-agent-001', name: 'Customer Service', uptime: 99.7, responseTime: 1.2, errorRate: 0.3, status: 'healthy' },
  { id: 'compliance-007', name: 'Compliance Monitor', uptime: 99.95, responseTime: 0.8, errorRate: 0.05, status: 'healthy' },
  { id: 'loan-agent-003', name: 'Loan Processing', uptime: 99.5, responseTime: 4.5, errorRate: 0.8, status: 'warning' },
]
