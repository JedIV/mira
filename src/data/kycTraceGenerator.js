/**
 * KYC Trace Generator — Self-contained module (no Mira imports)
 *
 * Generates fake session traces in Dataiku span format for the KYC
 * verification flow, then derives decision-flow statistics and
 * UI-ready conversation objects from those traces.
 *
 * Can be run standalone or imported into the Mira app.
 */

// ─── Seeded PRNG (self-contained) ────────────────────────────────────────────

function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seedFromString(str) {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0
  }
  return hash >>> 0
}

// ─── Agent topology ──────────────────────────────────────────────────────────
// Mirrors the node/edge graph in TraceFlowDiagram — but expressed as tool IDs
// that appear inside span attributes.

const TOOL_IDS = {
  IDENTITY_VERIFIER: 'identity_verifier',
  US_PASSPORT: 'us_passport_agent',
  NON_US_PASSPORT: 'non_us_passport_agent',
}

// ─── Content pools for realistic messages ────────────────────────────────────

const LOAN_TYPES = [
  { type: 'Mortgage', amountRange: [180000, 750000], terms: ['15-year fixed', '30-year fixed'] },
  { type: 'Auto loan', amountRange: [12000, 65000], terms: ['36-month', '48-month', '60-month'] },
  { type: 'Personal loan', amountRange: [5000, 50000], terms: ['24-month', '36-month', '48-month'] },
  { type: 'HELOC', amountRange: [50000, 400000], terms: [] },
  { type: 'Credit card application', amountRange: [5000, 30000], terms: [] },
  { type: 'Line of credit', amountRange: [10000, 100000], terms: [] },
]

const US_CONTEXTS = [
  'homeowner {years} years at same address',
  'employed at same company {years} years',
  'existing customer since {year}',
  'current address {years} years',
]

const NON_US_PASSPORTS = [
  'German', 'Brazilian', 'Canadian', 'UK', 'Indian', 'Japanese',
  'French', 'Mexican', 'Korean', 'Australian', 'Nigerian', 'Chinese',
]

const NON_US_CONTEXTS_APPROVED = [
  'US resident {years} years',
  'US resident {years} years, renting',
  'long-term US resident, homeowner',
  'US resident since {year}, employed locally',
]

const NON_US_CONTEXTS_ESCALATED = [
  'relocated to US {months} months ago',
  'US resident {years} years, recently moved',
  'recent address change',
  'new to US, temporary housing',
]

const ESCALATION_REASONS = [
  'confidence {conf}. Recent address not in postal database.',
  'confidence {conf}. Unit format not matching parser.',
  'confidence {conf}. Address formatting discrepancy.',
  'confidence {conf}. International address format mismatch.',
]

const DOCS_PRESENT = [
  'paystub', 'proof of income', 'bank statements', 'W-2',
  'property deed', 'tax returns',
]

// ─── Span builder helpers ────────────────────────────────────────────────────

function makeSpan(name, attrs, outputs, children, offsetSec, durationMs) {
  const span = {
    type: 'span',
    name,
    begin: offsetSec,          // seconds from t=0 — reformatted at render time
    end: offsetSec + durationMs / 1000,
    duration: durationMs,
    attributes: attrs || {},
  }
  if (outputs) span.outputs = outputs
  if (children && children.length) span.children = children
  return span
}

// ─── Single-session trace generator ──────────────────────────────────────────

