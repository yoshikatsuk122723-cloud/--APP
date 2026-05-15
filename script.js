const imageUpload = document.getElementById("imageUpload");
const previewImage = document.getElementById("previewImage");
const imagePreview = document.getElementById("imagePreview");
const beforeAfterToggle = document.getElementById("beforeAfterToggle");
const wallColorOptions = document.getElementById("wallColorOptions");
const roofColorOptions = document.getElementById("roofColorOptions");
const sashColorOptions = document.getElementById("sashColorOptions");
const finishButtons = document.getElementById("finishOptions");
const selectedWallSwatch = document.getElementById("selectedWallSwatch");
const selectedRoofSwatch = document.getElementById("selectedRoofSwatch");
const selectedSashSwatch = document.getElementById("selectedSashSwatch");
const selectedWallColorName = document.getElementById("selectedWallColorName");
const selectedRoofColorName = document.getElementById("selectedRoofColorName");
const selectedSashColorName = document.getElementById("selectedSashColorName");
const colorAdvice = document.getElementById("colorAdvice");
const riskDirt = document.getElementById("riskDirt");
const riskFade = document.getElementById("riskFade");
const riskStreak = document.getElementById("riskStreak");
const impressionText = document.getElementById("impressionText");
const comboWarning = document.getElementById("comboWarning");
const summaryText = document.getElementById("summaryText");
const luxuryValue = document.getElementById("luxuryValue");
const customerComment = document.getElementById("customerComment");

const wallColors = [
  {
    id: "ivory",
    name: "アイボリー",
    value: "#f5f0e6",
    advice: "明るく柔らかい印象です。汚れや雨だれ跡はやや目立ちやすいので、実際の住宅写真と比べて確認しましょう。",
    risks: { dirt: "やや高め", fade: "低め", streak: "中" },
    luxury: "やや高め",
    impression: "高級感と柔らかさが両立します。"
  },
  {
    id: "beige",
    name: "ベージュ",
    value: "#d6c5aa",
    advice: "自然で落ち着いた色味です。直射日光で色褪せしやすいため、外観全体のバランスに注意してください。",
    risks: { dirt: "中", fade: "中", streak: "中" },
    luxury: "中程度",
    impression: "ナチュラルで親しみやすい印象です。"
  },
  {
    id: "gray",
    name: "グレー",
    value: "#9ca3af",
    advice: "モダンな雰囲気です。落ち着きがありますが、陰影で色味が変わるため、実際の光の当たり方も確認してください。",
    risks: { dirt: "中", fade: "中", streak: "やや高め" },
    luxury: "高め",
    impression: "モダンで洗練された雰囲気を作ります。"
  },
  {
    id: "charcoal",
    name: "チャコール",
    value: "#4b5563",
    advice: "重厚感のある色です。雨だれや光の反射で濃淡が出やすいので、しっかり確認してください。",
    risks: { dirt: "低め", fade: "やや高め", streak: "高め" },
    luxury: "高め",
    impression: "落ち着きと高級感が強い色です。"
  },
  {
    id: "black",
    name: "ブラック",
    value: "#1f2937",
    advice: "引き締まった印象です。汚れや色褪せが目立ちやすいので、お手入れ頻度も説明しましょう。",
    risks: { dirt: "高め", fade: "高め", streak: "高め" },
    luxury: "高め",
    impression: "高級感と重厚感がはっきりした印象です。"
  },
  {
    id: "brown",
    name: "ブラウン",
    value: "#8b5e3c",
    advice: "温かみがあり安心感のある色です。窓や屋根との相性を確認しやすい色です。",
    risks: { dirt: "中", fade: "中", streak: "中" },
    luxury: "中程度",
    impression: "ナチュラルで安心感のある雰囲気です。"
  }
];

const roofColors = [
  { id: "roof-darkgray", name: "ダークグレー", value: "#4f575f" },
  { id: "roof-black", name: "ブラック", value: "#1f2937" },
  { id: "roof-brown", name: "ブラウン", value: "#7c513d" },
  { id: "roof-slate", name: "スレート", value: "#6b7280" }
];

const sashColors = [
  { id: "sash-white", name: "ホワイト", value: "#f8fafc" },
  { id: "sash-brown", name: "ブラウン", value: "#6b4226" },
  { id: "sash-black", name: "ブラック", value: "#111827" },
  { id: "sash-silver", name: "シルバー", value: "#d1d5db" }
];

const finishOptions = [
  { id: "gloss", name: "艶あり", alpha: 0.24, note: "光をきれいに反射し、濃く高級感のある仕上がりになります。" },
  { id: "semi", name: "3分艶", alpha: 0.16, note: "自然な光沢で落ち着いた雰囲気になります。" },
  { id: "matte", name: "艶なし", alpha: 0.10, note: "光の反射が少なく、落ち着いたマットな質感です。" }
];

let selectedWallColor = wallColors[0];
let selectedRoofColor = roofColors[0];
let selectedSashColor = sashColors[0];
let selectedFinish = finishOptions[0];
let isAfterView = true;

function createButtons(list, container, buttonClass, onClick) {
  list.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = buttonClass;
    button.textContent = item.name;
    button.dataset.id = item.id;
    button.addEventListener("click", () => onClick(item.id));
    container.appendChild(button);
  });
}

function selectWallColor(id) {
  selectedWallColor = wallColors.find((item) => item.id === id) || wallColors[0];
  updateUI();
}

function selectRoofColor(id) {
  selectedRoofColor = roofColors.find((item) => item.id === id) || roofColors[0];
  updateUI();
}

function selectSashColor(id) {
  selectedSashColor = sashColors.find((item) => item.id === id) || sashColors[0];
  updateUI();
}

