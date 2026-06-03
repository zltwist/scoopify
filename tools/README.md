# Scoopify Tools

## Generate QR tiket

Jalankan dari root project:

```bash
python tools/generate_qr_ticket.py --url "https://domain-kamu.com/photobooth.html"
```

Output PNG masuk ke folder `qr-tickets/`. File itu bisa ditempel ke desain cup, tiket, atau frame.

Untuk membuat token khusus:

```bash
python tools/generate_qr_ticket.py --url "https://domain-kamu.com/photobooth.html" --token "SCOOPIFY-DEMO-001"
```

## Tes model Gemini untuk Scoopify

Script ini akan membaca `GEMINI_API_KEY` dari environment atau `.env`, lalu mengecek model Gemini satu per satu dengan prompt yang dipakai backend Scoopify.

Jalankan dari root project:

```powershell
py -3.10 tools/test_gemini_models.py
```

Kalau mau tes model tertentu saja:

```powershell
py -3.10 tools/test_gemini_models.py --models gemini-2.5-flash gemini-1.5-flash
```

Kalau mau tes satu prompt saja:

```powershell
py -3.10 tools/test_gemini_models.py --prompt "harga coklat berapa dan masih ada?"
```

Hasil lengkap bisa disimpan ke JSON:

```powershell
py -3.10 tools/test_gemini_models.py --out gemini_test_results.json
```
