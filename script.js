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
let maskCanvas = null;      // マスク用キャンバス
let isShowingAfter = true;
let isDrawingMode = false;  // ペイントモード中フラグ
let isDrawing = false;      // 描画中フラグ

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
const previewImage = document.getElementById("previewImage");
const previewCanvas = document.getElementById("previewCanvas");
const drawingCanvas = document.getElementById("drawingCanvas");
const drawingHint = document.getElementById("drawingHint");
const beforeAfterToggle = document.getElementById("beforeAfterToggle");
const startDrawBtn = document.getElementById("startDrawBtn");
const stopDrawBtn = document.getElementById("stopDrawBtn");
const resetMaskBtn = document.getElementById("resetMaskBtn");

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
  console.log('[init] ========== init() START ==========');
  
  console.log('[init] About to call renderWallColors()');
  renderWallColors();
  console.log('[init] renderWallColors() completed');
  console.log('[init] wallColorGrid.childElementCount:', wallColorGrid ? wallColorGrid.childElementCount : 'NULL');
  
  renderRoofColors();
  renderSashColors();
  renderFinishOptions();
  renderThemes();
  setupEventListeners();
  updateDisplay();
  loadSavedPatterns();
  
  console.log('[init] ========== init() END ==========');
}

// ============================================================================
// ボタン描画
// ============================================================================

function renderWallColors() {
  console.log('[render] renderWallColors called');
  console.log('[render] wallColorGrid:', wallColorGrid);
  console.log('[render] wallColorGrid is null?', wallColorGrid === null);
  console.log('[render] wallColorGrid is undefined?', wallColorGrid === undefined);
  
  if (!wallColorGrid) {
    console.error('[render] ERROR: wallColorGrid is null/undefined!');
    return;
  }
  
  console.log('[render] WALL_COLORS.length:', WALL_COLORS.length);
  wallColorGrid.innerHTML = "";
  console.log('[render] After innerHTML="", childElementCount:', wallColorGrid.childElementCount);
  
  let buttonCount = 0;
  WALL_COLORS.forEach(color => {
    console.log('[render] Creating button for:', color.id);
    const btn = document.createElement("button");
    btn.className = "color-button";
    btn.textContent = color.name;
    btn.style.background = "linear-gradient(180deg, " + color.value + " 0%, rgba(255,255,255,0.06) 100%)";
    btn.onclick = () => { selectWallColor(color.id); };
    if (currentState.wall === color.id) btn.classList.add("selected");
    
    wallColorGrid.appendChild(btn);
    buttonCount++;
    console.log('[render] Button added, total buttons:', buttonCount, 'childElementCount:', wallColorGrid.childElementCount);
  });
  
  console.log('[render] renderWallColors completed. Final childElementCount:', wallColorGrid.childElementCount);
  console.log('[render] wallColorGrid.innerHTML length:', wallColorGrid.innerHTML.length);
  console.log('[render] wallColorGrid.innerHTML preview:', wallColorGrid.innerHTML.substring(0, 100));
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
    const btn = document.createElement("button");
    btn.className = "theme-button";
    btn.textContent = theme.name;
    btn.onclick = () => { applyTheme(theme); };
    themeGrid.appendChild(btn);
  });
}

// ============================================================================
// イベント設定と画像アップロード処理
// ============================================================================

