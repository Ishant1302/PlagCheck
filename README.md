# PlagCheck 🧬

A fullstack application plagiarism detector/detection app with a modern React dashboard and a Flask NLP backend to help users check plagiarism for their document or text.

## Stack
- **Backend**: Python / Flask — TF-IDF, Jaccard, N-gram, Sentence matching
- **Frontend**: React (Vite) — dark glassmorphism dashboard with animated charts

## Quick Start

### 1. First install Python dependencies
```bash
pip install -r requirements.txt
```

### 2. Install Node.js dependencies
```bash
cd frontend
npm install
```

### 3. Run the app

**Option A – one-command launch (Windows)**
```
Double-click start.bat
```

**Option B – manually (two terminals)**

Terminal 1 — Backend:
```bash
python app.py
```

Terminal 2 — Frontend:
```bash
cd frontend
npm run dev
```

Then open: **http://localhost:5173**

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/check` | Analyze two texts |
| GET  | `/api/health` | Health check |

## Dashboard Features
- **Score Ring** — animated circular progress with colour coding
- **Verdict Badge** — Low / Moderate / High with pulsing indicator
- **Metric Cards** — TF-IDF, Jaccard, Bigram, Trigram, Sentence scores with progress bars
- **Radar Chart** — all 5 metrics in a spider chart
- **Matched Sentences** — side-by-side original vs submitted pairs
- **Document Stats** — word counts, unique words, sentence counts
