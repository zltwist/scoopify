from __future__ import annotations

import argparse
import json
import math
from dataclasses import asdict, dataclass
from typing import Dict, List, Optional


SOLD_OUT_FLAVORS = {"stroberi", "nangka"}
ACTIVE_FLAVORS = {"durian", "vanila", "coklat", "taro"}


@dataclass(frozen=True)
class MoodRule:
    key: str
    mood: str
    nickname: str
    vector: Dict[str, int]
    ideal_flavor: str
    fallback_flavor: str
    rationale: str
    bridge: Optional[str] = None


@dataclass(frozen=True)
class Recommendation:
    mood_key: str
    mood: str
    nickname: str
    input_vector: Dict[str, int]
    target_vector: Dict[str, int]
    euclidean_distance: float
    match_percent: int
    ideal_flavor: str
    ideal_status: str
    selected_flavor: str
    selected_status: str
    action: str
    rationale: str
    substitution_note: Optional[str]


MOOD_KNOWLEDGE_BASE: List[MoodRule] = [
    MoodRule(
        key="jatuh_cinta",
        mood="Jatuh Cinta",
        nickname="The Butterfly Effect",
        vector={"energy": 5, "emotional": 5, "stress": 2, "craving": 3},
        ideal_flavor="Stroberi + Vanila",
        fallback_flavor="Vanila + Taro",
        rationale=(
            "Lonjakan dopamin dan oksitosin menciptakan energi tinggi dan kebahagiaan maksimal. "
            "Lidah cenderung menginginkan rasa romantis, manis, dan segar."
        ),
        bridge=(
            "Karena stroberi sedang kosong, sistem mengalihkan formula ke Vanila + Taro "
            "yang tetap creamy, manis, dan romantis."
        ),
    ),
    MoodRule(
        key="bahagia",
        mood="Bahagia / Senang",
        nickname="Sunshine On-The-Go",
        vector={"energy": 4, "emotional": 5, "stress": 1, "craving": 2},
        ideal_flavor="Coklat + Vanila",
        fallback_flavor="Coklat + Taro",
        rationale=(
            "Emosi positif yang stabil dan minim kortisol cocok dirayakan dengan kombinasi "
            "rasa legendaris yang creamy dan memuaskan."
        ),
    ),
    MoodRule(
        key="sedih_galau",
        mood="Sedih / Galau",
        nickname="Cloudy with a Chance of Tears",
        vector={"energy": 2, "emotional": 2, "stress": 3, "craving": 1},
        ideal_flavor="Coklat + Taro",
        fallback_flavor="Coklat + Vanila",
        rationale=(
            "Saat serotonin menurun, tubuh cenderung mencari comfort food dengan rasa "
            "manis pekat untuk membantu memicu rasa nyaman."
        ),
    ),
    MoodRule(
        key="patah_hati",
        mood="Patah Hati",
        nickname="The Heartbreak Club",
        vector={"energy": 1, "emotional": 1, "stress": 4, "craving": 1},
        ideal_flavor="Coklat",
        fallback_flavor="Taro",
        rationale=(
            "Drop energi dan kecemasan tinggi membutuhkan rasa coklat pekat sebagai "
            "comfort flavor yang bold dan menenangkan."
        ),
    ),
    MoodRule(
        key="bingung",
        mood="Bingung / Overthinking",
        nickname="The Maze Runner",
        vector={"energy": 3, "emotional": 3, "stress": 5, "craving": 4},
        ideal_flavor="Durian + Taro",
        fallback_flavor="Vanila + Taro",
        rationale=(
            "Stres kognitif tinggi membutuhkan distraksi sensorik yang kompleks dan earthy "
            "untuk memutus rantai pikiran yang berputar."
        ),
    ),
    MoodRule(
        key="rindu_nostalgia",
        mood="Rindu / Nostalgia",
        nickname="Time Traveler",
        vector={"energy": 3, "emotional": 4, "stress": 2, "craving": 5},
        ideal_flavor="Nangka + Vanila",
        fallback_flavor="Durian + Vanila",
        rationale=(
            "Kondisi melankolis yang hangat cocok dengan rasa lokal yang eksotis, autentik, "
            "dan beraroma kuat."
        ),
        bridge=(
            "Karena nangka sedang kosong, AI mengalihkan rekomendasi ke Durian + Vanila "
            "yang sama-sama lokal, kuat, dan creamy."
        ),
    ),
    MoodRule(
        key="kecewa",
        mood="Kecewa",
        nickname="The Bitter Truth",
        vector={"energy": 2, "emotional": 2, "stress": 4, "craving": 1},
        ideal_flavor="Taro + Coklat",
        fallback_flavor="Vanila + Coklat",
        rationale=(
            "Rasa sedih yang disertai ketegangan internal membutuhkan rasa creamy padat "
            "berpadu manis-pahit sebagai soothing agent."
        ),
    ),
    MoodRule(
        key="grief",
        mood="Grief / Berduka",
        nickname="The Midnight Rain",
        vector={"energy": 1, "emotional": 1, "stress": 2, "craving": 2},
        ideal_flavor="Vanila",
        fallback_flavor="Taro",
        rationale=(
            "Pada fase emotional numbness, indra perasa lebih aman menerima rasa yang "
            "murni, polos, lembut, dan netral."
        ),
    ),
    MoodRule(
        key="bittersweet",
        mood="Senang tapi Sedih",
        nickname="The Rainy Sunset",
        vector={"energy": 3, "emotional": 3, "stress": 3, "craving": 3},
        ideal_flavor="Stroberi + Coklat",
        fallback_flavor="Vanila + Coklat",
        rationale=(
            "Ambivalensi emosi cocok dengan pengalaman sensorik kontras: segar, manis, "
            "dan pekat."
        ),
        bridge=(
            "Karena stroberi sedang kosong, AI memilih Vanila + Coklat sebagai pengganti "
            "yang tetap memberi kontras lembut dan pekat."
        ),
    ),
    MoodRule(
        key="marah",
        mood="Marah / Kesal",
        nickname="Volcanic Eruption",
        vector={"energy": 5, "emotional": 1, "stress": 5, "craving": 5},
        ideal_flavor="Durian + Coklat",
        fallback_flavor="Durian",
        rationale=(
            "Amigdala yang over-stimulated membutuhkan pengalihan rasa yang kuat, dominan, "
            "dan tajam untuk memusatkan ulang orientasi sensorik."
        ),
    ),
    MoodRule(
        key="cemas",
        mood="Cemas / Gelisah",
        nickname="The Panic Room",
        vector={"energy": 4, "emotional": 2, "stress": 5, "craving": 2},
        ideal_flavor="Vanila + Taro",
        fallback_flavor="Vanila",
        rationale=(
            "Cemas berlebih cocok ditenangkan dengan karakter rasa milky dan creamy-soft "
            "yang terasa aman di tubuh."
        ),
    ),
    MoodRule(
        key="bosan",
        mood="Bosan / Jenuh",
        nickname="Stuck in Time",
        vector={"energy": 2, "emotional": 3, "stress": 1, "craving": 5},
        ideal_flavor="Nangka + Durian",
        fallback_flavor="Durian + Taro",
        rationale=(
            "Kurang stimulasi dopaminergik cocok dibangunkan dengan rasa tropis lokal "
            "yang tajam dan intens."
        ),
        bridge=(
            "Karena nangka sedang kosong, AI mengalihkan ke Durian + Taro yang tetap "
            "unik, kuat, dan tersedia."
        ),
    ),
]


