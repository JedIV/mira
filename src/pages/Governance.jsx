import { Card, CardHeader, StatusBadge, Badge } from '../components/common'
import { riskAssessments, approvalWorkflows, complianceRequirements, getRiskLevel } from '../data/governance'
import { formatDate, formatDateTime, formatRelativeTime } from '../utils/formatters'
import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '../components/navigation/Icons'

const agentRisk = riskAssessments['cs-agent-001']

export default function Governance() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="text-2xl font-bold mb-2">Risk & Governance</h1>
        <p className="text-sm text-slate-300">
          Risk assessments, compliance status, and approval workflows for deployed agents
        </p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-sm text-slate-500 mb-2">Pending Approvals</p>
          <p className="text-4xl font-bold text-warning">2</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-slate-500 mb-2">Compliance Status</p>
          <p className="text-4xl font-bold text-success">94%</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-slate-500 mb-2">Agents Under Review</p>
          <p className="text-4xl font-bold text-slate-900">3</p>
        </Card>
      </div>

      {/* Split View: Risk Matrix + Approval Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Matrix */}
        <Card>
          <CardHeader
            title="Risk Assessment"
            subtitle="Customer Service Agent - Multi-dimensional risk view"
          />

          {/* Overall Score */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${
              agentRisk.overall === 'low' ? 'bg-success' :
              agentRisk.overall === 'medium' ? 'bg-warning' : 'bg-danger'
            }`}>
              {agentRisk.overallScore}
            </div>
            <div>
              <p className="font-semibold text-slate-900">Overall Risk: <span className="capitalize">{agentRisk.overall}</span></p>
              <p className="text-sm text-slate-500">Last assessed: {formatDate(agentRisk.lastAssessed)}</p>
              <p className="text-sm text-slate-500">Next review: {formatDate(agentRisk.nextReview)}</p>
            </div>
          </div>

          {/* Dimension Scores */}
          <div className="space-y-4">
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

        {/* Approval Workflows */}
        <Card>
          <CardHeader
            title="Approval Workflows"
            subtitle="Pending and recent approval requests"
          />

          <div className="space-y-6">
            {approvalWorkflows.map((workflow) => (
              <div key={workflow.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-slate-900">{workflow.title}</p>
                    <p className="text-sm text-slate-500">{workflow.agentName}</p>
                  </div>
                  <StatusBadge status={workflow.status} />
                </div>
                <p className="text-sm text-slate-600 mb-4">{workflow.description}</p>

                {/* Approval Stages */}
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-3 top-6 bottom-6 w-0.5 bg-slate-200" />

                  <div className="space-y-4">
                    {workflow.stages.map((stage, index) => (
                      <div key={stage.team} className="flex items-start gap-3 relative">
                        {/* Stage Indicator */}
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

                        {/* Stage Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-900">{stage.team}</p>
                            {stage.timestamp && (
                              <span className="text-xs text-slate-400">
                                {formatRelativeTime(stage.timestamp)}
                              </span>
                            )}
                          </div>
                          {stage.approver && (
                            <p className="text-sm text-slate-500">Approved by {stage.approver}</p>
                          )}
                          {stage.comments && (
                            <p className="text-sm text-slate-600 mt-1 bg-slate-50 p-2 rounded">
                              "{stage.comments}"
                            </p>
                          )}
                          {stage.status === 'pending' && (
                            <p className="text-sm text-warning mt-1">Awaiting review...</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Changes */}
                {workflow.changes && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs font-medium text-slate-500 mb-2">Changes in this request:</p>
                    <div className="flex flex-wrap gap-2">
                      {workflow.changes.map((change, i) => (
                        <Badge key={i} variant="neutral" size="sm">
                          {change.type}: {change.description}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

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

      {/* Governance Summary */}
      <Card>
        <CardHeader title="Governance Health Summary" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-success-light rounded-lg">
            <p className="text-3xl font-bold text-success-dark">45</p>
            <p className="text-sm text-success-dark">Low Risk Agents</p>
          </div>
          <div className="text-center p-4 bg-warning-light rounded-lg">
            <p className="text-3xl font-bold text-warning-dark">4</p>
            <p className="text-sm text-warning-dark">Medium Risk</p>
          </div>
          <div className="text-center p-4 bg-danger-light rounded-lg">
            <p className="text-3xl font-bold text-danger-dark">1</p>
            <p className="text-sm text-danger-dark">High Risk</p>
          </div>
          <div className="text-center p-4 bg-slate-100 rounded-lg">
            <p className="text-3xl font-bold text-slate-700">0</p>
            <p className="text-sm text-slate-600">Blocked</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
