// ------------------------------------------------------
// LOGIN PROTECTION
// ------------------------------------------------------
function requireLogin() {
  const user = localStorage.getItem("loggedUser");
  if (!user) {
    window.location.href = "login.html";
  }
}
requireLogin();

// ------------------------------------------------------
// MAIN INITIALIZATION
// ------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadDraftIfAny();

  // Sidebar navigation
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sectionId = btn.dataset.section;
      setActiveNav(sectionId);
      loadSection(sectionId);
    });
  });

  // Draft buttons
  const saveBtn = document.getElementById("saveDraftBtn");
  const clearBtn = document.getElementById("clearDraftBtn");
  if (saveBtn) saveBtn.addEventListener("click", saveDraft);
  if (clearBtn) clearBtn.addEventListener("click", clearDraft);

  // Load initial section
  setActiveNav("basic-info");
  loadSection("basic-info");
});

// ==================================================================
// BASIC INFO SECTION INITIALIZER
// ==================================================================
function initBasicInfoSection() {
  const state = window.AppState.basic_info;

  // Get logged user
  const logged = JSON.parse(localStorage.getItem("loggedUser") || "{}");

  // ------------------------------
  // Elements
  // ------------------------------
  const instInput = document.getElementById("instNameInput");
  const facultyInput = document.getElementById("facultyNameInput");
  const divisionSelect = document.getElementById("divisionSelect");
  const divisionOther = document.getElementById("divisionOtherInput");
  const yearSelect = document.getElementById("yearSelect");
  const execTextarea = document.getElementById("execSummary");
  const execCounter = document.getElementById("execWordCount");

  // ------------------------------
  // Force faculty name from login
  // ------------------------------
  if (logged.name) {
    state.faculty_name = logged.name.toUpperCase();
    if (facultyInput) {
      facultyInput.value = state.faculty_name;
      facultyInput.readOnly = true; // Cannot edit
      facultyInput.style.background = "#f0f0f0";
    }
  }

  // ------------------------------
  // Populate years list
  // ------------------------------
  if (yearSelect && !yearSelect.options.length) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear + 1; y >= currentYear - 5; y--) {
      const opt = document.createElement("option");
      opt.value = String(y);
      opt.textContent = String(y);
      yearSelect.appendChild(opt);
    }
  }

  // ------------------------------
  // Restore old values from state
  // ------------------------------
  if (instInput)
    instInput.value =
      (state.institute_name_short || "ICAR-IIAB").split("ICAR-")[1] || "IIAB";

  if (!facultyInput.readOnly) {
    facultyInput.value = state.faculty_name || "";
  }

  if (divisionSelect) divisionSelect.value = state.division.value || "";
  if (divisionOther) divisionOther.value = state.division.other_text || "";
  if (yearSelect && state.year) yearSelect.value = String(state.year);

  if (execTextarea) execTextarea.value = state.executive_summary || "";
  if (execCounter)
    execCounter.textContent = countWords(state.executive_summary || "0");

  // ------------------------------
  // Roles checkboxes
  // ------------------------------
  const roleCheckboxes = document.querySelectorAll(
    "input[name='roleCheckbox']"
  );
  roleCheckboxes.forEach((cb) => {
    cb.checked = (state.roles || []).includes(cb.value);
    cb.addEventListener("change", () => {
      const selected = [];
      document
        .querySelectorAll("input[name='roleCheckbox']:checked")
        .forEach((c) => selected.push(c.value));
      window.AppState.basic_info.roles = selected;
    });
  });

  // ------------------------------
  // Institute input
  // ------------------------------
  instInput?.addEventListener("input", (e) => {
    const raw = (e.target.value || "").toUpperCase();
    e.target.value = raw;
    const suffix = raw.trim() || "IIAB";
    window.AppState.basic_info.institute_name_short = "ICAR-" + suffix;
  });

  // ------------------------------
  // Division logic
  // ------------------------------
  divisionSelect?.addEventListener("change", (e) => {
    const val = e.target.value;
    if (val === "other") {
      divisionOther.classList.remove("hidden");
      state.division.type = "other";
      state.division.value = "";
    } else {
      divisionOther.classList.add("hidden");
      state.division.type = "predefined";
      state.division.value = val;
      state.division.other_text = "";
    }
  });

  divisionOther?.addEventListener("input", (e) => {
    state.division.other_text = e.target.value;
  });

  // ------------------------------
  // Year selection
  // ------------------------------
  yearSelect?.addEventListener("change", (e) => {
    state.year = parseInt(e.target.value, 10);
  });

  // ------------------------------
  // Executive summary input
  // ------------------------------
  execTextarea?.addEventListener("input", (e) => {
    const text = e.target.value || "";
    const wc = countWords(text);
    execCounter.textContent = wc;
    state.executive_summary = text;

    const helper = document.getElementById("execWordHelper");
    if (helper) {
      helper.style.color = wc < 50 || wc > 100 ? "#b91c1c" : "#6b7280";
    }
  });

  // ------------------------------
  // Validation button
  // ------------------------------
  const basicValidateBtn = document.getElementById("validateBasicInfoBtn");
  basicValidateBtn?.addEventListener("click", () => {
    const errors = [];
    if (!state.faculty_name) errors.push("Faculty name is required.");
    if (!state.institute_name_short)
      errors.push("Institute short name is required.");
    if (!state.year) errors.push("Year is required.");

    const wc = countWords(state.executive_summary || "");
    if (wc < 50 || wc > 100)
      errors.push(
        "Executive summary must be between 50 and 100 words. Current: " + wc
      );

    if (errors.length) showAlert(errors.join(" "), "error");
    else showAlert("Basic information looks valid.", "success");
  });
}
