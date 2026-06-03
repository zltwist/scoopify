import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any


BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta"


def load_env_file(path: Path) -> None:
    if not path.exists():
        return

    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def load_api_key() -> str:
    load_env_file(PROJECT_ROOT / ".env")
    load_env_file(BASE_DIR / ".env")
    return os.getenv("GEMINI_API_KEY", "").strip()


def normalize_model_name(model_name: str) -> str:
    model_name = model_name.strip()
    if model_name.startswith("models/"):
        return model_name.removeprefix("models/")
    return model_name


def request_json(url: str, method: str, api_key: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json", "x-goog-api-key": api_key},
        method=method,
    )
    with urllib.request.urlopen(request, timeout=15) as response:
        return json.loads(response.read().decode("utf-8"))


def list_candidate_models(api_key: str) -> list[dict[str, Any]]:
    payload = request_json(f"{GEMINI_API_BASE}/models", "GET", api_key)
    models = payload.get("models", [])
    candidates: list[dict[str, Any]] = []

    for model in models:
        methods = model.get("supportedGenerationMethods", [])
        name = model.get("name", "")
        if "generateContent" not in methods:
            continue
        if not name.startswith("models/"):
            continue

        candidates.append(
            {
                "name": name,
                "model_id": normalize_model_name(name),
            }
        )

    def sort_key(model: dict[str, Any]) -> tuple[int, str]:
        name = model.get("model_id", normalize_model_name(model.get("name", "models/")))
        priority = 50
        if "flash" in name:
            priority = 10
        if "pro" in name:
            priority = min(priority, 20)
        if "lite" in name:
            priority = min(priority, 15)
        if "exp" in name:
            priority = max(priority, 60)
        return priority, name

    candidates.sort(key=sort_key)
    return candidates


def test_model(api_key: str, model_name: str, message: str) -> dict[str, Any]:
    model_id = normalize_model_name(model_name)
    url = f"{GEMINI_API_BASE}/models/{urllib.parse.quote(model_id, safe='')}:generateContent"
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": message}],
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 64,
        },
    }

    try:
        data = request_json(url, "POST", api_key, payload)
        answer = (
            data.get("candidates", [{}])[0]
            .get("content", {})
            .get("parts", [{}])[0]
            .get("text", "")
            .strip()
        )
        return {
            "model": model_name,
            "model_id": model_id,
            "ok": True,
            "status": "success",
            "answer": answer,
        }
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        try:
            payload_error = json.loads(detail)
            message_text = payload_error.get("error", {}).get("message", detail)
        except json.JSONDecodeError:
            message_text = detail
        return {
            "model": model_name,
            "model_id": model_id,
            "ok": False,
            "status": f"http_{error.code}",
            "error": message_text[:240],
        }
    except (urllib.error.URLError, TimeoutError, KeyError, IndexError, json.JSONDecodeError) as error:
        return {
            "model": model_name,
            "model_id": model_id,
            "ok": False,
            "status": "request_failed",
            "error": f"{type(error).__name__}: {str(error)[:240]}",
        }


def pick_app_prompt() -> str:
    return (
        "Kamu adalah asisten Scoopify. Jawab singkat dalam Bahasa Indonesia. "
        "Tes ini hanya untuk mengecek apakah model bisa dipakai untuk chatbot aplikasi."
    )


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Cek model Gemini satu per satu untuk kebutuhan Scoopify."
    )
    parser.add_argument(
        "--message",
        default=pick_app_prompt(),
        help="Prompt uji yang dikirim ke setiap model.",
    )
    parser.add_argument(
        "--models",
        nargs="*",
        help="Daftar nama model penuh seperti models/gemini-1.5-flash. Jika kosong, ambil otomatis dari API.",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Cetak hasil dalam format JSON.",
    )
    parser.add_argument(
        "--output",
        help="Simpan hasil JSON ke file.",
    )
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    api_key = load_api_key()
    if not api_key:
        print("GEMINI_API_KEY belum terisi di .env root atau nlp_backend/.env.", file=sys.stderr)
        return 1

    if args.models:
        models_to_test = [
            {"name": model_name, "model_id": normalize_model_name(model_name)}
            for model_name in args.models
        ]
    else:
        try:
            models_to_test = list_candidate_models(api_key)
        except urllib.error.HTTPError as error:
            print(f"Gagal mengambil daftar model: HTTP {error.code}", file=sys.stderr)
            return 1
        except urllib.error.URLError as error:
            print(f"Gagal mengambil daftar model: {error}", file=sys.stderr)
            return 1

    if not models_to_test:
        print("Tidak ada model yang mendukung generateContent ditemukan.", file=sys.stderr)
        return 1

    results: list[dict[str, Any]] = []
    for index, model in enumerate(models_to_test, start=1):
        model_name = model["name"]
        model_id = model.get("model_id", normalize_model_name(model_name))
        print(f"[{index}/{len(models_to_test)}] Mencoba {model_id} ...")
        result = test_model(api_key, model_id, args.message)
        results.append(result)

        if result["ok"]:
            snippet = result.get("answer", "")[:140]
            print(f"  OK: {snippet or '(respon kosong)'}")
        else:
            print(f"  FAIL: {result.get('error', 'unknown error')}")

    report = {
        "total": len(results),
        "success": sum(1 for item in results if item["ok"]),
        "failed": sum(1 for item in results if not item["ok"]),
        "results": results,
    }

    if args.output:
        Path(args.output).write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print("")
        print(f"Selesai. {report['success']} model bisa dipakai, {report['failed']} model gagal.")
        successful_models = [item.get("model_id", item["model"]) for item in results if item["ok"]]
        if successful_models:
            print("Model yang lolos uji:")
            for model_name in successful_models:
                print(f"- {model_name}")

    return 0 if report["success"] else 2


if __name__ == "__main__":
    raise SystemExit(main())