import { useEffect, useMemo, useRef, useState } from 'react'
import cytoscape from 'cytoscape'
import dagre from 'cytoscape-dagre'

cytoscape.use(dagre)

const months = [
  { id: '2025-09', label: 'Sep 2025' },
  { id: '2025-10', label: 'Oct 2025' },
  { id: '2025-11', label: 'Nov 2025' },
  { id: '2025-12', label: 'Dec 2025' },
  { id: '2026-01', label: 'Jan 2026' },
  { id: '2026-02', label: 'Feb 2026 (Today)' },
]

const nodes = [
  { id: 'application', label: 'KYC Orchestrator', role: 'agent', roleLabel: 'AGENT' },
  { id: 'doc_class', label: 'Document Classifier', role: 'tool', roleLabel: 'TOOL' },
  { id: 'identity', label: 'Identity Verifier API', role: 'tool', roleLabel: 'TOOL' },
  { id: 'passport_us', label: 'US Passport Path', role: 'subagent', roleLabel: 'SUB-AGENT' },
  { id: 'passport_non_us', label: 'Non-US Passport Path', role: 'subagent', roleLabel: 'SUB-AGENT' },
  { id: 'auto_approve', label: 'Auto-Approval Agent', role: 'subagent', roleLabel: 'SUB-AGENT' },
  { id: 'manual_escalation', label: 'Manual Approval Agent', role: 'subagent', roleLabel: 'SUB-AGENT' },
]

const edges = [
  ['application', 'doc_class'],
  ['doc_class', 'identity'],
  ['identity', 'passport_us'],
  ['identity', 'passport_non_us'],
  ['passport_us', 'auto_approve'],
  ['passport_us', 'manual_escalation'],
  ['passport_non_us', 'auto_approve'],
  ['passport_non_us', 'manual_escalation'],
]

const traces = {
  '2025-09': {
    nodes: {
      application: 287, doc_class: 287, identity: 287, passport_us: 172, passport_non_us: 115,
      auto_approve: 263, manual_escalation: 24,
    },
    edges: {
      'application->doc_class': 287, 'doc_class->identity': 287, 'identity->passport_us': 172, 'identity->passport_non_us': 115,
      'passport_us->auto_approve': 165, 'passport_us->manual_escalation': 7,
      'passport_non_us->auto_approve': 98, 'passport_non_us->manual_escalation': 17,
    },
  },
  '2025-10': {
    nodes: {
      application: 300, doc_class: 300, identity: 300, passport_us: 178, passport_non_us: 122,
      auto_approve: 267, manual_escalation: 33,
    },
    edges: {
      'application->doc_class': 300, 'doc_class->identity': 300, 'identity->passport_us': 178, 'identity->passport_non_us': 122,
      'passport_us->auto_approve': 170, 'passport_us->manual_escalation': 8,
      'passport_non_us->auto_approve': 97, 'passport_non_us->manual_escalation': 25,
    },
  },
  '2025-11': {
    nodes: {
      application: 312, doc_class: 312, identity: 312, passport_us: 189, passport_non_us: 123,
      auto_approve: 268, manual_escalation: 44,
    },
    edges: {
      'application->doc_class': 312, 'doc_class->identity': 312, 'identity->passport_us': 189, 'identity->passport_non_us': 123,
      'passport_us->auto_approve': 181, 'passport_us->manual_escalation': 8,
      'passport_non_us->auto_approve': 87, 'passport_non_us->manual_escalation': 36,
    },
  },
  '2025-12': {
    nodes: {
      application: 328, doc_class: 328, identity: 328, passport_us: 197, passport_non_us: 131,
      auto_approve: 269, manual_escalation: 59,
    },
    edges: {
      'application->doc_class': 328, 'doc_class->identity': 328, 'identity->passport_us': 197, 'identity->passport_non_us': 131,
      'passport_us->auto_approve': 188, 'passport_us->manual_escalation': 9,
      'passport_non_us->auto_approve': 81, 'passport_non_us->manual_escalation': 50,
    },
  },
  '2026-01': {
    nodes: {
      application: 346, doc_class: 346, identity: 346, passport_us: 205, passport_non_us: 141,
      auto_approve: 273, manual_escalation: 73,
    },
    edges: {
      'application->doc_class': 346, 'doc_class->identity': 346, 'identity->passport_us': 205, 'identity->passport_non_us': 141,
      'passport_us->auto_approve': 196, 'passport_us->manual_escalation': 9,
      'passport_non_us->auto_approve': 77, 'passport_non_us->manual_escalation': 64,
    },
  },
  '2026-02': {
    nodes: {
      application: 362, doc_class: 362, identity: 362, passport_us: 217, passport_non_us: 145,
      auto_approve: 279, manual_escalation: 83,
    },
    edges: {
      'application->doc_class': 362, 'doc_class->identity': 362, 'identity->passport_us': 217, 'identity->passport_non_us': 145,
      'passport_us->auto_approve': 207, 'passport_us->manual_escalation': 10,
      'passport_non_us->auto_approve': 72, 'passport_non_us->manual_escalation': 73,
    },
  },
}

