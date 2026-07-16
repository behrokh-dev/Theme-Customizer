

const palettes = [
  { from: "#f0abfc", to: "#a78bfa" }, // fuchsia -> violet (پیش‌فرض)     ایندکس 0
  { from: "#93c5fd", to: "#6ee7b7" }, // blue -> emerald                 ایندکس 1 
  { from: "#fda4af", to: "#fdba74" }, // rose -> orange                  ایندکس 2
  { from: "#c4b5fd", to: "#f0abfc" }, // violet -> fuchsia               ایندکس 3
  { from: "#67e8f9", to: "#93c5fd" }  // cyan -> blue                    ایندکس 4
];

const fontMap = {
  rounded: "'Trebuchet MS', sans-serif",
  serif: "Georgia, serif",
  mono: "'Courier New', monospace",
  verdana: "Verdana, sans-serif",
  playful: "'Comic Sans MS', cursive",
  times: "'Times New Roman', serif"
};

const STORAGE_KEY = "themeCustomizerState";

let state = {
  paletteIndex: 0,
  font: "rounded",
  radius: 20,
  shadow: 0,
  letterSpacing: 0,
  gradient: true
}


const previewBox = document.getElementById("preview-box");
const previewTitle = document.getElementById("preview-title");
const savedBadge = document.getElementById("saved-badge");
const paletteRow = document.getElementById("palette-row");
const fontSelect = document.getElementById("font-select");
const radiusSlider = document.getElementById("radius-slider");
const shadowSlider = document.getElementById("shadow-slider");
const letterSpacingSlider = document.getElementById("letterspacing-slider");
const modeSolidBtn = document.getElementById("mode-solid");
const modeGradientBtn = document.getElementById("mode-gradient");
const randomBtn = document.getElementById("random-btn");
const resetBtn = document.getElementById("reset-btn");

// ===== ذخیره و بازیابی از localStorage =====

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  showSavedBadge();
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    state = JSON.parse(saved);
  }
}

function showSavedBadge() {
  savedBadge.style.opacity = "1";
  setTimeout(() => {
    savedBadge.style.opacity = "0";
  }, 1000);
}

// ===== اعمال state روی preview =====

function applyState() {
  const palette = palettes[state.paletteIndex];

  if (state.gradient) {
    previewBox.style.background = `linear-gradient(135deg, ${palette.from}, ${palette.to})`;
  } else {
    previewBox.style.background = palette.from;
  }

  previewBox.style.borderRadius = state.radius + "px";
  previewBox.style.boxShadow =
    state.shadow > 0
      ? `0 ${state.shadow / 2}px ${state.shadow}px rgba(0,0,0,0.18)`
      : "none";
  previewBox.style.fontFamily = fontMap[state.font];

  previewTitle.style.letterSpacing = state.letterSpacing + "px";

  // آپدیت UI کنترل‌ها با مقدار state
  fontSelect.value = state.font;
  radiusSlider.value = state.radius;
  shadowSlider.value = state.shadow;
  letterSpacingSlider.value = state.letterSpacing;

  updateModeButtons();
  buildPalette();
}

function updateModeButtons() {
  if (state.gradient) {
    modeGradientBtn.classList.add("mode-btn-active");
    modeSolidBtn.classList.remove("mode-btn-active");
  } else {
    modeSolidBtn.classList.add("mode-btn-active");
    modeGradientBtn.classList.remove("mode-btn-active");
  }
}

// ===== ساخت داینامیک دایره‌های پالت رنگ =====

function buildPalette() {
  paletteRow.innerHTML = "";

  palettes.forEach((p, index) => {
    const swatch = document.createElement("div");
    swatch.className =
      "w-7 h-7 rounded-full cursor-pointer border-2 transition";
    swatch.style.background = `linear-gradient(135deg, ${p.from}, ${p.to})`;
    swatch.style.borderColor =
      index === state.paletteIndex ? "#4c1d95" : "transparent";

    swatch.addEventListener("click", () => {
      state.paletteIndex = index;
      applyState();
      saveState();
    });

    paletteRow.appendChild(swatch);
  });
}

// ===== Event listenerها =====

fontSelect.addEventListener("change", (e) => {
  state.font = e.target.value;
  applyState();
  saveState();
});

radiusSlider.addEventListener("input", (e) => {
  state.radius = parseInt(e.target.value);
  applyState();
});
radiusSlider.addEventListener("change", saveState);

shadowSlider.addEventListener("input", (e) => {
  state.shadow = parseInt(e.target.value);
  applyState();
});
shadowSlider.addEventListener("change", saveState);

letterSpacingSlider.addEventListener("input", (e) => {
  state.letterSpacing = parseFloat(e.target.value);
  applyState();
});
letterSpacingSlider.addEventListener("change", saveState);

modeSolidBtn.addEventListener("click", () => {
  state.gradient = false;
  applyState();
  saveState();
});

modeGradientBtn.addEventListener("click", () => {
  state.gradient = true;
  applyState();
  saveState();
});

randomBtn.addEventListener("click", () => {
  state.paletteIndex = Math.floor(Math.random() * palettes.length);
  state.radius = Math.floor(Math.random() * 41);
  state.shadow = Math.floor(Math.random() * 21) * 2;
  state.letterSpacing = Math.round(Math.random() * 12) / 2;
  state.gradient = Math.random() > 0.3;

  applyState();
  saveState();
});

resetBtn.addEventListener("click", () => {
  state = {
    paletteIndex: 0,
    font: "rounded",
    radius: 20,
    shadow: 0,
    letterSpacing: 0,
    gradient: true
  };

  applyState();
  saveState();
});

// ===== اجرای اولیه موقع باز شدن صفحه =====

loadState();
applyState();