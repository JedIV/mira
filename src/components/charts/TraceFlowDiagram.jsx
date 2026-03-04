import { useEffect, useMemo, useRef } from 'react'
import cytoscape from 'cytoscape'
import dagre from 'cytoscape-dagre'

cytoscape.use(dagre)

const nodes = [
  { id: 'application', label: 'KYC Orchestrator', role: 'agent', roleLabel: 'AGENT' },
  { id: 'doc_class', label: 'Document Classifier', role: 'tool', roleLabel: 'TOOL' },
  { id: 'identity', label: 'Identity Verifier', role: 'tool', roleLabel: 'TOOL' },
  { id: 'passport_us', label: 'US Passport Path', role: 'subagent', roleLabel: 'SUB-AGENT' },
  { id: 'passport_non_us', label: 'Non-US Passport', role: 'subagent', roleLabel: 'SUB-AGENT' },
  { id: 'auto_approve', label: 'Auto-Approval', role: 'subagent', roleLabel: 'SUB-AGENT' },
  { id: 'manual_escalation', label: 'Manual Escalation', role: 'subagent', roleLabel: 'SUB-AGENT' },
]

const edgeDefs = [
  ['application', 'doc_class'],
  ['doc_class', 'identity'],
  ['identity', 'passport_us'],
  ['identity', 'passport_non_us'],
  ['passport_us', 'auto_approve'],
  ['passport_us', 'manual_escalation'],
  ['passport_non_us', 'auto_approve'],
  ['passport_non_us', 'manual_escalation'],
]

const baseline = {
  nodes: { application: 287, doc_class: 287, identity: 287, passport_us: 172, passport_non_us: 115, auto_approve: 263, manual_escalation: 24 },
  edges: {
    'application->doc_class': 287, 'doc_class->identity': 287, 'identity->passport_us': 172, 'identity->passport_non_us': 115,
    'passport_us->auto_approve': 165, 'passport_us->manual_escalation': 7,
    'passport_non_us->auto_approve': 98, 'passport_non_us->manual_escalation': 17,
  },
}

const current = {
  nodes: { application: 362, doc_class: 362, identity: 362, passport_us: 212, passport_non_us: 150, auto_approve: 276, manual_escalation: 86 },
  edges: {
    'application->doc_class': 362, 'doc_class->identity': 362, 'identity->passport_us': 212, 'identity->passport_non_us': 150,
    'passport_us->auto_approve': 202, 'passport_us->manual_escalation': 10,
    'passport_non_us->auto_approve': 74, 'passport_non_us->manual_escalation': 76,
  },
}

const PROBLEM_EDGES = new Set(['passport_non_us->manual_escalation', 'identity->passport_non_us'])

function pct(value, total) {
  return total ? (value / total) * 100 : 0
}

function createStylesheet() {
  return [
    {
      selector: 'node',
      style: {
        shape: 'round-rectangle',
        width: 220,
        height: 90,
        label: 'data(display)',
        color: '#1e293b',
        'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        'font-size': 11,
        'text-wrap': 'wrap',
        'text-max-width': 196,
        'text-valign': 'center',
        'text-halign': 'center',
        'border-width': 0,
        'background-color': '#ffffff',
        'border-color': '#e2e8f0',
      },
    },
    {
      selector: 'node[borderSide]',
      style: {
        'border-width': '0 0 0 4',
        'border-color': 'data(borderColor)',
        'border-style': 'solid',
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
        color: '#64748b',
        'font-size': 10,
        'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        'text-background-color': '#ffffff',
        'text-background-opacity': 0.9,
        'text-background-padding': 3,
        'text-rotation': 'autorotate',
      },
    },
    {
      selector: 'edge[problem]',
      style: {
        'line-color': '#ef4444',
        'target-arrow-color': '#ef4444',
        color: '#dc2626',
        'font-weight': 'bold',
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
    const edgeValues = edgeDefs.map(([from, to]) => pct(current.edges[`${from}->${to}`] ?? 0, currentTotal))
    const minEdge = Math.min(...edgeValues)
    const maxEdge = Math.max(...edgeValues)
    const edgeRange = maxEdge - minEdge || 1

    const nodeElements = nodes.map((node) => {
      const curPct = pct(current.nodes[node.id] ?? 0, currentTotal)
      const basePct = pct(baseline.nodes[node.id] ?? 0, baselineTotal)
      const deltaPp = curPct - basePct
      const deltaSign = deltaPp > 0 ? '+' : ''
      const isProblematic = node.id === 'manual_escalation' || node.id === 'passport_non_us'
      const borderColor = isProblematic ? '#ef4444' : '#10b981'

      const display = `${node.roleLabel}\n${node.label}\n${curPct.toFixed(1)}% (${deltaSign}${deltaPp.toFixed(1)}pp)`

      return {
        data: {
          id: node.id,
          display,
          role: node.role,
          borderSide: true,
          borderColor,
        },
      }
    })

    const edgeElements = edgeDefs.map(([from, to]) => {
      const key = `${from}->${to}`
      const curPct = pct(current.edges[key] ?? 0, currentTotal)
      const isProblem = PROBLEM_EDGES.has(key)
      const strokeWidth = 2 + ((curPct - minEdge) / edgeRange) * 6

      return {
        data: {
          id: key,
          source: from,
          target: to,
          edgeColor: isProblem ? '#ef4444' : '#94a3b8',
          strokeWidth: isProblem ? Math.max(strokeWidth, 5) : strokeWidth,
          edgeLabel: `${curPct.toFixed(1)}%`,
          ...(isProblem ? { problem: true } : {}),
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
      minZoom: 0.3,
      maxZoom: 2,
      userPanningEnabled: true,
      userZoomingEnabled: true,
      boxSelectionEnabled: false,
      autoungrabify: true,
    })

    cy.layout({
      name: 'dagre',
      rankDir: 'LR',
      nodeSep: 60,
      rankSep: 100,
      edgeSep: 40,
      fit: true,
      padding: 20,
    }).run()

    cyRef.current = cy

    const ro = new ResizeObserver(() => {
      cy.resize()
      cy.fit(undefined, 20)
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
      style={{ width: '100%', height: '400px' }}
    />
  )
}
