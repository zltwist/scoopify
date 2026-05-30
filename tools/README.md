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
