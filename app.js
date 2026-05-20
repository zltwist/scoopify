// Data mapping hasil AI
const moodProfiles = {
  relaxed: {
    title: "YOU ARE FEELING RELAXED 🌙",
    flavor: "Vanilla Lavender",
    quote: "Take a slow breath and enjoy the calm.",
    note: "Rasa lembut yang menenangkan tubuh dan pikiran.",
    theme: "theme-relaxed",
    image: "assets/menu/Vanilla.png",
    description: "Vanilla dengan sentuhan lavender untuk suasana adem dan santai.",
  },
  excited: {
    title: "YOU ARE FEELING EXCITED ✨",
    flavor: "Strawberry Spark",
    quote: "Let the sparkle lift your vibe even higher!",
    note: "Manis cerah untuk mood yang lagi naik.",
    theme: "theme-excited",
    image: "assets/menu/Stroberi.png",
    description: "Stroberi segar dengan vibes ceria, cocok untuk hari penuh energi.",
  },
  burnout: {
    title: "YOU ARE FEELING BURNOUT 🌧️",
    flavor: "Chocolate Energy Boost",
    quote: "Recharge gently, you are doing great.",
    note: "Cokelat hangat untuk bantu recharge.",
    theme: "theme-burnout",
    image: "assets/menu/Coklat.png",
    description: "Cokelat pekat yang menenangkan, pas untuk lelah yang butuh jeda.",
  },
  melancholy: {
    title: "YOU ARE FEELING MELANCHOLY 💙",
    flavor: "Durian Memories",
    quote: "It is okay to feel it all, softly.",
    note: "Rasa unik untuk mood mellow.",
    theme: "theme-melancholy",
    image: "assets/menu/Durian.png",
    description: "Durian legit untuk menemani mood yang sedang sendu.",
  },
  nostalgic: {
    title: "YOU ARE FEELING NOSTALGIC 🌞",
    flavor: "Nangka Classic",
    quote: "A sweet throwback to warm memories.",
    note: "Rasa klasik yang mengingatkan masa kecil.",
    theme: "theme-nostalgic",
    image: "assets/menu/Nangka.png",
    description: "Nangka manis tropis, pas untuk vibe nostalgia.",
  },
  happy: {
    title: "YOU ARE FEELING HAPPY 😍",
    flavor: "Strawberry Bliss",
    quote: "Keep that smile shining!",
    note: "Segar ceria untuk mood bahagia.",
    theme: "theme-happy",
    image: "assets/menu/Stroberi.png",
    description: "Stroberi lembut dengan rasa manis yang bikin mood makin cerah.",
  },
};

const gameDemoMode = true;

function hasGameTicket() {
  return gameDemoMode || flowState.qrScanned;
}

// STATE UNTUK FLOW (Fleksibel)
let flowState = {
  analyzed: false,      // Sudah analyze mood?
  qrScanned: gameDemoMode, // Demo mode membuka game tanpa scan QR
  gameTokenUsed: false, // Satu QR hanya bisa mulai game satu kali
  gameStarted: false,
  gameFinished: false,
  gameLocked: false,
  gameWon: false,
  lastMoodResult: null, // Menyimpan hasil mood terakhir
};

// Urutan halaman
const sectionOrder = ["welcome", "analyzer", "result", "flavor", "game", "reward"];
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
const detailImage = document.getElementById("detailImage");
const detailFlavorName = document.getElementById("detailFlavorName");
const detailDescription = document.getElementById("detailDescription");

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
  { key: "energy", input: "energyRange", value: "energyValue" },
  { key: "stress", input: "stressRange", value: "stressValue" },
  { key: "social", input: "socialRange", value: "socialValue" },
  { key: "emotional", input: "emotionalRange", value: "emotionalValue" },
  { key: "adventure", input: "adventureRange", value: "adventureValue" },
];

const sliders = sliderConfig.map((item) => ({
  key: item.key,
  input: document.getElementById(item.input),
  value: document.getElementById(item.value),
}));

