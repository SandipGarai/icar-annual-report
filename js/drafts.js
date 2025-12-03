// js/drafts.js

const DRAFT_KEY = "annual_report_draft_v1";

/****************************************************
 * SAVE DRAFT (fully fixed)
 ****************************************************/
function saveDraft() {
  try {
    // Deep clone full AppState safely
    const snapshot = cloneAppState();

    // Ensure meta exists (THIS FIXES YOUR CRASH)
    if (!snapshot.meta) snapshot.meta = {};

    snapshot.meta.lastSavedAt = new Date().toISOString();

    // Save to browser storage
    localStorage.setItem(DRAFT_KEY, JSON.stringify(snapshot));

    showAlert("Draft saved locally in this browser.", "success");
  } catch (err) {
    console.error("Save draft error:", err);
    showAlert("Error saving draft: " + (err.message || err), "error");
  }
}

/****************************************************
 * LOAD DRAFT IF EXISTS
 ****************************************************/
function loadDraftIfAny() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);

    // Replace entire AppState with snapshot
    window.AppState = parsed;
    window.__draftLoaded = true;

    console.log("✅ Draft loaded from localStorage");
    showAlert("Saved draft has been loaded.", "success");
  } catch (err) {
    console.error("Load draft error:", err);
  }

  /****************************************************
   * SYNC basic_info → UI model
   ****************************************************/
  if (window.AppState.basic_info) {
    const bi = window.AppState.basic_info;

    if (!window.AppState.sections) window.AppState.sections = {};
    if (!window.AppState.sections["basic-info"]) {
      window.AppState.sections["basic-info"] = {};
    }

    const ui = window.AppState.sections["basic-info"];

    ui.instName = bi.institute_name_short || "";
    ui.facultyName = bi.faculty_name || "";
    ui.roles = bi.roles || [];
    ui.division = bi.division || {
      type: "predefined",
      value: "",
      other_text: "",
    };
    ui.year = bi.year || new Date().getFullYear();
    ui.execSummary = bi.executive_summary || "";

    console.log("✅ Synced basic_info → sections[basic-info]");
  }

  // Mark basic-info as ready
  window.__basicInfoReady = true;

  /****************************************************
   * RELOAD LAST SECTION
   ****************************************************/
  setTimeout(() => {
    const last = localStorage.getItem("lastSection") || "basic-info";

    if (
      typeof window.loadSection === "function" &&
      typeof window.setActiveNav === "function"
    ) {
      console.log(`🔄 Reloading section: ${last}`);
      window.setActiveNav(last);
      window.loadSection(last);
    }
  }, 100);
}

/****************************************************
 * CLEAR DRAFT
 ****************************************************/
function clearDraft() {
  if (!confirm("Clear saved draft from this browser?")) return;
  localStorage.removeItem(DRAFT_KEY);
  window.location.reload();
}

// Expose globally
window.saveDraft = saveDraft;
window.loadDraftIfAny = loadDraftIfAny;
window.clearDraft = clearDraft;
