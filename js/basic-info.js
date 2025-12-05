// js/basic-info.js
function initBasicInfoSection() {
  const st = AppState.sections["basic-info"];

  // -----------------------------
  // SAFE ELEMENT GETTERS
  // -----------------------------
  const inst = document.getElementById("instNameInput") || null;
  const fac = document.getElementById("facultyNameInput") || null;
  const roles = document.querySelectorAll("input[name='roleCheckbox']");
  const divSel = document.getElementById("divisionSelect") || null;
  const divOther = document.getElementById("divisionOtherInput") || null;
  const yearSel = document.getElementById("yearSelect") || null;
  const exec =
    document.getElementById("execSummaryText") ||
    document.getElementById("execSummary") ||
    null;
  const wc = document.getElementById("execSummaryWordCount") || null;

  // If panel not rendered yet → STOP SAFELY
  if (!inst || !fac || !divSel || !yearSel) {
    console.warn("Basic Info HTML not loaded yet — skipping init.");
    return;
  }

  // -----------------------------
  // INSTITUTE NAME
  // -----------------------------
  inst.value = st.instName || "";
  inst.addEventListener("input", () => {
    st.instName = inst.value.toUpperCase().replace(/[^A-Z0-9 ]/g, "");
    inst.value = st.instName;

    // Sync to canonical source
    AppState.basic_info.institute_name_short = st.instName;
  });

  // -----------------------------
  // FACULTY NAME - EDITABLE & PRE-FILLED
  // -----------------------------
  const logged = JSON.parse(localStorage.getItem("loggedUser") || "{}");

  // Pre-fill from login if not already set
  if (!st.facultyName && logged.fullname) {
    st.facultyName = logged.fullname.toUpperCase();
    // 🔥 ALSO sync canonical basic_info so backend sees correct name
    AppState.basic_info.faculty_name = st.facultyName;
  }

  // Set value (either from state or login)
  fac.value = st.facultyName || "";

  // Make it editable and update state
  fac.addEventListener("input", () => {
    st.facultyName = fac.value.replace(/[.,!@#$^&()\-_=+;:'"]/g, "");
    fac.value = st.facultyName;

    // Sync to canonical source
    AppState.basic_info.faculty_name = st.facultyName;
  });

  // -----------------------------
  // ROLES
  // -----------------------------
  roles.forEach((chk) => {
    chk.checked = st.roles?.includes(chk.value);
    chk.addEventListener("change", () => {
      st.roles = [
        ...document.querySelectorAll("input[name='roleCheckbox']:checked"),
      ].map((x) => x.value);

      // Sync to canonical source
      AppState.basic_info.roles = st.roles;
    });
  });

  // -----------------------------
  // DIVISION
  // -----------------------------
  // Ensure object exists
  if (!st.division || typeof st.division !== "object") {
    st.division = {
      type: "predefined",
      value: "",
      other_text: "",
    };
  }

  // Apply UI values from state
  divSel.value = st.division.type === "other" ? "other" : st.division.value;
  divOther.value = st.division.other_text || "";

  if (st.division.type === "other") {
    divOther.classList.remove("hidden");
  }

  // 🔥 FIX: Sync restored division on load (critical)
  AppState.basic_info.division = { ...st.division };

  // On dropdown change
  divSel.addEventListener("change", () => {
    if (divSel.value === "other") {
      st.division.type = "other";
      st.division.value = "";
      divOther.classList.remove("hidden");
    } else {
      st.division.type = "predefined";
      st.division.value = divSel.value;
      st.division.other_text = "";
      divOther.classList.add("hidden");
      divOther.value = "";
    }

    // Sync to canonical source
    AppState.basic_info.division = { ...st.division };
  });

  // On typing in "other" field
  divOther.addEventListener("input", () => {
    st.division.other_text = divOther.value.trim();

    // Sync to canonical source
    AppState.basic_info.division = { ...st.division };
  });

  // -----------------------------
  // YEAR - AUTO-SELECT CURRENT YEAR IF NOT SET
  // -----------------------------
  yearSel.innerHTML = "";
  const yearNow = new Date().getFullYear();
  for (let y = yearNow; y >= 2005; y--) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSel.appendChild(opt);
  }

  // Set to saved year OR current year
  yearSel.value = st.year || yearNow;
  st.year = yearSel.value;

  yearSel.addEventListener("change", () => {
    st.year = yearSel.value;

    // Sync to canonical source
    AppState.basic_info.year = st.year;
  });

  // -----------------------------
  // EXECUTIVE SUMMARY
  // -----------------------------
  if (exec) {
    exec.value = st.execSummary || "";
    function updateExec() {
      st.execSummary = exec.value;
      wc.textContent = exec.value.trim().split(/\s+/).filter(Boolean).length;

      // Sync to canonical source
      AppState.basic_info.executive_summary = st.execSummary;
    }
    exec.addEventListener("input", updateExec);
    updateExec();
  }

  // -----------------------------
  // VALIDATE BUTTON
  // -----------------------------
  const validateBtn = document.getElementById("validateBasicInfoBtn");
  validateBtn?.addEventListener("click", () => {
    const errors = [];
    if (!st.instName) errors.push("Institute short name is required.");
    if (!st.facultyName) errors.push("Faculty name is required.");
    if (!st.division) errors.push("Division must be selected.");
    if (st.division.type === "other" && !st.division.other_text)
      errors.push("Specify division.");

    const words = (st.execSummary || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    if (words > 100) errors.push("Executive summary cannot exceed 100 words.");

    if (errors.length) showAlert(errors.join("<br>"), "error", true);
    else showAlert("Basic info looks good!", "success", true);
  });

  // Mark as ready
  window.__basicInfoReady = true;
  console.log("✅ Basic Info Section Ready");
}

window.initBasicInfoSection = initBasicInfoSection;
