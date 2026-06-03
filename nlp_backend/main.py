import json
import os
import re
import time
import urllib.error
import urllib.request
from difflib import get_close_matches
from pathlib import Path
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent
KB_PATH = BASE_DIR / "knowledge_base.json"
PROJECT_ROOT = BASE_DIR.parent


def load_env_file(path: Path) -> None:
    if not path.exists():
        return

    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_env_file(PROJECT_ROOT / ".env")
load_env_file(BASE_DIR / ".env")

DEFAULT_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")
DEFAULT_FALLBACK_MODELS = os.getenv("GEMINI_FALLBACK_MODELS", "gemini-3.1-flash-lite,gemini-2.5-flash")


def normalize_model_name(model_name: str) -> str:
    model_name = model_name.strip()
    if model_name.startswith("models/"):
        return model_name.removeprefix("models/")
    return model_name

app = FastAPI(
    title="Scoopify NLP Chatbot API",
    description="LLM + RAG + prompt-based NER API for Scoopify virtual assistant.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatTurn(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatTurn] = []


class ChatResponse(BaseModel):
    answer: str
    original_message: str
    preprocessed_message: str
    preprocessing_steps: list[str]
    entities: dict[str, list[str]]
    retrieved_context: list[dict[str, Any]]
    mode: str
    llm_used: bool
    llm_error: str | None = None
    confidence: float
    latency_ms: int


def load_knowledge_base() -> list[dict[str, Any]]:
    with KB_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


KNOWLEDGE_BASE = load_knowledge_base()

TOPIC_ALIAS_MAP = {
    "brand": ["scoopify", "brand", "play your mood", "taste your scoop"],
    "menu": ["menu", "rasa", "varian", "flavor", "stok", "tersedia", "sold out", "produk"],
    "price": ["harga", "price", "biaya", "rp", "rupiah", "bayar"],
    "promo": ["promo", "diskon", "reward", "hadiah", "potongan", "topping", "gratis"],
    "ai_mood": ["ai", "mood", "rekomendasi", "rasa", "emosi", "tracker"],
    "ai_mood_current_input_detail": ["parameter mood", "parameter", "input mood", "energy level", "emotional valence", "stress", "craving"],
    "ai_mood_profiles_complete": ["jatuh cinta", "bahagia", "galau", "patah hati", "overthinking", "cemas", "bosan", "mood profile"],
    "photobooth": ["photobooth", "foto", "frame", "kamera", "download", "share"],
    "photobooth_layout_and_frame_detail": ["2 foto", "3 foto", "6 foto", "cute doodle journal", "low poly", "old game", "windows 7", "free frame", "premium frame"],
    "photobooth_camera_controls_detail": ["mirror", "brightness", "filter", "normal", "bnw", "b&w", "nostalgia", "rio", "retake", "finish", "countdown", "hasil sementara"],
    "photobooth_output_and_share_detail": ["download hasil", "share hasil", "navigator share", "png", "finish dulu"],
    "qr_ticket": ["qr", "ticket", "tiket", "scan", "akses", "kode"],
    "qr_ticket_unique_detail": ["qr code unik", "qr unik", "ticket digital", "tiket unik", "kode pembelian"],
    "qr_scanner_technical_flow": ["barcode detector", "jsqr", "scanner", "kamera qr", "validasi qr", "ticket token"],
    "mini_game": ["game", "mini game", "reward", "hadiah", "diskon", "topping"],
    "mini_game_state_and_rules_detail": ["memory game", "12 kartu", "6 gambar", "3 kesempatan", "salah tebak bebas", "waktu habis", "coba lagi"],
    "reward_probability_exact": ["peluang reward", "probabilitas", "91 persen", "6 persen", "3 persen", "roulette"],
    "faq_order": ["pesan", "beli", "order", "cara", "bayar", "faq"],
    "location": ["lokasi", "tempat", "booth", "alamat", "event", "acara"],
    "partner_feature_plan": ["mitra", "partner", "reseller", "bergabung", "gabung sebagai mitra", "5 kg", "whatsapp", "wa", "order mitra"],
    "partner_menu_catalog": ["menu mitra", "paket 5 kg", "harga 5 kg", "harga per 5kg", "per 5kg", "rp80.000", "durian delight", "pandan cream", "chocolate heaven", "strawberry bliss", "fresh taro", "vanilla classic"],
    "partner_opening_promo": ["opening promo", "beli 2 gratis 1", "ambil promo", "promo mitra"],
    "partner_order_flow_detail": ["alur mitra", "cara jadi mitra", "cara gabung mitra", "order mitra", "pesan paket 5 kg", "tanpa keranjang"],
    "partner_requirements_policy": ["syarat mitra", "ketentuan mitra", "kebutuhan mitra", "reseller", "umkm", "kantin", "event", "pengiriman"],
    "partner_contact_info": ["kontak mitra", "nomor wa", "whatsapp mitra", "admin mitra", "email mitra", "hubungi mitra"],
    "variant_catalog_complete_current": ["katalog varian", "nickname", "nama lucu", "soft cloud", "purple puff", "choco hug", "triple trouble"],
    "chatbot_frontend_backend_detail": ["chatbot", "fastapi", "endpoint", "fetch api", "latency", "gemini aktif", "fallback rag"],
    "chatbot_preprocessing_detail": ["preprocessing", "normalisasi", "typo", "fuzzy", "huruf berulang", "clean text"],
    "policy": ["kebijakan", "aturan", "habis", "alternatif", "stok", "layanan"],
    "faq_common": ["faq", "pertanyaan", "umum", "bantuan", "customer", "pelanggan"],
}

QUERY_EXPANSIONS = {
    "harga": ["price", "rp", "rupiah", "bayar"],
    "stok": ["tersedia", "available", "sold out"],
    "promo": ["reward", "diskon", "topping", "hadiah"],
    "photobooth": ["foto", "frame", "download", "share"],
    "frame": ["photobooth", "premium", "gratis", "layout", "2 foto", "3 foto", "6 foto"],
    "filter": ["photobooth", "kamera", "brightness", "mirror", "bnw", "nostalgia", "rio"],
    "qr": ["ticket", "tiket", "scan"],
    "ticket": ["qr", "tiket", "akses", "mini game", "photobooth"],
    "mood": ["rekomendasi", "rasa", "emosi", "ai"],
    "memory": ["mini game", "kartu", "pasangan", "15 detik", "3 kesempatan"],
    "reward": ["topping", "diskon", "roulette", "probabilitas", "potongan"],
    "pesan": ["order", "beli", "cara", "bayar"],
    "event": ["booth", "lokasi", "acara"],
    "mitra": ["partner", "reseller", "bergabung", "gabung sebagai mitra", "5 kg", "5kg", "paket", "harga 5 kg", "per 5kg", "whatsapp", "wa", "promo mitra", "syarat", "ketentuan", "kontak", "hubungi", "dihubungi", "admin", "pengiriman"],
    "whatsapp": ["wa", "chat", "mitra", "checkout"],
    "chatbot": ["llm", "rag", "ner", "fastapi", "gemini", "preprocessing"],
    "llm": ["gemini", "large language model", "chatbot", "rag", "ner"],
}

INTENT_TO_KB_ID = {
    "ask_price": "price",
    "check_stock": "menu",
    "ask_variant": "menu",
    "ask_promo": "promo",
    "use_photobooth": "photobooth",
    "ask_photo_layout": "photobooth_layout_and_frame_detail",
    "ask_frame": "photobooth_layout_and_frame_detail",
    "ask_camera_setting": "photobooth_camera_controls_detail",
    "ask_download_share": "photobooth_output_and_share_detail",
    "scan_qr": "qr_ticket",
    "ask_qr_scanner": "qr_scanner_technical_flow",
    "play_game": "mini_game",
    "ask_game_rule": "mini_game_state_and_rules_detail",
    "ask_reward_probability": "reward_probability_exact",
    "ask_ai_mood": "ai_mood",
    "ask_mood_profile": "ai_mood_profiles_complete",
    "ask_location": "location",
    "ask_partner": "partner_feature_plan",
    "ask_partner_menu": "partner_menu_catalog",
    "ask_partner_promo": "partner_opening_promo",
    "ask_partner_flow": "partner_order_flow_detail",
    "ask_partner_requirements": "partner_requirements_policy",
    "ask_partner_contact": "partner_contact_info",
    "ask_policy": "policy",
    "ask_order_flow": "faq_order",
    "ask_chatbot_system": "chatbot_frontend_backend_detail",
    "ask_preprocessing": "chatbot_preprocessing_detail",
}

PRODUCT_ENTITIES = [
    "scoopify",
    "vanila",
    "vanilla",
    "taro",
    "coklat",
    "durian",
    "duren",
    "stroberi",
    "strawberry",
    "nangka",
    "photobooth",
    "mini game",
    "ai mood tracker",
    "qr",
    "qr code",
    "ticket digital",
    "tiket digital",
    "qr ticket",
    "promo",
    "reward",
    "topping",
    "soft cloud",
    "purple puff",
    "choco hug",
    "drama king",
    "lilac daydream",
    "moody munch",
    "cozy duo",
    "bold sweetie",
    "tiny daredevil",
    "volcano hug",
    "classic cuddle",
    "triple trouble",
    "sweet chaos",
    "royal scoop squad",
    "pink wink",
    "golden throwback",
    "cute doodle journal",
    "low poly",
    "old game",
    "windows 7",
    "free frame",
    "premium frame",
    "b&w",
    "bnw",
    "nostalgia",
    "rio",
    "rio de janeiro",
    "mitra",
    "partner",
    "reseller",
    "durian delight",
    "pandan cream",
    "chocolate heaven",
    "strawberry bliss",
    "fresh taro",
    "vanilla classic",
    "whatsapp",
    "wa",
    "paket 5 kg",
    "5kg",
    "umkm",
    "kantin",
    "coffee shop",
    "admin mitra",
    "halo scoopify",
]

ACTION_ENTITIES = {
    "greeting": ["halo", "hai", "hello", "hi", "pagi", "siang", "sore", "malam"],
    "test": ["test", "tes", "testing", "cek"],
    "order": ["pesan", "beli", "membeli", "order", "bayar"],
    "scan_qr": ["scan", "qr", "tiket", "ticket", "barcode", "kode qr"],
    "ask_qr_scanner": ["scanner", "kamera qr", "barcode detector", "jsqr", "qr tidak bisa", "tidak bisa scan", "validasi qr"],
    "check_stock": ["stok", "stoknya", "tersedia", "sold out", "habis", "masih ada", "ready", "available"],
    "ask_price": ["harga", "price", "biaya", "rp", "rupiah"],
    "ask_promo": ["promo", "diskon", "reward", "rewardnya", "hadiah", "hadiahnya", "potongan", "topping"],
    "ask_location": ["lokasi", "tempat", "alamat", "booth", "event", "acara"],
    "ask_policy": ["kebijakan", "aturan", "layanan", "valid", "berlaku"],
    "use_photobooth": ["photobooth", "foto", "frame", "download", "share", "kamera"],
    "ask_frame": ["frame gratis", "frame premium", "premium frame", "free frame", "cute doodle", "low poly", "old game", "windows 7"],
    "ask_camera_setting": ["mirror", "brightness", "cerah", "gelap", "filter", "bnw", "b&w", "black and white", "nostalgia", "rio", "normal", "retake", "finish", "countdown"],
    "ask_download_share": ["download", "share", "bagikan", "simpan", "hasil foto", "png", "finish dulu"],
    "play_game": ["game", "mini game", "memory", "memory game", "kartu", "pasangan", "reward", "hadiah", "diskon", "topping"],
    "ask_game_rule": ["aturan game", "cara main", "salah tebak", "kesempatan", "percobaan", "waktu habis", "coba lagi", "12 kartu", "6 gambar"],
    "ask_reward_probability": ["peluang", "probabilitas", "chance", "persen", "91", "6 persen", "3 persen", "roulette"],
    "ask_ai_mood": ["mood", "rekomendasi", "ai", "emosi", "likert", "emoticon", "euclidean", "parameter", "input mood", "menghitung"],
    "ask_mood_profile": ["jatuh cinta", "bahagia", "senang", "sedih", "galau", "patah hati", "bingung", "overthinking", "rindu", "nostalgia", "kecewa", "grief", "berduka", "marah", "kesal", "cemas", "gelisah", "bosan", "jenuh"],
    "ask_variant": ["varian", "rasa", "menu", "flavor", "pilihan", "nickname", "nama lucu", "katalog"],
    "ask_order_flow": ["cara pesan", "cara order", "alur", "langkah", "step", "proses"],
    "ask_photo_layout": ["layout", "frame", "2 foto", "3 foto", "6 foto"],
    "ask_duration": ["durasi", "lama", "waktu", "waktunya", "detik", "15 detik"],
    "ask_partner": ["mitra", "partner", "reseller", "bergabung", "gabung sebagai mitra", "5 kg", "5kg", "kilo", "whatsapp", "wa", "order sekarang"],
    "ask_partner_menu": ["menu mitra", "paket mitra", "harga 5 kg", "harga per 5kg", "per 5kg", "durian delight", "pandan cream", "chocolate heaven", "strawberry bliss", "fresh taro", "vanilla classic"],
    "ask_partner_promo": ["opening promo", "beli 2 gratis 1", "ambil promo", "promo mitra"],
    "ask_partner_flow": ["alur mitra", "cara jadi mitra", "cara gabung mitra", "order mitra", "pesan paket 5 kg", "beli paket 5 kg", "membeli es 5kg", "beli es 5kg", "tanpa keranjang", "proses mitra"],
    "ask_partner_requirements": ["syarat mitra", "ketentuan mitra", "kebutuhan mitra", "perlu apa", "butuh apa", "reseller", "umkm", "kantin", "event", "pengiriman", "stok final"],
    "ask_partner_contact": ["kontak mitra", "nomor wa mitra", "whatsapp mitra", "admin mitra", "email mitra", "hubungi mitra", "nomor admin mitra"],
    "ask_chatbot_system": ["chatbot", "llm", "rag", "ner", "fastapi", "backend", "frontend", "endpoint", "gemini", "fallback"],
    "ask_preprocessing": ["preprocessing", "normalisasi", "typo", "huruf berulang", "fuzzy", "clean text", "teks processing", "text processing"],
}

AVAILABLE_FLAVORS = {"vanila", "vanilla", "taro", "coklat"}
SOLD_OUT_FLAVORS = {"durian", "duren", "stroberi", "strawberry", "nangka"}

DOMAIN_VOCABULARY = sorted(
    {
        "ai",
        "alamat",
        "aturan",
        "backend",
        "bagaimana",
        "bayar",
        "beli",
        "brightness",
        "booth",
        "cara",
        "caranya",
        "chatbot",
        "chance",
        "coba",
        "coklat",
        "countdown",
        "diskon",
        "download",
        "delight",
        "durasi",
        "durian",
        "duren",
        "event",
        "eskrim",
        "foto",
        "frame",
        "frontend",
        "gemini",
        "game",
        "gratis",
        "harga",
        "halo",
        "hadiah",
        "habis",
        "jelaskan",
        "kamera",
        "kebijakan",
        "kode",
        "kontak",
        "likert",
        "layout",
        "llm",
        "lokasi",
        "memory",
        "mirror",
        "menu",
        "mini",
        "mitra",
        "admin",
        "mood",
        "ner",
        "normal",
        "nangka",
        "partner",
        "parameter",
        "paket",
        "pesan",
        "photobooth",
        "pilihan",
        "png",
        "potongan",
        "preprocessing",
        "promo",
        "qr",
        "rag",
        "retake",
        "ribu",
        "rasa",
        "rekomendasi",
        "reward",
        "rio",
        "roulette",
        "scan",
        "scoopify",
        "share",
        "stok",
        "stroberi",
        "taro",
        "test",
        "tiket",
        "topping",
        "vanila",
        "vanilla",
        "varian",
        "whatsapp",
        "windows",
        "reseller",
        "umkm",
        "kantin",
        "pengiriman",
        "ketentuan",
        "syarat",
    }
)

TYPO_DICTIONARY = {
    "aq": "aku",
    "ak": "aku",
    "bgaimana": "bagaimana",
    "bgaimna": "bagaimana",
    "bgmn": "bagaimana",
    "bgt": "banget",
    "brpa": "berapa",
    "bisa": "bisa",
    "bisaa": "bisa",
    "brighnes": "brightness",
    "brighness": "brightness",
    "buaat": "buat",
    "cabinet": "kabinet",
    "caraa": "cara",
    "caranyaa": "caranya",
    "ccoba": "coba",
    "ccocbbaa": "coba",
    "cokelat": "coklat",
    "coklaat": "coklat",
    "coklt": "coklat",
    "crome": "chrome",
    "dedngan": "dengan",
    "dri": "dari",
    "dettik": "detik",
    "fotoboth": "photobooth",
    "fotobooth": "photobooth",
    "fhotobooth": "photobooth",
    "fikter": "filter",
    "filtter": "filter",
    "gambaraa": "gambar",
    "gmbara": "gambar",
    "gimana": "bagaimana",
    "gimna": "bagaimana",
    "gmn": "bagaimana",
    "grattis": "gratis",
    "graattiss": "gratis",
    "hargaga": "harga",
    "hargaa": "harga",
    "hrga": "harga",
    "5kgg": "5kg",
    "5kilo": "5kg",
    "haraga": "harga",
    "konttak": "kontak",
    "dihibungi": "dihubungi",
    "dihubungii": "dihubungi",
    "laggi": "lagi",
    "matakuliah": "mata kuliah",
    "mitraa": "mitra",
    "mitraaa": "mitra",
    "mittra": "mitra",
    "minigame": "mini game",
    "meni": "menu",
    "naanya": "tanya",
    "nanya": "tanya",
    "ngga": "tidak",
    "pake": "pakai",
    "pecobaan": "percobaan",
    "photoboth": "photobooth",
    "photoboot": "photobooth",
    "photooboth": "photobooth",
    "photooboth": "photobooth",
    "phoyobootth": "photobooth",
    "pinttaar": "pintar",
    "prommo": "promo",
    "qrcode": "qr",
    "rb": "ribu",
    "vaariaan": "varian",
    "sessyattu": "sesuatu",
    "ssoalnya": "soalnya",
    "semntera": "sementara",
    "sementrara": "sementara",
    "tetpatat": "tepat",
    "tetang": "tentang",
    "tteks": "teks",
    "ttetaangg": "tentang",
    "ttentang": "tentang",
    "udaah": "sudah",
    "vaarian": "varian",
    "yyaangg": "yang",
}


def reduce_repeated_letters(word: str) -> str:
    return re.sub(r"([a-z])\1{1,}", r"\1", word)


def correct_token(token: str) -> tuple[str, str | None]:
    if not token or token.isdigit():
        return token, None
    if token in DOMAIN_VOCABULARY:
        return token, None
    if token in TYPO_DICTIONARY:
        return TYPO_DICTIONARY[token], f"dictionary:{token}->{TYPO_DICTIONARY[token]}"

    reduced = reduce_repeated_letters(token)
    if reduced in TYPO_DICTIONARY:
        return TYPO_DICTIONARY[reduced], f"repeat+dictionary:{token}->{TYPO_DICTIONARY[reduced]}"
    if reduced in DOMAIN_VOCABULARY:
        return reduced, f"repeat:{token}->{reduced}"
    if reduced.endswith("nya") and len(reduced) > 4:
        base = reduced[:-3]
        if base in DOMAIN_VOCABULARY:
            return base, f"suffix:{token}->{base}"

    if len(reduced) >= 5:
        match = get_close_matches(reduced, DOMAIN_VOCABULARY, n=1, cutoff=0.82)
        if match:
            return match[0], f"fuzzy:{token}->{match[0]}"

    return reduced, f"repeat:{token}->{reduced}" if reduced != token else None


def preprocess_text(text: str) -> tuple[str, list[str]]:
    steps: list[str] = []
    lowered = text.lower()
    if lowered != text:
        steps.append("lowercase")

    cleaned = re.sub(r"[^a-z0-9\s+]", " ", lowered)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    if cleaned != lowered.strip():
        steps.append("clean_non_alphanumeric")

    corrected_tokens: list[str] = []
    corrections: list[str] = []
    for token in cleaned.split():
        corrected, correction_step = correct_token(token)
        corrected_tokens.extend(corrected.split())
        if correction_step:
            corrections.append(correction_step)

    if corrections:
        steps.extend(corrections[:8])

    preprocessed = re.sub(r"\s+", " ", " ".join(corrected_tokens)).strip()
    if not steps:
        steps.append("no_change")
    return preprocessed, steps


def normalize_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s+]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def tokenize(text: str) -> set[str]:
    stop_words = {
        "aku",
        "saya",
        "mau",
        "ingin",
        "yang",
        "dan",
        "di",
        "ke",
        "itu",
        "ini",
        "ada",
        "apa",
        "gimana",
        "bagaimana",
        "buat",
        "untuk",
    }
    return {word for word in normalize_text(text).split() if word not in stop_words}


