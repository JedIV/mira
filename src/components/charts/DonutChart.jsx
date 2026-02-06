import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

export function DonutChart({
  data,
  height = 250,
  innerRadius = 60,
  outerRadius = 90,
  showLegend = true,
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          dataKey="value"
          nameKey="name"
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#0F172A',
            border: 'none',
            borderRadius: '8px',
            color: '#F8FAFC',
            fontSize: '13px',
          }}
          formatter={(value, name) => [`${value}%`, name]}
        />
        {showLegend && (
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-sm text-slate-600">{value}</span>
            )}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  )
}

export function MiniDonut({ data, size = 80, strokeWidth = 8 }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <ResponsiveContainer width={size} height={size}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={size / 2 - strokeWidth}
          outerRadius={size / 2}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
