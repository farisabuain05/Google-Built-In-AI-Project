// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  try {
    if (msg.action === "summarize") {
      const summary = await summarizeText(msg.content);
      sendResponse({ summary });
    }

    if (msg.action === "generateQuiz") {
      const quiz = await generateQuiz(msg.summary);
      sendResponse({ quiz });
    }
  } catch (err) {
    console.error("Error in background script:", err);
    sendResponse({ error: err.message });
  }

  // Return true to keep the message channel open for async operations
  return true;
});

// --- Summarization using Summarizer API ---
async function summarizeText(text) {
  const session = await ai.summarizer.create({ type: "tl;dr" });
  const summary = await session.summarize(text);
  return summary;
}

// --- Quiz generation using Prompt API ---
async function generateQuiz(summary) {
  const prompt = `
    Based on this summary, generate 3 concise study questions:
    ${summary}
  `;
  const session = await ai.prompt.create();
  const quiz = await session.prompt(prompt);
  return quiz;
}


// NOTE FOR FRONTEND: Chrome AI API (ai.summarizer, ai.prompt) is only available 
// in Manifest V3 extensions with "ai_summarizer" permission