def contains_trigger(normalized_text: str, trigger: str) -> bool:
    normalized_trigger = normalize_text(trigger)
    if " " in normalized_trigger:
        return normalized_trigger in normalized_text
    return re.search(rf"\b{re.escape(normalized_trigger)}\b", normalized_text) is not None


def is_ambiguous_follow_up(message: str, entities: dict[str, list[str]] | None = None) -> bool:
    normalized = normalize_text(message)
    terms = tokenize(message)
    actions = set((entities or {}).get("actions", []))
    products = set((entities or {}).get("products", []))
    topics = set((entities or {}).get("topics", []))
    if actions or products or topics:
        return False
    if len(terms) <= 2:
        return True
    generic_patterns = [
        "bagaimana caranya",
        "gimana caranya",
        "caranya",
        "cara nya",
        "jelaskan",
        "maksudnya",
        "apa itu",
        "lanjut",
    ]
    return any(contains_trigger(normalized, pattern) for pattern in generic_patterns)


def extract_topic_entities(normalized_message: str) -> list[str]:
    topics: list[str] = []
    for topic_name, triggers in TOPIC_ALIAS_MAP.items():
        if any(contains_trigger(normalized_message, trigger) for trigger in triggers):
            topics.append(topic_name)
    return sorted(set(topics))


