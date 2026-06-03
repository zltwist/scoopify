from pathlib import Path
import json
import re
from collections import Counter


def _extract_text_from_json(obj):
    parts = []
    if isinstance(obj, dict):
        for v in obj.values():
            parts.append(_extract_text_from_json(v))
    elif isinstance(obj, list):
        for v in obj:
            parts.append(_extract_text_from_json(v))
    elif isinstance(obj, (str, int, float)):
        parts.append(str(obj))
    return " \n ".join([p for p in parts if p])


def _simple_keywords(text: str, filename: str = "", top_n: int = 8):
    """Return a small list of keywords from filename + text."""
    stop = {
        'dan','yang','di','ke','dengan','untuk','pada','ini','itu','ada','saya','aku','kamu','kalian'
    }
    words = re.findall(r"[a-zA-Z]{3,}", (filename + ' ' + text).lower())
    words = [w for w in words if w not in stop]
    most = [w for w, _ in Counter(words).most_common(top_n)]
    return most


def load_documents(root: str = None, extensions=None):
    """Traverse the project and load text documents to index.

    Returns a list of dicts matching the knowledge-base style:
    {'id': id, 'title': title, 'content': text, 'keywords': [...], 'source': path}
    """
    if extensions is None:
        extensions = {'.md', '.txt', '.html', '.json'}

    if root is None:
        root = Path(__file__).resolve().parents[1]
    else:
        root = Path(root)

    docs = []
    for p in root.rglob('*'):
        if p.is_file() and p.suffix.lower() in extensions:
            try:
                if p.suffix.lower() == '.json':
                    with p.open('r', encoding='utf8') as f:
                        data = json.load(f)
                    text = _extract_text_from_json(data)
                else:
                    text = p.read_text(encoding='utf8')
                text = re.sub(r'\s+', ' ', text).strip()
                if text:
                    title = p.stem.replace('_', ' ').replace('-', ' ')
                    keywords = _simple_keywords(text[:1000], title)
                    docs.append({
                        'id': str(p.relative_to(root)),
                        'title': title,
                        'content': text,
                        'keywords': keywords,
                        'source': str(p.absolute()),
                    })
            except Exception:
                # skip files we can't decode
                continue

    return docs


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', help='Project root to ingest (defaults to repo root)', default=None)
    args = parser.parse_args()
    docs = load_documents(args.root)
    print(f'Found {len(docs)} documents to index')