// ========== FUNGSI UTAMA ==========

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
      slider.value.textContent = slider.input.value;
      slider.input.style.setProperty("--range-progress", `${slider.input.value}%`);
    }
  });
}

function calculateMood(values) {
  const { energy, stress, social, emotional, adventure } = values;

  if (stress >= 70 && energy <= 35) return "burnout";
  if (adventure >= 70 && energy >= 55) return "excited";
  if (emotional >= 70 && social >= 60) return "happy";
  if (emotional <= 30 && social <= 40) return "melancholy";
  if (stress <= 35 && energy <= 45) return "relaxed";
  if (social >= 70 && emotional >= 45) return "nostalgic";
  if (emotional >= 60) return "happy";
  return "relaxed";
}

function calculateMatch(values) {
  const balance = Math.round((values.energy + values.emotional + (100 - values.stress)) / 3);
  return Math.min(98, Math.max(60, balance));
}

function setBodyTheme(theme, extraClass = "") {
  const shouldLockFlow = document.body.classList.contains("flow-locked");
  document.body.className = [theme, extraClass, shouldLockFlow ? "flow-locked" : ""]
    .filter(Boolean)
    .join(" ");
}

function applySliderPreview(changedSlider) {
  if (!analyzeBtn) return;
  const values = readSliderValues();
  const moodKey = calculateMood(values);
  const profile = moodProfiles[moodKey] || moodProfiles.relaxed;

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
  const profile = moodProfiles[moodKey] || moodProfiles.relaxed;
  const match = calculateMatch(values);

  if (moodTitle) moodTitle.textContent = profile.title;
  if (moodQuote) moodQuote.textContent = profile.quote;
  if (resultFlavorName) resultFlavorName.textContent = profile.flavor;
  if (resultNote) resultNote.textContent = profile.note;
  if (resultMatch) resultMatch.textContent = `Match: ${match}%`;
  if (matchFill) matchFill.style.width = `${match}%`;
  if (resultImage) {
    resultImage.src = profile.image;
    resultImage.alt = profile.flavor;
  }
  if (detailImage) {
    detailImage.src = profile.image;
    detailImage.alt = profile.flavor;
  }
  if (detailFlavorName) detailFlavorName.textContent = profile.flavor;
  if (detailDescription) detailDescription.textContent = profile.description;

  setBodyTheme(profile.theme);
  
  // Simpan hasil mood
  flowState.lastMoodResult = { moodKey, profile, match };
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
  // Jika sudah analyze, bisa sampai flavor
  if (flowState.analyzed) return sectionOrder.indexOf("flavor");
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
  
  // Flavor hanya jika sudah analyze
  if (targetId === "flavor") return flowState.analyzed;
  
  if (targetId === "game") return hasGameTicket();
  if (targetId === "reward") return flowState.gameWon || hasGameTicket();
  
  return targetIndex <= maxAllowed;
}