def extract_rich_entities(raw_message: str, normalized_message: str) -> dict[str, list[str]]:
    quantities = re.findall(r"\b\d+\s*(?:pcs|porsi|scoop|x|buah|item|kg|kilo|kilogram)\b", normalized_message)
    durations = re.findall(r"\b\d+\s*(?:detik|menit|minute|minutes|seconds?|sec)\b", normalized_message)
    layouts = re.findall(r"\b(?:2|3|6)\s*(?:foto|frame|layout)\b", normalized_message)
    frame_names = [
        frame for frame in ["free frame", "frame gratis", "premium frame", "frame premium", "cute doodle journal", "low poly", "old game", "windows 7"]
        if contains_trigger(normalized_message, frame)
    ]
    filters = [
        item for item in ["normal", "bnw", "b&w", "black and white", "nostalgia", "rio", "rio de janeiro"]
        if contains_trigger(normalized_message, item)
    ]
    reward_types = [
        item for item in [
            "topping gratis",
            "potongan 1000",
            "potongan 2000",
            "potongan 1 ribu",
            "potongan 2 ribu",
            "diskon 1000",
            "diskon 2000",
            "diskon 1 ribu",
            "diskon 2 ribu",
            "roulette",
        ]
        if contains_trigger(normalized_message, item)
    ]
    percentages = re.findall(r"\b\d+(?:[.,]\d+)?\s*(?:%|persen)\b", raw_message.lower())
    money_values = re.findall(
        r"(?:rp\s*\d[\d.,]*\s*(?:k|ribu|rupiah)?)|(?:\d[\d.,]*\s*(?:k|ribu|rupiah))",
        raw_message,
    )
    request_types: list[str] = []

    if any(contains_trigger(normalized_message, trigger) for trigger in ["dua rasa", "2 rasa", "mix", "campur", "kombinasi", "double"]):
        request_types.append("combo_rasa")
    if any(contains_trigger(normalized_message, trigger) for trigger in ["rekomendasi", "saran", "cocok", "sesuai mood"]):
        request_types.append("recommendation")

    return {
        "quantities": sorted(set(quantities)),
        "durations": sorted(set(durations)),
        "layouts": sorted(set(layouts)),
        "frames": sorted(set(frame_names)),
        "filters": sorted(set(filters)),
        "rewards": sorted(set(reward_types)),
        "percentages": sorted(set(percentages)),
        "money": sorted(set(money_values)),
        "request_types": sorted(set(request_types)),
    }


