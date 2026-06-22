export default function LoadingSpinner() {
  return (
    <div className="glass-card spinner-overlay fade-in" style={{ marginBottom: 28 }}>
      <div className="spinner" />
      <p className="spinner-text">Running linguistic analysis…</p>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: 280 }}>
        Computing TF-IDF, Jaccard, n-gram overlaps, and sentence-level matching
      </p>
    </div>
  )
}
