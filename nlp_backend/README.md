# Scoopify NLP Chatbot

Prototype ini dipakai untuk tugas NLP: chatbot berbasis LLM, RAG, dan NER sebagai asisten virtual Scoopify.

## Fitur NLP

- **Chatbot**: menerima pertanyaan pelanggan dan menjawab dalam Bahasa Indonesia.
- **Text preprocessing**: melakukan lowercase, cleaning karakter, tokenisasi, reduksi huruf berulang, koreksi typo berbasis kamus, dan fuzzy correction istilah domain Scoopify sebelum input diproses lebih lanjut.
- **RAG kilat**: mengambil konteks dari `knowledge_base.json` seperti produk, harga, promo, kebijakan layanan, lokasi, FAQ, QR ticket, mini game, dan photobooth.
- **NER instan**: mengekstrak entitas produk, topic, aksi, harga, layout photobooth, durasi, dan request khusus, misalnya `coklat`, `photobooth`, `ask_price`, `ask_photo_layout`, dan `ask_duration`.
- **LLM via API**: jika `GEMINI_API_KEY` tersedia di `.env`, backend memakai Gemini sebagai LLM untuk menghasilkan respons dari konteks RAG dan hasil NER. Jika tidak, backend tetap bisa demo dengan fallback RAG lokal.

## Cara Menjalankan

Install dependency:

```powershell
py -3.10 -m pip install -r requirements.txt
```

Jalankan backend:

```powershell
py -3.10 -m uvicorn nlp_backend.main:app --reload --host 127.0.0.1 --port 8000
```

Backend otomatis membaca file `.env` di root project. Isi minimal untuk mode LLM:

```powershell
GEMINI_API_KEY=isi_api_key_gemini
GEMINI_MODEL=gemini-3.5-flash
GEMINI_FALLBACK_MODELS=gemini-3.1-flash-lite,gemini-2.5-flash
NGROK_API_KEY=isi_token_ngrok
```

Jika `GEMINI_API_KEY` kosong, sistem tetap berjalan dengan `fallback-rag`.

Opsional expose backend lokal dengan ngrok untuk demo dari device lain:

```powershell
$env:NGROK_API_KEY = (Get-Content .env | Where-Object { $_ -match '^NGROK_API_KEY=' }) -replace '^NGROK_API_KEY=', ''
ngrok config add-authtoken $env:NGROK_API_KEY
ngrok http 8000
```

Jika port `8000` sedang dipakai, matikan proses lama atau gunakan port lain:

```powershell
py -3.10 -m uvicorn nlp_backend.main:app --reload --host 127.0.0.1 --port 8001
```

Jika memakai port selain `8000`, sesuaikan `data-api-url` di `chatbot.html`.

Jalankan backend setelah `.env` terisi:

```powershell
py -3.10 -m uvicorn nlp_backend.main:app --reload --host 127.0.0.1 --port 8000
```

## Tes Model Gemini

Kalau ingin cek satu per satu model Gemini mana yang bisa dipakai untuk Scoopify, jalankan script ini:

```powershell
py -3.10 nlp_backend/test_gemini_models.py
```

Script akan mengambil daftar model yang mendukung `generateContent`, lalu mencoba tiap model dengan prompt uji singkat. Kalau mau pakai daftar model manual:

```powershell
py -3.10 nlp_backend/test_gemini_models.py --models models/gemini-3.5-flash models/gemini-3.1-flash-lite
```

Hasil bisa disimpan ke file JSON:

```powershell
py -3.10 nlp_backend/test_gemini_models.py --output gemini-model-test.json --json
```

Model yang disarankan untuk chatbot Scoopify:

- `gemini-3.5-flash` sebagai pilihan utama untuk demo karena responsif dan cerdas.
- `gemini-3.1-flash-lite` sebagai fallback ringan jika kuota atau latency perlu ditekan.
- `gemini-2.5-flash` sebagai fallback stabil jika model terbaru sedang terkena limit.

Backend akan menormalisasi nama model, jadi `.env` boleh diisi `gemini-3.5-flash` atau `models/gemini-3.5-flash`.
Jika respons model utama kosong atau terpotong, backend otomatis mencoba model pada `GEMINI_FALLBACK_MODELS` sebelum jatuh ke `fallback-rag`.

Buka frontend:

```text
http://127.0.0.1:8000/chatbot.html
```

Alternatif jika frontend statis dijalankan terpisah:

```powershell
python -m http.server 5500
```

Lalu buka:

```text
http://localhost:5500/chatbot.html
```

## API

Endpoint:

```text
POST /chat
```

Body:

```json
{
  "message": "harga coklat berapa dan masih ada?"
}
```

Response berisi:

- `answer`: jawaban chatbot.
- `entities`: hasil NER yang mencakup `products`, `topics`, `actions`, `prices`, `layouts`, `durations`, `money`, dan `request_types`.
- `retrieved_context`: konteks RAG yang dipakai.
- `mode`: `gemini-llm-rag-ner` atau `fallback-rag`.
- `latency_ms`: waktu proses.
