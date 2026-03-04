import { useState } from 'react'
import { Card, CardHeader, StatusBadge, Badge } from '../components/common'
import { getRiskAssessment, approvalWorkflows, complianceRequirements, getRiskLevel } from '../data/governance'
import { formatDate, formatRelativeTime } from '../utils/formatters'
import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '../components/navigation/Icons'

const agentRisk = getRiskAssessment('cs-agent-001')

// Split workflows: first 2 featured, rest in compact table
const featuredWorkflows = approvalWorkflows.slice(0, 2)
const remainingWorkflows = approvalWorkflows.slice(2)
const pendingCount = approvalWorkflows.filter(w => w.status !== 'approved').length

function ApprovalStages({ stages }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-6 bottom-6 w-0.5 bg-slate-200" />
      <div className="space-y-3">
        {stages.map((stage) => (
          <div key={stage.team} className="flex items-start gap-3 relative">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
              stage.status === 'approved' ? 'bg-success' :
              stage.status === 'pending' ? 'bg-slate-200' : 'bg-danger'
            }`}>
              {stage.status === 'approved' ? (
                <CheckCircleIcon className="w-4 h-4 text-white" />
              ) : stage.status === 'pending' ? (
                <ClockIcon className="w-4 h-4 text-slate-400" />
              ) : (
                <ExclamationTriangleIcon className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-900 text-sm">{stage.team}</p>
                {stage.timestamp && (
                  <span className="text-xs text-slate-400">{formatRelativeTime(stage.timestamp)}</span>
                )}
              </div>
              {stage.approver && (
                <p className="text-xs text-slate-500">Approved by {stage.approver}</p>
              )}
              {stage.comments && (
                <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded">"{stage.comments}"</p>
              )}
              {stage.status === 'pending' && (
                <p className="text-xs text-warning mt-1">Awaiting review...</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WorkflowCard({ workflow }) {
  return (
    <Card>
      <div className="mb-3">
        <p className="font-semibold text-slate-900 mb-1">{workflow.title}</p>
        <p className="text-sm text-slate-500">{workflow.agentName} · Requested by {workflow.requestedBy}</p>
      </div>
      <p className="text-sm text-slate-600 mb-4">{workflow.description}</p>

      <ApprovalStages stages={workflow.stages} />

      {workflow.changes && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-500 mb-2">Changes:</p>
          <div className="flex flex-wrap gap-1.5">
            {workflow.changes.map((change, i) => (
              <Badge key={i} variant="neutral" size="sm">
                {change.type}: {change.description}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

export default function Governance() {
  const [showAll, setShowAll] = useState(false)
  const displayedRemaining = showAll ? remainingWorkflows : remainingWorkflows.slice(0, 6)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="text-2xl font-bold mb-2">Risk & Governance</h1>
        <p className="text-sm text-slate-300">
          Risk assessments, compliance status, and approval workflows for deployed agents
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-sm text-slate-500 mb-2">Pending Approvals</p>
          <p className="text-4xl font-bold text-warning">{pendingCount}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-slate-500 mb-2">Compliance Status</p>
          <p className="text-4xl font-bold text-success">94%</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-slate-500 mb-2">Total Workflows</p>
          <p className="text-4xl font-bold text-slate-900">{approvalWorkflows.length}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-slate-500 mb-2">High Priority</p>
          <p className="text-4xl font-bold text-danger">{approvalWorkflows.filter(w => w.priority === 'high').length}</p>
        </Card>
      </div>

      {/* Featured Approval Workflows — side by side */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Active Approval Workflows</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {featuredWorkflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      </div>

      {/* Remaining Workflows — compact table */}
      {remainingWorkflows.length > 0 && (
        <Card>
          <CardHeader
            title="All Approval Requests"
            subtitle={`${remainingWorkflows.length} additional workflows`}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <th className="pb-3">Request</th>
                  <th className="pb-3">Agent</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3 text-center">Priority</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-center">Progress</th>
                  <th className="pb-3">Requested By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedRemaining.map((workflow) => {
                  const approved = workflow.stages.filter(s => s.status === 'approved').length
                  const total = workflow.stages.length
                  return (
                    <tr key={workflow.id} className="hover:bg-slate-50">
                      <td className="py-3">
                        <span className="font-medium text-slate-900">{workflow.title}</span>
                      </td>
                      <td className="py-3 text-slate-600">{workflow.agentName}</td>
                      <td className="py-3">
                        <span className="text-xs text-slate-500 capitalize">{workflow.type.replace(/-/g, ' ')}</span>
                      </td>
                      <td className="py-3 text-center">
                        <Badge
                          variant={workflow.priority === 'high' ? 'danger' : workflow.priority === 'medium' ? 'warning' : 'neutral'}
                          size="sm"
                        >
                          {workflow.priority}
                        </Badge>
                      </td>
                      <td className="py-3 text-center">
                        <StatusBadge status={workflow.status} />
                      </td>
                      <td className="py-3">
                        <div className="flex items-center justify-center gap-2">
                          <div className="flex gap-1">
                            {workflow.stages.map((stage, i) => (
                              <div
                                key={i}
                                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                  stage.status === 'approved' ? 'bg-success' : 'bg-slate-200'
                                }`}
                                title={`${stage.team}: ${stage.status}`}
                              >
                                {stage.status === 'approved' ? (
                                  <CheckCircleIcon className="w-3 h-3 text-white" />
                                ) : (
                                  <ClockIcon className="w-3 h-3 text-slate-400" />
                                )}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs text-slate-400">{approved}/{total}</span>
                        </div>
                      </td>
                      <td className="py-3 text-slate-500 text-xs">{workflow.requestedBy}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {remainingWorkflows.length > 6 && !showAll && (
            <div className="text-center pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAll(true)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Show {remainingWorkflows.length - 6} more workflows
              </button>
            </div>
          )}
        </Card>
      )}

      {/* Side-by-side: Risk Assessment + Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Assessment */}
        <Card>
          <CardHeader
            title="Risk Assessment"
            subtitle="Customer Service Agent — Multi-dimensional risk view"
          />
          <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold ${
              agentRisk.overall === 'low' ? 'bg-success' :
              agentRisk.overall === 'medium' ? 'bg-warning' : 'bg-danger'
            }`}>
              {agentRisk.overallScore}
            </div>
            <div>
              <p className="font-semibold text-slate-900">Overall Risk: <span className="capitalize">{agentRisk.overall}</span></p>
              <p className="text-xs text-slate-500">Last assessed: {formatDate(agentRisk.lastAssessed)}</p>
            </div>
          </div>
          <div className="space-y-3">
            {Object.entries(agentRisk.dimensions).map(([dimension, data]) => {
              const { level, color } = getRiskLevel(data.score)
              return (
                <div key={dimension}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium capitalize text-slate-700">{dimension}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${
                        color === 'success' ? 'text-success' :
                        color === 'warning' ? 'text-warning' : 'text-danger'
                      }`}>
                        {data.score}
                      </span>
                      {data.issues > 0 && (
                        <Badge variant={color} size="sm">{data.issues} issues</Badge>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        color === 'success' ? 'bg-success' :
                        color === 'warning' ? 'bg-warning' : 'bg-danger'
                      }`}
                      style={{ width: `${data.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-slate-400">
                    <span className="capitalize">{data.trend} trend</span>
                    <span className="capitalize">{level} risk</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Compliance Requirements */}
        <Card>
          <CardHeader
            title="Compliance Requirements"
            subtitle="Regulatory and policy compliance status"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <th className="pb-3">Requirement</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Last Audit</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complianceRequirements.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50">
                    <td className="py-3 font-medium text-slate-900">{req.name}</td>
                    <td className="py-3">
                      <Badge
                        variant={req.status === 'compliant' ? 'success' : 'warning'}
                        dot
                      >
                        {req.status === 'compliant' ? 'Compliant' : 'Review Needed'}
                      </Badge>
                    </td>
                    <td className="py-3 text-slate-500">{formatDate(req.lastAudit)}</td>
                    <td className="py-3 text-right">
                      {req.status !== 'compliant' && (
                        <button className="text-primary-600 hover:text-primary-700 font-medium">
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Governance Health Summary */}
      <Card>
        <CardHeader title="Governance Health Summary" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-success-light rounded-lg">
            <p className="text-3xl font-bold text-success-dark">3,841</p>
            <p className="text-sm text-success-dark">Low Risk Agents</p>
          </div>
          <div className="text-center p-4 bg-warning-light rounded-lg">
            <p className="text-3xl font-bold text-warning-dark">247</p>
            <p className="text-sm text-warning-dark">Medium Risk</p>
          </div>
          <div className="text-center p-4 bg-danger-light rounded-lg">
            <p className="text-3xl font-bold text-danger-dark">36</p>
            <p className="text-sm text-danger-dark">High Risk</p>
          </div>
          <div className="text-center p-4 bg-slate-100 rounded-lg">
            <p className="text-3xl font-bold text-slate-700">3</p>
            <p className="text-sm text-slate-600">Blocked</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
