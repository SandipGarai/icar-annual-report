/****************************************************
 * Executive Summary – Initializer
 * Section Key: "executive-summary"
 * Fields:
 *   - text (max 100 words)
 ****************************************************/

function initExecutiveSummary() {
  const st = AppState.sections["executive-summary"];

  const textarea = document.getElementById("execSummaryText");
  const counter = document.getElementById("execSummaryWordCount");

  // Load saved content
  textarea.value = st.text || "";

  function update() {
    st.text = textarea.value;

    // word count
    const words = st.text.trim().split(/\s+/).filter(Boolean);
    counter.textContent = words.length;

    // enforce max 100 words
    if (words.length > 100) {
      textarea.value = words.slice(0, 100).join(" ");
      st.text = textarea.value;
      counter.textContent = 100;
    }
  }

  textarea.addEventListener("input", update);

  // initialize
  update();
}

window.initExecutiveSummary = initExecutiveSummary;
