const flavorInventory = {
  durian: false,
  duren: false,
  nangka: false,
  vanila: true,
  vanilla: true,
  coklat: true,
  stroberi: false,
  taro: true,
};

const lastVariantThemeKey = "scoopifyLastVariantTheme";
const lastVariantIndexKey = "scoopifyLastVariantIndex";
const lastRecommendedFlavorKey = "scoopifyLastRecommendedFlavor";

const menuVariantCandidates = [
  "Coklat + Vanila",
  "Vanila + Taro",
  "Coklat + Taro",
  "Durian + Taro",
  "Durian + Vanila",
  "Vanila + Coklat",
  "Taro + Coklat",
  "Durian + Coklat",
  "Duren + Coklat",
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
  taro: "assets/menu/Taro.png",
};

const variantImages = {
  "vanila": "assets/menu/Vanilla.png",
  "vanilla": "assets/menu/Vanilla.png",
  "taro": "assets/menu/Taro.png",
  "coklat": "assets/menu/Coklat.png",
  "durian": "assets/menu/Durian.png",
  "duren": "assets/menu/Durian.png",
  "stroberi": "assets/menu/Stroberi.png",
  "nangka": "assets/menu/Nangka.png",
  "vanila+taro": "assets/menu/Vanilla Taro.png",
  "vanilla+taro": "assets/menu/Vanilla Taro.png",
  "taro+coklat": "assets/menu/Taro Coklat.png",
  "coklat+taro": "assets/menu/Taro Coklat.png",
  "coklat+vanila": "assets/menu/Coklat Vanilla.png",
  "coklat+vanilla": "assets/menu/Coklat Vanilla.png",
  "vanila+coklat": "assets/menu/Vanilla Coklat.png",
  "vanilla+coklat": "assets/menu/Vanilla Coklat.png",
  "durian+vanila": "assets/menu/Duren Vanilla.png",
  "durian+vanilla": "assets/menu/Duren Vanilla.png",
  "duren+vanila": "assets/menu/Duren Vanilla.png",
  "duren+vanilla": "assets/menu/Duren Vanilla.png",
  "taro+durian": "assets/menu/Taro Duren.png",
  "durian+taro": "assets/menu/Taro Duren.png",
  "taro+duren": "assets/menu/Taro Duren.png",
  "duren+taro": "assets/menu/Taro Duren.png",
  "durian+coklat": "assets/menu/Duren Coklat.png",
  "duren+coklat": "assets/menu/Duren Coklat.png",
  "taro+vanila+coklat": "assets/menu/Taro Vanilla Coklat.png",
  "taro+vanilla+coklat": "assets/menu/Taro Vanilla Coklat.png",
  "taro+vanila+durian": "assets/menu/Taro Vanilla Duren.png",
  "taro+vanilla+durian": "assets/menu/Taro Vanilla Duren.png",
  "taro+vanila+duren": "assets/menu/Taro Vanilla Duren.png",
  "taro+vanilla+duren": "assets/menu/Taro Vanilla Duren.png",
  "durian+coklat+vanila": "assets/menu/Duren Coklat Vanilla.png",
  "durian+coklat+vanilla": "assets/menu/Duren Coklat Vanilla.png",
  "duren+coklat+vanila": "assets/menu/Duren Coklat Vanilla.png",
  "duren+coklat+vanilla": "assets/menu/Duren Coklat Vanilla.png",
};

