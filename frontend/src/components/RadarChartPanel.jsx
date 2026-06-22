import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1a1f2e',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: '0.8rem',
      }}>
        <p style={{ color: 'var(--text-secondary)' }}>{payload[0].payload.metric}</p>
        <p style={{ color: '#a78bfa', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
          {payload[0].value.toFixed(1)}%
        </p>
      </div>
    )
  }
  return null
}

export default function RadarChartPanel({ data }) {
  return (
    <div className="glass-card chart-card">
      <p className="chart-card-title">Metric Radar</p>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data} outerRadius={100}>
          <PolarGrid
            stroke="rgba(255,255,255,0.06)"
            gridType="polygon"
          />
          <PolarAngleAxis
            dataKey="metric"
            tick={{
              fill: '#64748b',
              fontSize: 11,
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
            }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#475569', fontSize: 9 }}
            tickCount={4}
            stroke="rgba(255,255,255,0.04)"
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.18}
            strokeWidth={2}
            dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