function generateOneTrace(rand, sessionIndex, path) {
  // path = { passportType: 'US'|'non-US', outcome: 'auto_approve'|'manual_escalation' }

  const appId = `KYC-2026-${String(sessionIndex).padStart(5, '0')}`
  const offsetBase = Math.floor(rand() * 86400) // random second within a day

  // Pick loan type
  const loan = LOAN_TYPES[Math.floor(rand() * LOAN_TYPES.length)]
  const amount = Math.round((loan.amountRange[0] + rand() * (loan.amountRange[1] - loan.amountRange[0])) / 1000) * 1000
  const term = loan.terms.length ? loan.terms[Math.floor(rand() * loan.terms.length)] : null
  const amountStr = `$${amount.toLocaleString('en-US')}`

  const isUS = path.passportType === 'US'
  const isEscalated = path.outcome === 'manual_escalation'

  // Passport & context
  let passportLabel, context
  if (isUS) {
    passportLabel = 'US passport'
    const ctx = US_CONTEXTS[Math.floor(rand() * US_CONTEXTS.length)]
    const years = 2 + Math.floor(rand() * 14)
    const year = 2025 - years
    context = ctx.replace('{years}', String(years)).replace('{year}', String(year))
  } else {
    const nationality = NON_US_PASSPORTS[Math.floor(rand() * NON_US_PASSPORTS.length)]
    passportLabel = `${nationality} passport`
    if (isEscalated) {
      const ctx = NON_US_CONTEXTS_ESCALATED[Math.floor(rand() * NON_US_CONTEXTS_ESCALATED.length)]
      const months = 1 + Math.floor(rand() * 11)
      const years = 1 + Math.floor(rand() * 3)
      context = ctx.replace('{months}', String(months)).replace('{years}', String(years))
    } else {
      const ctx = NON_US_CONTEXTS_APPROVED[Math.floor(rand() * NON_US_CONTEXTS_APPROVED.length)]
      const years = 4 + Math.floor(rand() * 12)
      const year = 2025 - years
      context = ctx.replace('{years}', String(years)).replace('{year}', String(year))
    }
  }

  // Confidence scores
  const identityConf = isUS ? 0.97 + rand() * 0.03 : 0.91 + rand() * 0.08
  let addressConf
  if (isEscalated) {
    addressConf = 0.55 + rand() * 0.23 // 0.55–0.78
  } else {
    addressConf = 0.86 + rand() * 0.14 // 0.86–1.0
  }
  const addressVerified = !isEscalated

  // Decision confidence
  const decisionConf = isEscalated ? 0.55 + rand() * 0.15 : 0.92 + rand() * 0.08

  // Build user input message
  let userMsg = `${loan.type} ${amountStr}`
  if (term) userMsg += `, ${term} term`
  userMsg += `. Applicant holds ${passportLabel}, ${context}.`

  // Build agent output message
  const toolId = isUS ? TOOL_IDS.US_PASSPORT : TOOL_IDS.NON_US_PASSPORT
  const routeLabel = isUS ? 'US Passport Agent' : 'Non-US Passport Agent'
  const passportCheck = isUS ? 'Passport (US) \u2713' : 'Passport (non-US) \u2713'
  const extraDocs = []
  const numDocs = 1 + Math.floor(rand() * 2)
  for (let d = 0; d < numDocs; d++) {
    extraDocs.push(DOCS_PRESENT[Math.floor(rand() * DOCS_PRESENT.length)])
  }
  const docList = [passportCheck, ...extraDocs.map(d => `${d} \u2713`)].join(', ')

  let agentMsg = `${docList}. Routed to ${routeLabel}. Identity: VERIFIED (${Math.round(identityConf * 100)}%). `
  if (isEscalated) {
    const reason = ESCALATION_REASONS[Math.floor(rand() * ESCALATION_REASONS.length)]
      .replace('{conf}', addressConf.toFixed(2))
    agentMsg += `Address: FAILED \u2014 ${reason} Decision: Escalated to manual review.`
  } else {
    agentMsg += `Address: PASSED (${addressConf.toFixed(2)}). Decision: Approved.`
  }

  // Build spans
  const iter1Duration = 800 + Math.floor(rand() * 400)
  const iter2Duration = 1200 + Math.floor(rand() * 600)
  const iter3Duration = 400 + Math.floor(rand() * 300)
  const totalDuration = iter1Duration + iter2Duration + iter3Duration + Math.floor(rand() * 1000)

  const iter1 = makeSpan('DKU_AGENT_ITERATION', { iterationNumber: 1 }, null, [
    makeSpan('DKU_AGENT_LLM_CALL', { purpose: 'classify_documents' }, null, null, offsetBase, iter1Duration * 0.4),
    makeSpan('DKU_AGENT_TOOL_CALLS', {}, null, [
      makeSpan('DKU_MANAGED_TOOL_CALL', { toolId: TOOL_IDS.IDENTITY_VERIFIER }, {
        passportType: path.passportType,
        confidence: Math.round(identityConf * 100) / 100,
      }, null, offsetBase + iter1Duration * 0.4, iter1Duration * 0.6),
    ], offsetBase + iter1Duration * 0.4, iter1Duration * 0.6),
  ], offsetBase, iter1Duration)

  const iter2Start = offsetBase + iter1Duration / 1000
  const iter2 = makeSpan('DKU_AGENT_ITERATION', { iterationNumber: 2 }, null, [
    makeSpan('DKU_AGENT_LLM_CALL', { purpose: 'route_to_subagent' }, null, null, iter2Start, iter2Duration * 0.3),
    makeSpan('DKU_AGENT_TOOL_CALLS', {}, null, [
      makeSpan('DKU_MANAGED_TOOL_CALL', { toolId: toolId }, {
        addressConfidence: Math.round(addressConf * 100) / 100,
        addressVerified,
      }, null, iter2Start + iter2Duration * 0.3, iter2Duration * 0.7),
    ], iter2Start + iter2Duration * 0.3, iter2Duration * 0.7),
  ], iter2Start, iter2Duration)

  const iter3Start = iter2Start + iter2Duration / 1000
  const iter3 = makeSpan('DKU_AGENT_ITERATION', { iterationNumber: 3 }, null, [
    makeSpan('DKU_AGENT_LLM_CALL', { purpose: 'final_decision' }, {
      decision: path.outcome,
      confidence: Math.round(decisionConf * 100) / 100,
    }, null, iter3Start, iter3Duration),
  ], iter3Start, iter3Duration)

  return {
    type: 'span',
    name: 'DKU_AGENT_CALL',
    begin: offsetBase,
    end: offsetBase + totalDuration / 1000,
    duration: totalDuration,
    attributes: { class: 'KYCOrchestrator', applicationId: appId },
    children: [iter1, iter2, iter3],
    // Denormalized for convenience — not part of Dataiku span format
    _meta: {
      userMsg,
      agentMsg,
      passportType: path.passportType,
      outcome: path.outcome,
      addressConf: Math.round(addressConf * 100) / 100,
      identityConf: Math.round(identityConf * 100) / 100,
      decisionConf: Math.round(decisionConf * 100) / 100,
    },
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Generate a set of KYC traces with a specified distribution.
 *
 * @param {Object} config
 * @param {string} config.seed          - PRNG seed string
 * @param {number} config.usApproved    - count of US-passport approved sessions
 * @param {number} config.usEscalated   - count of US-passport escalated sessions
 * @param {number} config.nonUsApproved - count of non-US-passport approved sessions
 * @param {number} config.nonUsEscalated- count of non-US-passport escalated sessions
 * @returns {Object[]} array of trace span objects
 */
export function generateTraceSet(config) {
  const rand = mulberry32(seedFromString(config.seed))
  const traces = []
  let idx = 0

  const paths = [
    { count: config.usApproved, passportType: 'US', outcome: 'auto_approve' },
    { count: config.usEscalated, passportType: 'US', outcome: 'manual_escalation' },
    { count: config.nonUsApproved, passportType: 'non-US', outcome: 'auto_approve' },
    { count: config.nonUsEscalated, passportType: 'non-US', outcome: 'manual_escalation' },
  ]

  for (const p of paths) {
    for (let i = 0; i < p.count; i++) {
      traces.push(generateOneTrace(rand, idx++, { passportType: p.passportType, outcome: p.outcome }))
    }
  }

  // Shuffle so outcomes are interleaved
  for (let i = traces.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[traces[i], traces[j]] = [traces[j], traces[i]]
  }

  return traces
}

/**
 * Walk span trees and compute node/edge counts matching TraceFlowDiagram's
 * data format:
 *   { nodes: { nodeId: count }, edges: { 'from->to': count } }
 */
export function computeFlowStats(traces) {
  const nodes = {
    application: 0,
    identity: 0,
    passport_us: 0,
    passport_non_us: 0,
    auto_approve: 0,
    manual_escalation: 0,
  }
  const edges = {
    'application->identity': 0,
    'identity->passport_us': 0,
    'identity->passport_non_us': 0,
    'passport_us->auto_approve': 0,
    'passport_us->manual_escalation': 0,
    'passport_non_us->auto_approve': 0,
    'passport_non_us->manual_escalation': 0,
  }

  for (const trace of traces) {
    // Every trace goes through application → identity
    nodes.application++
    nodes.identity++
    edges['application->identity']++

    // Find the identity verifier tool call (iteration 1)
    let passportType = null
    let subagentToolId = null
    let decision = null

    for (const iter of trace.children || []) {
      for (const child of iter.children || []) {
        if (child.name === 'DKU_AGENT_TOOL_CALLS') {
          for (const tool of child.children || []) {
            if (tool.attributes?.toolId === TOOL_IDS.IDENTITY_VERIFIER) {
              passportType = tool.outputs?.passportType
            } else if (tool.attributes?.toolId === TOOL_IDS.US_PASSPORT) {
              subagentToolId = 'passport_us'
            } else if (tool.attributes?.toolId === TOOL_IDS.NON_US_PASSPORT) {
              subagentToolId = 'passport_non_us'
            }
          }
        }
        if (child.name === 'DKU_AGENT_LLM_CALL' && child.outputs?.decision) {
          decision = child.outputs.decision
        }
      }
    }

    // Route through passport node
    const passportNode = passportType === 'US' ? 'passport_us' : 'passport_non_us'
    nodes[passportNode]++
    edges[`identity->${passportNode}`]++

    // Outcome
    const outcomeNode = decision || 'auto_approve'
    nodes[outcomeNode]++
    edges[`${passportNode}->${outcomeNode}`]++
  }

  return { nodes, edges }
}

/**
 * Pick n representative traces — mix of outcomes and passport types.
 */
export function sampleTraces(traces, n) {
  // Bucket by outcome
  const escalated = traces.filter(t => t._meta?.outcome === 'manual_escalation')
  const approved = traces.filter(t => t._meta?.outcome === 'auto_approve')

  // Pick ~40% escalated, ~60% approved to show the problem
  const escCount = Math.min(Math.ceil(n * 0.4), escalated.length)
  const appCount = Math.min(n - escCount, approved.length)

  const sampled = []
  // Spread evenly through the arrays
  for (let i = 0; i < escCount; i++) {
    const idx = Math.floor((i / escCount) * escalated.length)
    sampled.push(escalated[idx])
  }
  for (let i = 0; i < appCount; i++) {
    const idx = Math.floor((i / appCount) * approved.length)
    sampled.push(approved[idx])
  }

  // Interleave by sorting on begin time
  sampled.sort((a, b) => b.begin - a.begin)
  return sampled
}

/**
 * Convert a trace span tree into the UI conversation format used by
 * AgentBehavior's ConversationCard component.
 */
export function traceToConversation(trace, index) {
  const meta = trace._meta || {}
  const isEscalated = meta.outcome === 'manual_escalation'
  const isNonUS = meta.passportType === 'non-US'

  // Build reasoning steps matching the Decision Flow diagram nodes exactly
  const passportAgentName = isNonUS ? 'Non-US Passport Agent' : 'US Passport Agent'
  const outcomeAgentName = isEscalated ? 'Manual Escalation Agent' : 'Auto-Approval Agent'

  const reasoning = [
    {
      step: 1,
      node: 'KYC Orchestrator',
      role: 'agent',
      action: 'Received application, classified documents',
      confidence: 0.99,
    },
    {
      step: 2,
      node: 'Identity Verifier',
      role: 'tool',
      action: `Identity verified (${(meta.identityConf * 100).toFixed(0)}%), detected ${isNonUS ? 'non-US' : 'US'} passport`,
      confidence: meta.identityConf,
    },
    {
      step: 3,
      node: passportAgentName,
      role: 'subagent',
      action: isEscalated
        ? `Address confidence ${meta.addressConf} — below 0.85 threshold`
        : `Address verification passed (${meta.addressConf})`,
      confidence: meta.addressConf,
    },
    {
      step: 4,
      node: outcomeAgentName,
      role: 'outcome',
      action: isEscalated ? 'Escalated to manual review' : 'Application approved',
      confidence: meta.decisionConf,
    },
  ]

  // Timestamp: use begin offset to create a relative recent timestamp
  // We store daysAgo + hour so the frontend can call recentTS()
  const daysAgo = Math.floor(trace.begin / 86400) % 5
  const hour = 8 + Math.floor((trace.begin % 86400) / 3600)
  const minute = Math.floor((trace.begin % 3600) / 60)

  // Build ISO timestamp relative to now (evergreen)
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hour, minute, 0, 0)

  return {
    id: trace.attributes.applicationId,
    timestamp: d.toISOString(),
    channel: 'api',
    topic: isEscalated ? 'address-verification-failure' : 'auto-approved',
    sentiment: isEscalated ? 'neutral' : 'positive',
    resolved: true,
    duration: trace.duration,
    messages: [
      { role: 'user', content: meta.userMsg },
      { role: 'agent', content: meta.agentMsg },
    ],
    reasoning,
  }
}