const flavorThemeMap = {
  "Vanila": "theme-vanilla",
  "Vanilla": "theme-vanilla",
  "Taro": "theme-taro",
  "Coklat": "theme-choco",
  "Durian": "theme-durian",
  "Duren": "theme-durian",
  "Stroberi": "theme-strawberry",
  "Nangka": "theme-nangka",
  "Vanila + Taro": "theme-vanilla-taro",
  "Vanilla + Taro": "theme-vanilla-taro",
  "Taro + Coklat": "theme-taro-choco",
  "Coklat + Taro": "theme-taro-choco",
  "Coklat + Vanila": "theme-choco-vanilla",
  "Coklat + Vanilla": "theme-choco-vanilla",
  "Vanila + Coklat": "theme-vanilla-choco",
  "Vanilla + Coklat": "theme-vanilla-choco",
  "Durian + Vanila": "theme-durian-vanilla",
  "Duren + Vanila": "theme-durian-vanilla",
  "Durian + Taro": "theme-taro-durian",
  "Duren + Taro": "theme-taro-durian",
  "Taro + Duren": "theme-taro-durian",
  "Durian + Coklat": "theme-durian-choco",
  "Duren + Coklat": "theme-durian-choco",
  "Taro + Vanila + Coklat": "theme-taro-vanilla-choco",
  "Taro + Vanilla + Coklat": "theme-taro-vanilla-choco",
  "Taro + Vanila + Duren": "theme-taro-vanilla-durian",
  "Taro + Vanilla + Durian": "theme-taro-vanilla-durian",
  "Duren + Coklat + Vanila": "theme-durian-choco-vanilla",
  "Durian + Coklat + Vanila": "theme-durian-choco-vanilla",
  "Stroberi + Vanila": "theme-strawberry",
  "Stroberi + Coklat": "theme-strawberry",
  "Nangka + Vanila": "theme-nangka",
  "Nangka + Durian": "theme-nangka",
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
    fallbackFlavor: "Vanila + Taro",
    theme: "theme-nostalgic",
    header: "Analisis selesai. Kamu terdeteksi berada di fase Rindu / Nostalgia (Time Traveler).",
    rationale: "Memori episodik sering cocok dengan rasa lokal yang kuat, autentik, dan familiar.",
    bridge: "Karena nangka dan durian sedang sold out, AI mengalihkan rekomendasi ke Vanila + Taro yang tetap creamy, lembut, dan tersedia.",
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
    fallbackFlavor: "Coklat + Taro",
    theme: "theme-burnout",
    header: "Analisis selesai. Sistem mendeteksi fase Marah / Kesal (Volcanic Eruption).",
    rationale: "Amigdala yang over-stimulated butuh pengalihan rasa kuat, dominan, dan tajam untuk memusatkan ulang orientasi sensorik.",
    bridge: "Karena durian sedang sold out, AI mengalihkan ke Coklat + Taro yang tetap tebal, comforting, dan tersedia.",
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
    fallbackFlavor: "Taro + Coklat",
    theme: "theme-nostalgic",
    header: "Analisis selesai. Kamu berada di fase Bosan / Jenuh (Stuck in Time).",
    rationale: "Kurang stimulasi dopaminergik cocok dibangunkan dengan rasa tropis lokal yang tajam dan intens.",
    bridge: "Karena nangka dan durian sedang kosong, AI mengalihkan ke Taro + Coklat yang tetap unik, tebal, dan tersedia.",
  },
};

const photoboothUnlockKey = "scoopifyPhotoboothPremiumUnlocked";
const usedGameTicketsKey = "scoopifyUsedGameTicketsV1";
const gameTicketAttemptsKey = "scoopifyGameTicketAttemptsV1";
const maxGameTriesPerTicket = 3;
const gameRewardChances = [
  { type: "discount2000", chance: 0.03, title: "Potongan Rp2.000", note: "Langsung kurang bayar Rp2.000 di kasir." },
  { type: "discount1000", chance: 0.06, title: "Potongan Rp1.000", note: "Langsung kurang bayar Rp1.000 di kasir." },
  { type: "topping", chance: 0.91, title: "Topping Gratis", note: "Bebas pilih topping yang tersedia." },
];
const isPhotoboothPage = document.body?.dataset.page === "photobooth";

function hasGameTicket() {
  return flowState.qrScanned;
}

function extractTicketToken(ticketValue = "") {
  const rawValue = String(ticketValue || "").trim();
  if (!rawValue) return "";

  try {
    const parsedUrl = new URL(rawValue, window.location.href);
    return parsedUrl.searchParams.get("ticket") || rawValue;
  } catch {
    return rawValue;
  }
}

function getTicketFromUrl() {
  return new URLSearchParams(window.location.search).get("ticket");
}

function readUsedGameTickets() {
  try {
    return JSON.parse(window.localStorage?.getItem(usedGameTicketsKey) || "[]");
  } catch {
    return [];
  }
}

function readGameTicketAttempts() {
  try {
    return JSON.parse(window.localStorage?.getItem(gameTicketAttemptsKey) || "{}");
  } catch {
    return {};
  }
}

function getGameTicketAttempts(ticketToken) {
  if (!ticketToken) return 0;
  return Number(readGameTicketAttempts()[ticketToken] || 0);
}

function setGameTicketAttempts(ticketToken, nextAttempts) {
  if (!ticketToken) return;
  const attemptsByTicket = readGameTicketAttempts();
  attemptsByTicket[ticketToken] = Math.max(0, Number(nextAttempts) || 0);
  window.localStorage?.setItem(gameTicketAttemptsKey, JSON.stringify(attemptsByTicket));
}

function getCurrentTicketToken() {
  return extractTicketToken(window.localStorage?.getItem("scoopifyLastQrTicket") || getTicketFromUrl());
}