function setupEventListeners() {
  console.log('[app] setupEventListeners()');
  console.log('[el] imageSelectBtn present?', !!document.getElementById('imageSelectBtn'));
  console.log('[el] imageUpload present?', !!document.getElementById('imageUpload'));
  try {
    const btnEl = document.getElementById('imageSelectBtn');
    if (btnEl) console.log('[el] imageSelectBtn rect', btnEl.getBoundingClientRect());
  } catch (e) {
    console.log('[el] getBoundingClientRect error', e);
  }
  // 写真アップロード処理
  const imageSelectBtn = document.getElementById('imageSelectBtn');
  if (imageSelectBtn && imageUpload) {
    imageSelectBtn.addEventListener('click', () => {
      console.log('[upload] imageSelectBtn clicked');
      imageUpload.click();
    });
  }
  
  if (imageUpload) {
    imageUpload.addEventListener('change', (event) => {
      console.log('[upload] imageUpload change event');
      const file = event.target.files[0];
      if (!file) return;

      console.log('[upload] file selected', file.name, file.type, file.size);

      const reader = new FileReader();

      reader.onload = () => {
        console.log('[upload] FileReader.onload');
        // 画像をstateに保存
        currentState.originalImage = reader.result;
        
        // プレビュー画像に表示
        if (previewImage) {
          previewImage.src = reader.result;
          previewImage.style.display = 'block';
        }
        
        // 他のキャンバスは隠す
        if (drawingCanvas) drawingCanvas.style.display = 'none';
        if (previewCanvas) previewCanvas.style.display = 'none';
        
        // プレースホルダーを隠す
        if (placeholderText) placeholderText.style.display = 'none';
        if (drawingHint) drawingHint.style.display = 'none';
        
        // ステータスを更新
        if (imageStatus) {
          imageStatus.textContent = '写真を読み込みました';
          imageStatus.classList.remove('error');
          imageStatus.classList.add('success');
        }
        
        // 後処理：canvasに画像を読み込む
        const img = new Image();
        img.onload = () => {
          console.log('[upload] img.onload', img.width, img.height);
          originalCanvas = createCanvasFromImage(img);
          processedCanvas = createCanvasFromImage(img);
          maskCanvas = document.createElement('canvas');
          maskCanvas.width = originalCanvas.width;
          maskCanvas.height = originalCanvas.height;
          
          // ボタンを表示
          if (startDrawBtn) startDrawBtn.style.display = 'inline-flex';
          if (beforeAfterToggle) beforeAfterToggle.style.display = 'inline-flex';
        };
        img.src = reader.result;
      };

      reader.onerror = () => {
        console.log('[upload] FileReader error', reader.error);
        if (imageStatus) {
          imageStatus.textContent = '写真を読み込めませんでした。別の画像を選んでください。';
          imageStatus.classList.remove('success');
          imageStatus.classList.add('error');
        }
      };

      reader.readAsDataURL(file);
    });
  }
  
  // その他のイベントリスナー
  if (beforeAfterToggle) beforeAfterToggle.addEventListener('click', toggleBeforeAfter);
  if (startDrawBtn) startDrawBtn.addEventListener('click', startDrawingMode);
  if (stopDrawBtn) stopDrawBtn.addEventListener('click', stopDrawingMode);
  if (resetMaskBtn) resetMaskBtn.addEventListener('click', resetMask);
  if (savePatternBtn) savePatternBtn.addEventListener('click', savePattern);
  if (copyShareUrlBtn) copyShareUrlBtn.addEventListener('click', copyShareUrl);
  
  // ペイント用キャンバスのイベント
  if (drawingCanvas) {
    drawingCanvas.addEventListener('touchstart', handleCanvasTouchStart, false);
    drawingCanvas.addEventListener('touchmove', handleCanvasTouchMove, false);
    drawingCanvas.addEventListener('touchend', handleCanvasTouchEnd, false);
    drawingCanvas.addEventListener('mousedown', handleCanvasMouseDown, false);
    drawingCanvas.addEventListener('mousemove', handleCanvasMouseMove, false);
    drawingCanvas.addEventListener('mouseup', handleCanvasMouseUp, false);
    drawingCanvas.addEventListener('mouseleave', handleCanvasMouseUp, false);
  }
}