def retrieve_context(message: str, entities: dict[str, list[str]] | None = None, limit: int = 3) -> tuple[list[dict[str, Any]], float]:
    query_terms = tokenize(message)
    normalized = normalize_text(message)
    expanded_terms = set(query_terms)
    for term in list(query_terms):
        expanded_terms.update(QUERY_EXPANSIONS.get(term, []))

    if (
        not query_terms
        or any(contains_trigger(normalized, trigger) for trigger in ACTION_ENTITIES["greeting"] + ACTION_ENTITIES["test"])
        or is_ambiguous_follow_up(message, entities)
    ):
        return [], 1.0

    ranked: list[tuple[int, int, dict[str, Any]]] = []
    entity_topics = set((entities or {}).get("topics", []))
    entity_actions = set((entities or {}).get("actions", []))
    direct_context_ids = {INTENT_TO_KB_ID.get(action) for action in entity_actions}
    direct_context_ids.discard(None)

    for item in KNOWLEDGE_BASE:
        doc_terms = tokenize(" ".join([item["title"], item["content"], " ".join(item.get("keywords", []))]))
        score = len(expanded_terms & doc_terms)
        keyword_bonus = sum(1 for keyword in item.get("keywords", []) if contains_trigger(normalize_text(message), keyword))
        topic_bonus = 0
        direct_priority = 0
        if item.get("id") in direct_context_ids:
            topic_bonus += 8
            direct_priority = 1
        if item.get("id") in entity_topics:
            topic_bonus += 2
        ranked.append((score + keyword_bonus + topic_bonus, direct_priority, item))

    ranked.sort(key=lambda pair: (pair[1], pair[0]), reverse=True)
    best_score = ranked[0][0] if ranked else 0
    selected = [item for score, _, item in ranked if score > 0][:limit]
    confidence_denominator = max(4, len(expanded_terms) + 3)
    confidence = min(0.96, best_score / confidence_denominator)
    return selected, confidence


