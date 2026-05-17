// ============================================================================
// データ定義
// ============================================================================

const WALL_COLORS = [
  {
    id: "ivory",
    name: "アイボリー",
    value: "#f5f0e6",
    risks: { dirt: "高め", fade: "低め", streak: "やや高め", heat: "低め" },
    comment: "清潔感あり。雨だれや黒ずみに注意。",
    rating: "4.0"
  },
  {
    id: "beige",
    name: "ベージュ",
    value: "#d6c5aa",
    risks: { dirt: "低め", fade: "中", streak: "中", heat: "中" },
    comment: "汚れが目立ちにくい。失敗しにくい人気色。",
    rating: "4.5"
  },
  {
    id: "gray",
    name: "グレー",
    value: "#9ca3af",
    risks: { dirt: "中", fade: "やや高め", streak: "中", heat: "中" },
    comment: "落ち着いた印象。色味によって冷たく見える場合あり。",
    rating: "4.3"
  },
  {
    id: "charcoal",
    name: "チャコール",
    value: "#4b5563",
    risks: { dirt: "低め", fade: "やや高め", streak: "中", heat: "高め" },
    comment: "高級感あり。重たく見える場合あり。",
    rating: "4.2"
  },
  {
    id: "black",
    name: "ブラック",
    value: "#1f2937",
    risks: { dirt: "低め", fade: "高め", streak: "高め", heat: "非常に高め" },
    comment: "かっこいい。熱を持ちやすい。色褪せ注意。",
    rating: "3.8"
  },
  {
    id: "brown",
    name: "ブラウン",
    value: "#8b5e3c",
    risks: { dirt: "中", fade: "中", streak: "中", heat: "中" },
    comment: "温かみあり。暗すぎると重たい印象。",
    rating: "4.4"
  }
];

const ROOF_COLORS = [
  { id: "roof-darkgray", name: "ダークグレー", value: "#4f575f" },
  { id: "roof-black", name: "ブラック", value: "#1f2937" },
  { id: "roof-brown", name: "ブラウン", value: "#7c513d" },
  { id: "roof-slate", name: "スレート", value: "#6b7280" }
];

const SASH_COLORS = [
  { id: "sash-white", name: "ホワイト", value: "#f8fafc" },
  { id: "sash-brown", name: "ブラウン", value: "#6b4226" },
  { id: "sash-black", name: "ブラック", value: "#111827" },
  { id: "sash-silver", name: "シルバー", value: "#d1d5db" }
];

const FINISH_OPTIONS = [
  { id: "gloss", name: "艶あり", opacity: 0.24 },
  { id: "semi", name: "5分艶", opacity: 0.20 },
  { id: "matte", name: "3分艶", opacity: 0.16 },
  { id: "none", name: "艶なし", opacity: 0.10 }
];

const AI_THEMES = [
  {
    id: "luxury",
    name: "🏆 高級感",
    comment: "高級感があり人気の組み合わせ。新築のように見えます。",
    wall: "charcoal",
    roof: "roof-black",
    sash: "sash-black",
    finish: "gloss"
  },
  {
    id: "natural",
    name: "🌿 ナチュラル",
    comment: "自然で落ち着いた印象。周囲と調和しやすいです。",
    wall: "beige",
    roof: "roof-brown",
    sash: "sash-brown",
    finish: "matte"
  },
  {
    id: "modern",
    name: "🎨 モダン",
    comment: "洗練されたモダンな外観。スタイリッシュです。",
    wall: "gray",
    roof: "roof-darkgray",
    sash: "sash-black",
    finish: "semi"
  },
  {
    id: "calm",
    name: "😌 落ち着き",
    comment: "落ち着きのある穏やかな印象。家族向けです。",
    wall: "brown",
    roof: "roof-brown",
    sash: "sash-brown",
    finish: "matte"
  },
  {
    id: "popular",
    name: "⭐ 人気系",
    comment: "最も選ばれている組み合わせ。万能な選択肢です。",
    wall: "ivory",
    roof: "roof-darkgray",
    sash: "sash-brown",
    finish: "semi"
  }
];

