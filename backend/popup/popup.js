// popup.js
// Handles user interactions in the extension popup

document.getElementById("summarizeBtn").addEventListener("click", async () => {
  updateStatus("Summarizing page...");
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: summarizePageOnActiveTab
  });
});

document.getElementById("quizBtn").addEventListener("click", async () => {
  updateStatus("Generating quiz...");
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, { action: "generateQuizFromSummary" });
});

function updateStatus(text) {
  document.getElementById("status").textContent = text;
}

// This function will run inside the active tab (content script context)
function summarizePageOnActiveTab() {
  if (typeof summarizePage === "function") {
    summarizePage();
  } else {
    console.error("summarizePage() not found in content script.");
  }
}
