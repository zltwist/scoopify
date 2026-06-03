from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import json
import os
from pathlib import Path

INDEX_PATH = Path(__file__).resolve().parent / 'index.faiss'
DOCS_PATH = Path(__file__).resolve().parent / 'docs.json'


def load_index_and_docs():
    if not INDEX_PATH.exists() or not DOCS_PATH.exists():
        raise FileNotFoundError('Index or docs not found. Run rag/index.py to build index first.')
    index = faiss.read_index(str(INDEX_PATH))
    with open(DOCS_PATH, 'r', encoding='utf8') as f:
        docs = json.load(f)
    return index, docs


def query_topk(query: str, k: int = 5, model_name: str = 'all-MiniLM-L6-v2'):
    model = SentenceTransformer(model_name)
    emb = model.encode([query], convert_to_numpy=True)
    emb = emb / np.linalg.norm(emb, axis=1, keepdims=True)
    index, docs = load_index_and_docs()
    D, I = index.search(emb.astype('float32'), k)
    results = []
    for score, idx in zip(D[0], I[0]):
        if idx < 0 or idx >= len(docs):
            continue
        # normalize doc shape to include id/title/content/keywords/source
        d = docs[idx]
        normalized = {
            'id': d.get('id', f'doc-{idx}'),
            'title': d.get('title', Path(d.get('source', '')).name if d.get('source') else d.get('id', '')),
            'content': d.get('content', d.get('text', '')),
            'keywords': d.get('keywords', []),
            'source': d.get('source', ''),
        }
        results.append({'score': float(score), 'doc': normalized})
    return results


def generate_answer_openai(query: str, contexts, max_tokens: int = 256):
    try:
        import openai
    except Exception:
        raise RuntimeError('openai package not installed')

    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        raise RuntimeError('OPENAI_API_KEY not set in environment')
    openai.api_key = api_key

    prompt = 'You are a helpful assistant. Use the following context to answer the question.\n\n'
    for i, c in enumerate(contexts):
        prompt += f'Context {i+1}: {c["doc"]["content"]}\n---\n'
    prompt += f'Question: {query}\nAnswer:'

    resp = openai.Completion.create(engine='text-davinci-003', prompt=prompt, max_tokens=max_tokens, temperature=0.0)
    return resp.choices[0].text.strip()


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('query', help='Query string')
    parser.add_argument('--k', type=int, default=5)
    parser.add_argument('--model', default='all-MiniLM-L6-v2')
    parser.add_argument('--openai', action='store_true', help='Use OpenAI to synthesize answer (requires OPENAI_API_KEY)')
    args = parser.parse_args()

    results = query_topk(args.query, k=args.k, model_name=args.model)
    for r in results:
        print(f"[{r['score']:.4f}] {r['doc']['id']}")

    if args.openai:
        ans = generate_answer_openai(args.query, results)
        print('\n=== Generated answer ===\n')
        print(ans)
