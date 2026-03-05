import { useEffect, useMemo, useRef } from 'react'
import cytoscape from 'cytoscape'
import dagre from 'cytoscape-dagre'

cytoscape.use(dagre)

const nodes = [
  { id: 'application', label: 'KYC Orchestrator', role: 'agent', roleLabel: 'AGENT' },
  { id: 'identity', label: 'Identity Verifier', role: 'tool', roleLabel: 'TOOL' },
  { id: 'passport_us', label: 'US Passport Agent', role: 'subagent', roleLabel: 'SUB-AGENT' },
  { id: 'passport_non_us', label: 'Non-US Passport Agent', role: 'subagent', roleLabel: 'SUB-AGENT' },
  { id: 'auto_approve', label: 'Auto-Approval Agent', role: 'outcome', roleLabel: 'OUTCOME' },
  { id: 'manual_escalation', label: 'Manual Escalation Agent', role: 'outcome', roleLabel: 'OUTCOME' },
]

const edgeDefs = [
  ['application', 'identity'],
  ['identity', 'passport_us'],
  ['identity', 'passport_non_us'],
  ['passport_us', 'auto_approve'],
  ['passport_us', 'manual_escalation'],
  ['passport_non_us', 'auto_approve'],
  ['passport_non_us', 'manual_escalation'],
]

const baseline = {
  nodes: { application: 287, identity: 287, passport_us: 172, passport_non_us: 115, auto_approve: 264, manual_escalation: 23 },
  edges: {
    'application->identity': 287, 'identity->passport_us': 172, 'identity->passport_non_us': 115,
    'passport_us->auto_approve': 165, 'passport_us->manual_escalation': 7,
    'passport_non_us->auto_approve': 99, 'passport_non_us->manual_escalation': 16,
  },
}

const current = {
  nodes: { application: 362, identity: 362, passport_us: 212, passport_non_us: 150, auto_approve: 279, manual_escalation: 83 },
  edges: {
    'application->identity': 362, 'identity->passport_us': 212, 'identity->passport_non_us': 150,
    'passport_us->auto_approve': 202, 'passport_us->manual_escalation': 10,
    'passport_non_us->auto_approve': 77, 'passport_non_us->manual_escalation': 73,
  },
}

const PROBLEM_EDGE = 'passport_non_us->manual_escalation'
const DECLINING_EDGE = 'passport_non_us->auto_approve'

function pct(value, total) {
  return total ? (value / total) * 100 : 0
}

function edgePctOfSource(edgeKey) {
  const source = edgeKey.split('->')[0]
  return pct(current.edges[edgeKey] ?? 0, current.nodes[source])
}

function baselineEdgePctOfSource(edgeKey) {
  const source = edgeKey.split('->')[0]
  return pct(baseline.edges[edgeKey] ?? 0, baseline.nodes[source])
}

