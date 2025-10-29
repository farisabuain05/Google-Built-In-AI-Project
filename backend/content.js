// content.js

// Preliminary: Check if mark.js is loaded

if (typeof Mark === "undefined") {
  console.error("❌ mark.js not loaded");
} else {
  console.log("✅ mark.js loaded successfully");
}

// === 1️⃣ Step 1: Extract text and send to background for summarization ===

async function summarizePage() {
  const pageText = document.body.innerText;
  chrome.runtime.sendMessage(
    { action: "summarize", content: pageText },
    (response) => {
      if (response?.summary) {
        console.log("Summary:", response.summary);
        showSummaryBox(response.summary);
        // Optional: run either of the highlight methods
        highlightBasedOnSummary(response.summary);
        // OR use mark.js version:
        // highlightUsingMarkJS(response.summary);
      } else {
        console.error(response?.error || "No summary returned");
      }
    }
  );
}

// === 2️⃣ Step 2: Display summary on page ===

function showSummaryBox(summary) {
  const box = document.createElement("div");
  box.textContent = "🧠 TL;DR: " + summary;
  Object.assign(box.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#fff",
    color: "#000",
    padding: "12px 16px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    zIndex: 9999,
    width: "300px",
    maxHeight: "200px",
    overflowY: "auto",
    fontSize: "14px",
  });
  document.body.appendChild(box);
}

// === 3️⃣ Step 3: Highlight key sentences ===

function highlightUsingMarkJS(summary) {
  if (typeof Mark === "undefined") {
    console.warn("mark.js not loaded.");
    return;
  }
  const instance = new Mark(document.body);
  const keywords = summary
    .split(/\W+/)
    .filter((w) => w.length > 5)
    .map((w) => w.toLowerCase());

  instance.mark(keywords, {
    separateWordSearch: false,
    className: "tldrify-highlight",
  });
}

// Trigger automatically whenever this content script runs ===
summarizePage();