def extract_entities(message: str) -> dict[str, list[str]]:
    normalized = normalize_text(message)
    raw_message = message.lower()
    products = [product for product in PRODUCT_ENTITIES if contains_trigger(normalized, product)]
    topics = extract_topic_entities(normalized)
    actions = [
        action
        for action, triggers in ACTION_ENTITIES.items()
        if any(contains_trigger(normalized, trigger) for trigger in triggers)
    ]
    flavor_products = set(products) & (AVAILABLE_FLAVORS | SOLD_OUT_FLAVORS)
    if flavor_products and contains_trigger(normalized, "ada"):
        actions.append("check_stock")
    prices = re.findall(r"(?:rp\s*\d[\d.,]*\s*(?:k|ribu|rupiah)?)|(?:\d[\d.,]*\s*(?:k|ribu|rupiah))", raw_message)
    rich_entities = extract_rich_entities(raw_message, normalized)

    if rich_entities["layouts"]:
        actions.append("ask_photo_layout")
    if rich_entities["frames"]:
        actions.append("ask_frame")
    if rich_entities["filters"]:
        actions.append("ask_camera_setting")
    if rich_entities["rewards"] or rich_entities["percentages"]:
        actions.append("ask_reward_probability")
    if rich_entities["durations"]:
        actions.append("ask_duration")
    if rich_entities["request_types"]:
        actions.append("ask_recommendation")
    has_partner_quantity = any(
        contains_trigger(normalized, trigger)
        for trigger in ["5kg", "5 kg", "5 kilo", "5 kilogram"]
    )
    has_buy_intent = any(
        contains_trigger(normalized, trigger)
        for trigger in ["beli", "membeli", "pesan", "order"]
    )
    if has_partner_quantity:
        actions.append("ask_partner")
        actions.append("ask_partner_menu")
        if has_buy_intent:
            actions.append("ask_partner_flow")
    if contains_trigger(normalized, "mitra") and any(contains_trigger(normalized, trigger) for trigger in ["kontak", "hubungi", "dihubungi", "whatsapp", "wa", "admin"]):
        actions.append("ask_partner_contact")

    partner_specific_actions = {
        "ask_partner",
        "ask_partner_menu",
        "ask_partner_promo",
        "ask_partner_flow",
        "ask_partner_requirements",
        "ask_partner_contact",
    }
    if partner_specific_actions & set(actions):
        if "ask_partner_menu" in actions and "ask_variant" in actions:
            actions.remove("ask_variant")
        if "ask_partner_promo" in actions and "ask_promo" in actions:
            actions.remove("ask_promo")
        if "ask_partner_menu" in actions and "ask_price" in actions:
            actions.remove("ask_price")
        if "check_stock" in actions and not flavor_products:
            actions.remove("check_stock")

    return {
        "products": sorted(set(products)),
        "topics": topics,
        "actions": sorted(set(actions)),
        "prices": sorted(set(prices)),
        **rich_entities,
    }


def apply_history_followup_context(
    entities: dict[str, list[str]],
    current_message: str,
    history_text: str,
) -> dict[str, list[str]]:
    if not history_text:
        return entities

    normalized_current = normalize_text(current_message)
    normalized_history = normalize_text(history_text)
    actions = set(entities.get("actions", []))
    products = set(entities.get("products", []))
    topics = set(entities.get("topics", []))

    has_partner_history = any(
        contains_trigger(normalized_history, trigger)
        for trigger in ["mitra", "partner", "reseller", "5kg", "5 kg", "paket es krim 5"]
    )
    current_mentions_partner = any(
        contains_trigger(normalized_current, trigger)
        for trigger in [
            "mitra",
            "partner",
            "reseller",
            "5kg",
            "5 kg",
            "5 kilo",
            "5 kilogram",
            "paket 5",
            "kemitraan",
        ]
    )
    has_ai_mood_history = any(
        contains_trigger(normalized_history, trigger)
        for trigger in ["ai mood", "mood tracker", "euclidean", "parameter mood", "rekomendasi rasa"]
    )
    current_mentions_ai_mood = any(
        contains_trigger(normalized_current, trigger)
        for trigger in ["ai", "mood", "tracker", "parameter", "likert", "euclidean", "emosi", "menghitung"]
    )
    current_has_non_partner_context = bool(
        (products - {"mitra", "partner", "5kg", "paket 5 kg"})
        or (
            actions
            - {
                "ask_partner",
                "ask_partner_menu",
                "ask_partner_promo",
                "ask_partner_flow",
                "ask_partner_requirements",
                "ask_partner_contact",
                "ask_price",
                "order",
            }
        )
    )

    if has_partner_history and (current_mentions_partner or not current_has_non_partner_context) and not current_mentions_ai_mood:
        if any(contains_trigger(normalized_current, trigger) for trigger in ["kontak", "hubungi", "dihubungi", "wa", "whatsapp", "admin"]):
            actions.update(["ask_partner", "ask_partner_contact"])
            topics.update(["partner_feature_plan", "partner_contact_info"])
            products.add("mitra")
        if any(contains_trigger(normalized_current, trigger) for trigger in ["cara", "caranya", "bagaimana", "gimana", "alur", "proses"]):
            actions.update(["ask_partner", "ask_partner_flow"])
            topics.update(["partner_feature_plan", "partner_order_flow_detail"])
            products.add("mitra")
        if any(contains_trigger(normalized_current, trigger) for trigger in ["berapa", "harga", "5kg", "5 kg", "paket"]):
            actions.update(["ask_partner", "ask_partner_menu"])
            topics.update(["partner_feature_plan", "partner_menu_catalog"])
            products.add("mitra")
        if any(contains_trigger(normalized_current, trigger) for trigger in ["lokasi", "alamat", "dimana", "di mana"]):
            actions.update(["ask_partner", "ask_partner_contact"])
            topics.update(["partner_feature_plan", "partner_contact_info"])
            products.add("mitra")

    if has_ai_mood_history or current_mentions_ai_mood:
        if any(contains_trigger(normalized_current, trigger) for trigger in ["parameter", "input", "apa aja", "menghitung", "hitung", "dinilai"]):
            actions.add("ask_ai_mood")
            topics.update(["ai_mood", "ai_mood_current_input_detail"])
            products.add("ai mood tracker")

    entities["actions"] = sorted(actions)
    entities["products"] = sorted(products)
    entities["topics"] = sorted(topics)
    return entities


def format_chat_history(history: list[ChatTurn], limit: int = 8) -> str:
    compact_turns: list[str] = []
    for turn in history[-limit:]:
        role = "User" if turn.role == "user" else "Assistant"
        content = re.sub(r"\s+", " ", turn.content or "").strip()
        if content:
            compact_turns.append(f"{role}: {content[:420]}")
    return "\n".join(compact_turns)