def validate_likert(name: str, value: int) -> int:
    if value < 1 or value > 5:
        raise ValueError(f"{name} harus bernilai 1 sampai 5.")
    return value


def parse_flavor_components(flavor: str) -> List[str]:
    return [part.strip().lower() for part in flavor.split("+") if part.strip()]


def has_sold_out_component(flavor: str) -> bool:
    return any(component in SOLD_OUT_FLAVORS for component in parse_flavor_components(flavor))


def euclidean_distance(user_vector: Dict[str, int], target_vector: Dict[str, int]) -> float:
    return math.sqrt(
        (user_vector["energy"] - target_vector["energy"]) ** 2
        + (user_vector["emotional"] - target_vector["emotional"]) ** 2
        + (user_vector["stress"] - target_vector["stress"]) ** 2
        + (user_vector["craving"] - target_vector["craving"]) ** 2
    )


def match_percent(distance: float) -> int:
    max_distance = 8.0
    return max(55, min(99, round(100 - (distance / max_distance) * 100)))


def recommend(
    energy: int,
    emotional: int,
    stress: int,
    craving: int,
    use_pretrained: bool = False,
) -> Recommendation:
    """Return the closest mood recommendation.

    The main model is a deterministic knowledge-based expert system. The
    use_pretrained flag is accepted for CLI compatibility, but this numeric
    Likert task does not require a text/image pretrained model.
    """

    user_vector = {
        "energy": validate_likert("energy", energy),
        "emotional": validate_likert("emotional", emotional),
        "stress": validate_likert("stress", stress),
        "craving": validate_likert("craving", craving),
    }

    best_rule = min(
        MOOD_KNOWLEDGE_BASE,
        key=lambda rule: euclidean_distance(user_vector, rule.vector),
    )
    distance = euclidean_distance(user_vector, best_rule.vector)
    ideal_sold_out = has_sold_out_component(best_rule.ideal_flavor)
    selected_flavor = best_rule.fallback_flavor if ideal_sold_out else best_rule.ideal_flavor

    return Recommendation(
        mood_key=best_rule.key,
        mood=best_rule.mood,
        nickname=best_rule.nickname,
        input_vector=user_vector,
        target_vector=best_rule.vector,
        euclidean_distance=round(distance, 4),
        match_percent=match_percent(distance),
        ideal_flavor=best_rule.ideal_flavor,
        ideal_status="SOLD OUT / HABIS DI DEPO" if ideal_sold_out else "AVAILABLE",
        selected_flavor=selected_flavor,
        selected_status="ALTERNATIVE AVAILABLE" if ideal_sold_out else "AVAILABLE",
        action=(
            "PESAN VARIAN ALTERNATIF PILIHAN AI"
            if ideal_sold_out
            else "KONFIRMASI DAN PESAN SEKARANG"
        ),
        rationale=best_rule.rationale,
        substitution_note=best_rule.bridge if ideal_sold_out else None,
    )


