from __future__ import annotations

import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PORT = 8000


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def run(command: list[str], *, check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        command,
        cwd=PROJECT_ROOT,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=check,
    )


def configure_ngrok_token() -> None:
    token = os.getenv("NGROK_AUTHTOKEN") or os.getenv("NGROK_API_KEY")
    if not token:
        print("[WARN] NGROK_AUTHTOKEN/NGROK_API_KEY tidak ditemukan di .env.")
        print("       Jika ngrok meminta login, isi token dulu di .env.")
        return

    result = run(["ngrok", "config", "add-authtoken", token], check=False)
    if result.returncode != 0:
        print("[WARN] Gagal set authtoken ngrok:")
        print(result.stderr.strip() or result.stdout.strip())


def is_backend_running(port: int) -> bool:
    try:
        with urllib.request.urlopen(f"http://127.0.0.1:{port}/", timeout=2) as response:
            return response.status < 500
    except (urllib.error.URLError, TimeoutError):
        return False


def wait_for_tunnel(timeout_seconds: int = 25) -> str:
    deadline = time.time() + timeout_seconds
    last_error = ""
    while time.time() < deadline:
        try:
            with urllib.request.urlopen("http://127.0.0.1:4040/api/tunnels", timeout=2) as response:
                payload = json.loads(response.read().decode("utf-8"))
            tunnels = payload.get("tunnels", [])
            https_tunnels = [
                tunnel.get("public_url", "")
                for tunnel in tunnels
                if tunnel.get("public_url", "").startswith("https://")
            ]
            if https_tunnels:
                return https_tunnels[0].rstrip("/")
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as error:
            last_error = str(error)
        time.sleep(0.7)
    raise RuntimeError(f"Ngrok tunnel belum tersedia. {last_error}")


def main() -> int:
    load_env_file(PROJECT_ROOT / ".env")
    load_env_file(PROJECT_ROOT / "nlp_backend" / ".env")

    port = int(os.getenv("SCOOPIFY_CHATBOT_PORT", str(DEFAULT_PORT)))
    configure_ngrok_token()

    uvicorn_cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "nlp_backend.main:app",
        "--host",
        "127.0.0.1",
        "--port",
        str(port),
    ]
    ngrok_cmd = ["ngrok", "http", str(port)]

    print("[1/3] Menyiapkan backend FastAPI...")
    uvicorn_process: subprocess.Popen[bytes] | None = None
    if is_backend_running(port):
        print(f"      Backend sudah aktif di http://127.0.0.1:{port}; memakai proses yang ada.")
    else:
        uvicorn_process = subprocess.Popen(uvicorn_cmd, cwd=PROJECT_ROOT)
        time.sleep(1.5)
        if uvicorn_process.poll() is not None:
            raise RuntimeError(
                "Backend FastAPI gagal start. Cek apakah port 8000 sedang dipakai atau jalankan "
                "`py -3.10 -m uvicorn nlp_backend.main:app --host 127.0.0.1 --port 8000` manual untuk melihat error."
            )

    print("[2/3] Menjalankan ngrok tunnel...")
    ngrok_process = subprocess.Popen(ngrok_cmd, cwd=PROJECT_ROOT)

    try:
        public_url = wait_for_tunnel()
        chat_api_url = f"{public_url}/chat"
        vercel_hint = f"chatbot.html?chatApi={public_url}"

        print()
        print("=" * 72)
        print("SCOOPIFY CHATBOT NGROK SIAP")
        print("=" * 72)
        print(f"Backend lokal : http://127.0.0.1:{port}/chat")
        print(f"Ngrok API     : {chat_api_url}")
        print()
        print("Untuk Vercel, buka halaman chatbot dengan query ini:")
        print(vercel_hint)
        print()
        print("Atau di Console browser Vercel jalankan:")
        print(f'localStorage.setItem("scoopifyChatbotApiUrl", "{chat_api_url}")')
        print("location.reload()")
        print()
        print("Biarkan terminal ini tetap menyala selama demo.")
        print("Tekan Ctrl+C untuk berhenti.")
        print("=" * 72)
        print()

        while True:
            time.sleep(1)
            if uvicorn_process is not None and uvicorn_process.poll() is not None:
                raise RuntimeError("Backend FastAPI berhenti.")
            if ngrok_process.poll() is not None:
                raise RuntimeError("Ngrok berhenti.")
    except KeyboardInterrupt:
        print("\nMenghentikan backend dan ngrok...")
    finally:
        for process in (ngrok_process, uvicorn_process):
            if process is not None and process.poll() is None:
                process.terminate()
        time.sleep(0.5)
        for process in (ngrok_process, uvicorn_process):
            if process is not None and process.poll() is None:
                process.kill()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