def build_prompt(
    message: str,
    contexts: list[dict[str, Any]],
    entities: dict[str, list[str]],
    history: list[ChatTurn] | None = None,
) -> str:
    rag_context = "\n".join(f"- {item['title']}: {item['content']}" for item in contexts)
    conversation_history = format_chat_history(history or [])
    ner_examples = """
Contoh NER:
User: "harga coklat berapa dan masih ada?"
Entities: products=["coklat"], topics=["menu","price"], actions=["ask_price","check_stock"], prices=["harga"]
User: "aku mau scan QR buat photobooth"
Entities: products=["qr ticket","photobooth"], topics=["qr_ticket","photobooth"], actions=["scan_qr","use_photobooth"]
User: "layout 3 foto untuk photobooth ada?"
Entities: topics=["photobooth"], actions=["use_photobooth","ask_photo_layout"], layouts=["3 foto"]
User: "mini game berapa lama?"
Entities: topics=["mini_game"], actions=["play_game","ask_duration"], durations=["15 detik"]
User: "cara jadi mitra?"
Entities: products=["mitra"], topics=["partner_feature_plan","partner_order_flow_detail"], actions=["ask_partner","ask_partner_flow"]
User: "kontak admin mitra?"
Entities: products=["mitra","admin mitra"], topics=["partner_contact_info"], actions=["ask_partner","ask_partner_contact"]
"""

    system = f"""
Kamu adalah Scoopify Assistant, asisten virtual ramah untuk website Scoopify.
Jawab dalam Bahasa Indonesia yang singkat, jelas, dan sesuai konteks internal.
Jangan mengarang stok, harga, atau aturan di luar konteks RAG.
Jika informasi tidak ada di konteks, katakan bahwa informasi perlu dikonfirmasi ke booth.

Konteks RAG internal:
{rag_context}

Riwayat percakapan sebelumnya:
{conversation_history or "- Belum ada riwayat percakapan."}

NER few-shot prompt:
{ner_examples}

NER terdeteksi dari pesan user:
{json.dumps(entities, ensure_ascii=False)}

Pertanyaan pengguna:
{message}

Instruksi output:
- Jawab langsung ke pelanggan.
- Gunakan konteks RAG sebagai sumber kebenaran.
- Jika pertanyaan pengguna berupa lanjutan seperti "berapa?", "kontaknya?", atau "caranya?", pahami referensinya dari riwayat percakapan.
- Jika konteks RAG berisi informasi mitra, jangan menjawab informasi tidak tersedia.
- Jangan membahas mitra, reseller, paket 5 kg, atau WhatsApp mitra kecuali pertanyaan pengguna memang menyebut mitra, reseller, kemitraan, atau 5 kg.
- Manfaatkan hasil NER untuk memahami produk atau aksi yang dimaksud.
- Prioritaskan topics, layouts, durations, dan money jika tersedia.
- Maksimal 4 kalimat.
- Gunakan plain text saja, tanpa markdown, tanpa bullet, tanpa tanda bintang, dan jangan mengulang pertanyaan pengguna.
""".strip()
    return system


