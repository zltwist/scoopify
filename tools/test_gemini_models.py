"""Test Gemini models one by one for Scoopify.

This script:
- loads GEMINI_API_KEY from the environment or root .env
- lists Gemini models that support generateContent
- sends Scoopify-style prompts to each model
- reports which models respond successfully for this app

Run from the project root:
    py -3.10 tools/test_gemini_models.py
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DOTENV_PATH = PROJECT_ROOT / ".env"
DEFAULT_TIMEOUT = 10
DEFAULT_SAMPLE_LIMIT = 3

SAMPLE_MESSAGES = [
    "harga coklat berapa dan masih ada?",
    "aku mau scan QR buat photobooth",
    "mini game reward-nya apa?",
]


def load_dotenv(path: Path) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def ensure_api_key() -> str:
    load_dotenv(DOTENV_PATH)
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise SystemExit("GEMINI_API_KEY tidak ditemukan di environment atau .env")
    return api_key


def http_json(method: str, url: str, api_key: str, payload: dict[str, Any] | None = None, timeout: int = DEFAULT_TIMEOUT) -> dict[str, Any]:
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json", "x-goog-api-key": api_key},
        method=method,
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def normalize_model_name(name: str) -> str:
    return name.split("/", 1)[-1] if name.startswith("models/") else name


def list_gemini_models(api_key: str) -> list[dict[str, Any]]:
    url = "https://generativelanguage.googleapis.com/v1beta/models?" + urllib.parse.urlencode({"key": api_key})
    data = http_json("GET", url, api_key)
    models = data.get("models", [])

    filtered: list[dict[str, Any]] = []
    for model in models:
        name = normalize_model_name(model.get("name", ""))
        methods = model.get("supportedGenerationMethods", []) or []
        if not name or not name.startswith("gemini-"):
            continue
        if "generateContent" not in methods:
            continue
        filtered.append(model)

    # Prefer stable/current variants first, then keep the rest in API order.
    def sort_key(model: dict[str, Any]) -> tuple[int, str]:
        name = normalize_model_name(model.get("name", "")).lower()
        priority = 100
        for idx, marker in enumerate([
            "gemini-2.5-pro",
            "gemini-2.5-flash",
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-1.5-flash-8b",
            "gemini-1.0-pro",
            "gemini-pro",
        ]):
            if name.startswith(marker):
                priority = idx
                break
        return priority, name

    return sorted(filtered, key=sort_key)


def fallback_models() -> list[str]:
    return [
        "gemini-2.5-pro",
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-1.5-flash-8b",
        "gemini-1.0-pro",
        "gemini-pro",
    ]


def build_prompt(message: str) -> str:
    # Import lazily so --help and model listing stay lightweight.
    from nlp_backend.main import build_prompt as app_build_prompt
    from nlp_backend.main import extract_entities, retrieve_context

    contexts, _confidence = retrieve_context(message)
    entities = extract_entities(message)
    return app_build_prompt(message, contexts, entities)


def generate_with_model(api_key: str, model_name: str, message: str, timeout: int) -> dict[str, Any]:
    prompt = build_prompt(message)
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}],
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 260,
        },
    }
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{urllib.parse.quote(model_name, safe='')}:generateContent"
    started = time.perf_counter()
    data = http_json("POST", url, api_key, payload=payload, timeout=timeout)
    latency_ms = int((time.perf_counter() - started) * 1000)
    answer = (
        data.get("candidates", [{}])[0]
        .get("content", {})
        .get("parts", [{}])[0]
        .get("text", "")
        .strip()
    )
    return {
        "ok": bool(answer),
        "latency_ms": latency_ms,
        "answer": answer,
        "raw": data,
    }


def run_test_suite(api_key: str, model_name: str, timeout: int, sample_messages: list[str]) -> dict[str, Any]:
    results = []
    passed = 0
    for message in sample_messages:
        try:
            result = generate_with_model(api_key, model_name, message, timeout)
            result.update({"message": message, "error": None})
            if result["ok"]:
                passed += 1
        except urllib.error.HTTPError as error:
            detail = error.read().decode("utf-8", errors="replace")
            result = {
                "message": message,
                "ok": False,
                "latency_ms": None,
                "answer": "",
                "error": f"HTTP {error.code}: {detail[:180]}",
            }
        except Exception as error:
            result = {
                "message": message,
                "ok": False,
                "latency_ms": None,
                "answer": "",
                "error": f"{type(error).__name__}: {str(error)[:180]}",
            }
        results.append(result)

    if passed == len(sample_messages):
        status = "PASS"
    elif passed > 0:
        status = "PARTIAL"
    else:
        status = "FAIL"

    return {
        "model": model_name,
        "status": status,
        "passed": passed,
        "total": len(sample_messages),
        "results": results,
    }


def pick_models(api_key: str, requested_models: list[str] | None, limit: int | None) -> list[str]:
    if requested_models:
        models = [normalize_model_name(model) for model in requested_models]
    else:
        try:
            models = [normalize_model_name(model.get("name", "")) for model in list_gemini_models(api_key)]
        except Exception:
            models = fallback_models()

    models = [model for model in models if model]
    deduped = list(dict.fromkeys(models))
    if limit is not None and limit > 0:
        return deduped[:limit]
    return deduped


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Test Gemini models one by one for Scoopify.")
    parser.add_argument("--models", nargs="*", help="Model names to test. Default: list from Gemini API.")
    parser.add_argument("--limit", type=int, default=None, help="Max number of models to test.")
    parser.add_argument("--timeout", type=int, default=DEFAULT_TIMEOUT, help="Timeout per request in seconds.")
    parser.add_argument("--prompt", default=None, help="Single custom prompt to test instead of the built-in Scoopify prompts.")
    parser.add_argument("--out", default=None, help="Write full results to a JSON file.")
    return parser.parse_args()


def print_summary(results: list[dict[str, Any]]) -> None:
    print("\nHasil uji Gemini untuk Scoopify\n")
    print(f"{'MODEL':28} {'STATUS':8} {'LULUS':7} {'TOTAL':7} {'AVG MS':8}")
    print("-" * 60)
    for item in results:
        latencies = [r["latency_ms"] for r in item["results"] if r.get("latency_ms") is not None]
        avg_ms = int(sum(latencies) / len(latencies)) if latencies else 0
        print(f"{item['model'][:28]:28} {item['status']:8} {item['passed']:>3}/{item['total']:<3} {item['total']:>7} {avg_ms:>8}")
    print()


def print_details(results: list[dict[str, Any]]) -> None:
    for item in results:
        print(f"Model: {item['model']} -> {item['status']}")
        for result in item["results"]:
            preview = result.get("answer", "")[:180].replace("\n", " ")
            if result["ok"]:
                print(f"  OK  | {result['message']} | {result.get('latency_ms')} ms | {preview}")
            else:
                print(f"  ERR | {result['message']} | {result.get('error')}")
        print()


def main() -> int:
    args = parse_args()
    api_key = ensure_api_key()

    sample_messages = [args.prompt] if args.prompt else SAMPLE_MESSAGES[:DEFAULT_SAMPLE_LIMIT]
    models = pick_models(api_key, args.models, args.limit)

    if not models:
        print("Tidak ada model Gemini yang bisa diuji.", file=sys.stderr)
        return 1

    results = []
    for index, model_name in enumerate(models, start=1):
        print(f"[{index}/{len(models)}] Testing {model_name} ...")
        results.append(run_test_suite(api_key, model_name, args.timeout, sample_messages))

    print_summary(results)
    print_details(results)

    if args.out:
        out_path = Path(args.out)
        out_path.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Hasil disimpan ke {out_path}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
