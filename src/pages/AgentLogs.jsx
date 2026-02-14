import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardHeader, StatusBadge, Badge } from '../components/common'
import { getAgentById } from '../data/agents'
import { getSessionsForAgent, stepTypeColors } from '../data/sessions'
import { ChevronRightIcon } from '../components/navigation/Icons'

function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function formatTimestamp(iso) {
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

function SessionRow({ session }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
      >
        <ChevronRightIcon
          className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${
            expanded ? 'rotate-90' : ''
          }`}
        />
        <span className="text-sm text-slate-500 w-40 flex-shrink-0">
          {formatTimestamp(session.timestamp)}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
          session.status === 'completed'
            ? 'bg-emerald-50 text-emerald-700'
            : session.status === 'failed'
            ? 'bg-red-50 text-red-700'
            : 'bg-blue-50 text-blue-700'
        }`}>
          {session.status}
        </span>
        <span className="text-sm text-slate-700 flex-shrink-0">
          {formatDuration(session.duration)}
        </span>
        <span className="text-sm text-slate-500 flex-shrink-0">
          {session.stepsCount} steps
        </span>
        <span className="text-sm text-slate-500">
          {session.tokens} tokens
        </span>
        {session.errorMessage && (
          <span className="text-xs text-red-500 truncate ml-auto">
            {session.errorMessage}
          </span>
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 pl-12">
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Step Trace
            </h4>
            <div className="space-y-2">
              {session.steps.map((step, i) => (
                <div key={step.id} className="flex items-center gap-3">
                  {/* Step number */}
                  <span className="text-xs text-slate-400 w-5 text-right">{i + 1}</span>
                  {/* Type indicator */}
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: stepTypeColors[step.type] }}
                  />
                  {/* Label */}
                  <span className="text-sm font-medium text-slate-700 w-28 flex-shrink-0">
                    {step.label}
                  </span>
                  {/* Detail */}
                  <span className="text-sm text-slate-500 flex-1 truncate">
                    {step.detail}
                  </span>
                  {/* Latency */}
                  <span className="text-xs text-slate-400 flex-shrink-0">
                    {formatDuration(step.latency)}
                  </span>
                  {/* Status */}
                  {step.status === 'error' && (
                    <span className="text-xs text-red-500 flex-shrink-0">error</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AgentLogs() {
  const { agentId } = useParams()
  const agent = getAgentById(agentId || 'cs-agent-001')
  const sessions = getSessionsForAgent(agentId || 'cs-agent-001')

  if (!agent) {
    return <div className="text-center py-12 text-slate-500">Agent not found</div>
  }

  const completedCount = sessions.filter(s => s.status === 'completed').length
  const failedCount = sessions.filter(s => s.status === 'failed').length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
              <Link to={`/agents/${agent.id}`} className="hover:text-white transition-colors">
                {agent.name}
              </Link>
              <ChevronRightIcon className="w-3 h-3" />
              <span className="text-slate-300">Session Logs</span>
            </div>
            <h1 className="text-2xl font-bold">Session Logs</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300">{completedCount} completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-slate-300">{failedCount} failed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <Card padding={false}>
        {/* Table Header */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-b border-slate-200 text-xs font-medium text-slate-500 uppercase tracking-wider">
          <span className="w-4" />
          <span className="w-40">Timestamp</span>
          <span className="w-20">Status</span>
          <span className="w-16">Duration</span>
          <span className="w-16">Steps</span>
          <span>Tokens</span>
        </div>

        {/* Session Rows */}
        {sessions.map((session) => (
          <SessionRow key={session.id} session={session} />
        ))}
      </Card>
    </div>
  )
}