def fallback_answer(message: str, contexts: list[dict[str, Any]], entities: dict[str, list[str]]) -> str:
    normalized = normalize_text(message)
    context_text = contexts[0]["content"] if contexts else "Informasi belum tersedia."
    actions = set(entities["actions"])
    products = set(entities["products"])
    layouts = set(entities.get("layouts", []))
    durations = set(entities.get("durations", []))
    topics = set(entities.get("topics", []))
    answer_parts: list[str] = []
    mood_direct_answers = {
        "jatuh cinta": "Mood Jatuh Cinta idealnya Stroberi + Vanila, tetapi karena stroberi sold out sistem mengalihkan ke Vanila + Taro.",
        "bahagia": "Mood Bahagia / Senang idealnya Coklat + Vanila, dengan cadangan Coklat + Taro.",
        "senang": "Mood Bahagia / Senang idealnya Coklat + Vanila, dengan cadangan Coklat + Taro.",
        "sedih": "Mood Sedih / Galau idealnya Coklat + Taro, dengan cadangan Coklat + Vanila.",
        "galau": "Mood Sedih / Galau idealnya Coklat + Taro, dengan cadangan Coklat + Vanila.",
        "patah hati": "Mood Patah Hati idealnya Coklat, dengan cadangan Taro.",
        "bingung": "Mood Bingung / Overthinking idealnya Durian + Taro, tetapi karena durian sold out sistem mengalihkan ke Vanila + Taro.",
        "overthinking": "Mood Bingung / Overthinking idealnya Durian + Taro, tetapi karena durian sold out sistem mengalihkan ke Vanila + Taro.",
        "rindu": "Mood Rindu / Nostalgia idealnya Nangka + Vanila, tetapi karena nangka sold out sistem mengalihkan ke Vanila + Taro.",
        "nostalgia": "Mood Rindu / Nostalgia idealnya Nangka + Vanila, tetapi karena nangka sold out sistem mengalihkan ke Vanila + Taro.",
        "kecewa": "Mood Kecewa idealnya Taro + Coklat, dengan cadangan Vanila + Coklat.",
        "grief": "Mood Grief / Berduka idealnya Vanila, dengan cadangan Taro.",
        "berduka": "Mood Grief / Berduka idealnya Vanila, dengan cadangan Taro.",
        "marah": "Mood Marah / Kesal idealnya Durian + Coklat, tetapi karena durian sold out sistem mengalihkan ke Coklat + Taro.",
        "kesal": "Mood Marah / Kesal idealnya Durian + Coklat, tetapi karena durian sold out sistem mengalihkan ke Coklat + Taro.",
        "cemas": "Mood Cemas / Gelisah idealnya Vanila + Taro, dengan cadangan Vanila.",
        "gelisah": "Mood Cemas / Gelisah idealnya Vanila + Taro, dengan cadangan Vanila.",
        "bosan": "Mood Bosan / Jenuh idealnya Nangka + Durian, tetapi karena keduanya sold out sistem mengalihkan ke Taro + Coklat.",
        "jenuh": "Mood Bosan / Jenuh idealnya Nangka + Durian, tetapi karena keduanya sold out sistem mengalihkan ke Taro + Coklat.",
    }

    if "greeting" in actions:
        return "Halo! Aku Scoopify AI. Kamu bisa tanya soal menu, harga, stok, promo, QR ticket, mini game, AI Mood Tracker, atau photobooth."
    if "test" in actions:
        return "Tes berhasil. Chatbot Scoopify sudah aktif dan siap menjawab pertanyaan pelanggan."
    if is_ambiguous_follow_up(message, entities):
        return "Maksudmu cara untuk bagian yang mana? Aku bisa jelaskan cara pesan, scan QR ticket, main mini game, pakai photobooth, atau pakai AI Mood Tracker."
    if not contexts and not actions and not products:
        return "Aku belum menangkap maksudnya. Coba tanya lebih spesifik soal menu, harga, stok, promo, QR ticket, mini game, AI Mood Tracker, atau photobooth Scoopify."

    if "ask_price" in actions:
        answer_parts.append("Harga Scoopify saat ini Rp5.000 per scoop.")
    if "check_stock" in actions:
        mentioned_available = sorted(products & AVAILABLE_FLAVORS)
        mentioned_sold_out = sorted(products & SOLD_OUT_FLAVORS)
        if mentioned_available:
            answer_parts.append(f"Rasa {', '.join(mentioned_available)} sedang tersedia.")
        if mentioned_sold_out:
            answer_parts.append(f"Rasa {', '.join(mentioned_sold_out)} sedang sold out.")
        if not mentioned_available and not mentioned_sold_out:
            answer_parts.append("Stok aktif saat ini: Vanila, Taro, dan Coklat. Durian, Stroberi, dan Nangka sedang sold out.")
    if "ask_promo" in actions:
        answer_parts.append("Promo tersedia lewat mini game, dengan peluang topping gratis pilihan bebas dari topping tersedia, potongan Rp1.000, atau potongan Rp2.000.")
    if "ask_reward_probability" in actions:
        answer_parts.append("Peluang reward mini game adalah topping gratis 91%, potongan Rp1.000 sebesar 6%, dan potongan Rp2.000 sebesar 3%.")
    if "ask_location" in actions:
        answer_parts.append("Lokasi Scoopify mengikuti booth event atau pop-up booth pada hari acara.")
    if "ask_policy" in actions:
        answer_parts.append("QR ticket mini game dibatasi sesuai aturan percobaan, sedangkan photobooth premium dapat digunakan selama tiket valid.")
    if "scan_qr" in actions:
        answer_parts.append("QR code unik dari tiap pembelian berfungsi sebagai ticket digital untuk membuka mini game dan frame premium photobooth.")
    if "ask_qr_scanner" in actions:
        answer_parts.append("Scanner QR memakai kamera browser dengan BarcodeDetector jika tersedia dan jsQR sebagai fallback pembaca QR dari video.")
    if "use_photobooth" in actions:
        answer_parts.append("Photobooth punya 1 frame gratis dan 4 frame premium yang dibuka dengan scan QR ticket, plus fitur retake, brightness, filter, download, dan share.")
    if "ask_frame" in actions:
        answer_parts.append("Frame gratisnya adalah Free Frame/basic, sedangkan frame premium adalah Cute Doodle Journal, Low Poly, Old Game, dan Windows 7.")
    if "ask_camera_setting" in actions:
        answer_parts.append("Setting kamera photobooth mencakup Mirror, Brightness 70-140%, filter Normal, B&W, Nostalgia, dan Rio de Janeiro, serta countdown sebelum foto.")
    if "ask_download_share" in actions:
        answer_parts.append("Download dan Share muncul setelah pengguna menekan Finish; hasil foto disimpan sebagai PNG dan share memakai fitur berbagi browser bila didukung.")
    if "play_game" in actions:
        answer_parts.append("Mini game memakai QR ticket, berbentuk memory game 12 kartu dari 6 gambar varian rasa, durasinya 15 detik, dan maksimal 3 kali percobaan.")
    if "ask_game_rule" in actions:
        answer_parts.append("Salah tebak kartu tidak mengurangi kesempatan; kesempatan berkurang per ronde saat game dimulai, dan tiket mini game selesai setelah menang atau 3 percobaan habis.")
    if "ask_ai_mood" in actions or "mood" in normalized:
        answer_parts.append("AI Mood Tracker mencocokkan mood dengan knowledge base dan Euclidean Distance, lalu memberi rekomendasi rasa yang paling cocok.")
    if "ask_ai_mood" in actions and any(contains_trigger(normalized, trigger) for trigger in ["parameter", "input", "apa aja", "menghitung", "hitung"]):
        answer_parts.append("Parameter yang dihitung adalah Energy Level, Emotional Valence, Stress/Anxiety Level, dan Craving Taste Profile. Keempat nilai ini dipakai untuk mencocokkan mood pengguna dengan profil rasa di knowledge base.")
    if "ask_mood_profile" in actions:
        for trigger, direct_answer in mood_direct_answers.items():
            if contains_trigger(normalized, trigger):
                answer_parts.append(direct_answer)
                break
        answer_parts.append("Mood yang dikenali meliputi Jatuh Cinta, Bahagia, Sedih/Galau, Patah Hati, Bingung/Overthinking, Rindu/Nostalgia, Kecewa, Grief, Bittersweet, Marah, Cemas, dan Bosan.")
    if "ask_variant" in actions:
        answer_parts.append("Varian tersedia saat ini meliputi Vanilla, Taro, Coklat, Vanilla Taro, Taro Coklat, Coklat Vanilla, Vanilla Coklat, dan Taro Vanilla Coklat; varian dengan Duren, Stroberi, dan Nangka sedang sold out.")
    if "ask_order_flow" in actions:
        answer_parts.append("Alurnya: pilih atau cek rekomendasi rasa, lihat menu dan stok, lakukan pembelian di booth, lalu scan QR ticket untuk fitur interaktif.")
    if "ask_partner" in actions:
        answer_parts.append("Fitur Gabung Sebagai Mitra tersedia dari bubble di kiri bawah halaman Daftar Varian. Paket mitra dijual per 5 kg untuk reseller, UMKM, kantin, booth event, coffee shop, atau penjual lokal.")
    if "ask_partner_menu" in actions:
        answer_parts.append("Menu mitra 5 kg terdiri dari Durian Delight, Pandan Cream, Chocolate Heaven, Strawberry Bliss, Fresh Taro, dan Vanilla Classic, masing-masing Rp80.000 per 5 kg.")
    if "ask_partner_promo" in actions:
        answer_parts.append("Promo opening mitra adalah Beli 2 Gratis 1 untuk semua varian rasa klasik, dengan tombol Ambil Promo yang langsung menuju WhatsApp.")
    if "ask_partner_flow" in actions:
        answer_parts.append("Alur mitra: pilih paket 5 kg atau promo, tekan Pesan, lalu WhatsApp admin terbuka otomatis. Setelah itu konfirmasi varian, jumlah, lokasi, jadwal, pembayaran, dan pengiriman.")
    if "ask_partner_requirements" in actions:
        answer_parts.append("Syarat praktis mitra adalah menentukan varian, jumlah paket 5 kg, tanggal kebutuhan, lokasi, serta metode pembayaran. Stok, pengiriman, dan promo final dikonfirmasi admin.")
    if "ask_partner_contact" in actions:
        answer_parts.append("Kontak mitra Scoopify: WhatsApp +62 812 3456 789 dan email halo@scoopify.id. Lokasi utama di Medan, Sumatera Utara; area layanan mengikuti lokasi event dan ketersediaan produksi.")
    if "ask_chatbot_system" in actions:
        answer_parts.append("Chatbot memakai frontend HTML/JavaScript, backend FastAPI endpoint /chat, NER berbasis aturan, RAG dari knowledge_base.json, dan Gemini LLM jika API key aktif.")
    if "ask_preprocessing" in actions:
        answer_parts.append("Preprocessing chatbot meliputi lowercase, pembersihan karakter, pengurangan huruf berulang, kamus typo, dan fuzzy matching ke kosakata Scoopify.")
    if "ask_photo_layout" in actions or layouts:
        layout_text = ", ".join(sorted(layouts)) if layouts else "2 foto, 3 foto, dan 6 foto"
        answer_parts.append(f"Photobooth Scoopify mendukung layout {layout_text}.")
    if "ask_duration" in actions or durations:
        duration_text = ", ".join(sorted(durations)) if durations else "15 detik"
        answer_parts.append(f"Mini game memakai durasi sekitar {duration_text}.")
    if "ask_recommendation" in actions or "ai_mood" in topics:
        answer_parts.append("Kalau kamu mau rekomendasi rasa, AI Mood Tracker bisa bantu mencocokkan mood dengan pilihan stok yang tersedia.")

    if answer_parts:
        return " ".join(answer_parts)
    return context_text