// ============================================================================
// グローバル変数
// ============================================================================

let originalCanvas = null;
let processedCanvas = null;
let isShowingAfter = true;

let currentState = {
  wall: "ivory",
  roof: "roof-darkgray",
  sash: "sash-white",
  finish: "semi",
  originalImage: null
};

// ============================================================================
// DOM要素
// ============================================================================

const imageUpload = document.getElementById("imageUpload");
const imageStatus = document.getElementById("imageStatus");
const placeholderText = document.getElementById("placeholderText");
const previewCanvas = document.getElementById("previewCanvas");
const beforeAfterToggle = document.getElementById("beforeAfterToggle");

const wallColorGrid = document.getElementById("wallColorGrid");
const roofColorGrid = document.getElementById("roofColorGrid");
const sashColorGrid = document.getElementById("sashColorGrid");
const finishGrid = document.getElementById("finishGrid");

const wallSwatchDisplay = document.getElementById("wallSwatchDisplay");
const roofSwatchDisplay = document.getElementById("roofSwatchDisplay");
const sashSwatchDisplay = document.getElementById("sashSwatchDisplay");
const finishSwatchDisplay = document.getElementById("finishSwatchDisplay");

const wallColorDisplay = document.getElementById("wallColorDisplay");
const roofColorDisplay = document.getElementById("roofColorDisplay");
const sashColorDisplay = document.getElementById("sashColorDisplay");
const finishDisplay = document.getElementById("finishDisplay");

const riskList = document.getElementById("riskList");
const siteFeedback = document.getElementById("siteFeedback");
const comboAdvice = document.getElementById("comboAdvice");

const saveName = document.getElementById("saveName");
const savePatternBtn = document.getElementById("savePatternBtn");
const copyShareUrlBtn = document.getElementById("copyShareUrlBtn");
const savedPatternsList = document.getElementById("savedPatternsList");

const themeGrid = document.getElementById("themeGrid");
const themeComment = document.getElementById("themeComment");

// ============================================================================
// 初期化
// ============================================================================

function init() {
  renderWallColors();
  renderRoofColors();
  renderSashColors();
  renderFinishOptions();
  renderThemes();
  setupEventListeners();
  updateDisplay();
  loadSavedPatterns();
}

// ============================================================================
// ボタン描画
// ============================================================================

function renderWallColors() {
  wallColorGrid.innerHTML = "";
  WALL_COLORS.forEach(color => {
    const btn = document.createElement("button");
    btn.className = "color-button";
    btn.textContent = color.name;
    btn.style.background = "linear-gradient(180deg, " + color.value + " 0%, rgba(255,255,255,0.06) 100%)";
    btn.onclick = () => { selectWallColor(color.id); };
    if (currentState.wall === color.id) btn.classList.add("selected");
    wallColorGrid.appendChild(btn);
  });
}

function renderRoofColors() {
  roofColorGrid.innerHTML = "";
  ROOF_COLORS.forEach(color => {
    const btn = document.createElement("button");
    btn.className = "option-button";
    btn.textContent = color.name;
    btn.style.background = color.value;
    btn.onclick = () => { selectRoofColor(color.id); };
    if (currentState.roof === color.id) btn.classList.add("selected");
    roofColorGrid.appendChild(btn);
  });
}

function renderSashColors() {
  sashColorGrid.innerHTML = "";
  SASH_COLORS.forEach(color => {
    const btn = document.createElement("button");
    btn.className = "option-button";
    btn.textContent = color.name;
    btn.style.background = color.value;
    btn.onclick = () => { selectSashColor(color.id); };
    if (currentState.sash === color.id) btn.classList.add("selected");
    sashColorGrid.appendChild(btn);
  });
}

function renderFinishOptions() {
  finishGrid.innerHTML = "";
  FINISH_OPTIONS.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "finish-button";
    btn.textContent = option.name;
    btn.onclick = () => { selectFinish(option.id); };
    if (currentState.finish === option.id) btn.classList.add("selected");
    finishGrid.appendChild(btn);
  });
}

