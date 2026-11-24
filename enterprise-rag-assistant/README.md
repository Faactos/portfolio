# Enterprise RAG Assistant

A document-grounded question answering system: upload PDFs, ask questions, get
answers with citations that trace back to a specific document and page — and an
explicit refusal when the documents do not contain the answer.

Runs entirely on free infrastructure. Embeddings and reranking are local models;
generation uses the Groq free tier (or Ollama for fully offline operation).

---

## What this demonstrates

The interesting claim is not "the chatbot responds." It is **how retrieval
settings change answer quality**, measured on a gold test set:

```bash
python -m eval.sweep --dataset eval/datasets/sample.json --corpus data/corpus
```

That sweeps chunk size (256 / 512 / 1024), top-k (3 / 5), hybrid search on/off,
and reranking on/off — 24 configurations — and emits a comparison table of
recall@k, precision@k, nDCG, MRR, groundedness, citation validity, refusal
accuracy, p50 latency, and estimated cost. Results land in
`eval/results/sweep.md`.

## Architecture

```
PDF/TXT ──► PyMuPDF ──► page-aware chunker ──► bge-small embeddings ──► Qdrant
                                                                          │
question ──► bge query embedding ──► vector search ──┐                    │
         └─► BM25 lexical search ───────────────────►├─ RRF fusion ◄──────┘
                                                     │
                                       bge-reranker cross-encoder
                                                     │
                                     top-k passages ─┴─► Groq LLM ──► cited answer
                                                                      or refusal
```

Every retrieval call is scoped to the `doc_ids` the requesting user may read, so
access control is enforced in the data layer rather than in route handlers.

| Component | Choice | Cost |
|---|---|---|
| PDF extraction | PyMuPDF (keeps page numbers) | free |
| Embeddings | `BAAI/bge-small-en-v1.5`, local CPU | free |
| Vector store | Qdrant (embedded file mode or Docker) | free |
| Lexical search | BM25 (`rank_bm25`) + Reciprocal Rank Fusion | free |
| Reranking | `BAAI/bge-reranker-base` cross-encoder, local | free |
| Generation | Groq free tier (`openai/gpt-oss-120b`) | free tier |
| Offline fallback | Ollama (`llama3.1:8b`) | free |
| API / UI | FastAPI + Streamlit, SQLite for metadata | free |

## Grounding guarantees

Three independent gates keep answers traceable:

1. **Score floor** — if no passage clears `MIN_SCORE`, the system refuses before
   calling the LLM. Weak context is the main way a RAG system fabricates.
2. **Mandatory citations** — the prompt requires `[n]` markers; an answer with no
   valid citation is converted into a refusal rather than returned.
3. **Marker validation** — citation markers outside the retrieved passage range
   are dropped, so a hallucinated `[9]` can never surface as a source link.

## Quick start

### Local (no Docker)

```bash
python -m venv .venv && .venv/Scripts/activate      # Windows
pip install -r requirements.txt

cp .env.example .env            # add your free Groq key
export GROQ_API_KEY=gsk_...     # or set it in .env

uvicorn app.api.main:app --reload       # API on :8000
streamlit run ui/app.py                 # UI on :8501
```

Qdrant runs in embedded file mode when `QDRANT_URL` is unset, so nothing extra
needs to be running. First launch downloads ~200MB of models.

### Docker

```bash
echo "GROQ_API_KEY=gsk_..." > .env
docker compose up --build
```

UI at http://localhost:8501, API docs at http://localhost:8000/docs.

## API

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/auth/register` | Create a user, returns a bearer token (shown once) |
| `POST` | `/documents` | Upload and index a PDF/TXT/MD |
| `GET` | `/documents` | List owned and shared documents |
| `DELETE` | `/documents/{id}` | Owner-only delete (vectors, file, and metadata) |
| `POST` | `/documents/{id}/share` | Grant another user read access |
| `POST` | `/ask` | Grounded answer with citations |
| `POST` | `/retrieve` | Retrieval only — inspect why an answer went wrong |

```bash
TOKEN=$(curl -s -X POST localhost:8000/auth/register \
  -H 'content-type: application/json' -d '{"email":"me@example.com"}' | jq -r .token)

curl -X POST localhost:8000/documents -H "Authorization: Bearer $TOKEN" \
  -F file=@data/corpus/acme-leave-policy.md

curl -X POST localhost:8000/ask -H "Authorization: Bearer $TOKEN" \
  -H 'content-type: application/json' \
  -d '{"question":"How many days of annual leave do full-time employees get?"}'
```

## Evaluation

The gold set (`eval/datasets/sample.json`) labels relevant pages per question
and includes **three deliberately unanswerable questions** — the refusal-accuracy
metric checks the system declines exactly when it should, which a recall-only
eval would miss entirely.

```bash
# one configuration
python -m eval.run_eval --dataset eval/datasets/sample.json --user-id <uid>

# retrieval metrics only (no LLM, no API key, no quota)
python -m eval.run_eval --dataset ... --user-id <uid> --retrieval-only

# full sweep
python -m eval.sweep --dataset eval/datasets/sample.json --corpus data/corpus
```

Metrics come from `packages/llm_eval_toolkit`, a standalone module shared across
projects. Deterministic checks are the ground truth; LLM-as-judge scorers in
`judges.py` are supplementary evidence only.

## Configuration

Every retrieval knob is env-overridable so the sweep can vary it without code
changes — see `.env.example`. The important ones:

| Variable | Default | Effect |
|---|---|---|
| `CHUNK_SIZE` / `CHUNK_OVERLAP` | 512 / 64 | words per chunk; chunks never span pages |
| `TOP_K` | 5 | passages passed to the LLM |
| `CANDIDATE_K` | 20 | pre-rerank candidate pool |
| `USE_HYBRID` | true | BM25 + vector fusion via RRF |
| `USE_RERANKER` | true | cross-encoder reranking |
| `MIN_SCORE` | 0.25 | refusal threshold |

## Tests

```bash
pytest tests/ -q
```

Offline by design — chunking, RRF, citation resolution, refusal behaviour, ACL
enforcement, and every metric are tested with stubs, no models or network.
