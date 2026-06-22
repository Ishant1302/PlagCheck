import { useState } from 'react'

function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

function InputCard({ id, label, docNum, value, onChange }) {
  const words = countWords(value)
  const chars = value.length

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      onChange(text)
    } catch {
      // clipboard access denied
    }
  }

  return (
    <div className="glass-card input-card">
      <div className="input-card-header">
        <span className="input-card-label">
          <span className="doc-badge">{docNum}</span>
          {label}
        </span>
        <div className="input-card-actions">
          <button className="btn-ghost" onClick={handlePaste} title="Paste from clipboard">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            </svg>
            Paste
          </button>
          {value && (
            <button className="btn-ghost" onClick={() => onChange('')} title="Clear">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>

      <textarea
        id={id}
        className="text-area"
        placeholder={`Paste or type ${label.toLowerCase()} here…\n\nMinimum 20 characters needed to analyze.`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck
      />

      <div className="input-meta">
        <span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          {words} words
        </span>
        <span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 7 4 4 20 4 20 7"/>
            <line x1="9" y1="20" x2="15" y2="20"/>
            <line x1="12" y1="4" x2="12" y2="20"/>
          </svg>
          {chars} chars
        </span>
        {value.trim().length > 0 && value.trim().length < 20 && (
          <span style={{ color: 'var(--amber)', fontWeight: 600 }}>Need more text</span>
        )}
        {value.trim().length >= 20 && (
          <span style={{ color: 'var(--green)', fontWeight: 600 }}>✓ Ready</span>
        )}
      </div>
    </div>
  )
}

export default function TextInputPanel({ text1, text2, onText1Change, onText2Change }) {
  return (
    <div className="input-grid">
      <InputCard
        id="text1"
        label="Original Document"
        docNum="A"
        value={text1}
        onChange={onText1Change}
      />
      <InputCard
        id="text2"
        label="Submitted Document"
        docNum="B"
        value={text2}
        onChange={onText2Change}
      />
    </div>
  )
}
