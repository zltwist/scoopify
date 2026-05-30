const flavorInventory = {
  durian: true,
  duren: true,
  nangka: false,
  vanila: true,
  vanilla: true,
  coklat: true,
  stroberi: false,
  taro: true,
};

const menuVariantCandidates = [
  "Coklat + Vanila",
  "Vanila + Taro",
  "Coklat + Taro",
  "Durian + Taro",
  "Durian + Vanila",
  "Vanila + Coklat",
  "Taro + Coklat",
  "Durian + Coklat",
  "Durian",
  "Vanila",
  "Taro",
  "Coklat",
  "Taro + Duren",
  "Taro + Vanila + Coklat",
  "Taro + Vanila + Duren",
  "Duren + Coklat + Vanila",
  "Stroberi + Vanila",
  "Stroberi + Coklat",
  "Nangka + Vanila",
  "Nangka + Durian",
];

const flavorSimilarity = {
  stroberi: ["vanila", "coklat", "taro"],
  nangka: ["durian", "vanila", "taro"],
  durian: ["nangka", "taro", "coklat", "vanila"],
  duren: ["nangka", "taro", "coklat", "vanila"],
  vanila: ["taro", "coklat", "durian"],
  vanilla: ["taro", "coklat", "durian"],
  coklat: ["taro", "vanila", "durian"],
  taro: ["vanila", "coklat", "durian"],
};
const flavorImages = {
  durian: "assets/menu/Durian.png",
  duren: "assets/menu/Durian.png",
  nangka: "assets/menu/Nangka.png",
  vanila: "assets/menu/Vanilla.png",
  vanilla: "assets/menu/Vanilla.png",
  coklat: "assets/menu/Coklat.png",
  stroberi: "assets/menu/Stroberi.png",
  taro: "assets/menu/Taro.svg",
};

const moodKnowledgeBase = {
  jatuh_cinta: {
    mood: "Jatuh Cinta",
    nickname: "The Butterfly Effect",
    vector: { energy: 5, emotional: 5, stress: 2, craving: 3 },
    idealFlavor: "Stroberi + Vanila",
    fallbackFlavor: "Vanila + Taro",
    theme: "theme-excited",
    header: "Analisis selesai! Detak emosimu memancarkan frekuensi merah jambu. Kamu terdeteksi sedang Jatuh Cinta (The Butterfly Effect).",
    rationale: "Lonjakan dopamin dan oksitosin membuat energi serta kebahagiaan berada di titik tinggi. Sistem membaca kebutuhan rasa romantis, manis, dan segar.",
    bridge: "Karena pasokan stroberi sedang kosong, sistem mengalihkan formula ke alternatif aktif yang tetap creamy, manis, dan romantis.",
  },
  bahagia: {
    mood: "Bahagia / Senang",
    nickname: "Sunshine On-The-Go",
    vector: { energy: 4, emotional: 5, stress: 1, craving: 2 },
    idealFlavor: "Coklat + Vanila",
    fallbackFlavor: "Coklat + Taro",
    theme: "theme-happy",
    header: "Hasil pemindaian getaran emosimu selesai! Kamu berada di fase Bahagia / Senang (Sunshine On-The-Go).",
    rationale: "Emosi positif stabil dan rendah stres cocok dirayakan dengan kombinasi rasa legendaris yang creamy dan memuaskan.",
  },
  sedih_galau: {
    mood: "Sedih / Galau",
    nickname: "Cloudy with a Chance of Tears",
    vector: { energy: 2, emotional: 2, stress: 3, craving: 1 },
    idealFlavor: "Coklat + Taro",
    fallbackFlavor: "Coklat + Vanila",
    theme: "theme-galau",
    header: "Hasil pemindaian getaran emosimu selesai! Sistem mendeteksi awan mendung sedang melintas di hatimu. Kamu berada di fase Sedih / Galau.",
    rationale: "Saat serotonin menurun, tubuh cenderung mencari comfort food dengan rasa manis pekat untuk membantu memicu rasa nyaman.",
  },
  patah_hati: {
    mood: "Patah Hati",
    nickname: "The Heartbreak Club",
    vector: { energy: 1, emotional: 1, stress: 4, craving: 1 },
    idealFlavor: "Coklat",
    fallbackFlavor: "Taro",
    theme: "theme-burnout",
    header: "Analisis selesai. Kamu berada di fase Patah Hati (The Heartbreak Club).",
    rationale: "Energi turun dan stres emosional naik. Rasa coklat pekat dipilih sebagai comfort flavor yang bold dan menenangkan.",
  },
  bingung: {
    mood: "Bingung / Overthinking",
    nickname: "The Maze Runner",
    vector: { energy: 3, emotional: 3, stress: 5, craving: 4 },
    idealFlavor: "Durian + Taro",
    fallbackFlavor: "Vanila + Taro",
    theme: "theme-galau",
    header: "Analisis selesai. Sistem mendeteksi pola Bingung / Overthinking (The Maze Runner).",
    rationale: "Stres kognitif tinggi membutuhkan distraksi sensorik yang kompleks dan earthy untuk memutus pikiran yang berputar.",
  },
  rindu_nostalgia: {
    mood: "Rindu / Nostalgia",
    nickname: "Time Traveler",
    vector: { energy: 3, emotional: 4, stress: 2, craving: 5 },
    idealFlavor: "Nangka + Vanila",
    fallbackFlavor: "Durian + Vanila",
    theme: "theme-nostalgic",
    header: "Analisis selesai. Kamu terdeteksi berada di fase Rindu / Nostalgia (Time Traveler).",
    rationale: "Memori episodik sering cocok dengan rasa lokal yang kuat, autentik, dan familiar.",
    bridge: "Karena nangka sedang sold out, AI mengalihkan rekomendasi ke Durian + Vanila yang sama-sama lokal, kuat, dan creamy.",
  },
  kecewa: {
    mood: "Kecewa",
    nickname: "The Bitter Truth",
    vector: { energy: 2, emotional: 2, stress: 4, craving: 1 },
    idealFlavor: "Taro + Coklat",
    fallbackFlavor: "Vanila + Coklat",
    theme: "theme-burnout",
    header: "Analisis selesai. Sistem membaca mood Kecewa (The Bitter Truth).",
    rationale: "Sedih dengan ketegangan internal membutuhkan rasa creamy padat dan manis-pahit sebagai soothing agent.",
  },
  grief: {
    mood: "Grief / Berduka",
    nickname: "The Midnight Rain",
    vector: { energy: 1, emotional: 1, stress: 2, craving: 2 },
    idealFlavor: "Vanila",
    fallbackFlavor: "Taro",
    theme: "theme-relaxed",
    header: "Analisis selesai. Kamu berada di fase Grief / Berduka (The Midnight Rain).",
    rationale: "Pada fase emotional numbness, indra perasa lebih aman menerima rasa yang murni, polos, lembut, dan netral.",
  },
  bittersweet: {
    mood: "Senang tapi Sedih",
    nickname: "The Rainy Sunset",
    vector: { energy: 3, emotional: 3, stress: 3, craving: 3 },
    idealFlavor: "Stroberi + Coklat",
    fallbackFlavor: "Vanila + Coklat",
    theme: "theme-melancholy",
    header: "Analisis selesai. Sistem membaca emosi ambivalen: Senang tapi Sedih (The Rainy Sunset).",
    rationale: "Dua kutub perasaan yang bertabrakan cocok dengan rasa kontras: segar, manis, dan pekat.",
    bridge: "Karena stroberi sedang kosong, AI memilih Vanila + Coklat sebagai pengganti yang tetap memberi kontras lembut dan pekat.",
  },
  marah: {
    mood: "Marah / Kesal",
    nickname: "Volcanic Eruption",
    vector: { energy: 5, emotional: 1, stress: 5, craving: 5 },
    idealFlavor: "Durian + Coklat",
    fallbackFlavor: "Durian",
    theme: "theme-burnout",
    header: "Analisis selesai. Sistem mendeteksi fase Marah / Kesal (Volcanic Eruption).",
    rationale: "Amigdala yang over-stimulated butuh pengalihan rasa kuat, dominan, dan tajam untuk memusatkan ulang orientasi sensorik.",
  },
  cemas: {
    mood: "Cemas / Gelisah",
    nickname: "The Panic Room",
    vector: { energy: 4, emotional: 2, stress: 5, craving: 2 },
    idealFlavor: "Vanila + Taro",
    fallbackFlavor: "Vanila",
    theme: "theme-santai",
    header: "Analisis selesai. Sistem membaca fase Cemas / Gelisah (The Panic Room).",
    rationale: "Cemas berlebih cocok ditenangkan dengan rasa milky dan creamy-soft yang terasa aman di tubuh.",
  },
  bosan: {
    mood: "Bosan / Jenuh",
    nickname: "Stuck in Time",
    vector: { energy: 2, emotional: 3, stress: 1, craving: 5 },
    idealFlavor: "Nangka + Durian",
    fallbackFlavor: "Durian + Taro",
    theme: "theme-nostalgic",
    header: "Analisis selesai. Kamu berada di fase Bosan / Jenuh (Stuck in Time).",
    rationale: "Kurang stimulasi dopaminergik cocok dibangunkan dengan rasa tropis lokal yang tajam dan intens.",
    bridge: "Karena nangka sedang kosong, AI mengalihkan ke Durian + Taro yang tetap unik, kuat, dan tersedia.",
  },
};

