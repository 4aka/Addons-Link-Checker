const VT_API_KEY = "";

const MENU_ID = "vt_check_link";
const VT_API_BASE = "https://www.virustotal.com/api/v3";

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

browser.contextMenus.create({
  id: MENU_ID,
  title: "Check via VirusTotal",
  contexts: ["link"],
  icons: { "16": browser.runtime.getURL("icons/vtlc-16.png") }
});

async function vtSubmitUrl(url) {
  const body = new URLSearchParams({ url });
  const r = await fetch(`${VT_API_BASE}/urls`, {
    method: "POST",
    headers: {
      "x-apikey": VT_API_KEY,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });
  const data = await r.json();
  return data.data?.id;
}

async function vtWaitForAnalysis(analysisId) {
  for (let i = 0; i < 15; i++) {
    const r = await fetch(`${VT_API_BASE}/analyses/${analysisId}`, {
      headers: { "x-apikey": VT_API_KEY }
    });
    const data = await r.json();
    if (data.data?.attributes?.status === "completed") return data;
    await sleep(1500);
  }
  throw new Error("The waiting time for the analysis has expired.");
}

function buildSummary(analysisJson) {
  const stats = analysisJson.data?.attributes?.stats || {};
  const malicious = stats.malicious || 0;
  const suspicious = stats.suspicious || 0;
  let verdict = "Clean / Low Risk";
  if (malicious > 0) verdict = "Malicious";
  else if (suspicious > 0) verdict = "Suspicious";
  return verdict;
}

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ID) return;

  try {
    browser.tabs.sendMessage(tab.id, { type: "show-spinner" });

    const analysisId = await vtSubmitUrl(info.linkUrl);
    const analysisJson = await vtWaitForAnalysis(analysisId);
    const verdict = buildSummary(analysisJson);

    browser.tabs.sendMessage(tab.id, {
      type: "show-result",
      verdict: verdict
    });

  } catch (err) {
    console.error(err);
    browser.tabs.sendMessage(tab.id, {
      type: "show-result",
      verdict: "Error: " + err.message
    });
  }
});
