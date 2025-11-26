// js/drafts.js

const DRAFT_KEY = "annual_report_draft_v1";

function saveDraft() {
  try {
    const snapshot = cloneAppState();
    snapshot.meta.lastSavedAt = new Date().toISOString();
    localStorage.setItem(DRAFT_KEY, JSON.stringify(snapshot));
    showAlert("Draft saved locally in this browser.", "success");
  } catch (err) {
    console.error("Save draft error:", err);
    showAlert("Error saving draft: " + (err.message || err), "error");
  }
}

function loadDraftIfAny() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    // shallow replace
    window.AppState = parsed;
    showAlert("Saved draft has been loaded.", "success");
  } catch (err) {
    console.error("Load draft error:", err);
  }
}

function clearDraft() {
  if (!confirm("Clear saved draft from this browser?")) return;
  localStorage.removeItem(DRAFT_KEY);
  window.location.reload();
}

window.saveDraft = saveDraft;
window.loadDraftIfAny = loadDraftIfAny;
window.clearDraft = clearDraft;
