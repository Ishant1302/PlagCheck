import { useEffect, useState } from 'react'

const RADIUS = 68
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function getColor(verdict) {
  if (verdict === 'High') return '#ef4444'
  if (verdict === 'Moderate') return '#f59e0b'
  return '#22c55e'
}

export default function ScoreRing({ score, verdict }) {
  const [animated, setAnimated] = useState(0)
  const color = getColor(verdict)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  const offset = CIRCUMFERENCE - (animated / 100) * CIRCUMFERENCE

  return (
    <div className="score-ring-wrapper">
      <svg width="160" height="160" viewBox="0 0 160 160">
        {/* track */}
        <circle
          cx="80" cy="80" r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
        />
        {/* fill */}
        <circle
          cx="80" cy="80" r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s ease',
            filter: `drop-shadow(0 0 8px ${color}80)`,
          }}
        />
        {/* subtle glow track */}
        <circle
          cx="80" cy="80" r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          opacity="0.15"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="score-ring-center">
        <span className="score-ring-pct" style={{ color }}>
          {Math.round(animated)}
          <span style={{ fontSize: '1rem', fontWeight: 600, marginLeft: 1 }}>%</span>
        </span>
        <span className="score-ring-sub">Similarity</span>
      </div>
    </div>
  )
}
