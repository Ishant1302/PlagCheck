from flask import Flask, request, jsonify, send_file
import os
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import math
import string
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

# Download required NLTK data on first run
try:
    nltk.data.find('tokenizers/punkt_tab')
except LookupError:
    nltk.download('punkt_tab', quiet=True)

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


@app.route('/', methods=['GET'])
def index():
    return send_file(os.path.join(BASE_DIR, 'dashboard.html'))

stemmer = PorterStemmer()
STOP_WORDS = set(stopwords.words('english'))


# ─── Text Preprocessing ───────────────────────────────────────────────────────

def clean_text(text: str) -> str:
    """Lowercase, remove punctuation/extra whitespace."""
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    text = text.translate(str.maketrans('', '', string.punctuation))
    return text.strip()


def tokenize(text: str) -> list[str]:
    return word_tokenize(clean_text(text))


def stem_tokens(tokens: list[str]) -> list[str]:
    return [stemmer.stem(t) for t in tokens if t not in STOP_WORDS and len(t) > 1]


def get_ngrams(tokens: list[str], n: int) -> set[tuple]:
    return set(zip(*[tokens[i:] for i in range(n)]))


# ─── Similarity Metrics ──────────────────────────────────────────────────────

def tfidf_similarity(text1: str, text2: str) -> float:
    """Cosine similarity via TF-IDF on stemmed tokens."""
    stemmed1 = ' '.join(stem_tokens(tokenize(text1)))
    stemmed2 = ' '.join(stem_tokens(tokenize(text2)))
    if not stemmed1 or not stemmed2:
        return 0.0
    vectorizer = TfidfVectorizer()
    try:
        matrix = vectorizer.fit_transform([stemmed1, stemmed2])
        return float(cosine_similarity(matrix)[0][1])
    except Exception:
        return 0.0


def jaccard_similarity(text1: str, text2: str) -> float:
    """Word-set Jaccard similarity (ignores stop words, uses stemming)."""
    set1 = set(stem_tokens(tokenize(text1)))
    set2 = set(stem_tokens(tokenize(text2)))
    if not set1 or not set2:
        return 0.0
    intersection = set1 & set2
    union = set1 | set2
    return len(intersection) / len(union)


def ngram_similarity(text1: str, text2: str, n: int = 2) -> float:
    """N-gram overlap ratio (bigrams by default)."""
    tokens1 = stem_tokens(tokenize(text1))
    tokens2 = stem_tokens(tokenize(text2))
    if len(tokens1) < n or len(tokens2) < n:
        return 0.0
    grams1 = get_ngrams(tokens1, n)
    grams2 = get_ngrams(tokens2, n)
    if not grams1 or not grams2:
        return 0.0
    intersection = grams1 & grams2
    # Dice coefficient for n-grams
    return (2 * len(intersection)) / (len(grams1) + len(grams2))


def sentence_matching(text1: str, text2: str, threshold: float = 0.72) -> dict:
    """
    Find sentences in text2 that are highly similar to any sentence in text1.
    Uses TF-IDF cosine similarity at the sentence level.
    Returns matched pairs and a sentence-level similarity ratio.
    """
    try:
        sents1 = [s.strip() for s in sent_tokenize(text1) if len(s.strip()) > 20]
        sents2 = [s.strip() for s in sent_tokenize(text2) if len(s.strip()) > 20]
    except Exception:
        return {"matched": [], "sentence_score": 0.0}

    if not sents1 or not sents2:
        return {"matched": [], "sentence_score": 0.0}

    matched = []
    matched_indices2 = set()

    for s2_idx, s2 in enumerate(sents2):
        best_score = 0.0
        best_s1 = None
        for s1 in sents1:
            score = tfidf_similarity(s1, s2)
            if score > best_score:
                best_score = score
                best_s1 = s1
        if best_score >= threshold:
            matched.append({
                "original": best_s1,
                "submitted": s2,
                "score": round(best_score * 100, 1)
            })
            matched_indices2.add(s2_idx)

    sentence_score = len(matched_indices2) / len(sents2) if sents2 else 0.0
    return {"matched": matched, "sentence_score": sentence_score}


def compute_stats(text: str) -> dict:
    """Word count, unique word count, sentence count, avg sentence length."""
    try:
        sentences = sent_tokenize(text)
    except Exception:
        sentences = [text]
    words = tokenize(text)
    filtered = [w for w in words if w not in STOP_WORDS and w.isalpha()]
    return {
        "word_count": len(words),
        "unique_words": len(set(w.lower() for w in words if w.isalpha())),
        "sentence_count": len(sentences),
        "avg_sentence_length": round(len(words) / max(len(sentences), 1), 1),
        "content_words": len(filtered),
    }


# ─── Weighted Final Score ─────────────────────────────────────────────────────

def compute_overall(tfidf: float, jaccard: float, bigram: float,
                    trigram: float, sent_score: float) -> float:
    """
    Weighted composite score:
      35% TF-IDF cosine  — content/topic similarity
      20% Jaccard         — vocabulary overlap
      20% Bigram          — phrase-level paraphrase detection
      10% Trigram         — longer phrase detection
      15% Sentence        — direct copy detection
    """
    return (
        0.35 * tfidf +
        0.20 * jaccard +
        0.20 * bigram +
        0.10 * trigram +
        0.15 * sent_score
    )


# ─── API Routes ───────────────────────────────────────────────────────────────

@app.route('/api/check', methods=['POST'])
def check_plagiarism():
    data = request.get_json(force=True)
    text1 = (data.get('text1') or '').strip()
    text2 = (data.get('text2') or '').strip()

    if not text1 or not text2:
        return jsonify({"error": "Both text1 and text2 are required."}), 400

    # Run all metrics
    tfidf   = tfidf_similarity(text1, text2)
    jaccard = jaccard_similarity(text1, text2)
    bigram  = ngram_similarity(text1, text2, n=2)
    trigram = ngram_similarity(text1, text2, n=3)
    sent    = sentence_matching(text1, text2)
    overall = compute_overall(tfidf, jaccard, bigram, trigram, sent['sentence_score'])

    # Verdict
    if overall >= 0.70:
        verdict = "High"
    elif overall >= 0.35:
        verdict = "Moderate"
    else:
        verdict = "Low"

    return jsonify({
        "similarity": round(overall * 100, 2),
        "verdict": verdict,
        "scores": {
            "tfidf":   round(tfidf   * 100, 2),
            "jaccard": round(jaccard * 100, 2),
            "bigram":  round(bigram  * 100, 2),
            "trigram": round(trigram * 100, 2),
            "sentence_level": round(sent['sentence_score'] * 100, 2),
        },
        "matched_sentences": sent['matched'],
        "stats": {
            "doc1": compute_stats(text1),
            "doc2": compute_stats(text2),
        }
    })


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "version": "2.0"})


if __name__ == '__main__':
    app.run(debug=True, port=5000)