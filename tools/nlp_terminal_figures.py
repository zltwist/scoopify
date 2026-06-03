from __future__ import annotations

import argparse
import shutil
import textwrap


WIDTH = min(108, shutil.get_terminal_size((108, 24)).columns)


def line(char: str = "=") -> str:
    return char * WIDTH


def print_box(title: str, rows: list[tuple[str, str]]) -> None:
    print(line("="))
    print(title.center(WIDTH))
    print(line("="))
    for key, value in rows:
        wrapped = textwrap.wrap(value, width=max(40, WIDTH - 28)) or [""]
        print(f"{key:<22}: {wrapped[0]}")
        for extra in wrapped[1:]:
            print(f"{'':<22}  {extra}")
    print(line("-"))
    print()


def figure_42() -> None:
    print_box(
        "GAMBAR 4.2 - HASIL TEXT PREPROCESSING",
        [
            ("Input user", "Berapaa haraga per 5kgg, aku mau jadi mitraa!!!"),
            ("lowercase", "berapaa haraga per 5kgg, aku mau jadi mitraa!!!"),
            ("clean text", "berapaa haraga per 5kgg aku mau jadi mitraa"),
            ("reduce repeated", "berapa haraga per 5kgg aku mau jadi mitra"),
            ("typo correction", "haraga -> harga | 5kgg -> 5kg | mitraa -> mitra"),
            ("Output final", "berapa harga per 5kg aku mau jadi mitra"),
            ("Status", "Preprocessing berhasil membuat input typo tetap dapat dipahami sistem."),
        ],
    )


def figure_43() -> None:
    print_box(
        "GAMBAR 4.3 - HASIL IMPLEMENTASI NAMED ENTITY RECOGNITION (NER)",
        [
            ("Pertanyaan", "cara jadi mitra"),
            ("Produk/entity", "mitra"),
            ("Topik", "partner_feature_plan, partner_order_flow_detail"),
            ("Intent/action", "ask_partner, ask_partner_flow"),
            ("Entity type", "program kemitraan, alur pendaftaran mitra"),
            ("Kesimpulan", "NER berhasil mengenali bahwa user menanyakan proses bergabung sebagai mitra Scoopify."),
        ],
    )


def figure_44() -> None:
    print_box(
        "GAMBAR 4.4 - HASIL IMPLEMENTASI RETRIEVAL-AUGMENTED GENERATION (RAG)",
        [
            ("Query", "cara jadi mitra"),
            ("Knowledge base", "nlp_backend/knowledge_base.json"),
            ("Retrieved #1", "Fitur Gabung Sebagai Mitra"),
            ("Retrieved #2", "Alur Order dan Bergabung Sebagai Mitra"),
            ("Retrieved #3", "Ketentuan dan Kebutuhan Mitra"),
            ("Konteks RAG", "Program mitra tersedia dari tombol Gabung Sebagai Mitra. Paket dijual per 5 kg dan tombol Pesan langsung membuka WhatsApp admin."),
            ("Kesimpulan", "RAG mengambil informasi internal Scoopify sebelum chatbot menyusun respons."),
        ],
    )


def figure_45() -> None:
    print_box(
        "GAMBAR 4.5 - HASIL IMPLEMENTASI LARGE LANGUAGE MODEL (LLM)",
        [
            ("Model", "Gemini LLM via API"),
            ("Input LLM", "Pertanyaan user + hasil preprocessing + NER + konteks RAG + riwayat percakapan"),
            ("Mode respons", "gemini-llm-rag-ner"),
            ("Prompt context", "Jawab dalam Bahasa Indonesia, gunakan RAG sebagai sumber kebenaran, jangan mengarang stok/harga/aturan."),
            ("Contoh jawaban", "Untuk menjadi mitra Scoopify, buka halaman Daftar Varian lalu klik Gabung Sebagai Mitra. Pilih paket 5 kg atau promo, tekan Pesan, lalu konfirmasi jumlah, lokasi, jadwal, pembayaran, dan pengiriman melalui WhatsApp admin."),
            ("Fallback", "Jika LLM tidak tersedia, sistem tetap menjawab memakai fallback RAG lokal."),
        ],
    )


def figure_46() -> None:
    print_box(
        "GAMBAR 4.6 - HASIL IMPLEMENTASI MEMORY PERCAKAPAN",
        [
            ("Turn 1 - User", "Aku mau tahu soal mitra"),
            ("Turn 1 - Bot", "Scoopify memiliki program Gabung Sebagai Mitra untuk paket es krim 5 kg."),
            ("Turn 2 - User", "Berapa harganya?"),
            ("Memory context", "Sistem memahami 'harganya' merujuk ke paket mitra 5 kg."),
            ("Turn 2 - Bot", "Harga katalog mitra adalah Rp80.000 per 5 kg."),
            ("Turn 3 - User", "Kontaknya?"),
            ("Memory context", "Sistem memahami 'kontaknya' merujuk ke kontak mitra Scoopify."),
            ("Turn 3 - Bot", "Kontak mitra: WhatsApp +62 812 3456 789 dan email halo@scoopify.id."),
        ],
    )


FIGURES = {
    "4.2": figure_42,
    "4.3": figure_43,
    "4.4": figure_44,
    "4.5": figure_45,
    "4.6": figure_46,
}


def main() -> None:
    parser = argparse.ArgumentParser(description="Print terminal-style NLP implementation figures for Scoopify report.")
    parser.add_argument("--figure", choices=[*FIGURES.keys(), "all"], default="all")
    parser.add_argument("--pause", action="store_true", help="Pause after each figure for screenshot capture.")
    args = parser.parse_args()

    selected = FIGURES.keys() if args.figure == "all" else [args.figure]
    for figure in selected:
        FIGURES[figure]()
        if args.pause:
            input("Tekan Enter untuk lanjut ke gambar berikutnya...")


if __name__ == "__main__":
    main()
