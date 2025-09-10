let lastClick = {x: 50, y: 50};

document.addEventListener("contextmenu", (e) => {
  lastClick = { x: e.clientX, y: e.clientY };
  browser.runtime.sendMessage({ type: "save-click", coords: lastClick });
});

function showPopup(text, color, x, y, isSpinner = false) {
  const old = document.getElementById("vt-popup");
  if (old) old.remove();

  const popup = document.createElement("div");
  popup.id = "vt-popup";
  popup.style.position = "fixed";
  popup.style.left = x + 10 + "px";
  popup.style.top = y + 10 + "px";
  popup.style.background = "#fff";
  popup.style.border = "1px solid #ccc";
  popup.style.padding = "10px 14px";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
  popup.style.zIndex = 999999;
  popup.style.fontFamily = "sans-serif";
  popup.style.fontSize = "14px";
  popup.style.minWidth = "140px";
  popup.style.textAlign = "center";
  popup.style.cursor = "pointer";

  if (isSpinner) {
    popup.innerHTML = `<div class="spinner"></div><div style="margin-top:6px;font-size:12px;">Перевірка...</div>`;
    const style = document.createElement("style");
    style.textContent = `
      .spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3b82f6;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        animation: spin 1s linear infinite;
        margin: auto;
      }
      @keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
    `;
    popup.appendChild(style);
  } else {
    const badge = document.createElement("div");
    badge.textContent = text;
    badge.style.padding = "6px 10px";
    badge.style.borderRadius = "6px";
    badge.style.color = "#fff";
    badge.style.fontWeight = "600";
    badge.style.display = "inline-block";
    badge.style.background = color;
    popup.appendChild(badge);

    setTimeout(() => popup.remove(), 3000);
  }

  popup.addEventListener("click", () => popup.remove());

  document.body.appendChild(popup);
}

browser.runtime.onMessage.addListener((msg) => {
  if (msg.type === "show-spinner") {
    showPopup("", "", lastClick.x, lastClick.y, true);
  }
  if (msg.type === "show-result") {
    let color = "#22c55e";
    if (msg.verdict === "Suspicious") color = "#facc15";
    if (msg.verdict === "Malicious") color = "#ef4444";
    showPopup(msg.verdict, color, lastClick.x, lastClick.y, false);
  }
});
