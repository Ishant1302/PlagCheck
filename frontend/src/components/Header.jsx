export default function Header({ onReset }) {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo" aria-hidden>🧬</div>
        <div>
          <h1 className="header-title">
            Plag<span className="gradient-text">Check</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 1 }}>
            Multi-metric plagiarism intelligence
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="header-pill">v2.0</span>
        {onReset && (
          <button className="btn-ghost" onClick={onReset} title="Clear and start over">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.7"/>
            </svg>
            Reset
          </button>
        )}
      </div>
    </header>
  )
}
