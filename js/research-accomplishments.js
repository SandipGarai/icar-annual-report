// js/research-accomplishments.js

// ----------------------------------------------
// SAFE division resolver used by all sections
// ----------------------------------------------
function detectDivisionName() {
  // 1. Prefer canonical basic_info
  const bi = AppState.basic_info?.division;
  if (bi && typeof bi === "object") {
    if (bi.type === "other") {
      return bi.other_text?.trim() || "UNASSIGNED";
    }
    return bi.value?.trim() || "UNASSIGNED";
  }

  // 2. Fallback to sections["basic-info"]
  const st = AppState.sections["basic-info"]?.division;
  if (!st || typeof st !== "object") return "UNASSIGNED";

  if (st.type === "other") {
    return st.other_text?.trim() || "UNASSIGNED";
  }
  return st.value?.trim() || "UNASSIGNED";
}

// ----------------------------------------------
// WAIT FOR BASIC INFO TO COMPLETE
// ----------------------------------------------
async function waitForBasicInfoReady() {
  let attempts = 0;
  // max ~5 seconds (50 * 100ms)
  while (!window.__basicInfoReady && attempts < 50) {
    await new Promise((r) => setTimeout(r, 100));
    attempts++;
  }
}

async function initResearchSection() {
  // 🔥 Wait for basic-info state to be ready
  await waitForBasicInfoReady();

  // -------------------------------------------------------
  // 1. DETECT ACTIVE DIVISION (fully synced with UI state)
  // -------------------------------------------------------
  let divisionName = detectDivisionName();
  console.log("Active Division:", divisionName);

  // -------------------------------------------------------
  // 1A. ENSURE & NORMALIZE STORAGE MODEL
  // -------------------------------------------------------
  if (!AppState.sections) AppState.sections = {};

  // If missing, create as object
  if (!AppState.sections.research_accomplishments) {
    AppState.sections.research_accomplishments = {};
  }

  const ra = AppState.sections.research_accomplishments;

  // 🔧 MIGRATION 1: If old version stored this as an array,
  // convert that array into the bucket for the current division.
  if (Array.isArray(ra)) {
    console.warn(
      "[RA] Legacy array model detected, migrating to division-based object."
    );
    const legacyArray = ra;
    AppState.sections.research_accomplishments = {};
    AppState.sections.research_accomplishments[divisionName] = legacyArray;
  }

  // Now rebind after possible migration
  const raObj = AppState.sections.research_accomplishments;

  // 🔧 MIGRATION 2: If user typed under "UNASSIGNED" earlier, but
  // now we have a proper division, move that data over once.
  if (
    divisionName !== "UNASSIGNED" &&
    Array.isArray(raObj.UNASSIGNED) &&
    raObj.UNASSIGNED.length &&
    (!Array.isArray(raObj[divisionName]) || !raObj[divisionName].length)
  ) {
    console.log(
      `[RA] Moving ${raObj.UNASSIGNED.length} legacy projects from UNASSIGNED → ${divisionName}`
    );
    raObj[divisionName] = raObj.UNASSIGNED;
    delete raObj.UNASSIGNED;
  }

  // Create bucket for this division if missing
  if (!Array.isArray(raObj[divisionName])) {
    raObj[divisionName] = [];
  }

  const root = raObj[divisionName];
  console.log(`Loading ${root.length} projects for division: ${divisionName}`);

  // -------------------------------------------------------
  // 2. RENDER CONTAINER
  // -------------------------------------------------------
  const container = document.getElementById("projectContainer");
  if (!container) {
    console.error("projectContainer element not found.");
    return;
  }

  const rebuild = () => {
    container.innerHTML = "";
    root.forEach((proj, i) => container.appendChild(renderProject(proj, i)));
  };

  rebuild();

  // -------------------------------------------------------
  // 3. ADD NEW PROJECT
  // -------------------------------------------------------
  const addBtn = document.getElementById("addProjectBtn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      root.push({
        project_title: "",
        subheadings: [],
        _division: divisionName, // Backend safety only
      });
      rebuild();
    });
  }

  // -------------------------------------------------------
  // 4. RENDER ONE PROJECT ENTRY
  // -------------------------------------------------------
  function renderProject(project, index) {
    const wrapper = document.createElement("div");
    wrapper.className = "ra-project";

    wrapper.innerHTML = `
      <div class="ra-project-head">
        <input type="text" class="ra-title" placeholder="Project Title" value="${
          project.project_title || ""
        }">
        <button class="btn btn-danger btn-remove ra-remove">🗑 Remove Project</button>
      </div>

      <button class="btn btn-outline ra-add-sub">➕ Add Subheading</button>
      <div class="ra-sub-container"></div>
    `;

    // Project title binding
    wrapper.querySelector(".ra-title").addEventListener("input", (e) => {
      project.project_title = e.target.value.trim();
    });

    // Remove entire project
    wrapper.querySelector(".ra-remove").addEventListener("click", () => {
      if (!confirm("Delete entire project?")) return;
      root.splice(index, 1);
      rebuild();
    });

    // Add subheading
    wrapper.querySelector(".ra-add-sub").addEventListener("click", () => {
      project.subheadings.push({
        title: "",
        blocks: [],
      });
      rebuild();
    });

    // Render subheadings
    const subC = wrapper.querySelector(".ra-sub-container");
    project.subheadings.forEach((sub, i) => {
      subC.appendChild(renderSubheading(sub, project, i));
    });

    return wrapper;
  }

  // -------------------------------------------------------
  // 5. RENDER SUBHEADING
  // -------------------------------------------------------
  function renderSubheading(sub, project, subIndex) {
    const wrap = document.createElement("div");
    wrap.className = "ra-sub";

    wrap.innerHTML = `
      <div class="ra-sub-head">
        <input type="text" class="ra-subtitle" placeholder="Subheading" value="${
          sub.title || ""
        }">
        <button class="btn btn-danger btn-remove ra-sub-remove">🗑 Remove</button>
      </div>

      <button class="btn btn-secondary ra-add-block">➕ Add Content Block</button>
      <div class="ra-block-container"></div>
    `;

    // Subheading title
    wrap.querySelector(".ra-subtitle").addEventListener("input", (e) => {
      sub.title = e.target.value.trim();
    });

    // Remove subheading
    wrap.querySelector(".ra-sub-remove").addEventListener("click", () => {
      if (!confirm("Remove this subheading?")) return;
      project.subheadings.splice(subIndex, 1);
      rebuild();
    });

    // Add a content block
    wrap.querySelector(".ra-add-block").addEventListener("click", () => {
      SectionEngine.createBlock(
        wrap.querySelector(".ra-block-container"),
        "research_accomplishments",
        sub.blocks
      );
    });

    // Render blocks inside subheading
    const blkC = wrap.querySelector(".ra-block-container");
    sub.blocks.forEach((blk) => {
      const blkUI = SectionEngine._renderBlock(blk, sub.blocks);
      blkC.appendChild(blkUI);

      // Restore text, tables, figures
      SectionEngine.restoreBlockAssets(blk, blkUI);
    });

    return wrap;
  }
}

window.initResearchSection = initResearchSection;