const photoboothUnlockKey = "scoopifyPhotoboothPremiumUnlocked";
const isPhotoboothPage = document.body?.dataset.page === "photobooth";

function hasGameTicket() {
  return flowState.qrScanned;
}

function getTicketFromUrl() {
  return new URLSearchParams(window.location.search).get("ticket");
}

function hasPhotoboothPremiumAccess() {
  return Boolean(getTicketFromUrl()) || window.localStorage?.getItem(photoboothUnlockKey) === "true";
}

if (getTicketFromUrl()) {
  window.localStorage?.setItem(photoboothUnlockKey, "true");
}

// STATE UNTUK FLOW (Fleksibel)
let flowState = {
  analyzed: false,      // Sudah analyze mood?
  qrScanned: Boolean(getTicketFromUrl()), // QR URL membuka game
  gameTokenUsed: false, // Satu QR hanya bisa mulai game satu kali
  gameStarted: false,
  gameFinished: false,
  gameLocked: false,
  gameWon: false,
  lastMoodResult: null, // Menyimpan hasil mood terakhir
};

// Urutan halaman
const sectionOrder = ["welcome", "analyzer", "result", "game"];
const publicMenuSections = ["welcome", "analyzer"];

// DOM Elements
const analyzeBtn = document.getElementById("analyzeBtn");
const moodTitle = document.getElementById("moodTitle");
const moodQuote = document.getElementById("moodQuote");
const resultImage = document.getElementById("resultImage");
const resultFlavorName = document.getElementById("resultFlavorName");
const resultMatch = document.getElementById("resultMatch");
const resultNote = document.getElementById("resultNote");
const matchFill = document.getElementById("matchFill");
const resultVisual = document.getElementById("resultVisual") || resultImage?.closest(".result-visual");
const resultCard = resultImage?.closest(".result-card");
const orderBtn = document.getElementById("orderBtn");
let resultStockStatus = null;
let substitutionCard = null;
let substitutionFlavorName = null;
let substitutionNote = null;
let substitutionActionBtn = null;

// Game variables
const memoryBoard = document.getElementById("memory-game");
const attemptsEl = document.getElementById("attempts");
const starsEl = document.getElementById("stars");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const gameStatus = document.getElementById("gameStatus");
const resetGameBtn = document.getElementById("resetGame");
const skipGameBtn = document.getElementById("skipGameBtn");
const gameGate = document.getElementById("gameGate");
const gameGateTitle = document.getElementById("gameGateTitle");
const gameGateText = document.getElementById("gameGateText");
const startGameBtn = document.getElementById("startGameBtn");
const countdownEl = document.getElementById("countdown");

// Slider configuration
const sliderConfig = [
  {
    key: "energy",
    input: "energyRange",
    value: "energyValue",
    labels: {
      1: "🥱 Sangat Lemas",
      2: "😪 Kurang Bertenaga",
      3: "😐 Netral",
      4: "🙂 Cukup Aktif",
      5: "⚡ Hiperaktif",
    },
  },
  {
    key: "emotional",
    input: "emotionalRange",
    value: "emotionalValue",
    labels: {
      1: "😭 Sangat Buruk",
      2: "🙁 Muram",
      3: "😐 Datar",
      4: "😊 Senang",
      5: "💖 Euforia",
    },
  },
  {
    key: "stress",
    input: "stressRange",
    value: "stressValue",
    labels: {
      1: "🧘 Sangat Tenang",
      2: "☕ Rileks",
      3: "😐 Biasa Saja",
      4: "😰 Gelisah",
      5: "🤯 Overthinking",
    },
  },
  {
    key: "craving",
    input: "adventureRange",
    value: "adventureValue",
    labels: {
      1: "🍫 Bold Comforting",
      2: "🥛 Creamy Milky",
      3: "🥭 Acidic Fruity",
      4: "🪵 Earthy Savory",
      5: "👑 Pungent Intense",
    },
  },
];

const sliders = sliderConfig.map((item) => ({
  key: item.key,
  input: document.getElementById(item.input),
  value: document.getElementById(item.value),
  labels: item.labels,
}));

// ========== FUNGSI UTAMA ==========

function normalizeHomeCopy() {
  const startButton = document.querySelector('#welcome .cta-row button[data-target="analyzer"]');
  const scanButton = document.getElementById("scanBtn");
  if (startButton) startButton.textContent = "Mulai Cek Mood";
  if (scanButton && !isPhotoboothPage) scanButton.textContent = "Scan QR";
}

function createResultElement(className, text = "") {
  const element = document.createElement("p");
  element.className = className;
  element.textContent = text;
  return element;
}