function createStylesheet() {
  return [
    // Default node
    {
      selector: 'node',
      style: {
        shape: 'round-rectangle',
        width: 200,
        height: 72,
        label: 'data(display)',
        color: '#334155',
        'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        'font-size': 13,
        'text-wrap': 'wrap',
        'text-max-width': 180,
        'text-valign': 'center',
        'text-halign': 'center',
        'background-color': '#f8fafc',
        'border-width': 1.5,
        'border-color': '#cbd5e1',
      },
    },
    // Problem nodes — red
    {
      selector: 'node[problem]',
      style: {
        'background-color': '#fef2f2',
        'border-color': '#f87171',
        'border-width': 2.5,
        color: '#991b1b',
        'font-size': 14,
        width: 210,
        height: 78,
      },
    },
    // Healthy outcome — green
    {
      selector: 'node[healthy]',
      style: {
        'background-color': '#f0fdf4',
        'border-color': '#4ade80',
        'border-width': 2.5,
        color: '#166534',
        'font-size': 14,
        width: 210,
        height: 78,
      },
    },
    // Passport nodes — neutral slate blue
    {
      selector: 'node[passport]',
      style: {
        'background-color': '#f0f4ff',
        'border-color': '#93a3d1',
        'border-width': 2,
        color: '#334155',
        'font-size': 13,
        width: 210,
        height: 78,
      },
    },
    // Passthrough nodes — small and muted
    {
      selector: 'node[passthrough]',
      style: {
        'background-color': '#f1f5f9',
        'border-color': '#e2e8f0',
        'border-width': 1,
        color: '#94a3b8',
        'font-size': 11,
        height: 50,
        width: 150,
      },
    },
    // Default edges — thin gray
    {
      selector: 'edge',
      style: {
        width: 'data(strokeWidth)',
        'curve-style': 'bezier',
        'line-color': '#e2e8f0',
        'target-arrow-color': '#e2e8f0',
        'target-arrow-shape': 'triangle',
        'arrow-scale': 0.6,
        label: '',
        'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      },
    },
    // Problem edge — thick red
    {
      selector: 'edge[problem]',
      style: {
        'line-color': '#ef4444',
        'target-arrow-color': '#ef4444',
        'arrow-scale': 1.2,
      },
    },
    // Declining edge — blue
    {
      selector: 'edge[declining]',
      style: {
        'line-color': '#3b82f6',
        'target-arrow-color': '#3b82f6',
        'arrow-scale': 0.9,
      },
    },
  ]
}

export default function TraceFlowDiagram() {
  const cyRef = useRef(null)
  const containerRef = useRef(null)

  const baselineTotal = baseline.nodes.application
  const currentTotal = current.nodes.application

  const elements = useMemo(() => {
    const passthroughNodes = new Set(['application', 'identity'])

    const nodeElements = nodes.map((node) => {
      const curPct = pct(current.nodes[node.id] ?? 0, currentTotal)
      const basePct = pct(baseline.nodes[node.id] ?? 0, baselineTotal)
      const deltaPp = curPct - basePct
      const deltaSign = deltaPp > 0 ? '+' : ''

      const isPassthrough = passthroughNodes.has(node.id)
      const isProblem = node.id === 'manual_escalation'
      const isHealthy = node.id === 'auto_approve'
      const isPassport = node.id === 'passport_us' || node.id === 'passport_non_us'

      let display
      if (isPassthrough) {
        display = `${node.roleLabel}\n${node.label}`
      } else {
        const absDelta = Math.abs(deltaPp)
        const arrow = deltaPp > 0.5 ? '\u25B2' : deltaPp < -0.5 ? '\u25BC' : ''
        display = `${node.label}\n${arrow} ${deltaSign}${absDelta.toFixed(0)}%\n(now ${curPct.toFixed(0)}%)`
      }

      return {
        data: {
          id: node.id,
          display,
          ...(isPassthrough ? { passthrough: true } : {}),
          ...(isProblem ? { problem: true } : {}),
          ...(isHealthy ? { healthy: true } : {}),
          ...(isPassport ? { passport: true } : {}),
        },
      }
    })

    const edgeElements = edgeDefs.map(([from, to]) => {
      const key = `${from}->${to}`
      const curPct = edgePctOfSource(key)
      const isPassthrough = passthroughNodes.has(from) && passthroughNodes.has(to)
      const isProblem = key === PROBLEM_EDGE
      const isDeclining = key === DECLINING_EDGE

      let strokeWidth = 1.5
      if (isProblem) strokeWidth = 8
      else if (isDeclining) strokeWidth = 4
      else if (isPassthrough) strokeWidth = 1
      else strokeWidth = 1 + (curPct / 100) * 3

      return {
        data: {
          id: key,
          source: from,
          target: to,
          edgeLabel: '',
          strokeWidth,
          ...(isProblem ? { problem: true } : {}),
          ...(isDeclining ? { declining: true } : {}),
        },
      }
    })

    return [...nodeElements, ...edgeElements]
  }, [baselineTotal, currentTotal])

  useEffect(() => {
    if (!containerRef.current) return

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: createStylesheet(),
      wheelSensitivity: 0.22,
      minZoom: 0.5,
      maxZoom: 2,
      userPanningEnabled: true,
      userZoomingEnabled: true,
      boxSelectionEnabled: false,
      autoungrabify: true,
    })

    cy.layout({
      name: 'dagre',
      rankDir: 'LR',
      nodeSep: 40,
      rankSep: 90,
      edgeSep: 25,
      fit: true,
      padding: 16,
    }).run()

    cyRef.current = cy

    const ro = new ResizeObserver(() => {
      cy.resize()
      cy.fit(undefined, 16)
    })
    ro.observe(containerRef.current)

    return () => {
      ro.disconnect()
      cy.destroy()
      cyRef.current = null
    }
  }, [elements])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '280px' }}
    />
  )
}
