import { Card, CardHeader, MetricCard } from '../components/common'
import { LineChart, BarChart, DonutChart } from '../components/charts'
import { generateTimeSeriesData, businessMetrics } from '../data/metrics'
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatters'
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
} from '../components/navigation/Icons'

// Generate data showing Q4 performance drop
const resolutionData = generateTimeSeriesData(12, 85, 0.08, true)
const satisfactionData = generateTimeSeriesData(12, 4.3, 0.05, true)
const throughputData = generateTimeSeriesData(12, 1200, 0.1)

const teamPerformance = [
  { name: 'Customer Experience', value: 82, color: '#06B6D4' },
  { name: 'Risk Management', value: 95, color: '#10B981' },
  { name: 'Lending Operations', value: 78, color: '#F59E0B' },
  { name: 'IT Operations', value: 88, color: '#8B5CF6' },
  { name: 'Compliance', value: 92, color: '#EC4899' },
]

const kpiDistribution = [
  { name: 'Automated', value: 68, color: '#06B6D4' },
  { name: 'Assisted', value: 22, color: '#8B5CF6' },
  { name: 'Escalated', value: 10, color: '#F59E0B' },
]

export default function BusinessPerformance() {
  const csMetrics = businessMetrics['cs-agent-001']
  const resolutionDrop = ((csMetrics.previousResolutionRate - csMetrics.resolutionRate) / csMetrics.previousResolutionRate * 100).toFixed(1)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with context */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">Business Performance Overview</h2>
        <p className="text-primary-100">
          Business metrics derived from actual outcomes, not just system telemetry. These KPIs
          reflect how agents are contributing to ABC Bank's business objectives.
        </p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          label="Overall Resolution Rate"
          value="78.5"
          suffix="%"
          icon={CheckCircleIcon}
          trend="down"
          trendValue={parseFloat(resolutionDrop)}
        />
        <MetricCard
          label="Customer Satisfaction"
          value="4.1"
          suffix="/5"
          icon={UserGroupIcon}
          trend="down"
          trendValue={8.9}
        />
        <MetricCard
          label="Daily Throughput"
          value={formatNumber(8450)}
          suffix=" interactions"
          icon={ClockIcon}
          trend="up"
          trendValue={12.3}
        />
        <MetricCard
          label="Cost Savings"
          value={formatCurrency(2400000)}
          suffix="/year"
          icon={CurrencyDollarIcon}
          trend="up"
          trendValue={18.5}
        />
      </div>

      {/* Alert Banner */}
      <div className="bg-warning-light border border-warning rounded-lg p-4 flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-warning flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">!</span>
        </div>
        <div>
          <p className="font-medium text-warning-dark">Q4 Performance Drop Detected</p>
          <p className="text-sm text-warning-dark/80 mt-1">
            Resolution rate dropped from 85.2% to 78.5% (-{resolutionDrop}%) in Q4.
            Customer satisfaction also declined. Investigation recommended via Behavior Analysis.
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Resolution Rate Trend"
            subtitle="12-month trend showing Q4 decline"
          />
          <LineChart
            data={resolutionData}
            dataKey="value"
            color="#06B6D4"
            height={280}
            referenceLine={{ value: 80, label: 'Target', color: '#EF4444' }}
          />
        </Card>

        <Card>
          <CardHeader
            title="Customer Satisfaction"
            subtitle="Average CSAT score trend"
          />
          <LineChart
            data={satisfactionData}
            dataKey="value"
            color="#10B981"
            height={280}
            referenceLine={{ value: 4.0, label: 'Minimum', color: '#EF4444' }}
          />
        </Card>
      </div>

      {/* Team Performance + Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Performance by Team"
              subtitle="Resolution rate by business team"
            />
            <BarChart
              data={teamPerformance}
              dataKey="value"
              xAxisKey="name"
              height={280}
            />
          </Card>
        </div>

        <Card>
          <CardHeader
            title="Interaction Distribution"
            subtitle="How interactions are handled"
          />
          <DonutChart
            data={kpiDistribution}
            height={280}
          />
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Automation Rate</span>
              <span className="font-semibold text-slate-900">68%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Escalation Rate</span>
              <span className="font-semibold text-warning">10%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Business Impact */}
      <Card>
        <CardHeader title="Business Impact Summary" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-slate-500">Hours Saved (Monthly)</p>
            <p className="text-2xl font-bold text-slate-900">12,450</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Tickets Automated</p>
            <p className="text-2xl font-bold text-slate-900">87,320</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Avg Handle Time Reduction</p>
            <p className="text-2xl font-bold text-success">-42%</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Customer Wait Time</p>
            <p className="text-2xl font-bold text-success">-65%</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
