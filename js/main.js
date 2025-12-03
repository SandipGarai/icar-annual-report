/****************************************************
 * MAIN.JS — FINAL, CORRECTED, SAFE, STABLE VERSION
 ****************************************************/

document.addEventListener("DOMContentLoaded", () => {
  /****************************************************
   * 1. LOGIN CHECK
   ****************************************************/
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "null");

  if (!loggedUser) {
    window.location.href = "login.html";
    return;
  }

  // /****************************************************
  //  * 2. PREPARE EMPTY APPSTATE
  //  *    (Draft loader will replace it)
  //  ****************************************************/
  // if (!window.AppState) window.AppState = {};
  // window.__basicInfoReady = false;

  /****************************************************
   * 3. LOAD DRAFT FIRST (THIS IS CRUCIAL!)
   ****************************************************/
  if (typeof loadDraftIfAny === "function") {
    loadDraftIfAny();
  }

  /****************************************************
   * 4. ENSURE MINIMUM STRUCTURE EXISTS
   ****************************************************/
  if (!AppState.sections) AppState.sections = {};

  if (!AppState.sections["basic-info"]) {
    AppState.sections["basic-info"] = {
      instName: "",
      facultyName: "",
      roles: [],
      division: { type: "predefined", value: "", other_text: "" },
      year: new Date().getFullYear(),
      execSummary: "",
    };
  }

  // Make sure meta exists (fix for saveDraft)
  if (!AppState.meta) AppState.meta = {};

  /****************************************************
   * 5. PRE-FILL FACULTY NAME FROM LOGIN
   ****************************************************/
  if (!AppState.sections["basic-info"].facultyName && loggedUser.fullname) {
    AppState.sections["basic-info"].facultyName =
      loggedUser.fullname.toUpperCase();
  }

  /****************************************************
   * 6. LOGOUT HANDLER (auto-save before logout)
   ****************************************************/
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (typeof saveDraft === "function") saveDraft();
      localStorage.removeItem("loggedUser");
      window.location.href = "login.html";
    });
  }

  /****************************************************
   * 7. RESTORE LAST SECTION
   ****************************************************/
  const lastSection = localStorage.getItem("lastSection") || "basic-info";

  setTimeout(() => {
    if (
      typeof loadSection === "function" &&
      typeof setActiveNav === "function"
    ) {
      setActiveNav(lastSection);
      loadSection(lastSection);
    }
  }, 200);

  /****************************************************
   * 8. SECTION NAVIGATION BUTTONS
   ****************************************************/
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sec = btn.dataset.section;
      if (!sec) return;

      localStorage.setItem("lastSection", sec);

      if (
        typeof loadSection === "function" &&
        typeof setActiveNav === "function"
      ) {
        setActiveNav(sec);
        loadSection(sec);
      }
    });
  });

  /****************************************************
   * 9. MANUAL SAVE / CLEAR BUTTONS
   ****************************************************/
  const saveBtn = document.getElementById("saveDraftBtn");
  const clearBtn = document.getElementById("clearDraftBtn");

  if (saveBtn && typeof saveDraft === "function") {
    saveBtn.addEventListener("click", () => {
      saveDraft();
      showAlert("Draft saved", "success", true);
    });
  }

  if (clearBtn && typeof clearDraft === "function") {
    clearBtn.addEventListener("click", () => {
      if (confirm("Clear all saved draft data?")) {
        clearDraft();
      }
    });
  }

  /****************************************************
   * 10. AUTO-SAVE EVERY 1 MINUTE
   ****************************************************/
  if (typeof saveDraft === "function") {
    setInterval(() => {
      saveDraft();
      console.log("Auto-saved:", new Date().toLocaleTimeString());
    }, 60000);
  }

  /****************************************************
   * 11. AUTO-SAVE ON PAGE EXIT
   ****************************************************/
  window.addEventListener("beforeunload", () => {
    if (typeof saveDraft === "function") saveDraft();
  });
});