function getRemainingGameTries(ticketToken = getCurrentTicketToken()) {
  return Math.max(0, maxGameTriesPerTicket - getGameTicketAttempts(ticketToken));
}

function isGameTicketUsed(ticketToken) {
  if (!ticketToken) return false;
  return readUsedGameTickets().includes(ticketToken) || getRemainingGameTries(ticketToken) <= 0;
}

function markGameTicketUsed(ticketToken) {
  if (!ticketToken) return;
  const tickets = new Set(readUsedGameTickets());
  tickets.add(ticketToken);
  window.localStorage?.setItem(usedGameTicketsKey, JSON.stringify([...tickets]));
}

function hasPhotoboothPremiumAccess() {
  return Boolean(getTicketFromUrl()) || window.localStorage?.getItem(photoboothUnlockKey) === "true";
}

if (getTicketFromUrl()) {
  window.localStorage?.setItem(photoboothUnlockKey, "true");
  window.localStorage?.setItem("scoopifyLastQrTicket", extractTicketToken(getTicketFromUrl()));
}

// STATE UNTUK FLOW (Fleksibel)
let flowState = {
  analyzed: false,      // Sudah analyze mood?
  qrScanned: Boolean(getTicketFromUrl()) && !isGameTicketUsed(extractTicketToken(getTicketFromUrl())), // QR URL membuka game
  gameTokenUsed: false, // Satu QR hanya bisa mulai game satu kali
  gameStarted: false,
  gameFinished: false,
  gameLocked: false,
  gameWon: false,
  lastReward: null,
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

function saveLastVariantSelection(theme, index) {
  if (!theme) return;
  try {
    window.localStorage.setItem(lastVariantThemeKey, theme);
    if (Number.isInteger(index)) {
      window.localStorage.setItem(lastVariantIndexKey, String(index));
    } else {
      window.localStorage.removeItem(lastVariantIndexKey);
    }
  } catch (error) {
    // Ignore storage failures so the UI still works in private/restricted browsers.
  }
}

function saveLastRecommendedFlavor(flavor) {
  if (!flavor) return;
  try {
    window.localStorage.setItem(lastRecommendedFlavorKey, flavor);
  } catch (error) {
    // Ignore storage failures so the UI still works in private/restricted browsers.
  }
}

function readLastVariantTheme() {
  try {
    return window.localStorage.getItem(lastVariantThemeKey) || "";
  } catch (error) {
    return "";
  }
}

function readLastRecommendedFlavor() {
  try {
    return window.localStorage.getItem(lastRecommendedFlavorKey) || "";
  } catch (error) {
    return "";
  }
}

function readLastVariantIndex() {
  try {
    const storedValue = window.localStorage.getItem(lastVariantIndexKey);
    if (storedValue === null) return -1;
    const value = Number(storedValue);
    return Number.isInteger(value) ? value : -1;
  } catch (error) {
    return -1;
  }
}

const savedVariantTheme = readLastVariantTheme();
const savedVariantIndex = readLastVariantIndex();
const savedRecommendedFlavor = readLastRecommendedFlavor();
if (savedVariantTheme) {
  setBodyTheme(savedVariantTheme);
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

function extractFlavorTokens(text) {
  const normalizedText = String(text || "")
    .toLowerCase()
    .replace(/strawberry/g, "stroberi")
    .replace(/durian|duren/g, "durian")
    .replace(/vanilla|vanila/g, "vanila");
  return ["durian", "nangka", "vanila", "coklat", "stroberi", "taro"]
    .filter((flavor) => normalizedText.includes(flavor))
    .sort();
}

function isSameFlavorSet(firstFlavor, secondFlavor) {
  const firstTokens = extractFlavorTokens(firstFlavor);
  const secondTokens = extractFlavorTokens(secondFlavor);
  return Boolean(firstTokens.length) &&
    firstTokens.length === secondTokens.length &&
    firstTokens.every((token, index) => token === secondTokens[index]);
}

function hasSoldOutFlavor(flavor) {
  return parseFlavorComponents(flavor).some((item) => flavorInventory[item] === false);
}

function isFlavorAvailable(flavor) {
  const components = parseFlavorComponents(flavor);
  return Boolean(components.length) && components.every((item) => flavorInventory[item] !== false);
}

function getVariantImageKey(flavor) {
  return String(flavor || "")
    .toLowerCase()
    .split("+")
    .map((item) => item.trim())
    .filter(Boolean)
    .join("+");
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
  const exactVariantImage = variantImages[getVariantImageKey(flavor)];
  if (exactVariantImage) return exactVariantImage;

  const components = parseFlavorComponents(flavor);
  const availableComponent = components.find((item) => flavorInventory[item] !== false);
  const firstComponent = preferAvailable ? availableComponent || components[0] : components[0] || availableComponent;
  return flavorImages[firstComponent] || flavorImages.vanila;
}

function getFlavorTheme(flavor, fallbackTheme = "theme-vanilla") {
  if (flavorThemeMap[flavor]) return flavorThemeMap[flavor];
  const normalizedFlavor = parseFlavorComponents(flavor).map((item) => {
    if (item === "vanila" || item === "vanilla") return "Vanila";
    if (item === "durian" || item === "duren") return "Duren";
    return item.charAt(0).toUpperCase() + item.slice(1);
  }).join(" + ");
  return flavorThemeMap[normalizedFlavor] || fallbackTheme;
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
    theme: getFlavorTheme(selectedFlavor || profile.idealFlavor, profile.theme),
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

function applyMoodResult(values, options = {}) {
  const shouldApplyTheme = options.applyTheme !== false;
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
  if (shouldApplyTheme) {
    setBodyTheme(recommendation.theme);
    saveLastVariantSelection(recommendation.theme);
    saveLastRecommendedFlavor(recommendation.selectedFlavor || recommendation.idealFlavor);
  }
  
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
          }

          if (!qrValue && hasJsQrFallback) {
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
  const ticketToken = extractTicketToken(ticketValue);
  if (ticketToken) window.localStorage?.setItem("scoopifyLastQrTicket", ticketToken);
  window.localStorage?.setItem(photoboothUnlockKey, "true");

  if (!isPhotoboothPage && isGameTicketUsed(ticketToken)) {
    flowState.qrScanned = false;
    updateGameGate();
    updateNavLinksState();
    alert("QR ini sudah pernah dipakai untuk mini game. Photobooth tetap bisa digunakan dengan QR yang sama.");
    return;
  }

  flowState.qrScanned = true;
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
  "stroberi", "stroberi",
  "nangka", "nangka",
];
let comparisonArray = [];
let attempts = 0;
let lives = 3;
let clickCount = 0;
let pairs = 0;
let totalSeconds = 0;
let timerId = null;
const gameTimeLimit = 15;

function setGameGateContent(title, text, canStart) {
  if (gameGateTitle) gameGateTitle.textContent = title;
  if (gameGateText) gameGateText.textContent = text;
  if (startGameBtn) startGameBtn.disabled = !canStart;
}

function syncGameModeLabels() {
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
    if (startGameBtn) startGameBtn.textContent = "Mulai Game";
    return;
  }

  if (flowState.gameFinished) {
    gameGate.classList.remove("hidden");
    if (flowState.gameWon) {
      setGameGateContent(
        "Reward terbuka",
        flowState.lastReward ? `Kamu menang: ${flowState.lastReward.title}.` : "Kamu menang. Ambil reward di kasir.",
        false
      );
    } else {
      const remainingTries = getRemainingGameTries();
      setGameGateContent(
        remainingTries > 0 ? "Coba lagi" : "Kesempatan habis",
        remainingTries > 0
          ? `Masih ada ${remainingTries} kesempatan. Tekan Coba Lagi untuk mulai ulang.`
          : "Tiket ini sudah habis untuk mini game. Photobooth tetap bisa dipakai.",
        remainingTries > 0
      );
      if (startGameBtn) startGameBtn.textContent = remainingTries > 0 ? "Coba Lagi" : "Kesempatan Habis";
    }
    return;
  }

  if (flowState.gameLocked) {
    gameGate.classList.remove("hidden");
    const remainingTries = getRemainingGameTries();
    setGameGateContent(
      remainingTries > 0 ? "Coba lagi" : "Kesempatan habis",
      remainingTries > 0
        ? `Masih ada ${remainingTries} kesempatan. Tekan Coba Lagi untuk mulai ulang.`
        : "Tiket ini sudah habis untuk mini game. Photobooth tetap bisa dipakai.",
      remainingTries > 0
    );
    if (startGameBtn) startGameBtn.textContent = remainingTries > 0 ? "Coba Lagi" : "Kesempatan Habis";
    return;
  }

  if (!flowState.gameStarted) {
    gameGate.classList.remove("hidden");
    const remainingTries = getRemainingGameTries();
    setGameGateContent(
      "Siap main?",
      `Cocokkan kartu dalam ${gameTimeLimit} detik. Kesempatan tiket ini: ${remainingTries}/${maxGameTriesPerTicket}.`,
      remainingTries > 0
    );
    if (startGameBtn) startGameBtn.textContent = remainingTries === maxGameTriesPerTicket ? "Mulai Game" : "Coba Lagi";
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

function updateStars() {
  if (!starsEl) return;
  const remainingTries = hasGameTicket() ? getRemainingGameTries() : maxGameTriesPerTicket;
  starsEl.textContent = Array.from(
    { length: maxGameTriesPerTicket },
    (_, index) => (index < remainingTries ? "♥" : "♡")
  ).join(" ");
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
  if (attemptsEl) attemptsEl.textContent = String(hasGameTicket() ? getRemainingGameTries() : maxGameTriesPerTicket);
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

  const ticketToken = getCurrentTicketToken();
  if (isGameTicketUsed(ticketToken)) {
    flowState.qrScanned = false;
    updateGameGate();
    updateNavLinksState();
    alert("Kesempatan mini game untuk QR ini sudah habis. Photobooth tetap bisa digunakan.");
    return;
  }

  setGameTicketAttempts(ticketToken, getGameTicketAttempts(ticketToken) + 1);
  resetGame();
  flowState.gameTokenUsed = true;
  flowState.gameStarted = true;
  flowState.gameFinished = false;
  flowState.gameLocked = false;
  flowState.gameWon = false;
  updateGameGate();
  const currentTry = getGameTicketAttempts(ticketToken);
  if (attemptsEl) attemptsEl.textContent = String(getRemainingGameTries(ticketToken));
  updateStars();
  if (gameStatus) gameStatus.textContent = `Ronde ${currentTry}/${maxGameTriesPerTicket}. ${gameTimeLimit} detik dimulai. Salah tebak bebas.`;
  startTimer();
}

function failGame(reason = "Waktu habis") {
  stopTimer();
  flowState.gameStarted = false;
  flowState.gameFinished = true;
  const ticketToken = getCurrentTicketToken();
  const remainingTries = getRemainingGameTries(ticketToken);
  flowState.gameLocked = remainingTries <= 0;
  flowState.gameWon = false;
  comparisonArray = [];
  document.querySelectorAll(".flipped").forEach((item) => item.classList.remove("flipped"));
  if (remainingTries <= 0) {
    markGameTicketUsed(ticketToken);
  }
  if (gameStatus) {
    gameStatus.textContent = remainingTries > 0
      ? `${reason}. Masih ada ${remainingTries} kesempatan.`
      : `${reason}. Kesempatan mini game habis.`;
  }
  if (skipGameBtn) skipGameBtn.disabled = !hasGameTicket();
  updateGameGate();
}

function showWinMessageLegacy() {
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
      <p>Kesempatan tersisa: ${getRemainingGameTries()}</p>
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

function pickGameReward() {
  const roll = Math.random();
  let cursor = 0;
  for (const reward of gameRewardChances) {
    cursor += reward.chance;
    if (roll < cursor) return reward;
  }
  return gameRewardChances[gameRewardChances.length - 1];
}

function showWinMessage() {
  flowState.gameStarted = false;
  flowState.gameFinished = true;
  flowState.gameLocked = false;
  flowState.gameWon = true;
  markGameTicketUsed(getCurrentTicketToken());
  const reward = pickGameReward();
  flowState.lastReward = reward;
  if (skipGameBtn) skipGameBtn.disabled = false;
  updateNavLinksState();
  updateGameGate();

  const overlay = document.createElement("div");
  overlay.className = "game-over";
  overlay.innerHTML = `
    <div class="message-box reward-box">
      <h3>Yeay, menang!</h3>
      <div class="reward-roulette" aria-label="Roulette reward">
        <span>Rp1.000</span>
        <span>Topping</span>
        <span>Rp2.000</span>
      </div>
      <p class="reward-result" id="rewardResult">Memutar reward...</p>
      <p class="reward-note" id="rewardNote">Tunggu sebentar ya.</p>
      <button id="closeWin">OK</button>
    </div>
  `;
  document.body.appendChild(overlay);

  window.setTimeout(() => {
    overlay.querySelector(".reward-roulette")?.classList.add("done");
    const result = overlay.querySelector("#rewardResult");
    const note = overlay.querySelector("#rewardNote");
    if (result) result.textContent = reward.title;
    if (note) note.textContent = reward.note;
    if (gameStatus) gameStatus.textContent = `Menang. Reward: ${reward.title}.`;
    updateGameGate();
  }, 1200);

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
      if (gameStatus) gameStatus.textContent = "Menang. Roulette reward dimulai.";
      showWinMessage();
    }
    return;
  }

  setTimeout(() => {
    document.querySelectorAll(".flipped").forEach((item) => item.classList.remove("flipped"));
    comparisonArray = [];
    clickCount = 0;
    if (gameStatus) gameStatus.textContent = "Belum cocok. Coba lagi, waktunya masih jalan.";
  }, 800);
}

if (memoryBoard) {
  resetGame();
  syncGameModeLabels();
  memoryBoard.addEventListener("click", handleCardClick);
  updateGameGate();
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
let boothLayout = 2;
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
  basic: { label: "Free Frame", bg: "#f7e8ff", accent: "#9d7cff", text: "#332457", premium: false },
};

const boothLogoImage = typeof Image !== "undefined" ? new Image() : null;
if (boothLogoImage) {
  boothLogoImage.src = "assets/logo/scoopify.png";
  boothLogoImage.addEventListener("load", () => {
    renderShotTray();
  });
}

const boothFrameOverlayImages = {};
if (typeof Image !== "undefined") {
  [2, 3, 6].forEach((layout) => {
    const image = new Image();
    image.src = `assets/frame-free/free-frame-${layout}.png`;
    image.addEventListener("load", () => {
      renderShotTray();
      if (boothShots.length) renderBoothCanvas();
    });
    boothFrameOverlayImages[layout] = image;
  });
}

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
  updateCaptureButtonState();
}

function markBoothDirty() {
  photoCaptured = false;
  setBoothFinished(false);
}

function updateCaptureButtonState() {
  const isFull = boothShots.length >= boothLayout;
  captureBtn?.toggleAttribute("disabled", boothCapturing || isFull || boothFinished);
  captureBtn?.classList.toggle("is-disabled", boothCapturing || isFull || boothFinished);
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

function drawRoundRect(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

function drawBoothDecoration(context, width, height, colors, topBand, bottomBand) {
  const accent = colors.accent;
  const textColor = colors.text;
  const bottomY = height - bottomBand;
  const dotSize = Math.max(8, width * 0.014);
  const sparkleSize = Math.max(16, width * 0.026);

  context.save();
  context.globalAlpha = 0.34;
  context.fillStyle = "#ffffff";
  [
    [width * 0.08, topBand * 0.56, dotSize * 1.2],
    [width * 0.14, topBand * 0.32, dotSize * 0.7],
    [width * 0.88, topBand * 0.50, dotSize],
    [width * 0.94, topBand * 0.28, dotSize * 0.62],
    [width * 0.10, bottomY + bottomBand * 0.48, dotSize],
    [width * 0.91, bottomY + bottomBand * 0.62, dotSize * 1.15],
  ].forEach(([x, y, radius]) => {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  });

  context.globalAlpha = 0.55;
  context.strokeStyle = "#ffffff";
  context.lineWidth = Math.max(3, width * 0.004);
  [
    [width * 0.05, height * 0.5],
    [width * 0.95, height * 0.43],
    [width * 0.12, height * 0.86],
    [width * 0.88, height * 0.82],
  ].forEach(([x, y]) => {
    context.beginPath();
    context.moveTo(x, y - sparkleSize);
    context.lineTo(x + sparkleSize * 0.34, y - sparkleSize * 0.34);
    context.lineTo(x + sparkleSize, y);
    context.lineTo(x + sparkleSize * 0.34, y + sparkleSize * 0.34);
    context.lineTo(x, y + sparkleSize);
    context.lineTo(x - sparkleSize * 0.34, y + sparkleSize * 0.34);
    context.lineTo(x - sparkleSize, y);
    context.lineTo(x - sparkleSize * 0.34, y - sparkleSize * 0.34);
    context.closePath();
    context.stroke();
  });
  context.restore();

  context.save();
  context.globalAlpha = 0.96;
  context.fillStyle = "rgba(255,255,255,0.74)";
  drawRoundRect(context, width * 0.31, bottomY + bottomBand * 0.11, width * 0.38, bottomBand * 0.75, bottomBand * 0.28);
  context.fill();

  const logoMaxWidth = width * 0.24;
  const logoMaxHeight = bottomBand * 0.34;
  if (boothLogoImage?.complete && boothLogoImage.naturalWidth) {
    const imageRatio = boothLogoImage.naturalWidth / boothLogoImage.naturalHeight;
    let logoWidth = logoMaxWidth;
    let logoHeight = logoWidth / imageRatio;
    if (logoHeight > logoMaxHeight) {
      logoHeight = logoMaxHeight;
      logoWidth = logoHeight * imageRatio;
    }
    context.drawImage(
      boothLogoImage,
      (width - logoWidth) / 2,
      bottomY + bottomBand * 0.18,
      logoWidth,
      logoHeight
    );
  } else {
    context.fillStyle = accent;
    context.font = `900 ${Math.max(18, width * 0.04)}px Arial`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("SCOOPIFY", width / 2, bottomY + bottomBand * 0.34);
  }

  context.fillStyle = textColor;
  context.font = `800 ${Math.max(12, width * 0.019)}px Arial`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("PLAY YOUR MOOD, TASTE YOUR SCOOP", width / 2, bottomY + bottomBand * 0.68);
  context.restore();
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

  const frameGradient = context.createLinearGradient(0, 0, width, height);
  frameGradient.addColorStop(0, colors.bg);
  frameGradient.addColorStop(0.52, "#fff7fb");
  frameGradient.addColorStop(1, colors.bg);
  context.fillStyle = frameGradient;
  context.fillRect(0, 0, width, height);
  context.fillStyle = "rgba(255,255,255,0.18)";
  context.fillRect(inset, inset, width - inset * 2, height - inset * 2);
  context.fillStyle = colors.accent;
  context.fillRect(0, 0, width, topBand);
  context.fillRect(0, height - bottomBand, width, bottomBand);
  context.fillStyle = "rgba(255,255,255,0.18)";
  context.fillRect(0, topBand, width, Math.max(4, height * 0.006));
  context.fillRect(0, height - bottomBand - Math.max(4, height * 0.006), width, Math.max(4, height * 0.006));
  drawBoothDecoration(context, width, height, colors, topBand, bottomBand);
}

function getBoothOutputSize(layout = boothLayout) {
  if (layout === 6) {
    return { width: 1080, height: 1560, ratio: "9 / 13" };
  }

  return { width: 1080, height: 1440, ratio: "3 / 4" };
}

function getSlotRects(width, height, count) {
  if (count === 2) {
    const slotWidth = width * 0.66;
    const slotHeight = slotWidth * 0.75;
    const startY = height * 0.12;
    const gap = height * 0.054;
    return Array.from({ length: 2 }, (_, index) => ({
      x: (width - slotWidth) / 2,
      y: startY + index * (slotHeight + gap),
      w: slotWidth,
      h: slotHeight,
    }));
  }

  if (count === 3) {
    const topWidth = width * 0.76;
    const topHeight = topWidth * 0.75;
    const topX = (width - topWidth) / 2;
    const topY = height * 0.13;
    const gap = width * 0.05;
    const smallWidth = (width * 0.82 - gap) / 2;
    const smallHeight = smallWidth * 0.75;
    const smallY = topY + topHeight + height * 0.045;
    return [
      { x: topX, y: topY, w: topWidth, h: topHeight },
      { x: width * 0.09, y: smallY, w: smallWidth, h: smallHeight },
      { x: width * 0.09 + smallWidth + gap, y: smallY, w: smallWidth, h: smallHeight },
    ];
  }

  const margin = width * 0.065;
  const gap = width * 0.035;
  const slotWidth = (width - margin * 2 - gap) / 2;
  const slotHeight = slotWidth * 0.75;
  const startY = height * 0.058;
  const rowGap = height * 0.022;
  return Array.from({ length: 6 }, (_, index) => ({
    x: margin + (index % 2) * (slotWidth + gap),
    y: startY + Math.floor(index / 2) * (slotHeight + rowGap),
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

  const frameOverlay = boothFrameOverlayImages[boothLayout];
  if (boothFrame === "basic" && frameOverlay?.complete && frameOverlay.naturalWidth) {
    context.drawImage(frameOverlay, 0, 0, width, height);
  }
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
      : `Foto lengkap ${boothLayout}/${boothLayout}`;
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
    cameraShell?.classList.remove("has-photo");
    finishBoothBtn?.removeAttribute("disabled");
    finishBoothBtn?.classList.remove("is-disabled");
  }
  updateBoothStatus();
  updateCaptureButtonState();
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
    updateCaptureButtonState();
  }
}

function updateBoothStatus() {
  if (!boothStatus) return;
  const remaining = Math.max(0, boothLayout - boothShots.length);
  updateBoothTakeProgress(remaining);
  if (boothFinished) {
    if (boothProgressText) boothProgressText.textContent = `Finish ${boothLayout}/${boothLayout}`;
    boothStatus.textContent = `Hasil ${boothLayout} foto sudah finish. Silakan download atau share.`;
  } else {
    boothStatus.textContent = remaining
      ? `${boothShots.length}/${boothLayout} foto. Ambil ${remaining} foto lagi.`
      : `Foto lengkap. Tekan Finish untuk membuka download dan share.`;
  }
  renderShotTray();
  updateCaptureButtonState();
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
    cameraShell?.classList.remove("has-photo");
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
    cameraShell?.classList.remove("has-photo");
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
    lockNote.textContent = "Frame premium belum ditambahkan.";
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
    cameraShell?.classList.remove("has-photo");
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
    cameraShell?.classList.remove("has-photo");
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
  setBoothMobileStep("result");
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
setBoothLayout(2);
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
let isRestoringVariant = false;
let isVariantProgrammaticScroll = false;
let isVariantTouching = false;
let variantTouchStartX = 0;
let variantTouchStartY = 0;
let variantTouchStartIndex = 0;
let variantProgrammaticScrollTimeout = null;

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
    if (!isRestoringVariant) {
      saveLastVariantSelection(theme, activeVariantIndex);
      saveLastRecommendedFlavor(activeCard.querySelector("h3")?.textContent || "");
    }
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
  isVariantProgrammaticScroll = true;
  window.clearTimeout(variantProgrammaticScrollTimeout);
  variantCards[nextIndex].scrollIntoView({
    behavior: "smooth",
    inline: "center",
    block: "nearest",
  });
  setActiveVariant(nextIndex, true);
  variantProgrammaticScrollTimeout = window.setTimeout(() => {
    isVariantProgrammaticScroll = false;
  }, 420);
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
variantTrack?.addEventListener("touchstart", (event) => {
  const touch = event.touches?.[0];
  if (!touch) return;
  isVariantTouching = true;
  variantTouchStartX = touch.clientX;
  variantTouchStartY = touch.clientY;
  variantTouchStartIndex = activeVariantIndex;
}, { passive: true });
variantTrack?.addEventListener("touchend", (event) => {
  if (!isVariantTouching) return;
  const touch = event.changedTouches?.[0];
  isVariantTouching = false;
  if (!touch) return;

  const deltaX = touch.clientX - variantTouchStartX;
  const deltaY = touch.clientY - variantTouchStartY;
  const isHorizontalSwipe = Math.abs(deltaX) > 52 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;

  if (isHorizontalSwipe) {
    scrollVariantTo(variantTouchStartIndex + (deltaX < 0 ? 1 : -1));
    return;
  }

  scrollVariantTo(variantTouchStartIndex);
}, { passive: true });
variantTrack?.addEventListener("scroll", () => {
  if (isRestoringVariant) return;

  const currentScrollLeft = variantTrack.scrollLeft;
  const directionClass = currentScrollLeft > lastVariantScrollLeft ? "swipe-left" : "swipe-right";
  lastVariantScrollLeft = currentScrollLeft;

  variantTrack.classList.add("is-swiping", directionClass);
  variantTrack.classList.toggle("swipe-left", directionClass === "swipe-left");
  variantTrack.classList.toggle("swipe-right", directionClass === "swipe-right");

  if (isVariantTouching || isVariantProgrammaticScroll) {
    window.clearTimeout(window.__variantScrollTimeout);
    window.__variantScrollTimeout = window.setTimeout(() => {
      variantTrack.classList.remove("is-swiping", "swipe-left", "swipe-right");
    }, 180);
    return;
  }

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
  applyMoodResult(readSliderValues(), { applyTheme: false });
}
syncGameModeLabels();
updateNavLinksState();
const initialVariantIndexByFlavor = variantCards.findIndex((card) => (
  isSameFlavorSet(card.querySelector("h3")?.textContent, savedRecommendedFlavor)
));
const initialVariantIndexByTheme = variantCards.findIndex((card) => card.dataset.theme === savedVariantTheme);
const initialVariantIndex = initialVariantIndexByFlavor >= 0
  ? initialVariantIndexByFlavor
  : savedVariantIndex >= 0 && savedVariantIndex < variantCards.length
    ? savedVariantIndex
    : initialVariantIndexByTheme;
const initialActiveVariantIndex = initialVariantIndex >= 0 ? initialVariantIndex : 0;
isRestoringVariant = initialVariantIndex >= 0;
setActiveVariant(initialActiveVariantIndex, Boolean(variantCards.length));
if (variantTrack && initialVariantIndex >= 0) {
  window.requestAnimationFrame(() => {
    variantCards[initialActiveVariantIndex]?.scrollIntoView({
      behavior: "auto",
      inline: "center",
      block: "nearest",
    });
    window.setTimeout(() => {
      isRestoringVariant = false;
      setActiveVariant(initialActiveVariantIndex, true);
    }, 250);
  });
} else {
  isRestoringVariant = false;
}
if (document.body.classList.contains("flow-locked")) {
  const initialSection = window.location.hash?.replace("#", "") || "welcome";
  scrollToSection(canNavigate(initialSection) ? initialSection : "welcome");
}

// Trigger nav visibility on load
if (desktopNav && window.innerWidth > 767 && window.scrollY > 40) {
  desktopNav.classList.add("hidden");
}
