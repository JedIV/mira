import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'

export function LineChart({
  data,
  dataKey,
  xAxisKey = 'month',
  color = '#06B6D4',
  height = 300,
  showGrid = true,
  referenceLine = null,
  strokeWidth = 2,
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLine data={data}>
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
        {referenceLine && (
          <ReferenceLine
            y={referenceLine.value}
            stroke={referenceLine.color || '#EF4444'}
            strokeDasharray="5 5"
            label={{
              value: referenceLine.label,
              fill: referenceLine.color || '#EF4444',
              fontSize: 12,
            }}
          />
        )}
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={strokeWidth}
          dot={{ fill: color, strokeWidth: 0, r: 3 }}
          activeDot={{ fill: color, strokeWidth: 0, r: 5 }}
        />
      </RechartsLine>
    </ResponsiveContainer>
  )
}

export function MultiLineChart({
  data,
  lines,
  xAxisKey = 'month',
  height = 300,
  showGrid = true,
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLine data={data}>
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
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={2}
            dot={{ fill: line.color, strokeWidth: 0, r: 3 }}
            activeDot={{ fill: line.color, strokeWidth: 0, r: 5 }}
          />
        ))}
      </RechartsLine>
    </ResponsiveContainer>
  )
}