function configureLikertMoodUi() {
  const socialInput = document.getElementById("socialRange");
  socialInput?.closest(".range-row")?.remove();
  const sectionCopy = document.querySelector("#analyzer .section-head p");
  if (sectionCopy) {
    sectionCopy.textContent = "Pilih emoticon yang paling menggambarkan kondisi kamu hari ini.";
  }

  const uiRows = [
    { id: "energyRange", label: "Energy Level", hint: "🥱 😪 😐 🙂 ⚡" },
    { id: "stressRange", label: "Stress / Anxiety Level", hint: "🧘 ☕ 😐 😰 🤯" },
    { id: "emotionalRange", label: "Emotional Valence", hint: "😭 🙁 😐 😊 💖" },
    { id: "adventureRange", label: "Craving Taste Profile", hint: "🍫 🥛 🥭 🪵 👑" },
  ];

  uiRows.forEach((item) => {
    const input = document.getElementById(item.id);
    const row = input?.closest(".range-row");
    if (!input || !row) return;
    input.min = "1";
    input.max = "5";
    input.step = "1";
    input.value = "3";
    input.hidden = true;
    row.querySelector(".range-label").textContent = item.label;
    row.querySelector(".range-emoji").textContent = item.hint;
  });

  sliders.forEach((slider) => {
    const row = slider.input?.closest(".range-row");
    if (!row || row.querySelector(".likert-options")) return;

    const optionGroup = document.createElement("div");
    optionGroup.className = "likert-options";
    optionGroup.setAttribute("role", "radiogroup");
    optionGroup.setAttribute("aria-label", row.querySelector(".range-label")?.textContent || slider.key);

    Object.entries(slider.labels || {}).forEach(([value, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "likert-option";
      button.dataset.value = value;
      button.setAttribute("role", "radio");
      button.setAttribute("aria-label", label);
      button.innerHTML = `<span>${label.split(" ")[0]}</span>`;
      button.addEventListener("click", () => {
        slider.input.value = value;
        updateSliderValues();
        applySliderPreview(slider);
      });
      optionGroup.appendChild(button);
    });

    row.appendChild(optionGroup);
  });

  resultStockStatus = resultFlavorName?.parentElement?.querySelector("#resultStockStatus");
  if (!resultStockStatus && resultFlavorName) {
    resultStockStatus = createResultElement("stock-status available", "AVAILABLE");
    resultStockStatus.id = "resultStockStatus";
    resultFlavorName.insertAdjacentElement("afterend", resultStockStatus);
  }

  substitutionCard = document.getElementById("substitutionCard");
  if (!substitutionCard && resultNote) {
    substitutionCard = document.createElement("div");
    substitutionCard.className = "substitution-card";
    substitutionCard.id = "substitutionCard";
    substitutionCard.hidden = true;
    substitutionCard.innerHTML = `
      <p class="substitution-title">Rekomendasi Pengalihan AI</p>
      <p class="flavor" id="substitutionFlavorName">Vanila + Taro</p>
      <p class="note" id="substitutionNote">Alternatif stok aktif dengan profil rasa terdekat.</p>
      <button class="primary substitution-action" id="substitutionActionBtn" type="button">Pesan Varian Alternatif Pilihan AI</button>
    `;
    resultNote.insertAdjacentElement("afterend", substitutionCard);
  }
  substitutionFlavorName = document.getElementById("substitutionFlavorName");
  substitutionNote = document.getElementById("substitutionNote");
  substitutionActionBtn = document.getElementById("substitutionActionBtn");

}

function readSliderValues() {
  const values = {};
  sliders.forEach((slider) => {
    values[slider.key] = Number(slider.input?.value || 50);
  });
  return values;
}

function updateSliderValues() {
  sliders.forEach((slider) => {
    if (slider.input && slider.value) {
      const currentValue = Number(slider.input.value);
      slider.value.textContent = `${currentValue} ${slider.labels?.[currentValue] || ""}`.trim();
      slider.input.style.setProperty("--range-progress", `${((Number(slider.input.value) - 1) / 4) * 100}%`);
      slider.input.closest(".range-row")?.querySelectorAll(".likert-option").forEach((button) => {
        const isSelected = Number(button.dataset.value) === currentValue;
        button.classList.toggle("active", isSelected);
        button.setAttribute("aria-checked", String(isSelected));
      });
    }
  });
}

function calculateMood(values) {
  let bestKey = "bittersweet";
  let bestDistance = Number.POSITIVE_INFINITY;

  Object.entries(moodKnowledgeBase).forEach(([key, profile]) => {
    const distance = Math.sqrt(
      (values.energy - profile.vector.energy) ** 2 +
      (values.emotional - profile.vector.emotional) ** 2 +
      (values.stress - profile.vector.stress) ** 2 +
      (values.craving - profile.vector.craving) ** 2
    );

    if (distance < bestDistance) {
      bestDistance = distance;
      bestKey = key;
    }
  });

  return bestKey;
}

function calculateMoodDistance(values, profile) {
  return Math.sqrt(
    (values.energy - profile.vector.energy) ** 2 +
    (values.emotional - profile.vector.emotional) ** 2 +
    (values.stress - profile.vector.stress) ** 2 +
    (values.craving - profile.vector.craving) ** 2
  );
}

function calculateMatch(values, profile = moodKnowledgeBase.bittersweet) {
  const maxDistance = 8;
  const distance = calculateMoodDistance(values, profile);
  return Math.min(99, Math.max(55, Math.round(100 - (distance / maxDistance) * 100)));
}

function setBodyTheme(theme, extraClass = "") {
  const shouldLockFlow = document.body.classList.contains("flow-locked");
  document.body.className = [theme, extraClass, shouldLockFlow ? "flow-locked" : ""]
    .filter(Boolean)
    .join(" ");
}

function parseFlavorComponents(flavor) {
  return flavor
    .toLowerCase()
    .split("+")
    .map((item) => item.trim())
    .map((item) => (item === "duren" ? "durian" : item))
    .map((item) => (item === "vanilla" ? "vanila" : item))
    .filter(Boolean);
}

function hasSoldOutFlavor(flavor) {
  return parseFlavorComponents(flavor).some((item) => flavorInventory[item] === false);
}

function isFlavorAvailable(flavor) {
  const components = parseFlavorComponents(flavor);
  return Boolean(components.length) && components.every((item) => flavorInventory[item] !== false);
}

function scoreAlternativeFlavor(candidate, idealFlavor, fallbackFlavor) {
  const candidateComponents = parseFlavorComponents(candidate);
  const idealComponents = parseFlavorComponents(idealFlavor);
  const fallbackComponents = parseFlavorComponents(fallbackFlavor);
  let score = 0;

  candidateComponents.forEach((component) => {
    if (idealComponents.includes(component)) score += 8;
    if (fallbackComponents.includes(component)) score += 5;
    idealComponents.forEach((ideal) => {
      if (flavorSimilarity[ideal]?.includes(component)) score += 3;
    });
    fallbackComponents.forEach((fallback) => {
      if (flavorSimilarity[fallback]?.includes(component)) score += 2;
    });
  });

  score -= Math.abs(candidateComponents.length - Math.max(1, fallbackComponents.length));
  return score;
}

function findAvailableAlternative(idealFlavor, fallbackFlavor) {
  const candidates = [fallbackFlavor, idealFlavor, ...menuVariantCandidates]
    .filter(Boolean)
    .filter((item, index, list) => list.indexOf(item) === index)
    .filter(isFlavorAvailable);

  return candidates.sort((a, b) => (
    scoreAlternativeFlavor(b, idealFlavor, fallbackFlavor) - scoreAlternativeFlavor(a, idealFlavor, fallbackFlavor)
  ))[0] || null;
}

function getFlavorImage(flavor, preferAvailable = true) {
  const components = parseFlavorComponents(flavor);
  const availableComponent = components.find((item) => flavorInventory[item] !== false);
  const firstComponent = preferAvailable ? availableComponent || components[0] : components[0] || availableComponent;
  return flavorImages[firstComponent] || flavorImages.vanila;
}

function buildRecommendation(profile) {
  const soldOut = hasSoldOutFlavor(profile.idealFlavor);
  const fallbackAvailable = isFlavorAvailable(profile.fallbackFlavor);
  const resolvedFallback = fallbackAvailable
    ? profile.fallbackFlavor
    : findAvailableAlternative(profile.idealFlavor, profile.fallbackFlavor);
  const selectedFlavor = soldOut ? resolvedFallback : profile.idealFlavor;
  const hasAlternative = Boolean(selectedFlavor);
  return {
    mood: profile.mood,
    nickname: profile.nickname,
    title: profile.header,
    quote: `${profile.mood} (${profile.nickname})`,
    idealFlavor: profile.idealFlavor,
    selectedFlavor,
    fallbackFlavor: resolvedFallback || "Belum ada stok aktif",
    hasAlternative,
    soldOut,
    status: soldOut ? "SOLD OUT / HABIS DI DEPO" : "AVAILABLE",
    actionText: "Konfirmasi dan Pesan Sekarang",
    substitutionActionText: "Pesan Varian Alternatif Pilihan AI",
    image: getFlavorImage(selectedFlavor || profile.idealFlavor),
    theme: profile.theme,
    note: profile.rationale,
    bridge: soldOut
      ? fallbackAvailable
        ? profile.bridge || "Karena salah satu komponen rasa ideal sedang kosong, sistem memilih cadangan stok aktif dengan profil terdekat."
        : hasAlternative
          ? `Cadangan utama juga sedang kosong, jadi AI memilih ${resolvedFallback} sebagai opsi paling dekat dari stok yang masih tersedia.`
          : "Semua komponen stok aktif sedang kosong. Mohon update stok sebelum menerima pesanan."
      : "",
    description: soldOut
      ? `${profile.rationale}\n\n${fallbackAvailable ? profile.bridge || "Karena salah satu komponen rasa ideal sedang kosong, sistem memilih cadangan stok aktif dengan profil terdekat." : hasAlternative ? `Cadangan utama juga sedang kosong, jadi AI memilih ${resolvedFallback} sebagai opsi paling dekat dari stok yang masih tersedia.` : "Semua komponen stok aktif sedang kosong. Mohon update stok sebelum menerima pesanan."}`
      : profile.rationale,
  };
}

function applySliderPreview(changedSlider) {
  if (!analyzeBtn) return;
  const values = readSliderValues();
  const moodKey = calculateMood(values);
  const profile = moodKnowledgeBase[moodKey] || moodKnowledgeBase.bittersweet;

  setBodyTheme(profile.theme, "mood-preview");

  sliders.forEach((slider) => {
    const row = slider.input?.closest(".range-row");
    row?.classList.toggle("active", slider === changedSlider);
  });

  if (changedSlider?.value) {
    changedSlider.value.classList.remove("pulse");
    void changedSlider.value.offsetWidth;
    changedSlider.value.classList.add("pulse");
  }

  window.clearTimeout(window.__sliderImpactTimeout);
  window.__sliderImpactTimeout = window.setTimeout(() => {
    sliders.forEach((slider) => slider.input?.closest(".range-row")?.classList.remove("active"));
  }, 420);
}

function applyMoodResult(values) {
  const moodKey = calculateMood(values);
  const profile = moodKnowledgeBase[moodKey] || moodKnowledgeBase.bittersweet;
  const recommendation = buildRecommendation(profile);
  const match = calculateMatch(values, profile);
  const distance = calculateMoodDistance(values, profile).toFixed(2);

  if (moodTitle) moodTitle.textContent = `${recommendation.mood} (${recommendation.nickname})`;
  if (moodQuote) moodQuote.textContent = recommendation.title;
  if (resultFlavorName) resultFlavorName.textContent = recommendation.idealFlavor;
  if (resultStockStatus) {
    resultStockStatus.textContent = recommendation.status;
    resultStockStatus.classList.toggle("available", !recommendation.soldOut);
    resultStockStatus.classList.toggle("sold-out", recommendation.soldOut);
  }
  resultCard?.classList.toggle("has-substitution", recommendation.soldOut);
  if (resultVisual) resultVisual.classList.toggle("is-sold-out", recommendation.soldOut);
  if (resultNote) resultNote.textContent = recommendation.note;
  if (resultMatch) resultMatch.textContent = `${match}% match - distance ${distance}`;
  if (matchFill) matchFill.style.width = `${match}%`;
  if (resultImage) {
    resultImage.src = recommendation.soldOut
      ? getFlavorImage(recommendation.idealFlavor, false)
      : recommendation.image;
    resultImage.alt = recommendation.soldOut ? recommendation.idealFlavor : recommendation.selectedFlavor;
  }
  if (substitutionCard) substitutionCard.hidden = !recommendation.soldOut;
  if (substitutionFlavorName) substitutionFlavorName.textContent = recommendation.fallbackFlavor;
  if (substitutionNote) {
    substitutionNote.textContent = recommendation.bridge || "Alternatif stok aktif dengan profil rasa terdekat dari knowledge base.";
  }
  if (substitutionActionBtn) {
    substitutionActionBtn.hidden = !recommendation.soldOut || !recommendation.hasAlternative;
    substitutionActionBtn.textContent = recommendation.substitutionActionText;
  }
  if (orderBtn) {
    orderBtn.textContent = recommendation.actionText;
    orderBtn.disabled = recommendation.soldOut;
    orderBtn.classList.toggle("is-disabled", recommendation.soldOut);
  }
  setBodyTheme(recommendation.theme);
  
  // Simpan hasil mood
  flowState.lastMoodResult = { moodKey, profile: recommendation, match };
}

// ========== SCROLL & NAVIGASI (FLEKSIBEL) ==========

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.toggle("active-screen", screen.id === sectionId);
    });
    window.scrollTo({ top: 0, behavior: "auto" });
  }
}