function navigateWithRules(targetId) {
  if (!canNavigate(targetId)) {
    if (!flowState.analyzed && (targetId === "result" || targetId === "flavor")) {
      alert("✨ Selesaikan Mood Analyzer dulu ya! Geser slider dan klik 'Analyze Mood'.\n\nAtau scan QR untuk langsung main game!");
    } else if (!hasGameTicket() && (targetId === "game" || targetId === "reward")) {
      alert("📷 Scan tiket QR dulu! Klik tombol 'Scan QR' di halaman utama.\n\nTiket QR ada di cup es krim Scoopify kamu.");
    } else if (targetId === "reward" && !hasGameTicket()) {
      alert("Scan tiket QR dulu untuk membuka filter IG.");
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

async function startQRScanner() {
  if (qrScannerActive) return;
  
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
    <p style="color:white; margin-top:20px; text-align:center;">Arahkan QR Code ke tengah layar</p>
  `;
  document.body.appendChild(overlay);
  
  const video = document.getElementById("qrVideo");
  const closeBtn = document.getElementById("closeScannerBtn");
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
    currentStream = stream;
    video.srcObject = stream;
    await video.play();
    qrScannerActive = true;
    
    // Simulasi scan QR (karena library QR code butuh external)
    // Untuk demo, setelah 3 detik dianggap scan berhasil
    const scanTimeout = setTimeout(() => {
      if (qrScannerActive) {
        handleQRSuccess();
        stopQRScanner();
      }
    }, 3000);
    
    window.__qrScanTimeout = scanTimeout;
    
  } catch (error) {
    console.error("Camera error:", error);
    alert("Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.");
    stopQRScanner();
  }
  
  closeBtn.addEventListener("click", () => {
    stopQRScanner();
  });
}

function stopQRScanner() {
  if (window.__qrScanTimeout) {
    clearTimeout(window.__qrScanTimeout);
  }
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
  }
  const overlay = document.getElementById("qrScannerOverlay");
  if (overlay) overlay.remove();
  qrScannerActive = false;
}

function handleQRSuccess() {
  // Tiket QR berhasil dipindai.
  flowState.qrScanned = true;
  flowState.gameTokenUsed = false;
  flowState.gameStarted = false;
  flowState.gameFinished = false;
  flowState.gameLocked = false;
  flowState.gameWon = false;
  resetGame();
  updateGameGate();
  alert("✅ Tiket QR berhasil di-scan! Kamu sekarang bisa mengakses Mini Game.\n\nSelesaikan game dalam 15 detik untuk membuka reward.");
  
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
const orderBtn = document.getElementById("orderBtn");
orderBtn?.addEventListener("click", () => {
  navigateWithRules("welcome");
});

// To Game button (di halaman flavor)
const toGameBtn = document.getElementById("toGameBtn");
toGameBtn?.addEventListener("click", () => {
  if (!hasGameTicket()) {
    alert("📷 Scan tiket QR dulu! Klik tombol 'Scan QR' di halaman utama.\n\nTiket QR ada di cup es krim Scoopify kamu.");
    return;
  }
  navigateWithRules("game");
});

// Skip Game button
skipGameBtn?.addEventListener("click", () => {
  if (!hasGameTicket()) {
    alert("Scan tiket QR dulu untuk membuka filter IG.");
    return;
  }
  navigateWithRules("reward");
});

// Scan QR button (di halaman welcome) - BISA LANGSUNG, TANPA SYARAT!
const scanBtn = document.getElementById("scanBtn");
scanBtn?.addEventListener("click", () => {
  // TIDAK ADA SYARAT! Langsung buka scanner
  startQRScanner();
});

// Navigasi buttons dengan data-target
document.querySelectorAll("[data-target]").forEach(btn => {
  btn.addEventListener("click", () => {
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
let touchStartY = 0;
let navRevealTimeout = null;

function revealMobileNav() {
  if (!desktopNav || window.innerWidth > 767) return;
  desktopNav.classList.add("mobile-revealed");
  window.clearTimeout(navRevealTimeout);
  navRevealTimeout = window.setTimeout(() => {
    desktopNav.classList.remove("mobile-revealed");
  }, 2600);
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
const cardArray = ["vanilla", "vanilla", "stroberi", "stroberi", "coklat", "coklat", "durian", "durian", "nangka", "nangka"];
let comparisonArray = [];
let attempts = 0;
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
  if (resetGameBtn) {
    resetGameBtn.textContent = gameDemoMode ? "Reset Demo" : "1x per Tiket";
    resetGameBtn.disabled = !gameDemoMode;
  }
  if (skipGameBtn) {
    skipGameBtn.textContent = "Lewati ke Filter IG";
    skipGameBtn.disabled = !hasGameTicket();
  }

  if (gameDemoMode) {
    setGameGateContent(
      "Demo Mode",
      "Cocokkan semua pasangan kartu dalam 15 detik untuk membuka reward.",
      true
    );
    return;
  }

  setGameGateContent(
    "Game terkunci",
    "Scan tiket QR pada cup Scoopify untuk membuka mini game. Setiap tiket hanya punya satu kesempatan main.",
    false
  );
}

function updateGameGate() {
  if (!gameGate) return;

  if (gameDemoMode && !flowState.gameStarted && !flowState.gameFinished) {
    gameGate.classList.remove("hidden");
    setGameGateContent(
      "Demo Mode",
      "Cocokkan semua pasangan kartu dalam 15 detik untuk membuka reward.",
      true
    );
    return;
  }

  if (!flowState.qrScanned) {
    gameGate.classList.remove("hidden");
    setGameGateContent(
      "Game terkunci",
      "Scan tiket QR pada cup Scoopify untuk membuka mini game. Setiap tiket hanya punya satu kesempatan main.",
      false
    );
    return;
  }

  if (flowState.gameFinished) {
    gameGate.classList.remove("hidden");
    if (flowState.gameWon) {
      setGameGateContent(
        "Reward terbuka",
        "Kamu berhasil menyelesaikan game. Lanjut ke halaman reward untuk klaim hadiah.",
        false
      );
    } else {
      setGameGateContent(
        gameDemoMode ? "Waktu habis" : "Kesempatan QR sudah selesai",
        gameDemoMode ? "Kamu belum menyelesaikan game dalam 15 detik. Reset demo untuk mencoba lagi." : "Tiket ini sudah dipakai. Scan tiket produk lain untuk membuka kesempatan game baru.",
        gameDemoMode
      );
    }
    return;
  }

  if (flowState.gameLocked) {
    gameGate.classList.remove("hidden");
    setGameGateContent(
      "Waktu habis",
      gameDemoMode ? "Kamu belum menyelesaikan game dalam 15 detik. Reset demo untuk mencoba lagi." : "Kamu belum menyelesaikan game dalam 15 detik. Scan tiket produk lain untuk mencoba lagi.",
      gameDemoMode
    );
    return;
  }

  if (!flowState.gameStarted) {
    gameGate.classList.remove("hidden");
    setGameGateContent(
      "Siap main?",
      gameDemoMode ? "Cocokkan semua pasangan kartu dalam 15 detik." : "Cocokkan semua pasangan kartu dalam 15 detik. Tombol mulai hanya bisa dipakai satu kali untuk tiket ini.",
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
  if (attemptsEl) attemptsEl.textContent = attempts;
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
  clickCount = 0;
  pairs = 0;
  totalSeconds = 0;
  if (gameDemoMode) {
    flowState.qrScanned = true;
    flowState.gameTokenUsed = false;
    flowState.gameStarted = false;
    flowState.gameFinished = false;
    flowState.gameLocked = false;
    flowState.gameWon = false;
  }
  if (attemptsEl) attemptsEl.textContent = "0";
  if (minutesEl) minutesEl.textContent = "00";
  if (secondsEl) secondsEl.textContent = "00";
  if (countdownEl) countdownEl.textContent = String(gameTimeLimit);
  if (skipGameBtn) skipGameBtn.disabled = !hasGameTicket();
  updateStars();
  if (gameStatus) gameStatus.textContent = gameDemoMode ? "Demo siap. Tekan Mulai Game." : "Scan tiket QR, baca instruksi, lalu mulai game.";
  stopTimer();
  createBoard();
}

function startOneQrGame() {
  if (!hasGameTicket()) {
    alert("Scan tiket QR dulu sebelum mulai game.");
    return;
  }

  if (!gameDemoMode && (flowState.gameTokenUsed || flowState.gameFinished || flowState.gameLocked)) {
    alert("Kesempatan untuk tiket ini sudah dipakai. Scan tiket produk lain untuk main lagi.");
    return;
  }

  resetGame();
  flowState.gameTokenUsed = !gameDemoMode;
  flowState.gameStarted = true;
  flowState.gameFinished = false;
  flowState.gameLocked = false;
  flowState.gameWon = false;
  updateGameGate();
  if (gameStatus) gameStatus.textContent = "15 detik dimulai. Cocokkan semua kartu!";
  startTimer();
}

function failGame() {
  stopTimer();
  flowState.gameStarted = false;
  flowState.gameFinished = true;
  flowState.gameLocked = true;
  flowState.gameWon = false;
  comparisonArray = [];
  document.querySelectorAll(".flipped").forEach((item) => item.classList.remove("flipped"));
  if (gameStatus) gameStatus.textContent = gameDemoMode ? "Waktu habis. Reset demo untuk mencoba lagi." : "Waktu habis. Kesempatan tiket ini gugur.";
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
      <p>Attempts: ${attempts}</p>
      <p>Time: ${minutesEl?.textContent || "00"}:${secondsEl?.textContent || "00"}</p>
      <p>🎁 Kamu mendapat TOPPING GRATIS!</p>
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
      showWinMessage();
    }
    return;
  }

  setTimeout(() => {
    document.querySelectorAll(".flipped").forEach((item) => item.classList.remove("flipped"));
    comparisonArray = [];
    clickCount = 0;
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

// ========== CAMERA FILTER DEMO ==========
const cameraVideo = document.getElementById("cameraVideo");
const cameraCanvas = document.getElementById("cameraCanvas");
const openFilterBtn = document.getElementById("openFilterBtn");
const captureBtn = document.getElementById("captureBtn");
const downloadFrameBtn = document.getElementById("downloadFrameBtn");
const shareBtn = document.getElementById("shareBtn");
const cameraShell = cameraVideo?.closest(".camera-shell");
let filterStream = null;
let photoCaptured = false;

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
    cameraShell?.classList.remove("has-photo");
    photoCaptured = false;
  } catch (error) {
    console.error("Camera filter error:", error);
    alert("Tidak dapat membuka kamera. Pastikan izin kamera diberikan.");
  }
}

function captureFilteredPhoto() {
  if (!cameraVideo || !cameraCanvas) return false;
  if (!cameraVideo.videoWidth || !cameraVideo.videoHeight) {
    alert("Buka kamera dulu sebelum ambil foto.");
    return false;
  }

  const context = cameraCanvas.getContext("2d");
  const width = 1080;
  const height = 1920;
  cameraCanvas.width = width;
  cameraCanvas.height = height;

  const videoRatio = cameraVideo.videoWidth / cameraVideo.videoHeight;
  const targetRatio = width / height;
  let sourceWidth = cameraVideo.videoWidth;
  let sourceHeight = cameraVideo.videoHeight;
  let sourceX = 0;
  let sourceY = 0;

  if (videoRatio > targetRatio) {
    sourceWidth = sourceHeight * targetRatio;
    sourceX = (cameraVideo.videoWidth - sourceWidth) / 2;
  } else {
    sourceHeight = sourceWidth / targetRatio;
    sourceY = (cameraVideo.videoHeight - sourceHeight) / 2;
  }

  context.drawImage(cameraVideo, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);

  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "rgba(255, 107, 107, 0.28)");
  gradient.addColorStop(0.52, "rgba(255, 214, 165, 0.18)");
  gradient.addColorStop(1, "rgba(157, 124, 255, 0.28)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  const highlight = context.createRadialGradient(width * 0.22, height * 0.18, 0, width * 0.22, height * 0.18, width * 0.46);
  highlight.addColorStop(0, "rgba(255, 255, 255, 0.22)");
  highlight.addColorStop(1, "rgba(255, 255, 255, 0)");
  context.fillStyle = highlight;
  context.fillRect(0, 0, width, height);

  cameraShell?.classList.add("has-photo");
  photoCaptured = true;
  return true;
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
  if (!photoCaptured && !captureFilteredPhoto()) return;
  const blob = await getPhotoBlob();
  if (!blob) return;

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "scoopify-gradient-filter.png";
  link.click();
  URL.revokeObjectURL(link.href);
}

async function shareFilteredPhoto() {
  if (!photoCaptured && !captureFilteredPhoto()) return;
  const blob = await getPhotoBlob();
  if (!blob) return;

  const file = new File([blob], "scoopify-gradient-filter.png", { type: "image/png" });
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
captureBtn?.addEventListener("click", captureFilteredPhoto);
downloadFrameBtn?.addEventListener("click", downloadFilteredPhoto);
shareBtn?.addEventListener("click", shareFilteredPhoto);

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
