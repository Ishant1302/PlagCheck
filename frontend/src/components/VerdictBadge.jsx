export default function VerdictBadge({ verdict }) {
  const classes = {
    Low: 'verdict-badge verdict-low',
    Moderate: 'verdict-badge verdict-moderate',
    High: 'verdict-badge verdict-high',
  }
  const icons = {
    Low: '✓',
    Moderate: '⚠',
    High: '✕',
  }
  const labels = {
    Low: 'Low Plagiarism',
    Moderate: 'Moderate Similarity',
    High: 'High Plagiarism',
  }

  return (
    <span className={classes[verdict] || 'verdict-badge'}>
      <span className="pulse-dot" aria-hidden />
      <span style={{ marginLeft: 2, fontSize: '0.9rem' }}>{icons[verdict]}</span>
      {labels[verdict] || verdict}
    </span>
  )
}