function getCurrentSectionIndex() {
  const screens = Array.from(document.querySelectorAll(".screen"));
  let currentIndex = 0;
  screens.forEach((screen, index) => {
    const rect = screen.getBoundingClientRect();
    if (rect.top <= 150 && rect.bottom >= 150) {
      currentIndex = index;
    }
  });
  return currentIndex;
}

function getMaxAllowedIndex() {
  // Reward hanya dibuka setelah game selesai menang
  if (flowState.gameWon) return sectionOrder.length - 1;
  // Setelah scan QR, akses sampai game
  if (hasGameTicket()) return sectionOrder.indexOf("game");
  // Jika sudah analyze, bisa sampai result
  if (flowState.analyzed) return sectionOrder.indexOf("result");
  // Belum apa-apa, cuma bisa welcome & analyzer
  return sectionOrder.indexOf("analyzer");
}

function canNavigate(targetId) {
  const targetIndex = sectionOrder.indexOf(targetId);
  const maxAllowed = getMaxAllowedIndex();
  if (targetIndex === -1) return false;
  
  // Menu publik selalu bisa dibuka dari navbar
  if (publicMenuSections.includes(targetId)) return true;
  
  // Result hanya jika sudah analyze
  if (targetId === "result") return flowState.analyzed;
  
  if (targetId === "game") return hasGameTicket();
  
  return targetIndex <= maxAllowed;
}

function navigateWithRules(targetId) {
  if (!canNavigate(targetId)) {
    if (!flowState.analyzed && targetId === "result") {
      alert("✨ Selesaikan Mood Analyzer dulu ya! Geser slider dan klik 'Analyze Mood'.\n\nAtau scan QR untuk langsung main game!");
    } else if (!hasGameTicket() && targetId === "game") {
      alert("📷 Scan tiket QR dulu! Klik tombol 'Scan QR' di halaman utama.\n\nTiket QR ada di cup es krim Scoopify kamu.");
    } else {
      alert("🚫 Belum bisa akses halaman ini. Ikuti alur yang benar ya!");
    }
    return;
  }
  
  scrollToSection(targetId);
}

// ========== QR SCANNER (REAL) ==========

let qrScannerActive = false;
let currentStream = null;
let qrScanFrameId = null;

async function startQRScanner() {
  if (qrScannerActive) return;

  if (!navigator.mediaDevices?.getUserMedia) {
    alert("Kamera tidak bisa dibuka dari browser ini. Jalankan web lewat localhost atau HTTPS, lalu buka di Chrome/Edge terbaru.");
    return;
  }
  
  // Buat overlay scanner
  const overlay = document.createElement("div");
  overlay.className = "qr-scanner-overlay";
  overlay.id = "qrScannerOverlay";
  overlay.innerHTML = `
    <div class="qr-scanner-container">
      <video id="qrVideo" class="qr-scanner-video" playsinline autoplay muted></video>
      <div class="scan-area"></div>
    </div>
    <button class="close-scanner" id="closeScannerBtn">Tutup Kamera</button>
    <p id="qrScannerHint" style="color:white; margin-top:20px; text-align:center;">Arahkan QR Code ke tengah layar</p>
  `;
  document.body.appendChild(overlay);
  
  const video = document.getElementById("qrVideo");
  const closeBtn = document.getElementById("closeScannerBtn");
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });
    currentStream = stream;
    video.srcObject = stream;
    await video.play();
    qrScannerActive = true;

    const fallbackCanvas = document.createElement("canvas");
    const fallbackContext = fallbackCanvas.getContext("2d", { willReadFrequently: true });
    const hasJsQrFallback = typeof window.jsQR === "function";
    let detector = null;

    if ("BarcodeDetector" in window) {
      try {
        detector = new BarcodeDetector({ formats: ["qr_code"] });
      } catch (detectorError) {
        console.warn("BarcodeDetector unavailable:", detectorError);
      }
    }

    if (!detector && !hasJsQrFallback) {
      alert("Scanner QR belum siap. Refresh halaman lalu coba lagi.");
      stopQRScanner();
      return;
    }

    const scanLoop = async () => {
      if (!qrScannerActive) return;
      try {
        if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          let qrValue = "";
          if (detector) {
            const codes = await detector.detect(video);
            qrValue = codes?.[0]?.rawValue || "";
          } else {
            fallbackCanvas.width = video.videoWidth;
            fallbackCanvas.height = video.videoHeight;
            fallbackContext.drawImage(video, 0, 0, fallbackCanvas.width, fallbackCanvas.height);
            const frame = fallbackContext.getImageData(0, 0, fallbackCanvas.width, fallbackCanvas.height);
            const code = window.jsQR(frame.data, frame.width, frame.height, {
              inversionAttempts: "attemptBoth",
            });
            qrValue = code?.data || "";
          }

          if (qrValue) {
            handleQRSuccess(qrValue);
            stopQRScanner();
            return;
          }
        }
      } catch (scanError) {
        console.error("QR scan error:", scanError);
      }
      qrScanFrameId = window.requestAnimationFrame(scanLoop);
    };

    scanLoop();
    
  } catch (error) {
    console.error("Camera error:", error);
    const reason = location.protocol === "file:"
      ? "Buka web lewat localhost, bukan langsung dari file HTML, supaya izin kamera aktif."
      : "Pastikan izin kamera diberikan dan kamera tidak sedang dipakai aplikasi lain.";
    alert(`Tidak dapat mengakses kamera. ${reason}`);
    stopQRScanner();
  }
  
  closeBtn.addEventListener("click", () => {
    stopQRScanner();
  });
}

function stopQRScanner() {
  if (qrScanFrameId) {
    window.cancelAnimationFrame(qrScanFrameId);
    qrScanFrameId = null;
  }
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
  }
  const overlay = document.getElementById("qrScannerOverlay");
  if (overlay) overlay.remove();
  qrScannerActive = false;
}

function handleQRSuccess(ticketValue = "") {
  // Tiket QR berhasil dipindai.
  flowState.qrScanned = true;
  if (ticketValue) {
    window.localStorage?.setItem("scoopifyLastQrTicket", ticketValue);
  }
  window.localStorage?.setItem(photoboothUnlockKey, "true");
  flowState.gameTokenUsed = false;
  flowState.gameStarted = false;
  flowState.gameFinished = false;
  flowState.gameLocked = false;
  flowState.gameWon = false;
  resetGame();
  syncGameModeLabels();
  updateGameGate();
  updatePremiumFrameState();
  if (isPhotoboothPage) {
    alert("Frame lucu berhasil dibuka. Kamu sekarang bisa pakai semua frame photobooth.");
    return;
  }
  alert("Tiket QR terbaca. Mini game sudah terbuka.");
  
  // Update tampilan tombol navigasi
  updateNavLinksState();
  
  // Tawarkan pindah ke game
  const goToGame = confirm("Ingin main game sekarang?");
  if (goToGame) {
    navigateWithRules("game");
  }
}

// ========== UPDATE NAVIGATION LINKS ==========

function updateNavLinksState() {
  const navLinks = document.querySelectorAll(".nav-link[data-target]");
  navLinks.forEach(link => {
    const target = link.dataset.target;
    if (!canNavigate(target)) {
      link.classList.add("disabled");
    } else {
      link.classList.remove("disabled");
    }
  });
}

// ========== EVENT LISTENERS ==========

// Sliders
sliders.forEach((slider) => {
  if (slider.input) {
    slider.input.addEventListener("input", () => {
      updateSliderValues();
      applySliderPreview(slider);
    });
  }
});

// Analyze button
analyzeBtn?.addEventListener("click", () => {
  const values = readSliderValues();
  applyMoodResult(values);
  flowState.analyzed = true;
  updateNavLinksState();
  navigateWithRules("result");
});

// Try Again button (di halaman result)
const tryAgainBtn = document.getElementById("tryAgainBtn");
tryAgainBtn?.addEventListener("click", () => {
  navigateWithRules("analyzer");
});

// Order / Back to Home button
orderBtn?.addEventListener("click", () => {
  navigateWithRules("welcome");
});

document.addEventListener("click", (event) => {
  if (event.target?.id === "substitutionActionBtn") {
    navigateWithRules("welcome");
  }
});

// Skip Game button
skipGameBtn?.addEventListener("click", () => {
  window.location.href = "photobooth.html";
});

// Scan QR button (di halaman welcome) - BISA LANGSUNG, TANPA SYARAT!
const scanBtn = document.getElementById("scanBtn");
scanBtn?.addEventListener("click", () => {
  // TIDAK ADA SYARAT! Langsung buka scanner
  startQRScanner();
});

// Navigasi buttons dengan data-target
document.querySelectorAll("[data-target]").forEach(btn => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    const target = btn.dataset.target;
    navigateWithRules(target);
  });
});

// Nav links desktop untuk navigasi section internal
const navLinks = document.querySelectorAll(".nav-link[data-target]");
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    const target = link.dataset.target;
    navigateWithRules(target);
    
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});

