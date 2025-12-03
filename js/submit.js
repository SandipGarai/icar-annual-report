/*********************************************************
 * submit.js – FINAL VERSION (with real server submit)
 **********************************************************/

const SUBMIT_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzEXC53wLM5M8nbhkPVgwL-4VlMPuF_yCxZbFrxmOVN-QFcUGIK3C5Yzd_ly5_Y4pp5/exec";

/*********************************************************
 * 1. SAVE DRAFT
 **********************************************************/
function saveDraft() {
  try {
    localStorage.setItem("annual_report_draft", JSON.stringify(AppState));
    showStatus("Draft saved successfully.", "success");
  } catch (err) {
    console.error(err);
    showStatus("Failed to save draft.", "error");
  }
}

/*********************************************************
 * 2. LOAD DRAFT
 **********************************************************/
function loadDraft() {
  try {
    const raw = localStorage.getItem("annual_report_draft");
    if (!raw) {
      showStatus("No saved draft found.", "error");
      return;
    }

    Object.assign(AppState, JSON.parse(raw));
    showStatus("Draft restored successfully.", "success");

    const active = document.querySelector(".nav-item.active");
    if (active) Router.load(active.dataset.section);
  } catch (err) {
    console.error(err);
    showStatus("Error restoring draft.", "error");
  }
}

/*********************************************************
 * 3. CLEAR DRAFT (FULL RESET)
 **********************************************************/
function clearDraft() {
  localStorage.removeItem("annual_report_draft");
  // reset AppState fully
  Object.keys(AppState.sections).forEach((key) => {
    if (Array.isArray(AppState.sections[key])) AppState.sections[key] = [];
    else AppState.sections[key] = {};
  });
  AppState.basic_info = {};
  AppState.local_counters = { figure: 0, table: 0 };

  showStatus("Draft cleared.", "success");

  // reload first section
  const firstItem = document.querySelector(".nav-item");
  if (firstItem) Router.load(firstItem.dataset.section);
}

/*********************************************************
 * 4. REAL SUBMIT (POST TO APPS SCRIPT)
 **********************************************************/
async function submitFinalReport() {
  try {
    showSubmitLoader(true);

    const response = await fetch(SUBMIT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(AppState),
      mode: "cors",
    });

    const data = await response.json();
    console.log("SERVER RESPONSE:", data);

    if (!data.ok) {
      showStatus("Server error: " + data.message, "error");
      return;
    }

    showStatus("Submitted successfully.", "success");
    const btn = document.getElementById("submitBtn");
    if (btn) {
      btn.textContent = "Submitted ✓";
      btn.classList.add("btn-success-state");
      // revert to normal after a short delay
      setTimeout(() => {
        btn.classList.remove("btn-success-state");
        btn.textContent = "Submit";
      }, 2000);
    }
  } catch (err) {
    console.error(err);
    showStatus("Failed: " + err, "error");
  } finally {
    showSubmitLoader(false);
  }
}

/*********************************************************
 * 5. AUTO-SAVE ON NAVIGATION
 **********************************************************/
function setupAutoSaveOnNavigation() {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => saveDraft());
  });
}

/*********************************************************
 * 6. UI HELPERS
 **********************************************************/
function showSubmitLoader(show) {
  const el = document.getElementById("submitLoader");
  const btn = document.getElementById("submitBtn");

  if (el) el.style.display = show ? "block" : "none";

  if (!btn) return;

  if (show) {
    btn.disabled = true;
    btn.classList.add("btn-loading");
    btn.textContent = "Submitting...";
  } else {
    btn.disabled = false;
    btn.classList.remove("btn-loading");
    btn.textContent = "Submit";
  }
}

function showStatus(msg, type) {
  const box = document.getElementById("statusBox");
  if (!box) return;

  box.className =
    "alert " + (type === "success" ? "alert-success" : "alert-error");
  box.textContent = msg;
  box.style.display = "block";

  setTimeout(() => (box.style.display = "none"), 2500);
}

/*********************************************************
 * 7. INIT & HOOKS (One DOM Loaded Block Only)
 **********************************************************/
document.addEventListener("DOMContentLoaded", () => {
  // 1. Load Draft (if any)
  const raw = localStorage.getItem("annual_report_draft");
  if (raw) {
    try {
      Object.assign(AppState, JSON.parse(raw));
    } catch (e) {
      console.error(e);
    }
  }

  // 2. Attach buttons AFTER everything exists
  document.getElementById("saveDraftBtn")?.addEventListener("click", saveDraft);
  document.getElementById("loadDraftBtn")?.addEventListener("click", loadDraft);
  document
    .getElementById("clearDraftBtn")
    ?.addEventListener("click", clearDraft);
  document
    .getElementById("submitBtn")
    ?.addEventListener("click", submitFinalReport);

  setupAutoSaveOnNavigation();

  // 3. Load first section ONLY AFTER router.js has registered all sections
  setTimeout(() => {
    const firstItem = document.querySelector(".nav-item");
    if (firstItem) {
      window.loadSection(firstItem.dataset.section);
      window.setActiveNav(firstItem.dataset.section);
    }
  }, 10);
});
