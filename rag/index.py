from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import json
import os
from pathlib import Path
from rag.ingest import load_documents


INDEX_PATH = Path(__file__).resolve().parent / 'index.faiss'
DOCS_PATH = Path(__file__).resolve().parent / 'docs.json'


def build_index(root: str = None, model_name: str = 'all-MiniLM-L6-v2'):
    docs = load_documents(root)
    texts = [d.get('content') for d in docs]
    if not texts:
        print('No documents found to index.')
        return

    model = SentenceTransformer(model_name)
    embeddings = model.encode(texts, show_progress_bar=True, convert_to_numpy=True)

    # normalize embeddings for cosine-similarity via inner product
    norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    embeddings = embeddings / norms

    dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(dim)
    index.add(embeddings.astype('float32'))

    faiss.write_index(index, str(INDEX_PATH))
    # Save docs in a knowledge-base-like schema so downstream code can use them directly
    with open(DOCS_PATH, 'w', encoding='utf8') as f:
        json.dump(docs, f, ensure_ascii=False, indent=2)

    print(f'Wrote {index.ntotal} vectors to {INDEX_PATH}')


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', help='Project root for ingestion', default=None)
    parser.add_argument('--model', help='SentenceTransformer model name', default='all-MiniLM-L6-v2')
    args = parser.parse_args()
    build_index(args.root, args.model)