const todayIndex = months.length - 1
const HIGHLIGHT_EDGES = new Set(['passport_non_us->manual_escalation', 'passport_non_us->auto_approve'])

function pct(value, total) {
  if (!total) return 0
  return (value / total) * 100
}

function deltaClass(raw) {
  if (raw > 0) return 'delta-up'
  if (raw < 0) return 'delta-down'
  return 'delta-flat'
}

function edgeShiftColor(edgeId, delta) {
  if (!HIGHLIGHT_EDGES.has(edgeId)) return '#64748b'
  if (Math.abs(delta) <= 2) return '#64748b'
  if (delta > 2) return '#ef4444'
  if (delta < -2) return '#2f6cff'
  return '#64748b'
}

function createStylesheet() {
  return [
    {
      selector: 'node',
      style: {
        shape: 'round-rectangle',
        width: 190,
        height: 86,
        label: 'data(display)',
        color: '#1f2937',
        'font-family': '"IBM Plex Mono", monospace',
        'font-size': 10,
        'text-wrap': 'wrap',
        'text-max-width': 168,
        'text-valign': 'center',
        'text-halign': 'center',
        'border-width': 1,
        'border-color': 'data(border)',
        'background-color': 'data(bg)',
      },
    },
    {
      selector: 'node[role = "agent"]',
      style: {
        shape: 'round-hexagon',
        'border-width': 2,
      },
    },
    {
      selector: 'node[role = "tool"]',
      style: {
        shape: 'round-rectangle',
        'border-style': 'dashed',
      },
    },
    {
      selector: 'node[role = "subagent"]',
      style: {
        shape: 'ellipse',
      },
    },
    {
      selector: 'node[role = "decision"]',
      style: {
        shape: 'diamond',
      },
    },
    {
      selector: 'edge',
      style: {
        width: 'data(strokeWidth)',
        'curve-style': 'bezier',
        'line-color': 'data(edgeColor)',
        'target-arrow-color': 'data(edgeColor)',
        'target-arrow-shape': 'triangle',
        'arrow-scale': 0.8,
        label: 'data(edgeLabel)',
        color: '#475569',
        'font-size': 9,
        'font-family': '"IBM Plex Mono", monospace',
        'text-background-color': 'rgba(255, 255, 255, 0.9)',
        'text-background-opacity': 1,
        'text-background-padding': 2,
        'text-rotation': 'autorotate',
      },
    },
  ]
}

function graphLayout() {
  return {
    name: 'dagre',
    rankDir: 'LR',
    nodeSep: 95,
    rankSep: 120,
    edgeSep: 55,
    fit: true,
    padding: 24,
  }
}

