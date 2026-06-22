export default function MatchedSentences({ matches }) {
  const hasMatches = matches && matches.length > 0

  return (
    <div className="glass-card matched-card">
      <div className="matched-header">
        <p className="matched-title">Matched Sentences</p>
        {hasMatches ? (
          <span className="matched-count">{matches.length} Match{matches.length !== 1 ? 'es' : ''}</span>
        ) : (
          <span style={{ padding: '4px 12px', background: 'var(--green-dim)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700, color: 'var(--green)' }}>
            None found
          </span>
        )}
      </div>

      {!hasMatches ? (
        <div className="no-matches">
          <div className="no-matches-icon">✅</div>
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>No direct sentence matches</p>
          <p style={{ fontSize: '0.82rem' }}>No sentences exceeded the similarity threshold. The texts may still share vocabulary or topic similarities.</p>
        </div>
      ) : (
        <div>
          {matches.map((match, idx) => (
            <MatchItem key={idx} match={match} index={idx} />
          ))}
        </div>
      )}
    </div>
  )
}

function MatchItem({ match, index }) {
  const scoreColor = match.score >= 90 ? 'var(--red)' : match.score >= 72 ? 'var(--amber)' : 'var(--green)'

  return (
    <div className="match-item fade-in" style={{ animationDelay: `${index * 0.06}s` }}>
      <div
        className="match-score-bar"
        style={{
          width: `${match.score}%`,
          background: match.score >= 90
            ? 'linear-gradient(90deg, #ef4444, #f97316)'
            : 'linear-gradient(90deg, #f59e0b, #eab308)',
        }}
      />
      <div className="match-body">
        <div className="match-col">
          <p className="match-col-label">Original (Doc A)</p>
          <p className="match-col-text">"{match.original}"</p>
        </div>
        <div className="match-col">
          <p className="match-col-label">Submitted (Doc B)</p>
          <p className="match-col-text">"{match.submitted}"</p>
        </div>
      </div>
      <div className="match-footer">
        <span className="match-score-label">Similarity</span>
        <span className="match-score-value" style={{ color: scoreColor }}>{match.score}%</span>
      </div>
    </div>
  )
}