def print_human_readable(result: Recommendation) -> None:
    print(f"Mood terpilih: {result.mood} ({result.nickname})")
    print(f"Input vector: {result.input_vector}")
    print(f"Target vector: {result.target_vector}")
    print(f"Euclidean distance: {result.euclidean_distance}")
    print(f"Match: {result.match_percent}%")
    print(f"Rasa ideal: {result.ideal_flavor}")
    print(f"Status rasa ideal: {result.ideal_status}")
    if result.substitution_note:
        print(f"Rekomendasi pengalihan AI: {result.selected_flavor}")
        print(f"Catatan substitusi: {result.substitution_note}")
    else:
        print(f"Rekomendasi utama: {result.selected_flavor}")
    print(f"Aksi: {result.action}")
    print(f"Rasional: {result.rationale}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="AI Mood Tracker Ice Cream Recommendation untuk Scoopify."
    )
    parser.add_argument("--energy", type=int, required=True, help="P1 Energy Level, nilai 1-5.")
    parser.add_argument("--emotional", type=int, required=True, help="P2 Emotional Valence, nilai 1-5.")
    parser.add_argument("--stress", type=int, required=True, help="P3 Stress/Anxiety Level, nilai 1-5.")
    parser.add_argument("--craving", type=int, required=True, help="P4 Craving Taste Profile, nilai 1-5.")
    parser.add_argument("--json", action="store_true", help="Cetak output JSON.")
    parser.add_argument(
        "--use-pretrained",
        action="store_true",
        help="Placeholder kompatibilitas. Model utama tetap expert system karena input berupa angka Likert.",
    )
    return parser


def main() -> None:
    args = build_parser().parse_args()
    result = recommend(
        energy=args.energy,
        emotional=args.emotional,
        stress=args.stress,
        craving=args.craving,
        use_pretrained=args.use_pretrained,
    )

    if args.json:
        print(json.dumps(asdict(result), ensure_ascii=False, indent=2))
        return

    print_human_readable(result)


if __name__ == "__main__":
    main()
