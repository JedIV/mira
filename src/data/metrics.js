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

// Map of agentId → { kpiKey, kpiLabel, baseValue, unit }
// Defines what the "primary KPI" is for each curated agent
const agentKpiConfig = {
  'cs-agent-001': { kpiLabel: 'Resolution Rate', baseValue: 85.2, unit: '%' },
  'fraud-agent-002': { kpiLabel: 'Detection Rate', baseValue: 99.2, unit: '%' },
  'loan-agent-003': { kpiLabel: 'Accuracy Rate', baseValue: 97.8, unit: '%' },
  'it-support-004': { kpiLabel: 'Resolution Rate', baseValue: 82.3, unit: '%' },
  'onboarding-005': { kpiLabel: 'Completion Rate', baseValue: 89.2, unit: '%' },
  'investment-006': { kpiLabel: 'Portfolio Accuracy', baseValue: 94.1, unit: '%' },
  'compliance-007': { kpiLabel: 'Compliance Rate', baseValue: 99.95, unit: '%' },
  'marketing-008': { kpiLabel: 'Conversion Rate', baseValue: 3.8, unit: '%' },
  'collections-009': { kpiLabel: 'Collection Rate', baseValue: 72, unit: '%' },
  'kyc-agent-016': { kpiLabel: 'Escalation Rate', baseValue: 8, unit: '%' },
}

// Domain → default KPI label and typical base value
const domainKpiDefaults = {
  'Retail Banking': { kpiLabel: 'Resolution Rate', baseValue: 84 },
  'Security': { kpiLabel: 'Detection Rate', baseValue: 97 },
  'Consumer Lending': { kpiLabel: 'Approval Accuracy', baseValue: 93 },
  'Compliance': { kpiLabel: 'Compliance Rate', baseValue: 98 },
  'Human Resources': { kpiLabel: 'Resolution Rate', baseValue: 81 },
  'Finance': { kpiLabel: 'Accuracy Rate', baseValue: 96 },
  'Sales': { kpiLabel: 'Forecast Accuracy', baseValue: 78 },
  'Marketing': { kpiLabel: 'Conversion Rate', baseValue: 4.2 },
  'Legal': { kpiLabel: 'Review Accuracy', baseValue: 95 },
  'Engineering': { kpiLabel: 'Deploy Success Rate', baseValue: 97 },
  'Operations': { kpiLabel: 'SLA Compliance', baseValue: 92 },
  'Facilities': { kpiLabel: 'Request Fulfillment', baseValue: 94 },
  'Executive': { kpiLabel: 'Report Accuracy', baseValue: 96 },
  'Infrastructure': { kpiLabel: 'Uptime', baseValue: 99.5 },
  'Data Platform': { kpiLabel: 'Pipeline Success', baseValue: 96 },
  'Analytics': { kpiLabel: 'Report Accuracy', baseValue: 95 },
  'Digital Channels': { kpiLabel: 'Crash-Free Rate', baseValue: 98.5 },
  'Investment Services': { kpiLabel: 'Portfolio Accuracy', baseValue: 94 },
  'Payments': { kpiLabel: 'Processing Success', baseValue: 99.1 },
  'Treasury': { kpiLabel: 'Position Accuracy', baseValue: 98 },
  'Risk': { kpiLabel: 'Model Accuracy', baseValue: 93 },
  'Internal Services': { kpiLabel: 'Resolution Rate', baseValue: 82 },
  'Document Processing': { kpiLabel: 'Extraction Accuracy', baseValue: 97 },
  'Support': { kpiLabel: 'First-Contact Resolution', baseValue: 72 },
  'Regulatory': { kpiLabel: 'Filing Accuracy', baseValue: 99 },
}

import { agentRand } from './prng'
import { getAgentById } from './agents'

// Get the KPI config for any agent (curated or generated)
export function getAgentKpiConfig(agentId) {
  if (agentKpiConfig[agentId]) return agentKpiConfig[agentId]
  const agent = getAgentById(agentId)
  if (!agent) return { kpiLabel: 'Performance', baseValue: 85 }
  const domainDefault = domainKpiDefaults[agent.domain] || { kpiLabel: 'Performance', baseValue: 85 }
  return { kpiLabel: domainDefault.kpiLabel, baseValue: domainDefault.baseValue }
}

// Generate 12-month timeline with the agent's actual KPI + Error Rate
export function generateAgentTimelineData(agentId) {
  const agent = getAgentById(agentId)
  const config = getAgentKpiConfig(agentId)
  const kpiLabel = config.kpiLabel
  const baseKpi = config.baseValue
  const baseError = agent ? agent.operationalHealth.errorRate : 0.5
  const rand = agentRand(agentId + '-timeline')

  // For KYC: escalation rate goes UP (bad), so we invert the story
  const isKyc = agentId === 'kyc-agent-016'
  const isCsAgent = agentId === 'cs-agent-001'

  const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb']
  const data = []

  for (let i = 0; i < 12; i++) {
    const noise = (rand() - 0.5) * 2

    let kpiValue, errorValue

    if (isKyc) {
      // Escalation rate: starts low (~8%), climbs to 23% in Q4+
      const baseEsc = 8
      if (i < 6) {
        kpiValue = baseEsc + noise * 1.5
      } else {
        const progression = (i - 6) / 5
        kpiValue = baseEsc + progression * 15 + noise * 1.5
      }
      errorValue = 0.2 + (rand() - 0.4) * 0.1 // stays flat and low
    } else if (isCsAgent) {
      // Resolution rate: starts ~85%, drops to ~78% in Q4
      if (i < 6) {
        kpiValue = 85.2 + noise * 1.5
      } else {
        const drop = (i - 6) / 5
        kpiValue = 85.2 - drop * 7 + noise * 1.5
      }
      errorValue = 0.3 + (rand() - 0.4) * 0.15
    } else {
      // Generic agents: stable with slight variation
      const isUnhealthy = agent && (agent.businessImpact === 'red' || agent.businessImpact === 'yellow')
      if (isUnhealthy && i >= 8) {
        // Late-period dip for yellow/red agents
        const dip = (i - 8) / 3 * (agent.businessImpact === 'red' ? 8 : 4)
        kpiValue = baseKpi - dip + noise * 1.5
      } else {
        kpiValue = baseKpi + noise * 1.5
      }
      errorValue = baseError + (rand() - 0.4) * (baseError * 0.3)
    }

    // Clamp values
    kpiValue = Math.round(Math.max(0, Math.min(100, kpiValue)) * 10) / 10
    errorValue = Math.round(Math.max(0, errorValue) * 100) / 100

    data.push({
      month: months[i],
      [kpiLabel]: kpiValue,
      'Error Rate': errorValue,
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
