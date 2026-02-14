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
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className={size === 'large' ? 'text-4xl font-extrabold text-slate-900' : 'metric-value'}>
              {value}
            </span>
            {suffix && <span className="text-lg font-medium text-slate-400">{suffix}</span>}
          </div>
          {trendValue !== null && (
            <div className={`flex items-center gap-1 mt-2.5 text-sm font-semibold ${
              isPositiveTrend ? 'text-emerald-600' : isNegativeTrend ? 'text-red-600' : 'text-slate-500'
            }`}>
              {isPositiveTrend && <ArrowUpIcon className="w-3.5 h-3.5" />}
              {isNegativeTrend && <ArrowDownIcon className="w-3.5 h-3.5" />}
              <span>{Math.abs(trendValue)}%</span>
              <span className="text-slate-400 font-normal text-xs ml-0.5">vs last period</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <Icon className="w-5 h-5 text-slate-400" />
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
      <p className="text-lg font-bold text-slate-900">
        {value}{suffix && <span className="text-sm text-slate-400 ml-0.5">{suffix}</span>}
      </p>
    </div>
  )
}
