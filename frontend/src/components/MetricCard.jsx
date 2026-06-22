import { useEffect, useState } from 'react'

function getBarColor(score) {
  if (score >= 70) return 'linear-gradient(90deg, #ef4444, #f97316)'
  if (score >= 35) return 'linear-gradient(90deg, #f59e0b, #eab308)'
  return 'linear-gradient(90deg, #22c55e, #16a34a)'
}

export default function MetricCard({ label, description, weight, score, color }) {
  const [animScore, setAnimScore] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setAnimScore(score), 150)
    return () => clearTimeout(t)
  }, [score])

  return (
    <div className="glass-card metric-card">
      <div className="metric-card-header">
        <div>
          <p className="metric-card-name">{label}</p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Weight: {weight}
          </p>
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `${color}20`,
            border: `1px solid ${color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
      </div>

      <p className="metric-card-value" style={{ color }}>
        {score.toFixed(1)}
        <span style={{ fontSize: '0.9rem', fontWeight: 500, marginLeft: 2 }}>%</span>
      </p>

      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5 }}>
        {description}
      </p>

      <div className="metric-bar-track">
        <div
          className="metric-bar-fill"
          style={{
            width: `${animScore}%`,
            background: getBarColor(score),
          }}
        />
      </div>
    </div>
  )
}