function renderThemes() {
  themeGrid.innerHTML = "";
  AI_THEMES.forEach(theme => {
  // スマホ向け: accept="image/*" を前提に、MIME が image/ なら許可
  const lowerName = (file.name || '').toLowerCase();
  const allowedExt = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];
  const hasValidExt = allowedExt.some(ext => lowerName.endsWith(ext));
  const isImageMime = file.type && file.type.startsWith('image/');

  if (!isImageMime && !hasValidExt) {
    imageStatus.textContent = "対応形式: JPG / PNG / WEBP / HEIC の画像を選んでください";
    imageStatus.classList.remove("success");
    imageStatus.classList.add("error");
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      currentState.originalImage = img;
      originalCanvas = createCanvasFromImage(img);
      processedCanvas = createCanvasFromImage(img);

      // 描画
      placeholderText.style.display = "none";
      imageStatus.textContent = "写真を読み込みました";
      imageStatus.classList.remove("error");
      imageStatus.classList.add("success");
      beforeAfterToggle.style.display = "block";
      redrawCanvas();
      console.log("写真をアップロード:", img.width, "x", img.height);
    };
    img.onerror = () => {
      imageStatus.textContent = "写真を読み込めませんでした。別の画像を選んでください。";
      imageStatus.classList.remove("success");
      imageStatus.classList.add("error");
      beforeAfterToggle.style.display = "none";
      placeholderText.style.display = "block";
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      currentState.originalImage = img;
      originalCanvas = createCanvasFromImage(img);
      processedCanvas = createCanvasFromImage(img);

      // 描画
      placeholderText.style.display = "none";
      imageStatus.textContent = "写真を読み込みました";
      imageStatus.classList.remove("error");
      imageStatus.classList.add("success");
      beforeAfterToggle.style.display = "block";
      redrawCanvas();
      console.log("写真をアップロード:", img.width, "x", img.height);
    };
    img.onerror = () => {
      imageStatus.textContent = "写真の読み込みに失敗しました";
      imageStatus.classList.remove("success");
      imageStatus.classList.add("error");
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function createCanvasFromImage(img) {
  const canvas = document.createElement("canvas");
  const maxW = 1100;
  const maxH = 800;
  const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
  canvas.width = Math.round(img.width * ratio);
  canvas.height = Math.round(img.height * ratio);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

// ============================================================================
// キャンバス描画
// ============================================================================

function redrawCanvas() {
  if (!originalCanvas) return;

  // 元画像をコピー
  const ctx = previewCanvas.getContext("2d");
  previewCanvas.width = originalCanvas.width;
  previewCanvas.height = originalCanvas.height;
  
  ctx.drawImage(originalCanvas, 0, 0);

  if (isShowingAfter) {
    // 外壁色を適用
    const wallColor = WALL_COLORS.find(c => c.id === currentState.wall);
    const roofColor = ROOF_COLORS.find(c => c.id === currentState.roof);
    const finish = FINISH_OPTIONS.find(f => f.id === currentState.finish);

    if (wallColor && finish) {
      applyColorOverlay(previewCanvas, wallColor.value, finish.opacity);
      applyFinishEffect(previewCanvas, finish.id);
    }
  }
}

function applyColorOverlay(canvas, color, opacity) {
  const ctx = canvas.getContext("2d");
  // 色を乗せる。multiply 合成で写真のディテールを残す
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function applyFinishEffect(canvas, finishId) {
  const ctx = canvas.getContext('2d');
  // 艶感を簡易表現: 艶ありはスクリーンで白いハイライトを少し乗せる
  ctx.save();
  if (finishId === 'gloss') {
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.08;
    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    g.addColorStop(0, 'rgba(255,255,255,0.18)');
    g.addColorStop(1, 'rgba(255,255,255,0.02)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (finishId === 'semi') {
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (finishId === 'matte') {
    // 少しコントラストを落として落ち着かせる
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = 0.04;
    ctx.fillStyle = 'rgba(0,0,0,0.02)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    // 艶なし: ほぼ変更なし
  }
  ctx.restore();
}

function toggleBeforeAfter() {
  isShowingAfter = !isShowingAfter;
  beforeAfterToggle.textContent = isShowingAfter ? "ビフォーを見る" : "アフターを見る";
  redrawCanvas();
}

// ============================================================================
// 色選択
// ============================================================================

function selectWallColor(colorId) {
  currentState.wall = colorId;
  updateDisplay();
  renderWallColors();
  redrawCanvas();
}

function selectRoofColor(colorId) {
  currentState.roof = colorId;
  updateDisplay();
  renderRoofColors();
  redrawCanvas();
}

function selectSashColor(colorId) {
  currentState.sash = colorId;
  updateDisplay();
  renderSashColors();
  redrawCanvas();
}

function selectFinish(finishId) {
  currentState.finish = finishId;
  updateDisplay();
  renderFinishOptions();
  redrawCanvas();
}

function applyTheme(theme) {
  currentState.wall = theme.wall;
  currentState.roof = theme.roof;
  currentState.sash = theme.sash;
  currentState.finish = theme.finish;
  
  themeComment.textContent = theme.comment;
  
  updateDisplay();
  renderWallColors();
  renderRoofColors();
  renderSashColors();
  renderFinishOptions();
  redrawCanvas();
}

// ============================================================================
// 表示更新
// ============================================================================

function updateDisplay() {
  const wallColor = WALL_COLORS.find(c => c.id === currentState.wall);
  const roofColor = ROOF_COLORS.find(c => c.id === currentState.roof);
  const sashColor = SASH_COLORS.find(c => c.id === currentState.sash);
  const finish = FINISH_OPTIONS.find(f => f.id === currentState.finish);

  // 色スワッチ
  if (wallColor) {
    wallSwatchDisplay.style.backgroundColor = wallColor.value;
    wallColorDisplay.textContent = wallColor.name;
  }
  if (roofColor) {
    roofSwatchDisplay.style.backgroundColor = roofColor.value;
    roofColorDisplay.textContent = roofColor.name;
  }
  if (sashColor) {
    sashSwatchDisplay.style.backgroundColor = sashColor.value;
    sashColorDisplay.textContent = sashColor.name;
  }
  if (finish) {
    finishSwatchDisplay.style.backgroundColor = "#e0e0e0";
    finishSwatchDisplay.textContent = finish.name;
    finishDisplay.textContent = finish.name;
  }

  // リスク表示
  if (wallColor) {
    updateRiskDisplay(wallColor);
    siteFeedback.textContent = wallColor.comment;
  }

  // 配色相性診断
  updateComboAdvice();
}

function updateRiskDisplay(wallColor) {
  riskList.innerHTML = "";
  
  const risks = [
    { label: "雨だれ", risk: wallColor.risks.streak },
    { label: "黒ずみ", risk: wallColor.risks.dirt },
    { label: "色褪せ", risk: wallColor.risks.fade },
    { label: "熱の持ちやすさ", risk: wallColor.risks.heat }
  ];

  // おすすめ度を必ず表示
  if (wallColor.rating) {
    risks.push({ label: "おすすめ度", risk: wallColor.rating + " /5" });
  }

  risks.forEach(r => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${r.label}:</strong> ${r.risk}`;
    riskList.appendChild(li);
  });
}

function updateComboAdvice() {
  const wallColor = WALL_COLORS.find(c => c.id === currentState.wall);
  const roofColor = ROOF_COLORS.find(c => c.id === currentState.roof);
  const sashColor = SASH_COLORS.find(c => c.id === currentState.sash);

  let advice = "✓ ";
  
  if (wallColor && wallColor.id === "black") {
    advice += "ブラックは高級感が出ますが、熱に注意してください。";
  } else if (wallColor && wallColor.id === "ivory") {
    advice += "アイボリーは明るく優しい印象です。雨だれ対策をお勧めします。";
  } else {
    advice += "バランスの取れた配色です。外観が一体感を持ちます。";
  }

  comboAdvice.textContent = advice;
}

// ============================================================================
// 保存・共有
// ============================================================================

function savePattern() {
  const name = saveName.value.trim();
  if (!name) {
    alert("保存名を入力してください");
    return;
  }

  const patterns = JSON.parse(localStorage.getItem("wallPatterns") || "[]");
  patterns.push({
    id: Date.now(),
    name,
    wall: currentState.wall,
    roof: currentState.roof,
    sash: currentState.sash,
    finish: currentState.finish
  });
  
  localStorage.setItem("wallPatterns", JSON.stringify(patterns));
  saveName.value = "";
  loadSavedPatterns();
  alert("保存しました！");
}

function loadSavedPatterns() {
  const patterns = JSON.parse(localStorage.getItem("wallPatterns") || "[]");
  savedPatternsList.innerHTML = "";

  if (patterns.length === 0) {
    savedPatternsList.innerHTML = "<p style='color: #999;'>保存されたパターンはありません</p>";
    return;
  }

  patterns.forEach(pattern => {
    const wallColor = WALL_COLORS.find(c => c.id === pattern.wall);
    const roofColor = ROOF_COLORS.find(c => c.id === pattern.roof);
    const sashColor = SASH_COLORS.find(c => c.id === pattern.sash);

    const card = document.createElement("div");
    card.className = "pattern-card";
    card.innerHTML = `
      <p class="pattern-card-name">${pattern.name}</p>
      <div class="pattern-preview">
        <div class="pattern-color" style="background-color: ${wallColor.value};"></div>
        <div class="pattern-color" style="background-color: ${roofColor.value};"></div>
        <div class="pattern-color" style="background-color: ${sashColor.value};"></div>
      </div>
      <div class="pattern-actions">
        <button class="pattern-load" onclick="loadPattern(${pattern.id})">読み込む</button>
        <button class="pattern-delete" onclick="deletePattern(${pattern.id})">削除</button>
      </div>
    `;
    savedPatternsList.appendChild(card);
  });
}

function loadPattern(id) {
  const patterns = JSON.parse(localStorage.getItem("wallPatterns") || "[]");
  const pattern = patterns.find(p => p.id === id);
  if (pattern) {
    currentState.wall = pattern.wall;
    currentState.roof = pattern.roof;
    currentState.sash = pattern.sash;
    currentState.finish = pattern.finish;
    updateDisplay();
    renderWallColors();
    renderRoofColors();
    renderSashColors();
    renderFinishOptions();
    redrawCanvas();
  }
}

function deletePattern(id) {
  if (confirm("削除してもよろしいですか？")) {
    let patterns = JSON.parse(localStorage.getItem("wallPatterns") || "[]");
    patterns = patterns.filter(p => p.id !== id);
    localStorage.setItem("wallPatterns", JSON.stringify(patterns));
    loadSavedPatterns();
  }
}

function copyShareUrl() {
  const url = `${window.location.origin}${window.location.pathname}?wall=${currentState.wall}&roof=${currentState.roof}&sash=${currentState.sash}&finish=${currentState.finish}`;
  navigator.clipboard.writeText(url).then(() => {
    alert("URLをコピーしました！");
  }).catch(() => {
    alert("コピーに失敗しました");
  });
}

// ============================================================================
// URLパラメータから復元
// ============================================================================

function loadFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("wall")) currentState.wall = params.get("wall");
  if (params.has("roof")) currentState.roof = params.get("roof");
  if (params.has("sash")) currentState.sash = params.get("sash");
  if (params.has("finish")) currentState.finish = params.get("finish");
  
  updateDisplay();
  renderWallColors();
  renderRoofColors();
  renderSashColors();
  renderFinishOptions();
}

// ============================================================================
// 起動
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  loadFromUrl();
  init();
});
