import { useState } from 'react'
import { Card, CardHeader, StatusBadge, Badge } from '../components/common'
import { testScenarios, recentUpdates, testCategories, getTestSummary } from '../data/tests'
import { formatDateTime, formatRelativeTime } from '../utils/formatters'
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '../components/navigation/Icons'

const agentId = 'cs-agent-001'
const tests = testScenarios[agentId] || []
const summary = getTestSummary(agentId)

export default function Testing() {
  const [categoryFilter, setCategoryFilter] = useState('all')

  const filteredTests = categoryFilter === 'all'
    ? tests
    : tests.filter(t => t.category === categoryFilter)

  const categories = ['all', ...Object.keys(testCategories)]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="text-2xl font-bold mb-2">Testing & Validation</h1>
        <p className="text-sm text-slate-300">
          Validation results for agent prompts, data connections, guardrails, and expected behaviors
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-4xl font-bold text-slate-900">{summary.total}</p>
          <p className="text-sm text-slate-500">Total Tests</p>
        </Card>
        <Card className="text-center bg-success-light border-success">
          <div className="flex items-center justify-center gap-2">
            <CheckCircleIcon className="w-6 h-6 text-success" />
            <p className="text-4xl font-bold text-success-dark">{summary.passed}</p>
          </div>
          <p className="text-sm text-success-dark">Passed</p>
        </Card>
        <Card className="text-center bg-danger-light border-danger">
          <div className="flex items-center justify-center gap-2">
            <XCircleIcon className="w-6 h-6 text-danger" />
            <p className="text-4xl font-bold text-danger-dark">{summary.failed}</p>
          </div>
          <p className="text-sm text-danger-dark">Failed</p>
        </Card>
        <Card className="text-center bg-warning-light border-warning">
          <div className="flex items-center justify-center gap-2">
            <ExclamationTriangleIcon className="w-6 h-6 text-warning" />
            <p className="text-4xl font-bold text-warning-dark">{summary.warning}</p>
          </div>
          <p className="text-sm text-warning-dark">Warnings</p>
        </Card>
      </div>

      {/* Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Updates */}
        <Card className="lg:col-span-1">
          <CardHeader
            title="Recent Updates"
            subtitle="Changes to prompts and data"
          />
          <div className="space-y-4">
            {recentUpdates.slice(0, 5).map((update) => (
              <div key={update.id} className="border-l-2 border-slate-200 pl-4 py-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant={
                      update.type === 'prompt' ? 'primary' :
                      update.type === 'data-connection' ? 'secondary' :
                      update.type === 'model' ? 'warning' : 'neutral'
                    }
                    size="sm"
                  >
                    {update.type}
                  </Badge>
                  <StatusBadge status={update.status} />
                </div>
                <p className="text-sm font-medium text-slate-900">{update.title}</p>
                <p className="text-xs text-slate-500 mt-1">{update.description}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                  <span>{update.author}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(update.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Test Scenarios */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Test Scenarios"
            subtitle="Customer Service Agent validation tests"
            action={
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      categoryFilter === cat
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'all' ? 'All' : testCategories[cat]?.label || cat}
                  </button>
                ))}
              </div>
            }
          />

          <div className="space-y-3">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className={`p-4 rounded-lg border ${
                  test.status === 'failed' ? 'border-danger bg-danger-light/30' :
                  test.status === 'warning' ? 'border-warning bg-warning-light/30' :
                  'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {test.status === 'passed' && (
                      <CheckCircleIcon className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    )}
                    {test.status === 'failed' && (
                      <XCircleIcon className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                    )}
                    {test.status === 'warning' && (
                      <ExclamationTriangleIcon className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium text-slate-900">{test.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <Badge
                          variant={testCategories[test.category]?.color || 'neutral'}
                          size="sm"
                        >
                          {testCategories[test.category]?.label || test.category}
                        </Badge>
                        <span>{test.duration}s</span>
                        <span>{test.passedAssertions}/{test.assertions} assertions</span>
                      </div>
                      {test.failureReason && (
                        <p className="mt-2 text-sm text-danger-dark bg-danger-light p-2 rounded">
                          <strong>Failure:</strong> {test.failureReason}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">
                    {formatDateTime(test.lastRun)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Test Coverage */}
      <Card>
        <CardHeader title="Test Coverage by Category" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(testCategories).map(([key, { label, color }]) => {
            const categoryTests = tests.filter(t => t.category === key)
            const passed = categoryTests.filter(t => t.status === 'passed').length
            const total = categoryTests.length
            const percentage = total > 0 ? Math.round((passed / total) * 100) : 0

            return (
              <div key={key} className="p-4 bg-slate-50 rounded-lg text-center">
                <p className="text-sm font-medium text-slate-600 mb-2">{label}</p>
                <p className={`text-2xl font-bold ${
                  percentage === 100 ? 'text-success' :
                  percentage >= 75 ? 'text-warning' : 'text-danger'
                }`}>
                  {percentage}%
                </p>
                <p className="text-xs text-slate-400 mt-1">{passed}/{total} passed</p>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader title="Required Actions" />
        <div className="space-y-3">
          {tests.filter(t => t.status === 'failed').map((test) => (
            <div key={test.id} className="flex items-center justify-between p-3 bg-danger-light rounded-lg">
              <div className="flex items-center gap-3">
                <XCircleIcon className="w-5 h-5 text-danger" />
                <div>
                  <p className="font-medium text-danger-dark">{test.name}</p>
                  <p className="text-sm text-danger-dark/70">{test.failureReason}</p>
                </div>
              </div>
              <button className="btn-primary text-sm">Fix Issue</button>
            </div>
          ))}
          {tests.filter(t => t.status === 'warning').map((test) => (
            <div key={test.id} className="flex items-center justify-between p-3 bg-warning-light rounded-lg">
              <div className="flex items-center gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-medium text-warning-dark">{test.name}</p>
                  <p className="text-sm text-warning-dark/70">{test.failureReason}</p>
                </div>
              </div>
              <button className="btn-secondary text-sm">Review</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