// Update nav active on scroll
window.addEventListener("scroll", () => {
  const screens = document.querySelectorAll(".screen");
  let current = "";
  screens.forEach(screen => {
    const rect = screen.getBoundingClientRect();
    if (rect.top <= 150 && rect.bottom >= 150) {
      current = screen.id;
    }
  });
  
  navLinks.forEach(link => {
    if (link.dataset.target === current) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});

// Desktop nav visibility
const desktopNav = document.querySelector(".desktop-nav");
const appScrollRoot = document.querySelector(".app");
let touchStartY = 0;
let navRevealTimeout = null;
let lastMobileScrollTop = 0;

function revealMobileNav() {
  if (!desktopNav || window.innerWidth > 767) return;
  desktopNav.classList.remove("mobile-hidden");
  desktopNav.classList.add("mobile-revealed");
  window.clearTimeout(navRevealTimeout);
  navRevealTimeout = window.setTimeout(() => {
    desktopNav.classList.remove("mobile-revealed");
  }, 2600);
}

function hideMobileNav() {
  if (!desktopNav || window.innerWidth > 767) return;
  desktopNav.classList.remove("mobile-revealed");
  desktopNav.classList.add("mobile-hidden");
}

window.addEventListener("scroll", () => {
  if (desktopNav) {
    if (window.innerWidth <= 767) return;
    if (window.scrollY > 40) {
      desktopNav.classList.add("hidden");
    } else {
      desktopNav.classList.remove("hidden");
    }
  }
});

function handleMobileNavByScroll(scrollTop) {
  if (!desktopNav || window.innerWidth > 767) return;
  const goingDown = scrollTop > lastMobileScrollTop + 8;
  const goingUp = scrollTop < lastMobileScrollTop - 8;

  if (scrollTop <= 8 || goingUp) {
    revealMobileNav();
  } else if (goingDown) {
    hideMobileNav();
  }

  lastMobileScrollTop = Math.max(0, scrollTop);
}

appScrollRoot?.addEventListener("scroll", () => {
  handleMobileNavByScroll(appScrollRoot.scrollTop);
}, { passive: true });

window.addEventListener("scroll", () => {
  handleMobileNavByScroll(window.scrollY);
}, { passive: true });

window.addEventListener("touchstart", (event) => {
  touchStartY = event.touches[0]?.clientY || 0;
}, { passive: true });

window.addEventListener("touchend", (event) => {
  const touchEndY = event.changedTouches[0]?.clientY || 0;
  const swipedUp = touchStartY - touchEndY > 45;
  if (swipedUp) {
    revealMobileNav();
  }
}, { passive: true });

// ========== MINI GAME MEMORY CARD ==========
const cardArray = [
  "vanilla", "vanilla",
  "taro", "taro",
  "coklat", "coklat",
  "durian", "durian",
  "coklat-vanilla", "coklat-vanilla",
  "taro-duren", "taro-duren",
];
let comparisonArray = [];
let attempts = 0;
let lives = 3;
let clickCount = 0;
let pairs = 0;
let totalSeconds = 0;
let timerId = null;
const gameTimeLimit = 30;

function setGameGateContent(title, text, canStart) {
  if (gameGateTitle) gameGateTitle.textContent = title;
  if (gameGateText) gameGateText.textContent = text;
  if (startGameBtn) startGameBtn.disabled = !canStart;
}

function syncGameModeLabels() {
  if (resetGameBtn) {
    resetGameBtn.textContent = "Reset Game";
    resetGameBtn.disabled = !hasGameTicket();
  }
  if (skipGameBtn) {
    skipGameBtn.textContent = "Lewati ke Photobooth";
    skipGameBtn.disabled = !hasGameTicket();
  }

  setGameGateContent(
    "Game terkunci",
    "Scan tiket QR pada cup Scoopify untuk membuka mini game.",
    false
  );
}

function updateGameGate() {
  if (!gameGate) return;

  if (!flowState.qrScanned) {
    gameGate.classList.remove("hidden");
    setGameGateContent(
      "Game terkunci",
      "Scan tiket QR pada cup Scoopify untuk membuka mini game.",
      false
    );
    return;
  }

  if (flowState.gameFinished) {
    gameGate.classList.remove("hidden");
    if (flowState.gameWon) {
      setGameGateContent(
        "Topping terbuka",
        "Kamu menang. Bebas pilih topping yang tersedia.",
        false
      );
    } else {
      setGameGateContent(
        "Coba lagi",
        "Reset game untuk mencoba lagi.",
        false
      );
    }
    return;
  }

  if (flowState.gameLocked) {
    gameGate.classList.remove("hidden");
    setGameGateContent(
      "Waktu habis",
      "Reset game untuk mencoba lagi.",
      false
    );
    return;
  }

  if (!flowState.gameStarted) {
    gameGate.classList.remove("hidden");
    setGameGateContent(
      "Siap main?",
      "Cocokkan kartu dalam 30 detik. Nyawa kamu 3.",
      true
    );
    return;
  }

  gameGate.classList.add("hidden");
}

function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    const temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function updateStars() {
  if (!starsEl) return;
  starsEl.textContent = Array.from({ length: 3 }, (_, index) => (index < lives ? "♥" : "♡")).join(" ");
  return;
  if (attempts > 32) {
    starsEl.textContent = "☆ ☆ ☆";
  } else if (attempts >= 24) {
    starsEl.textContent = "⭐ ☆ ☆";
  } else if (attempts > 16) {
    starsEl.textContent = "⭐ ⭐ ☆";
  } else {
    starsEl.textContent = "⭐ ⭐ ⭐";
  }
}

function updateTimer() {
  totalSeconds += 1;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const remaining = Math.max(0, gameTimeLimit - totalSeconds);
  if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
  if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
  if (countdownEl) countdownEl.textContent = String(remaining).padStart(2, "0");

  if (remaining <= 0 && pairs < cardArray.length / 2) {
    failGame();
  }
}

function startTimer() {
  if (timerId) return;
  timerId = setInterval(updateTimer, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

function flipCard(element) {
  element.classList.toggle("flipped");
}

function recordAttempts() {
  attempts += 1;
  if (attemptsEl) attemptsEl.textContent = String(lives);
  updateStars();
}

function createBoard() {
  if (!memoryBoard) return;
  memoryBoard.innerHTML = "";
  shuffle([...cardArray]).forEach((type) => {
    const container = document.createElement("div");
    container.className = "container";

    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-card-type", type);

    const front = document.createElement("figure");
    front.className = "front";
    const back = document.createElement("figure");
    back.className = "back";

    card.appendChild(front);
    card.appendChild(back);
    container.appendChild(card);
    memoryBoard.appendChild(container);
  });
}

function resetGame() {
  comparisonArray = [];
  attempts = 0;
  lives = 3;
  clickCount = 0;
  pairs = 0;
  totalSeconds = 0;
  flowState.gameTokenUsed = false;
  flowState.gameStarted = false;
  flowState.gameFinished = false;
  flowState.gameLocked = false;
  flowState.gameWon = false;
  if (attemptsEl) attemptsEl.textContent = String(lives);
  if (minutesEl) minutesEl.textContent = "00";
  if (secondsEl) secondsEl.textContent = "00";
  if (countdownEl) countdownEl.textContent = String(gameTimeLimit);
  if (skipGameBtn) skipGameBtn.disabled = !hasGameTicket();
  updateStars();
  if (gameStatus) gameStatus.textContent = hasGameTicket() ? "Game siap. Tekan Mulai Game." : "Scan tiket QR dulu untuk membuka game.";
  stopTimer();
  createBoard();
}

function startOneQrGame() {
  if (!hasGameTicket()) {
    alert("Scan tiket QR dulu sebelum mulai game.");
    return;
  }

  resetGame();
  flowState.gameTokenUsed = true;
  flowState.gameStarted = true;
  flowState.gameFinished = false;
  flowState.gameLocked = false;
  flowState.gameWon = false;
  updateGameGate();
  if (gameStatus) gameStatus.textContent = "30 detik dimulai. Kamu punya 3 nyawa.";
  startTimer();
}

function failGame(reason = "Waktu habis") {
  stopTimer();
  flowState.gameStarted = false;
  flowState.gameFinished = true;
  flowState.gameLocked = true;
  flowState.gameWon = false;
  comparisonArray = [];
  document.querySelectorAll(".flipped").forEach((item) => item.classList.remove("flipped"));
  if (gameStatus) gameStatus.textContent = `${reason}. Reset game untuk mencoba lagi.`;
  if (skipGameBtn) skipGameBtn.disabled = !hasGameTicket();
  updateGameGate();
}

function showWinMessage() {
  flowState.gameStarted = false;
  flowState.gameFinished = true;
  flowState.gameLocked = false;
  flowState.gameWon = true;
  if (skipGameBtn) skipGameBtn.disabled = false;
  updateNavLinksState();
  updateGameGate();
  const overlay = document.createElement("div");
  overlay.className = "game-over";
  overlay.innerHTML = `
    <div class="message-box">
      <h3>🎉 Congrats!</h3>
      <p>Kamu menemukan semua pasangan kartu.</p>
      <p>Nyawa tersisa: ${lives}</p>
      <p>Time: ${minutesEl?.textContent || "00"}:${secondsEl?.textContent || "00"}</p>
      <p>🎁 Kamu mendapat TOPPING GRATIS!</p>
      <button id="closeWin">OK</button>
    </div>
  `;
  overlay.innerHTML = `
    <div class="message-box">
      <h3>Yeay, menang!</h3>
      <p>Bebas pilih topping yang tersedia.</p>
      <button id="closeWin">OK</button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector("#closeWin").addEventListener("click", () => {
    overlay.remove();
    updateGameGate();
  });
}

function handleCardClick(event) {
  if (!flowState.gameStarted || flowState.gameFinished || flowState.gameLocked) return;
  const card = event.target.closest(".card");
  if (!card || card.classList.contains("flipped") || card.classList.contains("solved")) return;
  if (comparisonArray.length >= 2) return;

  flipCard(card);
  comparisonArray.push(card.getAttribute("data-card-type"));

  if (clickCount === 0) {
    clickCount += 1;
    recordAttempts();
    return;
  }

  if (comparisonArray[0] === comparisonArray[1]) {
    const cardType = comparisonArray[0];
    document.querySelectorAll(`.card[data-card-type="${cardType}"]`).forEach((item) => {
      item.classList.remove("flipped");
      item.classList.add("solved");
    });
    pairs += 1;
    comparisonArray = [];
    clickCount = 0;

    if (pairs === cardArray.length / 2) {
      stopTimer();
      if (gameStatus) gameStatus.textContent = "🎉 Kamu dapat reward topping tambahan!";
      if (gameStatus) gameStatus.textContent = "Menang. Bebas pilih topping yang tersedia.";
      showWinMessage();
    }
    return;
  }

  setTimeout(() => {
    document.querySelectorAll(".flipped").forEach((item) => item.classList.remove("flipped"));
    lives = Math.max(0, lives - 1);
    if (attemptsEl) attemptsEl.textContent = String(lives);
    updateStars();
    comparisonArray = [];
    clickCount = 0;
    if (lives <= 0) {
      failGame("Nyawa habis");
      return;
    }
    if (gameStatus) gameStatus.textContent = `Belum cocok. Sisa nyawa ${lives}.`;
  }, 800);
}

if (memoryBoard) {
  resetGame();
  syncGameModeLabels();
  memoryBoard.addEventListener("click", handleCardClick);
  updateGameGate();
}

if (resetGameBtn) {
  resetGameBtn.addEventListener("click", () => {
    resetGame();
    updateGameGate();
  });
}

startGameBtn?.addEventListener("click", startOneQrGame);

// ========== PHOTOBOOTH ==========
const cameraVideo = document.getElementById("cameraVideo");
const cameraCanvas = document.getElementById("cameraCanvas");
const openFilterBtn = document.getElementById("openFilterBtn");
const captureBtn = document.getElementById("captureBtn");
const retakeBoothBtn = document.getElementById("retakeBoothBtn");
const finishBoothBtn = document.getElementById("finishBoothBtn");
const downloadFrameBtn = document.getElementById("downloadFrameBtn");
const shareBtn = document.getElementById("shareBtn");
const boothStatus = document.getElementById("boothStatus");
const boothCountdown = document.getElementById("boothCountdown");
const boothShotTray = document.getElementById("boothShotTray");
const shotCounter = document.getElementById("shotCounter");
const boothProgressText = document.getElementById("boothProgressText");
const captureBtnText = document.getElementById("captureBtnText");
const boothTakeProgress = document.getElementById("boothTakeProgress");
const mirrorToggle = document.getElementById("mirrorToggle");
const brightnessRange = document.getElementById("brightnessRange");
const brightnessValue = document.getElementById("brightnessValue");
const boothStepButtons = Array.from(document.querySelectorAll(".booth-step"));
const boothFilterButtons = Array.from(document.querySelectorAll(".booth-filter"));
const boothLayoutButtons = Array.from(document.querySelectorAll(".booth-layout"));
const boothFrameButtons = Array.from(document.querySelectorAll(".booth-frame"));
const cameraShell = cameraVideo?.closest(".camera-shell");
let filterStream = null;
let photoCaptured = false;
let boothLayout = 1;
let boothShots = [];
let boothFrame = "basic";
let boothMirror = true;
let boothBrightness = 100;
let boothFilter = "normal";
let boothFinished = false;
let boothCapturing = false;

function setBoothMobileStep(nextStep) {
  const step = ["frame", "camera", "result"].includes(nextStep) ? nextStep : "frame";
  document.body.classList.remove("booth-step-frame", "booth-step-camera", "booth-step-result");
  document.body.classList.add(`booth-step-${step}`);
  boothStepButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.boothStep === step);
  });
}

const boothFrameProfiles = {
  basic: { label: "Clean Pop", bg: "#f7e8ff", accent: "#9d7cff", text: "#332457", premium: false },
  bubble: { label: "Bubble Pop", bg: "#ddf7ff", accent: "#47a7c9", text: "#173849", premium: false },
  heart: { label: "Heart Wink", bg: "#ffe1ec", accent: "#e85287", text: "#4a1026", premium: false },
  star: { label: "Star Rush", bg: "#fff3b8", accent: "#e0a51f", text: "#3d2b05", premium: false },
  retro: { label: "Retro Smile", bg: "#e7f0d2", accent: "#4e8a64", text: "#173a27", premium: false },
  dream: { label: "Dream Cloud", bg: "#eee7ff", accent: "#7f62ce", text: "#2e2352", premium: false },
  party: { label: "Party Splash", bg: "#ffe7c8", accent: "#eb6f48", text: "#4a2014", premium: false },
};

const boothFilterProfiles = {
  normal: { label: "Normal", canvas: "" },
  bnw: { label: "B&W", canvas: "grayscale(1) contrast(1.08)" },
  nostalgia: { label: "Nostalgia", canvas: "sepia(0.55) contrast(1.08) saturate(0.82) brightness(1.04)" },
  rio: { label: "Rio de Janeiro", canvas: "saturate(1.45) contrast(1.12) hue-rotate(-8deg) brightness(1.06)" },
};

function getCameraFilterValue() {
  const colorFilter = boothFilterProfiles[boothFilter]?.canvas || "";
  return [`brightness(${boothBrightness}%)`, colorFilter].filter(Boolean).join(" ");
}

function applyCameraPreviewSettings() {
  if (!cameraVideo) return;
  cameraVideo.style.transform = boothMirror ? "scaleX(-1)" : "none";
  cameraVideo.style.filter = getCameraFilterValue();
  if (brightnessValue) brightnessValue.textContent = `${boothBrightness}%`;
}

function setBoothFinished(nextFinished) {
  boothFinished = Boolean(nextFinished);
  document.querySelectorAll(".booth-export").forEach((button) => {
    button.hidden = !boothFinished;
  });
  document.querySelector(".booth-export-row")?.classList.toggle("is-visible", boothFinished);
  finishBoothBtn?.toggleAttribute("disabled", boothShots.length < boothLayout || boothFinished);
  finishBoothBtn?.classList.toggle("is-disabled", boothShots.length < boothLayout || boothFinished);
}

function markBoothDirty() {
  photoCaptured = false;
  setBoothFinished(false);
}

async function openCameraFilter() {
  if (!cameraVideo) return;

  try {
    if (filterStream) {
      filterStream.getTracks().forEach((track) => track.stop());
    }

    filterStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });
    cameraVideo.srcObject = filterStream;
    await cameraVideo.play();
    applyCameraPreviewSettings();
    cameraShell?.classList.remove("has-photo");
    markBoothDirty();
    updateBoothStatus();
  } catch (error) {
    console.error("Camera filter error:", error);
    alert("Tidak dapat membuka kamera. Pastikan izin kamera diberikan.");
  }
}

function getFrameColors() {
  return boothFrameProfiles[boothFrame] || boothFrameProfiles.basic;
}

function drawCoverImage(context, source, dx, dy, dw, dh, options = {}) {
  const applyEffects = options.applyEffects !== false;
  const applyMirror = options.applyMirror ?? (boothMirror && source === cameraVideo);
  const sourceWidth = source.videoWidth || source.width;
  const sourceHeight = source.videoHeight || source.height;
  if (!sourceWidth || !sourceHeight) return;

  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = dw / dh;
  let sw = sourceWidth;
  let sh = sourceHeight;
  let sx = 0;
  let sy = 0;

  if (sourceRatio > targetRatio) {
    sw = sh * targetRatio;
    sx = (sourceWidth - sw) / 2;
  } else {
    sh = sw / targetRatio;
    sy = (sourceHeight - sh) / 2;
  }

  context.save();
  context.filter = applyEffects ? getCameraFilterValue() : "none";
  if (applyMirror) {
    context.translate(dx + dw, dy);
    context.scale(-1, 1);
    context.drawImage(source, sx, sy, sw, sh, 0, 0, dw, dh);
  } else {
    context.drawImage(source, sx, sy, sw, sh, dx, dy, dw, dh);
  }
  context.restore();
}

function drawBoothFrame(context, width, height) {
  const colors = getFrameColors();
  const inset = width * 0.031;
  const topBand = height * 0.05;
  const bottomBand = height * 0.066;

  context.fillStyle = colors.bg;
  context.fillRect(0, 0, width, height);
  context.fillStyle = "rgba(255,255,255,0.18)";
  context.fillRect(inset, inset, width - inset * 2, height - inset * 2);
  context.fillStyle = colors.accent;
  context.fillRect(0, 0, width, topBand);
  context.fillRect(0, height - bottomBand, width, bottomBand);
}

function getBoothOutputSize(layout = boothLayout) {
  if (layout === 1) {
    return { width: 900, height: 1200, ratio: "3 / 4" };
  }

  if (layout === 3) {
    return { width: 720, height: 2160, ratio: "2 / 6" };
  }

  return { width: 1080, height: 1920, ratio: "9 / 16" };
}

function getSlotRects(width, height, count) {
  const margin = width * 0.059;
  const header = height * 0.066;
  const footer = height * 0.083;
  const gap = width * 0.026;
  const usableWidth = width - margin * 2;
  const usableHeight = height - header - footer;

  if (count === 1) {
    const slotWidth = usableWidth;
    const slotHeight = slotWidth * 0.75;
    const slotY = header + (usableHeight - slotHeight) / 2 - usableHeight * 0.09;
    return [{
      x: margin,
      y: slotY,
      w: slotWidth,
      h: slotHeight,
    }];
  }

  if (count === 3) {
    const slotWidth = Math.min(usableWidth, (usableHeight - gap * 2) / 2.25);
    const slotHeight = slotWidth * 0.75;
    const startX = margin + (usableWidth - slotWidth) / 2;
    return Array.from({ length: 3 }, (_, index) => ({
      x: startX,
      y: header + index * (slotHeight + gap),
      w: slotWidth,
      h: slotHeight,
    }));
  }

  const slotWidth = Math.min((usableWidth - gap) / 2, (usableHeight - gap * 2) / 2.25);
  const slotHeight = slotWidth * 0.75;
  const startX = margin + (usableWidth - (slotWidth * 2 + gap)) / 2;
  return Array.from({ length: 6 }, (_, index) => ({
    x: startX + (index % 2) * (slotWidth + gap),
    y: header + Math.floor(index / 2) * (slotHeight + gap),
    w: slotWidth,
    h: slotHeight,
  }));
}

function drawBoothComposition(context, width, height) {
  drawBoothFrame(context, width, height);
  const slots = getSlotRects(width, height, boothLayout);
  const mat = Math.max(4, width * 0.011);

  slots.forEach((slot, index) => {
    context.save();
    context.fillStyle = "#fff";
    context.fillRect(slot.x - mat, slot.y - mat, slot.w + mat * 2, slot.h + mat * 2);
    const shot = boothShots[index];
    if (shot) {
      drawCoverImage(context, shot, slot.x, slot.y, slot.w, slot.h);
    } else {
      context.fillStyle = "rgba(0,0,0,0.08)";
      context.fillRect(slot.x, slot.y, slot.w, slot.h);
      context.fillStyle = "rgba(0,0,0,0.42)";
      context.font = `700 ${Math.max(14, width * 0.035)}px Arial`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(`FOTO ${index + 1}`, slot.x + slot.w / 2, slot.y + slot.h / 2);
    }
    context.restore();
  });
}

function renderShotTray() {
  if (shotCounter) shotCounter.textContent = `${Math.min(boothShots.length, boothLayout)}/${boothLayout}`;
  if (!boothShotTray) return;

  boothShotTray.innerHTML = "";
  const item = document.createElement("div");
  item.className = "booth-frame-preview";
  item.dataset.filled = String(boothShots.length > 0);
  item.dataset.layout = String(boothLayout);

  const previewCanvas = document.createElement("canvas");
  const previewSize = getBoothOutputSize();
  item.style.aspectRatio = previewSize.ratio;
  previewCanvas.width = previewSize.width;
  previewCanvas.height = previewSize.height;
  previewCanvas.setAttribute("aria-label", "Preview sementara dengan frame aktif");
  drawBoothComposition(previewCanvas.getContext("2d"), previewCanvas.width, previewCanvas.height);

  item.appendChild(previewCanvas);
  boothShotTray.appendChild(item);
}

function updateBoothTakeProgress(remaining = Math.max(0, boothLayout - boothShots.length)) {
  const nextShot = Math.min(boothShots.length + 1, boothLayout);
  const completed = Math.min(boothShots.length, boothLayout);

  if (boothProgressText) {
    boothProgressText.textContent = remaining
      ? `Foto ${nextShot} dari ${boothLayout}`
      : `Lengkap ${boothLayout}/${boothLayout}`;
  }

  if (captureBtnText) {
    captureBtnText.textContent = remaining
      ? `Ambil Foto ${nextShot}/${boothLayout}`
      : `Foto Lengkap ${boothLayout}/${boothLayout}`;
  }

  if (boothTakeProgress) {
    boothTakeProgress.innerHTML = "";
    Array.from({ length: boothLayout }, (_, index) => {
      const dot = document.createElement("span");
      dot.className = "take-dot";
      dot.classList.toggle("done", index < completed);
      dot.classList.toggle("current", remaining > 0 && index === completed);
      dot.setAttribute("aria-label", `Foto ${index + 1} ${index < completed ? "selesai" : "belum"}`);
      boothTakeProgress.appendChild(dot);
    });
  }
}

function renderBoothCanvas() {
  if (!cameraVideo || !cameraCanvas) return false;
  if (!cameraVideo.videoWidth || !cameraVideo.videoHeight || !boothShots.length) {
    return false;
  }

  const context = cameraCanvas.getContext("2d");
  const { width, height, ratio } = getBoothOutputSize();
  cameraCanvas.width = width;
  cameraCanvas.height = height;

  drawBoothComposition(context, width, height);

  if (cameraShell) cameraShell.dataset.layout = String(boothLayout);
  cameraShell?.style.setProperty("--booth-output-ratio", ratio);
  cameraShell?.classList.add("has-photo");
  photoCaptured = true;
  return true;
}

function captureFilteredPhoto() {
  if (!cameraVideo || !cameraCanvas) return false;
  if (!cameraVideo.videoWidth || !cameraVideo.videoHeight) {
    alert("Buka kamera dulu sebelum ambil foto.");
    return false;
  }

  const shotCanvas = document.createElement("canvas");
  shotCanvas.width = 1200;
  shotCanvas.height = 900;
  const shotContext = shotCanvas.getContext("2d");
  drawCoverImage(shotContext, cameraVideo, 0, 0, shotCanvas.width, shotCanvas.height, {
    applyEffects: false,
    applyMirror: boothMirror,
  });
  boothShots.push(shotCanvas);
  if (boothShots.length > boothLayout) boothShots = boothShots.slice(-boothLayout);
  renderBoothCanvas();
  renderShotTray();
  markBoothDirty();
  if (boothShots.length < boothLayout) {
    cameraShell?.classList.remove("has-photo");
  }
  if (boothShots.length >= boothLayout) {
    if (boothLayout === 1) {
      finishBooth();
    } else {
      finishBoothBtn?.removeAttribute("disabled");
      finishBoothBtn?.classList.remove("is-disabled");
    }
    setBoothMobileStep("result");
  }
  updateBoothStatus();
  return true;
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function runBoothCountdown() {
  if (!boothCountdown) return;
  boothCountdown.hidden = false;
  for (const count of [3, 2, 1]) {
    boothCountdown.textContent = String(count);
    await wait(650);
  }
  boothCountdown.hidden = true;
}

async function captureBoothWithCountdown() {
  if (boothCapturing) return;
  if (!cameraVideo?.videoWidth || !cameraVideo?.videoHeight) {
    alert("Buka kamera dulu sebelum ambil foto.");
    return;
  }
  boothCapturing = true;
  captureBtn?.setAttribute("disabled", "true");
  try {
    await runBoothCountdown();
    captureFilteredPhoto();
  } finally {
    boothCapturing = false;
    captureBtn?.removeAttribute("disabled");
  }
}

function updateBoothStatus() {
  if (!boothStatus) return;
  const remaining = Math.max(0, boothLayout - boothShots.length);
  updateBoothTakeProgress(remaining);
  if (boothFinished) {
    if (boothProgressText) boothProgressText.textContent = `Finish ${boothLayout}/${boothLayout}`;
    if (captureBtnText) captureBtnText.textContent = `Finish ${boothLayout}/${boothLayout}`;
    boothStatus.textContent = `Hasil ${boothLayout} foto sudah finish. Silakan download atau share.`;
  } else {
    boothStatus.textContent = remaining
      ? `${boothShots.length}/${boothLayout} foto. Ambil ${remaining} foto lagi.`
      : `Foto lengkap. Tekan Finish untuk membuka download dan share.`;
  }
  renderShotTray();
}

function resetBooth() {
  boothShots = [];
  markBoothDirty();
  cameraShell?.classList.remove("has-photo");
  renderShotTray();
  updateBoothStatus();
}

function retakeLastBoothShot() {
  if (!boothShots.length) {
    resetBooth();
    setBoothMobileStep("camera");
    return;
  }
  boothShots.pop();
  markBoothDirty();
  if (boothShots.length) {
    renderBoothCanvas();
    if (boothShots.length < boothLayout) {
      cameraShell?.classList.remove("has-photo");
    }
  } else {
    cameraShell?.classList.remove("has-photo");
  }
  renderShotTray();
  updateBoothStatus();
  if (!boothShots.length) {
    setBoothMobileStep("camera");
  }
}

function setBoothLayout(nextLayout) {
  boothLayout = Number(nextLayout) || 1;
  boothShots = boothShots.slice(0, boothLayout);
  markBoothDirty();
  boothLayoutButtons.forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.layout) === boothLayout);
  });
  if (boothShots.length) {
    renderBoothCanvas();
    if (boothShots.length < boothLayout) {
      cameraShell?.classList.remove("has-photo");
    }
  } else {
    cameraShell?.classList.remove("has-photo");
  }
  renderShotTray();
  updateBoothStatus();
}

function updatePremiumFrameState() {
  const hasAccess = hasPhotoboothPremiumAccess();
  const lockNote = document.getElementById("boothLockNote");

  boothFrameButtons.forEach((button) => {
    const profile = boothFrameProfiles[button.dataset.frame];
    const locked = Boolean(profile?.premium) && !hasAccess;
    button.classList.toggle("locked", locked);
    button.setAttribute("aria-disabled", String(locked));
    button.title = locked ? "Scan QR untuk membuka frame ini" : "";
  });

  if (lockNote) {
    lockNote.textContent = hasAccess
      ? "Frame premium siap kalau sudah ditambahkan."
      : "Semua frame saat ini gratis.";
    lockNote.classList.toggle("unlocked", true);
  }

  if (!hasAccess && boothFrameProfiles[boothFrame]?.premium) {
    setBoothFrame("basic");
  }
}

function setBoothFrame(nextFrame) {
  const profile = boothFrameProfiles[nextFrame] || boothFrameProfiles.basic;
  if (profile.premium && !hasPhotoboothPremiumAccess()) {
    alert("Frame lucu hanya untuk pelanggan yang sudah beli dan scan QR.");
    return;
  }

  boothFrame = boothFrameProfiles[nextFrame] ? nextFrame : "basic";
  markBoothDirty();
  boothFrameButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.frame === boothFrame);
  });
  if (boothShots.length) {
    renderBoothCanvas();
    if (boothShots.length < boothLayout) {
      cameraShell?.classList.remove("has-photo");
    }
  }
  updateBoothStatus();
}

function setBoothFilter(nextFilter) {
  boothFilter = boothFilterProfiles[nextFilter] ? nextFilter : "normal";
  boothFilterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === boothFilter);
  });
  applyCameraPreviewSettings();
  if (boothShots.length) {
    markBoothDirty();
    renderBoothCanvas();
    if (boothShots.length < boothLayout) {
      cameraShell?.classList.remove("has-photo");
    }
    renderShotTray();
    updateBoothStatus();
  }
}

function finishBooth() {
  if (boothShots.length < boothLayout) {
    alert(`Ambil ${boothLayout - boothShots.length} foto lagi sebelum finish.`);
    return;
  }
  renderBoothCanvas();
  photoCaptured = true;
  setBoothFinished(true);
  updateBoothStatus();
}

function getPhotoBlob() {
  return new Promise((resolve) => {
    if (!cameraCanvas || !photoCaptured) {
      resolve(null);
      return;
    }
    cameraCanvas.toBlob(resolve, "image/png");
  });
}

async function downloadFilteredPhoto() {
  if (!boothFinished) {
    alert("Tekan Finish dulu sebelum download.");
    return;
  }
  if (!photoCaptured && !renderBoothCanvas()) return;
  const blob = await getPhotoBlob();
  if (!blob) return;

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `scoopify-photobooth-${boothFrame}-${boothLayout}-foto.png`;
  link.click();
  URL.revokeObjectURL(link.href);
}

async function shareFilteredPhoto() {
  if (!boothFinished) {
    alert("Tekan Finish dulu sebelum share.");
    return;
  }
  if (!photoCaptured && !renderBoothCanvas()) return;
  const blob = await getPhotoBlob();
  if (!blob) return;

  const file = new File([blob], `scoopify-photobooth-${boothFrame}-${boothLayout}-foto.png`, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: "Scoopify",
      text: "#PlayYourMood",
    });
    return;
  }

  await downloadFilteredPhoto();
  alert("Browser ini belum mendukung share file langsung. Foto sudah di-download.");
}

openFilterBtn?.addEventListener("click", openCameraFilter);
captureBtn?.addEventListener("click", captureBoothWithCountdown);
retakeBoothBtn?.addEventListener("click", retakeLastBoothShot);
finishBoothBtn?.addEventListener("click", finishBooth);
boothLayoutButtons.forEach((button) => {
  button.addEventListener("click", () => setBoothLayout(button.dataset.layout));
});
boothFrameButtons.forEach((button) => {
  button.addEventListener("click", () => setBoothFrame(button.dataset.frame));
});
mirrorToggle?.addEventListener("change", () => {
  boothMirror = mirrorToggle.checked;
  applyCameraPreviewSettings();
});
brightnessRange?.addEventListener("input", () => {
  boothBrightness = Number(brightnessRange.value) || 100;
  applyCameraPreviewSettings();
});
boothFilterButtons.forEach((button) => {
  button.addEventListener("click", () => setBoothFilter(button.dataset.filter));
});
boothStepButtons.forEach((button) => {
  button.addEventListener("click", () => setBoothMobileStep(button.dataset.boothStep));
});
downloadFrameBtn?.addEventListener("click", downloadFilteredPhoto);
shareBtn?.addEventListener("click", shareFilteredPhoto);
setBoothLayout(1);
updatePremiumFrameState();
setBoothFrame("basic");
applyCameraPreviewSettings();
setBoothFilter("normal");
setBoothFinished(false);
setBoothMobileStep("frame");

// ========== VARIANT CAROUSEL ==========
const variantTrack = document.getElementById("variantTrack");
const variantCards = Array.from(document.querySelectorAll(".variant-card"));
const variantPrev = document.getElementById("variantPrev");
const variantNext = document.getElementById("variantNext");
const variantDots = document.getElementById("variantDots");
let activeVariantIndex = 0;
let lastVariantScrollLeft = 0;
let variantScrollFrame = null;

function setActiveVariant(index, applyTheme = false) {
  if (!variantCards.length) return;
  const nextActiveIndex = Math.max(0, Math.min(index, variantCards.length - 1));
  const changed = nextActiveIndex !== activeVariantIndex;
  activeVariantIndex = nextActiveIndex;

  variantCards.forEach((card, cardIndex) => {
    card.classList.toggle("active", cardIndex === activeVariantIndex);
  });

  document.querySelectorAll(".variant-dot").forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeVariantIndex);
  });

  const activeCard = variantCards[activeVariantIndex];
  const theme = activeCard?.dataset.theme;
  if (applyTheme && theme) {
    setBodyTheme(theme);
  }

  if (changed && activeCard) {
    activeCard.classList.remove("variant-pop");
    void activeCard.offsetWidth;
    activeCard.classList.add("variant-pop");
  }
}

function scrollVariantTo(index) {
  if (!variantTrack || !variantCards.length) return;
  const nextIndex = Math.max(0, Math.min(index, variantCards.length - 1));
  variantCards[nextIndex].scrollIntoView({
    behavior: "smooth",
    inline: "center",
    block: "nearest",
  });
  setActiveVariant(nextIndex, true);
}

function updateActiveVariantFromScroll() {
  if (!variantTrack || !variantCards.length) return;
  const trackCenter = variantTrack.getBoundingClientRect().left + variantTrack.clientWidth / 2;
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  variantCards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.left + rect.width / 2;
    const distance = Math.abs(trackCenter - cardCenter);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  setActiveVariant(closestIndex, true);
}

if (variantDots && variantCards.length) {
  variantCards.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "variant-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Lihat varian ${index + 1}`);
    dot.addEventListener("click", () => scrollVariantTo(index));
    variantDots.appendChild(dot);
  });
}

variantPrev?.addEventListener("click", () => scrollVariantTo(activeVariantIndex - 1));
variantNext?.addEventListener("click", () => scrollVariantTo(activeVariantIndex + 1));
variantTrack?.addEventListener("scroll", () => {
  const currentScrollLeft = variantTrack.scrollLeft;
  const directionClass = currentScrollLeft > lastVariantScrollLeft ? "swipe-left" : "swipe-right";
  lastVariantScrollLeft = currentScrollLeft;

  variantTrack.classList.add("is-swiping", directionClass);
  variantTrack.classList.toggle("swipe-left", directionClass === "swipe-left");
  variantTrack.classList.toggle("swipe-right", directionClass === "swipe-right");

  if (!variantScrollFrame) {
    variantScrollFrame = window.requestAnimationFrame(() => {
      updateActiveVariantFromScroll();
      variantScrollFrame = null;
    });
  }

  window.clearTimeout(window.__variantScrollTimeout);
  window.__variantScrollTimeout = window.setTimeout(() => {
    updateActiveVariantFromScroll();
    variantTrack.classList.remove("is-swiping", "swipe-left", "swipe-right");
  }, 160);
});

// ========== INITIALIZE ==========
normalizeHomeCopy();
configureLikertMoodUi();
updateSliderValues();
if (analyzeBtn) {
  applyMoodResult(readSliderValues());
}
syncGameModeLabels();
updateNavLinksState();
setActiveVariant(0, Boolean(variantCards.length));
if (document.body.classList.contains("flow-locked")) {
  const initialSection = window.location.hash?.replace("#", "") || "welcome";
  scrollToSection(canNavigate(initialSection) ? initialSection : "welcome");
}

// Trigger nav visibility on load
if (desktopNav && window.innerWidth > 767 && window.scrollY > 40) {
  desktopNav.classList.add("hidden");
}
