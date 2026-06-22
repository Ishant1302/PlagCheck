import { useState } from 'react'
import axios from 'axios'
import Header from './components/Header'
import TextInputPanel from './components/TextInputPanel'
import ScoreRing from './components/ScoreRing'
import VerdictBadge from './components/VerdictBadge'
import MetricCard from './components/MetricCard'
import RadarChartPanel from './components/RadarChartPanel'
import MatchedSentences from './components/MatchedSentences'
import DocStats from './components/DocStats'
import LoadingSpinner from './components/LoadingSpinner'

const METRIC_META = [
  {
    key: 'tfidf',
    label: 'TF-IDF Cosine',
    description: 'Content & topic similarity using term weighting',
    weight: '35%',
    color: '#6366f1',
  },
  {
    key: 'jaccard',
    label: 'Jaccard Index',
    description: 'Vocabulary overlap between both texts',
    weight: '20%',
    color: '#8b5cf6',
  },
  {
    key: 'bigram',
    label: 'Bigram Match',
    description: 'Phrase-level paraphrase detection (2-word)',
    weight: '20%',
    color: '#a78bfa',
  },
  {
    key: 'trigram',
    label: 'Trigram Match',
    description: 'Longer phrase detection (3-word sequences)',
    weight: '10%',
    color: '#c4b5fd',
  },
  {
    key: 'sentence_level',
    label: 'Sentence Match',
    description: 'Direct sentence-by-sentence copy detection',
    weight: '15%',
    color: '#7c3aed',
  },
]

export default function App() {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!text1.trim() || !text2.trim()) {
      setError('Please enter text in both panels before analyzing.')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const { data } = await axios.post('/api/check', { text1, text2 })
      setResult(data)
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          'Failed to reach the backend. Make sure the Flask server is running on port 5000.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setText1('')
    setText2('')
    setResult(null)
    setError(null)
  }

  const canAnalyze = text1.trim().length > 20 && text2.trim().length > 20

  const radarData = result
    ? METRIC_META.map((m) => ({
        metric: m.label.split(' ')[0],
        value: result.scores[m.key] ?? 0,
      }))
    : []

  return (
    <div className="app-wrapper">
      <Header onReset={result ? handleReset : undefined} />

      {/* ── Input Section ── */}
      <TextInputPanel
        text1={text1}
        text2={text2}
        onText1Change={setText1}
        onText2Change={setText2}
      />

      {/* ── Analyze Button ── */}
      <div className="analyze-row">
        <button
          className="btn-primary"
          onClick={handleAnalyze}
          disabled={!canAnalyze || loading}
        >
          {loading ? (
            <>
              <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
              Analyzing…
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Analyze for Plagiarism
            </>
          )}
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="error-banner fade-in" style={{ marginBottom: 28 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {/* ── Loading ── */}
      {loading && <LoadingSpinner />}

      {/* ── Results ── */}
      {result && !loading && (
        <div className="results-section fade-in">

          {/* Score Hero */}
          <div className="glass-card score-hero">
            <ScoreRing score={result.similarity} verdict={result.verdict} />
            <div className="score-hero-info">
              <p className="score-hero-label">Overall Similarity Score</p>
              <p className="score-hero-value" style={{ color: verdictColor(result.verdict) }}>
                {result.similarity}%
              </p>
              <VerdictBadge verdict={result.verdict} />
              <p className="score-hero-desc">
                {verdictDesc(result.verdict, result.similarity)}
              </p>
            </div>
          </div>

          {/* Metric Cards */}
          <div>
            <div className="section-header">
              <span className="section-title">Metric Breakdown</span>
              <div className="section-line" />
            </div>
            <div className="metrics-grid">
              {METRIC_META.map((m) => (
                <MetricCard
                  key={m.key}
                  label={m.label}
                  description={m.description}
                  weight={m.weight}
                  score={result.scores[m.key] ?? 0}
                  color={m.color}
                />
              ))}
            </div>
          </div>

          {/* Charts Row */}
          <div className="charts-row">
            <RadarChartPanel data={radarData} />
            <DocStats stats={result.stats} />
          </div>

          {/* Matched Sentences */}
          <MatchedSentences matches={result.matched_sentences} />

        </div>
      )}

      {/* ── Empty State ── */}
      {!result && !loading && !error && (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <p className="empty-title">Ready to Detect</p>
          <p className="empty-desc">
            Paste two pieces of text above and click <strong>Analyze</strong>. We'll compare
            them across five linguistic metrics and highlight any similarities.
          </p>
        </div>
      )}
    </div>
  )
}

function verdictColor(verdict) {
  if (verdict === 'High') return 'var(--red)'
  if (verdict === 'Moderate') return 'var(--amber)'
  return 'var(--green)'
}

function verdictDesc(verdict, score) {
  if (verdict === 'High')
    return `A ${score}% similarity score indicates a very high likelihood of plagiarism. The submitted text closely mirrors the original across multiple linguistic dimensions.`
  if (verdict === 'Moderate')
    return `A ${score}% similarity score suggests moderate overlap. Some content may be paraphrased or partially reused. Review matched sentences for context.`
  return `A ${score}% similarity score suggests the texts are largely original and distinct from each other.`
}
