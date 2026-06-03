RAG (Retrieval-Augmented Generation) helper scripts for Scoopify

Files
- `ingest.py`: traverse the repo and extract text from `.md`, `.txt`, `.html`, and `.json` files
- `index.py`: build embeddings with `sentence-transformers` and store a FAISS index
- `query.py`: search the FAISS index; optional OpenAI synthesis when `OPENAI_API_KEY` is set

Quick start

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Build the index (runs inference locally with `all-MiniLM-L6-v2`):

```bash
python rag/index.py
```

3. Query the index:

```bash
python rag/query.py "How do I generate tickets?"
```

4. (Optional) Generate an answer via OpenAI (set `OPENAI_API_KEY` first):

```bash
export OPENAI_API_KEY=sk-...
python rag/query.py "How do I generate tickets?" --openai
```

Notes
- The scripts are intentionally minimal and avoid heavy wrappers. They should work on a local machine with Python 3.8+.
- Adjust `model_name` in `index.py` or `query.py` to use different SBERT models.
