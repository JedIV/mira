import { ArrowUpIcon, ArrowDownIcon } from '../navigation/Icons'

export function MetricCard({
  label,
  value,
  suffix = '',
  trend = null,
  trendValue = null,
  icon: Icon,
  size = 'default',
  className = ''
}) {
  const isPositiveTrend = trend === 'up'
  const isNegativeTrend = trend === 'down'

  return (
    <div className={`card p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="metric-label">{label}</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className={size === 'large' ? 'text-4xl font-bold text-slate-900' : 'metric-value'}>
              {value}
            </span>
            {suffix && <span className="text-lg text-slate-500">{suffix}</span>}
          </div>
          {trendValue !== null && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${
              isPositiveTrend ? 'text-success' : isNegativeTrend ? 'text-danger' : 'text-slate-500'
            }`}>
              {isPositiveTrend && <ArrowUpIcon className="w-4 h-4" />}
              {isNegativeTrend && <ArrowDownIcon className="w-4 h-4" />}
              <span>{Math.abs(trendValue)}%</span>
              <span className="text-slate-400 font-normal">vs last period</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-slate-100 rounded-xl">
            <Icon className="w-6 h-6 text-slate-600" />
          </div>
        )}
      </div>
    </div>
  )
}

export function MiniMetric({ label, value, suffix = '' }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-900">
        {value}{suffix && <span className="text-sm text-slate-500 ml-0.5">{suffix}</span>}
      </p>
    </div>
  )
}