function handleImageUpload(e) {
  const file = (e && e.target && e.target.files && e.target.files[0]) || null;
  if (!file) return;

  const lowerName = (file.name || '').toLowerCase();
  const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];
  const hasValidExt = allowedExt.some(ext => lowerName.endsWith(ext));
  const isImageMime = file.type && file.type.startsWith('image/');

  if (!isImageMime && !hasValidExt) {
    imageStatus.textContent = "対応形式: JPG / PNG / WEBP の画像を選んでください";
    imageStatus.classList.remove('success');
    imageStatus.classList.add('error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    const dataUrl = ev.target.result;

    const img = new Image();
    img.onload = () => {
      // 画像情報を保存
      currentState.originalImage = img;
      originalCanvas = createCanvasFromImage(img);
      processedCanvas = createCanvasFromImage(img);
      maskCanvas = document.createElement('canvas');
      maskCanvas.width = originalCanvas.width;
      maskCanvas.height = originalCanvas.height;
      
      // previewImage に表示（即座に表示される）
      if (previewImage) {
        previewImage.src = dataUrl;
        previewImage.style.display = 'block';
      }
      
      // その他のキャンバスは隠す
      if (drawingCanvas) drawingCanvas.style.display = 'none';
      if (previewCanvas) previewCanvas.style.display = 'none';
      
      // プレースホルダーを隠す
      placeholderText.style.display = 'none';
      drawingHint.style.display = 'none';
      
      // ステータスを更新
      imageStatus.textContent = '写真を読み込みました';
      imageStatus.classList.remove('error');
      imageStatus.classList.add('success');
      
      // ペイントボタンと操作ボタンを表示
      if (startDrawBtn) startDrawBtn.style.display = 'inline-flex';
      if (beforeAfterToggle) beforeAfterToggle.style.display = 'inline-flex';
    };
    
    img.onerror = () => {
      // 画像読み込み失敗時
      if (previewImage) previewImage.style.display = 'none';
      if (drawingCanvas) drawingCanvas.style.display = 'none';
      if (previewCanvas) previewCanvas.style.display = 'none';
      placeholderText.style.display = 'block';
      imageStatus.textContent = '写真を読み込めませんでした。別の画像を選んでください。';
      imageStatus.classList.remove('success');
      imageStatus.classList.add('error');
    };
    
    img.src = dataUrl;
  };
  
  reader.onerror = () => {
    imageStatus.textContent = '写真を読み込めませんでした。別の画像を選んでください。';
    imageStatus.classList.remove('success');
    imageStatus.classList.add('error');
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
// ペイント機能
// ============================================================================

function startDrawingMode() {
  if (!originalCanvas) return;
  
  isDrawingMode = true;
  
  // ペイント用キャンバスをセットアップ
  drawingCanvas.width = originalCanvas.width;
  drawingCanvas.height = originalCanvas.height;
  const ctx = drawingCanvas.getContext('2d');
  ctx.drawImage(originalCanvas, 0, 0);
  
  // マスク画像があれば、その選択部分を半透明で表示
  if (maskCanvas) {
    ctx.fillStyle = 'rgba(100, 150, 255, 0.15)';
    ctx.drawImage(maskCanvas, 0, 0);
  }
  
  if (previewImage) previewImage.style.display = 'none';
  previewCanvas.style.display = 'none';
  drawingCanvas.style.display = 'block';
  drawingHint.style.display = 'block';
  placeholderText.style.display = 'none';
  
  startDrawBtn.style.display = 'none';
  stopDrawBtn.style.display = 'inline-flex';
  resetMaskBtn.style.display = 'inline-flex';
}

function stopDrawingMode() {
  isDrawingMode = false;
  isDrawing = false;
  
  drawingCanvas.style.display = 'none';
  drawingHint.style.display = 'none';
  if (previewImage) previewImage.style.display = 'none';
  previewCanvas.style.display = 'block';
  redrawCanvas();
  
  startDrawBtn.style.display = 'inline-flex';
  stopDrawBtn.style.display = 'none';
  resetMaskBtn.style.display = 'inline-flex';
}

function resetMask() {
  if (maskCanvas) {
    const ctx = maskCanvas.getContext('2d');
    ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
  }
  
  if (isDrawingMode) {
    // ペイントモード中なら、描画キャンバスをリセット
    const ctx = drawingCanvas.getContext('2d');
    ctx.drawImage(originalCanvas, 0, 0);
  } else {
    // プレビューを再描画
    redrawCanvas();
  }
}

// マウスイベント
function handleCanvasMouseDown(e) {
  if (!isDrawingMode) return;
  isDrawing = true;
  const rect = drawingCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const ctx = drawingCanvas.getContext('2d');
  ctx.beginPath();
  ctx.moveTo(x, y);
  
  // maskCanvas のパスも開始
  if (maskCanvas) {
    const maskCtx = maskCanvas.getContext('2d');
    maskCtx.beginPath();
    maskCtx.moveTo(x, y);
  }
}

function handleCanvasMouseMove(e) {
  if (!isDrawing) return;
  const rect = drawingCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const ctx = drawingCanvas.getContext('2d');
  ctx.strokeStyle = 'rgba(200, 200, 255, 0.8)';
  ctx.lineWidth = 45;  // 面のように塗る感覚の太いブラシ
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineTo(x, y);
  ctx.stroke();
  
  // maskCanvas にも同じ線を描く
  if (maskCanvas) {
    const maskCtx = maskCanvas.getContext('2d');
    maskCtx.strokeStyle = 'rgba(255, 255, 255, 1)';
    maskCtx.lineWidth = 45;  // 面のように塗る感覚の太いブラシ
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';
    maskCtx.lineTo(x, y);
    maskCtx.stroke();
  }
}

function handleCanvasMouseUp() {
  isDrawing = false;
}

// タッチイベント
function handleCanvasTouchStart(e) {
  if (!isDrawingMode) return;
  e.preventDefault();
  isDrawing = true;
  const rect = drawingCanvas.getBoundingClientRect();
  const touch = e.touches[0];
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  const ctx = drawingCanvas.getContext('2d');
  ctx.beginPath();
  ctx.moveTo(x, y);
  
  // maskCanvas のパスも開始
  if (maskCanvas) {
    const maskCtx = maskCanvas.getContext('2d');
    maskCtx.beginPath();
    maskCtx.moveTo(x, y);
  }
}

function handleCanvasTouchMove(e) {
  if (!isDrawing) return;
  e.preventDefault();
  const rect = drawingCanvas.getBoundingClientRect();
  const touch = e.touches[0];
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  const ctx = drawingCanvas.getContext('2d');
  ctx.strokeStyle = 'rgba(200, 200, 255, 0.8)';
  ctx.lineWidth = 45;  // 面のように塗る感覚の太いブラシ
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineTo(x, y);
  ctx.stroke();
  
  // maskCanvas にも同じ線を描く
  if (maskCanvas) {
    const maskCtx = maskCanvas.getContext('2d');
    maskCtx.strokeStyle = 'rgba(255, 255, 255, 1)';
    maskCtx.lineWidth = 45;  // 面のように塗る感覚の太いブラシ
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';
    maskCtx.lineTo(x, y);
    maskCtx.stroke();
  }
}

function handleCanvasTouchEnd(e) {
  if (!isDrawing) return;
  e.preventDefault();
  isDrawing = false;
}

function redrawCanvas() {
  console.log('[redraw] redrawCanvas() called');
  if (!originalCanvas) {
    console.log('[redraw] originalCanvas is null');
    return;
  }

  // previewCanvas を表示、previewImage を隠す
  if (previewImage) previewImage.style.display = 'none';
  previewCanvas.style.display = 'block';

  // 元画像をコピー
  const ctx = previewCanvas.getContext("2d");
  previewCanvas.width = originalCanvas.width;
  previewCanvas.height = originalCanvas.height;
  ctx.drawImage(originalCanvas, 0, 0);
  
  // マスク診断
  if (maskCanvas) {
    const maskCtx = maskCanvas.getContext('2d');
    const maskImageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    const maskData = maskImageData.data;
    let opaquePixels = 0;
    for (let i = 3; i < maskData.length; i += 4) {
      if (maskData[i] > 10) opaquePixels++;
    }
    const maskRate = ((opaquePixels / (maskData.length / 4)) * 100).toFixed(1);
    console.log(`[redraw] マスク状態: ${opaquePixels} pixels (${maskRate}% of canvas)`);
  } else {
    console.log('[redraw] maskCanvas is null');
  }

  console.log(`[redraw] isShowingAfter=${isShowingAfter}, maskCanvas=${maskCanvas ? 'exists' : 'null'}`);
  if (isShowingAfter && maskCanvas) {
    console.log('[redraw] Entering color apply block');
    // マスク部分だけに色を反映
    const wallColor = WALL_COLORS.find(c => c.id === currentState.wall);
    const finish = FINISH_OPTIONS.find(f => f.id === currentState.finish);
    console.log(`[redraw] wallColor=${wallColor ? wallColor.id : 'not found'}, finish=${finish ? finish.id : 'not found'}`);

    if (wallColor && finish) {
      console.log('[redraw] Calling applyColorOverlayWithMask()');
      applyColorOverlayWithMask(previewCanvas, maskCanvas, wallColor.value, finish.opacity);
      applyFinishEffectWithMask(previewCanvas, maskCanvas, finish.id);
    } else {
      console.log('[redraw] wallColor or finish is missing');
    }
  } else {
    console.log('[redraw] Skipping color apply (isShowingAfter or maskCanvas condition not met)');
  }
}

function applyColorOverlayWithMask(canvas, mask, color, opacity) {
  console.log('[mask] applyColorOverlayWithMask() called');
  console.log(`[mask] canvas=${canvas.width}x${canvas.height}, mask=${mask.width}x${mask.height}, color=${color}, opacity=${opacity}`);
  
  const ctx = canvas.getContext("2d");
  const maskCtx = mask.getContext('2d');
  
  // マスクの画像データを取得
  const maskImageData = maskCtx.getImageData(0, 0, mask.width, mask.height);
  const maskData = maskImageData.data;
  console.log(`[mask] maskData.length=${maskData.length}`);
  
  // キャンバスの画像データを取得
  const canvasImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const canvasData = canvasImageData.data;
  
  // 色を RGB に分解
  const rgb = hexToRgb(color);
  console.log(`[mask] RGB=${rgb.r},${rgb.g},${rgb.b}`);
  
  // マスク診断ログ
  let opaquePixels = 0;
  let totalPixels = maskData.length / 4;
  for (let i = 3; i < maskData.length; i += 4) {
    if (maskData[i] > 10) opaquePixels++;
  }
  const maskRate = ((opaquePixels / totalPixels) * 100).toFixed(1);
  console.log(`[mask] 不透明ピクセル: ${opaquePixels} / ${totalPixels} (${maskRate}%)`);
  
  // マスク領域に色を乗せる（multiply 合成の近似）
  let appliedPixels = 0;
  for (let i = 0; i < maskData.length; i += 4) {
    const maskAlpha = maskData[i + 3]; // マスクのアルファ値
    if (maskAlpha > 10) {
      appliedPixels++;
      // この部分は選択されている
      const pixelIdx = i;
      const origR = canvasData[pixelIdx];
      const origG = canvasData[pixelIdx + 1];
      const origB = canvasData[pixelIdx + 2];
      
      // multiply 合成: 元の色 × 新しい色
      canvasData[pixelIdx] = Math.round(origR * rgb.r / 255);
      canvasData[pixelIdx + 1] = Math.round(origG * rgb.g / 255);
      canvasData[pixelIdx + 2] = Math.round(origB * rgb.b / 255);
      
      // opacity でアルファを調整
      const alpha = canvasData[pixelIdx + 3];
      canvasData[pixelIdx + 3] = Math.min(255, alpha + (255 * opacity * maskAlpha / 255));
    }
  }
  console.log(`[mask] 色適用ピクセル: ${appliedPixels}`);
  
  ctx.putImageData(canvasImageData, 0, 0);
  console.log(`[mask] 色適用完了: ${color} opacity=${opacity}`);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function applyFinishEffectWithMask(canvas, mask, finishId) {
  const ctx = canvas.getContext('2d');
  const maskCtx = mask.getContext('2d');
  
  const maskImageData = maskCtx.getImageData(0, 0, mask.width, mask.height);
  const maskData = maskImageData.data;
  
  const canvasImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const canvasData = canvasImageData.data;
  
  let highlightR, highlightG, highlightB, highlightAlpha = 0;
  
  if (finishId === 'gloss') {
    highlightR = 255; highlightG = 255; highlightB = 255;
    highlightAlpha = 0.18;
  } else if (finishId === 'semi') {
    highlightR = 255; highlightG = 255; highlightB = 255;
    highlightAlpha = 0.08;
  } else if (finishId === 'matte') {
    highlightR = 0; highlightG = 0; highlightB = 0;
    highlightAlpha = 0.02;
  } else {
    return; // 艶なし
  }
  
  // マスク領域に艶効果を乗せる
  for (let i = 0; i < maskData.length; i += 4) {
    const maskAlpha = maskData[i + 3];
    if (maskAlpha > 0) {
      const pixelIdx = i;
      const origR = canvasData[pixelIdx];
      const origG = canvasData[pixelIdx + 1];
      const origB = canvasData[pixelIdx + 2];
      
      if (finishId === 'gloss' || finishId === 'semi') {
        // スクリーン合成（明るくする）
        canvasData[pixelIdx] = Math.round(Math.min(255, origR + (255 - origR) * highlightAlpha));
        canvasData[pixelIdx + 1] = Math.round(Math.min(255, origG + (255 - origG) * highlightAlpha));
        canvasData[pixelIdx + 2] = Math.round(Math.min(255, origB + (255 - origB) * highlightAlpha));
      } else if (finishId === 'matte') {
        // オーバーレイ合成（少し暗くする）
        canvasData[pixelIdx] = Math.round(origR * (1 - highlightAlpha));
        canvasData[pixelIdx + 1] = Math.round(origG * (1 - highlightAlpha));
        canvasData[pixelIdx + 2] = Math.round(origB * (1 - highlightAlpha));
      }
    }
  }
  
  ctx.putImageData(canvasImageData, 0, 0);
}

function toggleBeforeAfter() {
  isShowingAfter = !isShowingAfter;
  beforeAfterToggle.textContent = isShowingAfter ? "ビフォーを見る" : "アフターを見る";
  if (!isDrawingMode) redrawCanvas();
}

// ============================================================================
// 色選択
// ============================================================================

function selectWallColor(colorId) {
  console.log(`[select] selectWallColor(${colorId})`);
  currentState.wall = colorId;
  isShowingAfter = true;
  console.log(`[select] isShowingAfter=${isShowingAfter}`);
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
