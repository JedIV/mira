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

    // Simulate business hours pattern (~75K requests/day from 10K users)
    let baseActivity = 200
    if (hourNum >= 9 && hourNum <= 17) {
      baseActivity = 7500 + Math.random() * 2500
    } else if (hourNum >= 6 && hourNum <= 21) {
      baseActivity = 2000 + Math.random() * 800
    } else {
      baseActivity = 200 + Math.random() * 150
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

// Generate weekly labels for 6 months (~26 weeks)
function weekLabels() {
  const labels = []
  const now = new Date()
  for (let i = 25; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
    labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
  }
  return labels
}

// Generate weekly business KPI timeline data
export function generateBusinessTimelineData(agentId) {
  const agent = getAgentById(agentId)
  const config = getAgentKpiConfig(agentId)
  const kpiLabel = config.kpiLabel
  const baseKpi = config.baseValue
  const rand = agentRand(agentId + '-biz-timeline')
  const weeks = weekLabels()

  const isKyc = agentId === 'kyc-agent-016'
  const isCsAgent = agentId === 'cs-agent-001'

  return weeks.map((week, i) => {
    const noise = (rand() - 0.5) * 3
    let kpiValue

    if (isKyc) {
      // Escalation rate: stable ~8% for first 12 weeks, climbs to max 23% by final week
      const baseEsc = 8
      const maxEsc = 23
      if (i < 12) {
        kpiValue = baseEsc + noise * 1.2
      } else {
        const progression = (i - 12) / 13
        const target = baseEsc + progression * (maxEsc - baseEsc)
        kpiValue = Math.min(maxEsc, target + noise * 1.5)
      }
    } else if (isCsAgent) {
      // Resolution rate: stable ~85%, drops from mid-period onward
      if (i < 12) {
        kpiValue = 85.2 + noise * 1.8
      } else {
        const drop = (i - 12) / 13
        kpiValue = 85.2 - drop * 7 + noise * 2
      }
    } else {
      const isUnhealthy = agent && (agent.businessImpact === 'red' || agent.businessImpact === 'yellow')
      if (isUnhealthy && i >= 18) {
        const dip = (i - 18) / 7 * (agent.businessImpact === 'red' ? 8 : 4)
        kpiValue = baseKpi - dip + noise * 1.5
      } else {
        kpiValue = baseKpi + noise * 1.5
      }
    }

    kpiValue = Math.round(Math.max(0, Math.min(100, kpiValue)) * 10) / 10
    return { week, [kpiLabel]: kpiValue }
  })
}

// Generate 90-day uptime status data (status bar like status.claude.com)
// Each day: { date, label, status: 'operational'|'degraded'|'minor'|'major', uptimePercent }
export function generateUptimeData(agentId) {
  const agent = getAgentById(agentId)
  const rand = agentRand(agentId + '-uptime')
  const isDegraded = agent && agent.status === 'degraded'
  const baseUptime = agent ? (agent.operationalHealth.errorRate > 1.5 ? 0.96 : 0.998) : 0.998
  const days = []

  for (let i = 89; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const r = rand()

    let status = 'operational'
    let uptimePercent = 100

    // Degraded agents get more incidents
    const incidentChance = isDegraded ? 0.12 : 0.04

    if (r < incidentChance * 0.15) {
      status = 'major'
      uptimePercent = Math.round((85 + rand() * 10) * 10) / 10
    } else if (r < incidentChance * 0.5) {
      status = 'degraded'
      uptimePercent = Math.round((95 + rand() * 4) * 10) / 10
    } else if (r < incidentChance) {
      status = 'minor'
      uptimePercent = Math.round((98 + rand() * 1.8) * 10) / 10
    }

    days.push({ date: d.toISOString().slice(0, 10), label, status, uptimePercent })
  }

  // Compute overall uptime across 90 days
  const avgUptime = Math.round(days.reduce((sum, d) => sum + d.uptimePercent, 0) / days.length * 100) / 100

  return { days, avgUptime }
}

// KPI target values for each curated agent's primary metric
export const agentKpiTargets = {
  'cs-agent-001': 82,
  'fraud-agent-002': 99,
  'loan-agent-003': 95,
  'it-support-004': 80,
  'onboarding-005': 85,
  'investment-006': 90,
  'compliance-007': 99,
  'marketing-008': 3.0,
  'collections-009': 70,
  'kyc-agent-016': 10, // escalation rate — lower is better
}

// Get the target for any agent
export function getAgentKpiTarget(agentId) {
  if (agentKpiTargets[agentId] != null) return agentKpiTargets[agentId]
  const config = getAgentKpiConfig(agentId)
  // Generated agents: target is 5% below base
  return Math.round((config.baseValue * 0.95) * 10) / 10
}

// Whether lower values are better for this agent's KPI (e.g. escalation rate)
export function isLowerBetter(agentId) {
  return agentId === 'kyc-agent-016'
}

// Get all KPIs for an agent as an array of { label, value, target?, previous?, unit }
export function getAllAgentKpis(agentId) {
  const bm = businessMetrics[agentId]
  if (!bm) {
    const config = getAgentKpiConfig(agentId)
    return [{ label: config.kpiLabel, value: config.baseValue, target: getAgentKpiTarget(agentId), unit: '%' }]
  }

  if (agentId === 'kyc-agent-016') {
    return [
      { label: 'Escalation Rate', value: bm.escalationRate, target: bm.escalationTarget, previous: bm.previousEscalationRate, unit: '%', lowerBetter: true },
      { label: 'Avg Processing Time', value: bm.avgProcessingTime, previous: bm.previousProcessingTime, unit: ' days', lowerBetter: true },
      { label: 'Customer Satisfaction', value: bm.customerSatisfaction, previous: bm.previousSatisfaction, unit: '/5' },
      { label: 'Manual Volume Change', value: bm.manualCheckVolumeChange, unit: '%', lowerBetter: true },
    ]
  }
  if (agentId === 'cs-agent-001') {
    return [
      { label: 'Resolution Rate', value: bm.resolutionRate, target: 82, previous: bm.previousResolutionRate, unit: '%' },
      { label: 'Customer Satisfaction', value: bm.customerSatisfaction, previous: bm.previousSatisfaction, unit: '/5' },
      { label: 'First Contact Resolution', value: bm.firstContactResolution, unit: '%' },
      { label: 'Escalation Rate', value: bm.escalationRate, unit: '%', lowerBetter: true },
    ]
  }
  if (agentId === 'fraud-agent-002') {
    return [
      { label: 'Detection Rate', value: bm.detectionRate, target: 99, unit: '%' },
      { label: 'False Positive Rate', value: bm.falsePositiveRate, unit: '%', lowerBetter: true },
      { label: 'Avg Detection Time', value: bm.avgDetectionTime, unit: 's', lowerBetter: true },
      { label: 'Blocked Transactions', value: bm.blockedTransactions, unit: '' },
    ]
  }
  if (agentId === 'loan-agent-003') {
    return [
      { label: 'Accuracy Rate', value: bm.accuracyRate, target: 95, unit: '%' },
      { label: 'Approval Rate', value: bm.approvalRate, unit: '%' },
      { label: 'Processing Time', value: bm.avgProcessingTime, unit: 'h', lowerBetter: true },
      { label: 'Documents Processed', value: bm.documentsProcessed, unit: '' },
    ]
  }
  if (agentId === 'onboarding-005') {
    return [
      { label: 'Completion Rate', value: bm.completionRate, target: 85, unit: '%' },
      { label: 'Avg Onboarding Time', value: bm.avgOnboardingTime, unit: ' min', lowerBetter: true },
      { label: 'Customers Onboarded', value: bm.customersOnboarded, unit: '' },
      { label: 'Drop-off Rate', value: bm.dropoffRate, unit: '%', lowerBetter: true },
    ]
  }
  if (agentId === 'it-support-004') {
    return [
      { label: 'Resolution Rate', value: bm.resolutionRate, target: 80, unit: '%' },
      { label: 'Avg Ticket Time', value: bm.avgTicketTime, unit: ' min', lowerBetter: true },
      { label: 'Tickets Handled', value: bm.ticketsHandled, unit: '' },
      { label: 'Employee Satisfaction', value: bm.employeeSatisfaction, unit: '/5' },
    ]
  }

  // Generic: just return what's available
  const config = getAgentKpiConfig(agentId)
  return [{ label: config.kpiLabel, value: config.baseValue, target: getAgentKpiTarget(agentId), unit: '%' }]
}

// Generate enterprise-wide KPI data (all key agents on one chart)
export function generateEnterpriseKpiData() {
  const weeks = weekLabels()
  const agentConfigs = [
    { id: 'fraud-agent-002', label: 'Fraud Detection Rate' },
    { id: 'cs-agent-001', label: 'CS Resolution Rate' },
    { id: 'loan-agent-003', label: 'Loan Accuracy Rate' },
    { id: 'kyc-agent-016', label: 'KYC Escalation Rate' },
    { id: 'onboarding-005', label: 'Onboarding Completion' },
  ]

  // Generate per-agent timelines
  const agentData = {}
  agentConfigs.forEach(({ id }) => {
    agentData[id] = generateBusinessTimelineData(id)
  })

  return weeks.map((week, i) => {
    const point = { week }
    agentConfigs.forEach(({ id, label }) => {
      const agentWeek = agentData[id][i]
      const config = getAgentKpiConfig(id)
      point[label] = agentWeek[config.kpiLabel]
    })
    return point
  })
}

// Get KPI status (on-target, approaching, missing) for an agent
export function getAgentKpiStatus(agentId) {
  const config = getAgentKpiConfig(agentId)
  const target = getAgentKpiTarget(agentId)
  const current = config.baseValue
  const lower = isLowerBetter(agentId)

  // For curated agents with businessMetrics, use live value
  const bm = businessMetrics[agentId]
  let liveValue = current
  if (bm) {
    if (agentId === 'kyc-agent-016') liveValue = bm.escalationRate
    else if (agentId === 'cs-agent-001') liveValue = bm.resolutionRate
    else if (agentId === 'fraud-agent-002') liveValue = bm.detectionRate
    else if (agentId === 'loan-agent-003') liveValue = bm.accuracyRate
    else if (agentId === 'onboarding-005') liveValue = bm.completionRate
    else if (agentId === 'it-support-004') liveValue = bm.resolutionRate
  }

  if (lower) {
    if (liveValue <= target) return 'on-target'
    if (liveValue <= target * 1.5) return 'approaching'
    return 'missing'
  } else {
    if (liveValue >= target) return 'on-target'
    if (liveValue >= target * 0.95) return 'approaching'
    return 'missing'
  }
}

// KPI events for KYC agent (timeline of threshold breaches)
export const kycKpiEvents = [
  { date: 'Dec 15, 2025', event: 'December model release deployed', type: 'deployment' },
  { date: 'Dec 28, 2025', event: 'Escalation rate crossed 10% threshold', type: 'breach' },
  { date: 'Jan 10, 2026', event: 'Processing time exceeded 3-day SLA', type: 'breach' },
  { date: 'Jan 22, 2026', event: 'CSAT dropped below 3.5 target', type: 'breach' },
  { date: 'Feb 5, 2026', event: 'Manual check volume +50% vs baseline', type: 'breach' },
  { date: 'Feb 18, 2026', event: 'Escalation rate reached 20%', type: 'breach' },
  { date: 'Mar 1, 2026', event: 'Escalation rate peaked at 23%', type: 'breach' },
]

// Critical agents with their status
export const criticalAgents = [
  { id: 'fraud-agent-002', name: 'Fraud Detection', uptime: 99.99, responseTime: 0.15, errorRate: 0.01, status: 'healthy' },
  { id: 'kyc-agent-016', name: 'KYC Verification', uptime: 99.9, responseTime: 1.1, errorRate: 0.2, status: 'healthy' },
  { id: 'cs-agent-001', name: 'Customer Service', uptime: 99.7, responseTime: 1.2, errorRate: 0.3, status: 'healthy' },
  { id: 'compliance-007', name: 'Compliance Monitor', uptime: 99.95, responseTime: 0.8, errorRate: 0.05, status: 'healthy' },
  { id: 'loan-agent-003', name: 'Loan Processing', uptime: 99.5, responseTime: 4.5, errorRate: 0.8, status: 'degraded' },
]