def summarize_gemini_http_error(error: urllib.error.HTTPError) -> str:
    detail = error.read().decode("utf-8", errors="replace")
    try:
        payload = json.loads(detail)
        message = payload.get("error", {}).get("message", "")
        status = payload.get("error", {}).get("status", "")
    except json.JSONDecodeError:
        message = detail
        status = ""

    if error.code == 401:
        return "Gemini API key tidak valid atau belum aktif"
    if error.code == 403:
        return "Gemini API ditolak. Cek permission, billing, atau pembatasan API key"
    if error.code == 429:
        return "Kuota atau rate limit Gemini habis"
    return f"Gemini HTTP {error.code}: {status or message[:120]}"


def clean_llm_answer(answer: str) -> str:
    answer = re.sub(r"[*_`#]+", "", answer or "")
    answer = re.sub(r"\s+", " ", answer).strip()
    return answer


def is_usable_llm_answer(answer: str) -> bool:
    if len(answer) < 24:
        return False
    if len(answer.split()) < 8:
        return False
    if answer.startswith((":**", "**", "-")):
        return False
    if answer[-1] not in ".!?":
        return False
    return any(char.isalpha() for char in answer)


def contradicts_available_context(answer: str, contexts: list[dict[str, Any]]) -> bool:
    normalized_answer = normalize_text(answer)
    context_ids = {item.get("id", "") for item in contexts}
    has_partner_context = any(context_id.startswith("partner_") for context_id in context_ids)
    unavailable_phrases = [
        "informasi tidak tersedia",
        "tidak tersedia dalam sistem",
        "tidak ada informasi",
        "tanyakan langsung kepada staf",
        "tanyakan langsung ke staf",
    ]
    return has_partner_context and any(contains_trigger(normalized_answer, phrase) for phrase in unavailable_phrases)


def get_model_candidates() -> list[str]:
    models = [DEFAULT_MODEL]
    models.extend(model.strip() for model in DEFAULT_FALLBACK_MODELS.split(",") if model.strip())
    normalized_models: list[str] = []
    for model in models:
        model_id = normalize_model_name(model)
        if model_id and model_id not in normalized_models:
            normalized_models.append(model_id)
    return normalized_models


def generate_answer(
    message: str,
    contexts: list[dict[str, Any]],
    entities: dict[str, list[str]],
    history: list[ChatTurn] | None = None,
) -> tuple[str, str, bool, str | None]:
    local_only_actions = {"greeting", "test"}
    partner_local_actions = {
        "ask_partner",
        "ask_partner_menu",
        "ask_partner_promo",
        "ask_partner_flow",
        "ask_partner_requirements",
        "ask_partner_contact",
    }
    has_intent = bool(entities.get("actions") or entities.get("products") or entities.get("topics"))
    if set(entities.get("actions", [])) & partner_local_actions:
        return fallback_answer(message, contexts, entities), "local-rag-ner", False, None

    if (
        set(entities.get("actions", [])) & local_only_actions
        or is_ambiguous_follow_up(message, entities)
        or (not contexts and not has_intent)
    ):
        return fallback_answer(message, contexts, entities), "local-ner", False, None

    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        return fallback_answer(message, contexts, entities), "fallback-rag", False, "GEMINI_API_KEY kosong"

    last_error: str | None = None

    for model_id in get_model_candidates():
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_id}:generateContent"
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": build_prompt(message, contexts, entities, history)}],
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 260,
            },
        }
        try:
            request = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json", "x-goog-api-key": api_key},
                method="POST",
            )
            with urllib.request.urlopen(request, timeout=8) as response:
                data = json.loads(response.read().decode("utf-8"))

            answer = clean_llm_answer(
                data.get("candidates", [{}])[0]
                .get("content", {})
                .get("parts", [{}])[0]
                .get("text", "")
                .strip()
            )
            if contradicts_available_context(answer, contexts):
                return fallback_answer(message, contexts, entities), "fallback-rag", False, f"Respons {model_id} mengabaikan konteks RAG mitra"
            if is_usable_llm_answer(answer):
                return answer, f"gemini-llm-rag-ner:{model_id}", True, None
            last_error = f"Respons {model_id} kosong, pendek, atau terpotong"
        except urllib.error.HTTPError as error:
            last_error = summarize_gemini_http_error(error)
        except (urllib.error.URLError, TimeoutError, KeyError, IndexError, json.JSONDecodeError) as error:
            last_error = f"{type(error).__name__}: {str(error)[:180]}"

    return fallback_answer(message, contexts, entities), "fallback-rag", False, last_error or "Semua model Gemini gagal"


@app.get("/")
def health_check() -> dict[str, str]:
    gemini_key_loaded = bool(os.getenv("GEMINI_API_KEY", "").strip())
    return {
        "status": "ok",
        "service": "Scoopify NLP Chatbot API",
        "llm_provider": "gemini",
        "llm_model": normalize_model_name(DEFAULT_MODEL),
        "llm_fallback_models": ",".join(get_model_candidates()[1:]),
        "gemini_key_loaded": str(gemini_key_loaded).lower(),
    }


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    started_at = time.perf_counter()
    original_message = request.message.strip()
    history = request.history[-8:]
    history_text = " ".join(turn.content for turn in history if turn.content)
    preprocessed_message, preprocessing_steps = preprocess_text(original_message)
    message_for_pipeline = preprocessed_message or original_message
    current_entities = extract_entities(message_for_pipeline)
    retrieval_message = message_for_pipeline

    entities = apply_history_followup_context(current_entities, message_for_pipeline, history_text)
    contexts, confidence = retrieve_context(retrieval_message, entities)
    has_intent = bool(entities.get("actions") or entities.get("products") or entities.get("topics"))
    if not has_intent and confidence < 0.45:
        contexts = []
    use_history_for_llm = is_ambiguous_follow_up(message_for_pipeline, current_entities) or not (
        current_entities.get("actions") or current_entities.get("products") or current_entities.get("topics")
    )
    history_for_llm = history if use_history_for_llm else []
    answer, mode, llm_used, llm_error = generate_answer(message_for_pipeline, contexts, entities, history_for_llm)
    latency_ms = int((time.perf_counter() - started_at) * 1000)

    return ChatResponse(
        answer=answer,
        original_message=original_message,
        preprocessed_message=message_for_pipeline,
        preprocessing_steps=preprocessing_steps,
        entities=entities,
        retrieved_context=[
            {"id": item["id"], "title": item["title"], "content": item["content"]}
            for item in contexts
        ],
        mode=mode,
        llm_used=llm_used,
        llm_error=llm_error,
        confidence=confidence,
        latency_ms=latency_ms,
    )


app.mount("/", StaticFiles(directory=BASE_DIR.parent, html=True), name="scoopify-static")