export default function App() {
  const [baselineIndex, setBaselineIndex] = useState(0)
  const cyRef = useRef(null)
  const graphRef = useRef(null)

  const baselineMonth = months[baselineIndex]
  const todayMonth = months[todayIndex]
  const baseline = traces[baselineMonth.id]
  const today = traces[todayMonth.id]
  const baselineTotal = baseline.nodes.application
  const todayTotal = today.nodes.application

  const edgeStats = useMemo(() => {
    const values = edges.map(([from, to]) => pct(today.edges[`${from}->${to}`] ?? 0, todayTotal))
    return { min: Math.min(...values), max: Math.max(...values) }
  }, [today, todayTotal])

  const focusPath = useMemo(() => {
    const focusEdges = ['passport_non_us->manual_escalation']
    const todayPct = focusEdges.reduce((sum, key) => sum + pct(today.edges[key] ?? 0, todayTotal), 0)
    const baselinePct = focusEdges.reduce((sum, key) => sum + pct(baseline.edges[key] ?? 0, baselineTotal), 0)
    return { todayPct, deltaPp: todayPct - baselinePct }
  }, [baseline, baselineTotal, today, todayTotal])

  const biggestShifts = useMemo(() => {
    const shifts = edges.map(([from, to]) => {
      const key = `${from}->${to}`
      const todayPct = pct(today.edges[key] ?? 0, todayTotal)
      const baselinePct = pct(baseline.edges[key] ?? 0, baselineTotal)
      return { key, deltaPp: todayPct - baselinePct }
    })
    shifts.sort((a, b) => Math.abs(b.deltaPp) - Math.abs(a.deltaPp))
    return shifts.slice(0, 3)
  }, [baseline, baselineTotal, today, todayTotal])

  const elements = useMemo(() => {
    const roleTheme = {
      agent: { bg: '#eef2ff', border: '#3730a3' },
      tool: { bg: '#ffffff', border: '#475569' },
      subagent: { bg: '#f8fafc', border: '#334155' },
      decision: { bg: '#fefce8', border: '#92400e' },
    }

    const nodeElements = nodes.map((node) => {
      const todayPct = pct(today.nodes[node.id] ?? 0, todayTotal)
      const baselinePct = pct(baseline.nodes[node.id] ?? 0, baselineTotal)
      const deltaPp = todayPct - baselinePct
      const theme = roleTheme[node.role] || roleTheme.tool
      const deltaStr = `${deltaPp > 0 ? '+' : ''}${deltaPp.toFixed(2)}pp`
      const display = `${node.roleLabel}\n${node.label}\n${todayPct.toFixed(2)}%  (${deltaStr})`
      return {
        data: {
          id: node.id,
          display,
          role: node.role,
          bg: theme.bg,
          border: theme.border,
        },
      }
    })

    const edgeElements = edges.map(([from, to]) => {
      const key = `${from}->${to}`
      const todayPct = pct(today.edges[key] ?? 0, todayTotal)
      const baselinePct = pct(baseline.edges[key] ?? 0, baselineTotal)
      const deltaPp = todayPct - baselinePct
      const strokeWidth = 1.8 + ((todayPct - edgeStats.min) / (edgeStats.max - edgeStats.min || 1)) * 7.5
      return {
        data: {
          id: key,
          source: from,
          target: to,
          edgeColor: edgeShiftColor(key, deltaPp),
          strokeWidth,
          edgeLabel: `${todayPct.toFixed(2)}% (${deltaPp > 0 ? '+' : ''}${deltaPp.toFixed(2)}pp)`,
        },
      }
    })

    return [...nodeElements, ...edgeElements]
  }, [baseline, baselineTotal, edgeStats.max, edgeStats.min, today, todayTotal])

  useEffect(() => {
    if (!graphRef.current) return
    if (cyRef.current) return

    const cy = cytoscape({
      container: graphRef.current,
      elements: [],
      style: createStylesheet(),
      wheelSensitivity: 0.22,
      minZoom: 0.2,
      maxZoom: 2.2,
    })
    cyRef.current = cy

    const ro = new ResizeObserver(() => {
      cy.resize()
      cy.fit(undefined, 24)
    })
    ro.observe(graphRef.current)

    return () => {
      ro.disconnect()
      cy.destroy()
      cyRef.current = null
    }
  }, [])

  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    cy.elements().remove()
    cy.add(elements)
    cy.layout(graphLayout()).run()
    cy.fit(undefined, 24)
  }, [elements])

  const recenter = () => {
    const cy = cyRef.current
    if (!cy) return
    cy.fit(undefined, 24)
  }

  return (
    <div className="screen">
      <div className="grain" />
      <main className="layout">
        <section className="hero">
          <p className="eyebrow">KYC Trace Lab</p>
          <h1>Weight Shift: {baselineMonth.label} to {todayMonth.label}</h1>
          <p className="subtitle">
            Decision-tree routing for <strong>kyc-agent-016</strong>. Edge color encodes shift from baseline month to today:
            <span className="legend red"> red = non-US route increase &gt; 2pp</span>, <span className="legend blue">blue = non-US route decrease &lt; -2pp</span>, <span className="legend gray">gray = all other edges</span>.
          </p>
        </section>

        <section className="controls">
          <div className="control-left">
            <label htmlFor="baseline">Compare from</label>
            <input
              id="baseline"
              type="range"
              min={0}
              max={todayIndex - 1}
              value={baselineIndex}
              onChange={(e) => setBaselineIndex(Number(e.target.value))}
            />
            <div className="period-chip">{baselineMonth.label}</div>
            <div className="period-chip">Today: {todayMonth.label}</div>
            <button className="play" onClick={recenter}>Recenter</button>
          </div>
          <div className="ticks">
            {months.map((m, i) => (
              <span key={m.id} className={i === baselineIndex ? 'active' : i === todayIndex ? 'today' : ''}>{m.label}</span>
            ))}
          </div>
        </section>

        <section className="tree-wrap">
          <div ref={graphRef} className="cy-container" />
        </section>

        <section className="insights">
          <article className="card warning">
            <h2>Focus Path</h2>
            <p>Non-US Passport Path to Manual Approval Agent</p>
            <p className={`big ${deltaClass(focusPath.deltaPp)}`}>
              {focusPath.todayPct.toFixed(2)}%
              <span>{focusPath.deltaPp > 0 ? '+' : ''}{focusPath.deltaPp.toFixed(2)}pp since {baselineMonth.label}</span>
            </p>
          </article>

          <article className="card">
            <h2>Largest Edge Shifts</h2>
            <ul>
              {biggestShifts.map((item) => (
                <li key={item.key}>
                  <span>{item.key.replace('->', ' to ')}</span>
                  <span className={deltaClass(item.deltaPp)}>
                    {item.deltaPp > 0 ? '+' : ''}{item.deltaPp.toFixed(2)}pp
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <article className="card">
            <h2>Narrative</h2>
            <p>
              The flow is simplified to final routing only. US vs non-US passport mix stays near 60/40,
              and the non-US path sends progressively more traffic to manual approval over time.
            </p>
          </article>
        </section>
      </main>
    </div>
  )
}
