import {
  AreaChart as RechartsArea,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

export function AreaChart({
  data,
  dataKey,
  xAxisKey = 'time',
  color = '#06B6D4',
  height = 300,
  showGrid = true,
  gradient = true,
}) {
  const gradientId = `gradient-${dataKey}`

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsArea data={data}>
        {gradient && (
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
        )}
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />}
        <XAxis
          dataKey={xAxisKey}
          tick={{ fill: '#64748B', fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: '#E2E8F0' }}
        />
        <YAxis
          tick={{ fill: '#64748B', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          width={40}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0F172A',
            border: 'none',
            borderRadius: '8px',
            color: '#F8FAFC',
            fontSize: '13px',
          }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fill={gradient ? `url(#${gradientId})` : color}
          fillOpacity={gradient ? 1 : 0.1}
        />
      </RechartsArea>
    </ResponsiveContainer>
  )
}
