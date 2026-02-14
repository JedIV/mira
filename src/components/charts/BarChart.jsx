import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts'

export function BarChart({
  data,
  dataKey,
  xAxisKey = 'name',
  color = '#2AB1AC',
  height = 300,
  showGrid = true,
  horizontal = false,
}) {
  const Chart = (
    <RechartsBar
      data={data}
      layout={horizontal ? 'vertical' : 'horizontal'}
    >
      {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={!horizontal} vertical={horizontal} />}

      {horizontal ? (
        <>
          <XAxis type="number" tick={{ fill: '#64748B', fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis
            dataKey={xAxisKey}
            type="category"
            tick={{ fill: '#64748B', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={100}
          />
        </>
      ) : (
        <>
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
        </>
      )}

      <Tooltip
        contentStyle={{
          backgroundColor: '#0F172A',
          border: 'none',
          borderRadius: '8px',
          color: '#F8FAFC',
          fontSize: '13px',
        }}
      />
      <Bar
        dataKey={dataKey}
        fill={color}
        radius={[4, 4, 4, 4]}
        maxBarSize={50}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color || color} />
        ))}
      </Bar>
    </RechartsBar>
  )

  return (
    <ResponsiveContainer width="100%" height={height}>
      {Chart}
    </ResponsiveContainer>
  )
}
