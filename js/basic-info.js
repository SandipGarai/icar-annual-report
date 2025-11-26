function initBasicInfoSection() {
  const st = AppState.sections["basic-info"];

  // Institute Name
  const inst = document.getElementById("instNameInput");
  inst.value = st.instName || "";
  inst.addEventListener("input", () => {
    st.instName = inst.value.toUpperCase().replace(/[^A-Z0-9 ]/g, "");
    inst.value = st.instName;
  });

  // Faculty Name
  const fac = document.getElementById("facultyNameInput");
  fac.value = st.facultyName || "";
  fac.addEventListener("input", () => {
    st.facultyName = fac.value.replace(/[.,!@#$^&()\-_=+;:'"]/g, "");
    fac.value = st.facultyName;
  });

  // Roles
  const roles = document.querySelectorAll("input[name='roleCheckbox']");
  roles.forEach((chk) => {
    chk.checked = st.roles?.includes(chk.value);
    chk.addEventListener("change", () => {
      st.roles = [
        ...document.querySelectorAll("input[name='roleCheckbox']:checked"),
      ].map((x) => x.value);
    });
  });

  // Division
  const divSel = document.getElementById("divisionSelect");
  const divOther = document.getElementById("divisionOtherInput");

  divSel.value = st.division || "";
  divOther.value = st.divisionOther || "";
  if (st.division === "other") divOther.classList.remove("hidden");

  divSel.addEventListener("change", () => {
    st.division = divSel.value;
    if (divSel.value === "other") {
      divOther.classList.remove("hidden");
    } else {
      divOther.classList.add("hidden");
      st.divisionOther = "";
      divOther.value = "";
    }
  });

  divOther.addEventListener("input", () => {
    st.divisionOther = divOther.value;
  });

  // Year
  const yearSel = document.getElementById("yearSelect");
  yearSel.innerHTML = "";
  const yearNow = new Date().getFullYear();
  for (let y = yearNow; y >= 2005; y--) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSel.appendChild(opt);
  }
  yearSel.value = st.year || yearNow;
  yearSel.addEventListener("change", () => {
    st.year = yearSel.value;
  });

  // Executive Summary inside Basic Info
  const exec = document.getElementById("execSummaryText");
  const wc = document.getElementById("execSummaryWordCount");

  st.execSummary = st.execSummary || "";
  exec.value = st.execSummary;

  function updateExec() {
    st.execSummary = exec.value;
    const words = exec.value.trim().split(/\s+/).filter(Boolean).length;
    wc.textContent = words;
  }

  exec.addEventListener("input", updateExec);
  updateExec();
  // VALIDATION BUTTON
  const validateBtn = document.getElementById("validateBasicInfoBtn");

  validateBtn.addEventListener("click", () => {
    let errors = [];

    // Validate institute name
    if (!st.instName || st.instName.trim() === "") {
      errors.push("Institute short name is required.");
    }

    // Validate faculty name
    if (!st.facultyName || st.facultyName.trim() === "") {
      errors.push("Faculty name is required.");
    }

    // Validate division
    if (!st.division || st.division === "") {
      errors.push("Division must be selected.");
    }
    if (
      st.division === "other" &&
      (!st.divisionOther || st.divisionOther.trim() === "")
    ) {
      errors.push("Please specify division/school/section.");
    }

    // Validate year
    if (!st.year || isNaN(parseInt(st.year))) {
      errors.push("Please select a valid reporting year.");
    }

    // Validate executive summary
    const words = (st.execSummary || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    if (words > 100) {
      errors.push("Executive Summary cannot exceed 100 words.");
    }

    // Show result
    if (errors.length > 0) {
      showAlert("Validation failed:<br>" + errors.join("<br>"), "error", true);
    } else {
      showAlert("Basic Information validated successfully!", "success", true);
    }
  });
}

window.initBasicInfoSection = initBasicInfoSection;