function selectFinish(id) {
  selectedFinish = finishOptions.find((item) => item.id === id) || finishOptions[0];
  updateFinishUI();
}

function updateFinishUI() {
  document.querySelectorAll(".finish-button").forEach((button) => {
    button.classList.toggle("selected", button.dataset.id === selectedFinish.id);
  });
  updateUI();
}

function updateUI() {
  document.querySelectorAll(".color-button").forEach((button) => {
    button.classList.toggle("selected", button.dataset.id === selectedWallColor.id);
  });
  document.querySelectorAll(".option-button").forEach((button) => {
    if (button.parentNode === roofColorOptions) {
      button.classList.toggle("selected", button.dataset.id === selectedRoofColor.id);
    } else {
      button.classList.toggle("selected", button.dataset.id === selectedSashColor.id);
    }
  });
  document.querySelectorAll(".finish-button").forEach((button) => {
    button.classList.toggle("selected", button.dataset.id === selectedFinish.id);
  });

  selectedWallSwatch.style.background = selectedWallColor.value;
  selectedRoofSwatch.style.background = selectedRoofColor.value;
  selectedSashSwatch.style.background = selectedSashColor.value;
  selectedWallColorName.textContent = selectedWallColor.name;
  selectedRoofColorName.textContent = selectedRoofColor.name;
  selectedSashColorName.textContent = selectedSashColor.name;

  colorAdvice.textContent = `${selectedWallColor.advice} ${selectedFinish.note}`;
  luxuryValue.textContent = selectedWallColor.luxury;
  impressionText.textContent = selectedWallColor.impression;
  riskDirt.textContent = selectedWallColor.risks.dirt;
  riskFade.textContent = selectedWallColor.risks.fade;
  riskStreak.textContent = selectedWallColor.risks.streak;
  updateComboWarning();
  updateCustomerComment();
  updateSummary();
  updateImageOverlay();
}

function updateComboWarning() {
  const wall = selectedWallColor.id;
  const roof = selectedRoofColor.id;
  const sash = selectedSashColor.id;
  let message = "";

  if ((wall === "black" || wall === "charcoal") && roof === "roof-brown") {
    message = "外壁が濃い色のとき、屋根に濃い茶色を合わせると少し重たく見える可能性があります。";
  }
  if ((wall === "ivory" || wall === "beige") && sash === "sash-black") {
    message = "明るい外壁に黒いサッシはコントラストが強くなるので、実物で確認しましょう。";
  }
  if ((wall === "gray" || wall === "charcoal") && sash === "sash-white") {
    message = "落ち着いた外壁に白いサッシは、縁が目立ちやすい組み合わせです。";
  }
  if (wall === "brown" && roof === "roof-black" && sash === "sash-white") {
    message = "ブラウン外壁に黒い屋根と白いサッシは、ややコントラストが強くなる可能性があります。";
  }

  comboWarning.textContent = message;
  comboWarning.style.display = message ? "block" : "none";
}

function updateCustomerComment() {
  const base = `この組み合わせは${selectedWallColor.name}の外壁と${selectedRoofColor.name}の屋根、${selectedSashColor.name}のサッシで構成されています。`;
  let extra = "";

  if (selectedWallColor.id === "ivory" || selectedWallColor.id === "beige") {
    extra = "明るく柔らかい色味で、汚れが目立ちにくい組み合わせです。";
  } else if (selectedWallColor.id === "gray") {
    extra = "モダンで人気のある配色です。バランスがよく幅広い住宅に似合います。";
  } else if (selectedWallColor.id === "charcoal" || selectedWallColor.id === "black") {
    extra = "引き締まった高級感があり、重厚感のある仕上がりになります。";
  } else if (selectedWallColor.id === "brown") {
    extra = "温かみがあり落ち着いた雰囲気です。周囲の景色と合わせやすいです。";
  }

  if (comboWarning.style.display === "block") {
    extra += " 配色の重さに注意し、お客様としっかり確認してください。";
  }

  customerComment.textContent = base + extra;
}

function updateSummary() {
  summaryText.textContent = `写真を見ながら色のバランスを確認し、お客様と違和感がないか一緒にチェックしましょう。`;
}

function updateImageOverlay() {
  const mask = imagePreview.querySelector(".preview-mask");
  if (!previewImage.src) {
    mask.style.background = "rgba(255,255,255,0.42)";
    return;
  }
  mask.style.background = isAfterView ? hexToRgba(selectedWallColor.value, selectedFinish.alpha) : "rgba(255,255,255,0.42)";
}

function hexToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const num = parseInt(value, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

imageUpload.addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    previewImage.src = "";
    imagePreview.querySelector(".placeholder").style.display = "block";
    updateImageOverlay();
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    previewImage.src = reader.result;
    imagePreview.querySelector(".placeholder").style.display = "none";
    updateImageOverlay();
  };
  reader.readAsDataURL(file);
});

beforeAfterToggle.addEventListener("click", () => {
  isAfterView = !isAfterView;
  beforeAfterToggle.textContent = isAfterView ? "ビフォー表示" : "アフター表示";
  updateImageOverlay();
});

createButtons(wallColors, wallColorOptions, "color-button", selectWallColor);
createButtons(roofColors, roofColorOptions, "option-button", selectRoofColor);
createButtons(sashColors, sashColorOptions, "option-button", selectSashColor);
finishOptions.forEach((option) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "finish-button";
  button.textContent = option.name;
  button.dataset.id = option.id;
  button.addEventListener("click", () => selectFinish(option.id));
  finishButtons.appendChild(button);
});
updateUI();
