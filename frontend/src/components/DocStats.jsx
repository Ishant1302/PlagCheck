const STATS_META = [
  { key: 'word_count',          label: 'Total Words',          icon: '📝' },
  { key: 'unique_words',        label: 'Unique Words',          icon: '✨' },
  { key: 'sentence_count',      label: 'Sentences',             icon: '📄' },
  { key: 'avg_sentence_length', label: 'Avg. Sentence Length',  icon: '📏' },
  { key: 'content_words',       label: 'Content Words',         icon: '🔤' },
]

function StatPanel({ label, docKey, stats }) {
  return (
    <div className="glass-card doc-stats-card">
      <p className="doc-stats-heading">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        {label}
      </p>
      {STATS_META.map(({ key, label: statLabel, icon }) => (
        <div className="stat-row" key={key}>
          <span className="stat-label">
            <span style={{ marginRight: 6, fontSize: '0.85rem' }}>{icon}</span>
            {statLabel}
          </span>
          <span className="stat-value">
            {stats?.[key] !== undefined ? stats[key].toLocaleString() : '—'}
            {key === 'avg_sentence_length' ? ' words' : ''}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function DocStats({ stats }) {
  return (
    <div className="doc-stats-row" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p className="chart-card-title" style={{ marginBottom: 0, padding: '0 4px' }}>Document Statistics</p>
      <StatPanel label="Document A — Original" docKey="doc1" stats={stats?.doc1} />
      <StatPanel label="Document B — Submitted" docKey="doc2" stats={stats?.doc2} />
    </div>
  )
}
