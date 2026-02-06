import { Link } from 'react-router-dom'
import { Card, CardHeader, StatusBadge, MetricCard } from '../components/common'
import { AreaChart, LineChart } from '../components/charts'
import { generateLiveActivityData, criticalAgents, generateTimeSeriesData } from '../data/metrics'
import { formatPercent, formatNumber } from '../utils/formatters'
import { ServerStackIcon, ClockIcon, ExclamationTriangleIcon } from '../components/navigation/Icons'

const activityData = generateLiveActivityData()
const responseTimeData = generateTimeSeriesData(12, 1.5, 0.15)
const errorRateData = generateTimeSeriesData(12, 0.5, 0.3)

export default function TechnicalPerformance() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          label="Average Uptime"
          value="99.7"
          suffix="%"
          icon={ServerStackIcon}
          trend="up"
          trendValue={0.2}
        />
        <MetricCard
          label="Avg Response Time"
          value="1.8"
          suffix="s"
          icon={ClockIcon}
          trend="down"
          trendValue={5.3}
        />
        <MetricCard
          label="Error Rate"
          value="0.42"
          suffix="%"
          icon={ExclamationTriangleIcon}
        />
        <MetricCard
          label="Requests/min"
          value={formatNumber(3240)}
          trend="up"
          trendValue={12.5}
        />
      </div>

      {/* Activity + Critical Agents Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Activity */}
        <Card>
          <CardHeader
            title="Live Activity"
            subtitle="Agent interactions over the last 24 hours"
          />
          <AreaChart
            data={activityData}
            dataKey="interactions"
            xAxisKey="time"
            height={300}
          />
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-500">Peak Hour</p>
              <p className="text-lg font-semibold text-slate-900">2:00 PM</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Peak Volume</p>
              <p className="text-lg font-semibold text-slate-900">2,847</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Today</p>
              <p className="text-lg font-semibold text-slate-900">45.2K</p>
            </div>
          </div>
        </Card>

        {/* Critical Agents */}
        <Card>
          <CardHeader
            title="Critical Agents"
            subtitle="Real-time status of high-priority agents"
          />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <th className="pb-3">Agent</th>
                  <th className="pb-3">Uptime</th>
                  <th className="pb-3">Response</th>
                  <th className="pb-3">Errors</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {criticalAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-slate-50">
                    <td className="py-3">
                      <Link to={`/agents/${agent.id}`} className="text-sm font-medium text-slate-900 hover:text-primary-600">
                        {agent.name}
                      </Link>
                    </td>
                    <td className="py-3 text-sm text-slate-700">{formatPercent(agent.uptime)}</td>
                    <td className="py-3 text-sm text-slate-700">{agent.responseTime}s</td>
                    <td className="py-3 text-sm text-slate-700">{formatPercent(agent.errorRate)}</td>
                    <td className="py-3">
                      <StatusBadge status={agent.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Response Time Trend" subtitle="Average response time over 12 months" />
          <LineChart
            data={responseTimeData}
            dataKey="value"
            color="#06B6D4"
            height={250}
          />
        </Card>
        <Card>
          <CardHeader title="Error Rate Trend" subtitle="Platform-wide error rate over 12 months" />
          <LineChart
            data={errorRateData}
            dataKey="value"
            color="#EF4444"
            height={250}
          />
        </Card>
      </div>

      {/* Status Summary */}
      <Card>
        <CardHeader title="System Health Summary" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-success-light rounded-lg">
            <p className="text-3xl font-bold text-success-dark">47</p>
            <p className="text-sm text-success-dark">Healthy</p>
          </div>
          <div className="text-center p-4 bg-warning-light rounded-lg">
            <p className="text-3xl font-bold text-warning-dark">2</p>
            <p className="text-sm text-warning-dark">Degraded</p>
          </div>
          <div className="text-center p-4 bg-slate-100 rounded-lg">
            <p className="text-3xl font-bold text-slate-700">1</p>
            <p className="text-sm text-slate-600">Maintenance</p>
          </div>
          <div className="text-center p-4 bg-danger-light rounded-lg">
            <p className="text-3xl font-bold text-danger-dark">0</p>
            <p className="text-sm text-danger-dark">Offline</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
