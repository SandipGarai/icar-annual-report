// js/academic-activities.js

function initAcademicSection() {
  const container = document.getElementById("acadContainer");
  const stateList = AppState.sections.academic_activities;

  // Predefined subsections
  const defaultSubs = [
    {
      key: "UG Program",
      label: "UG Program",
      concerned_roles: ["UG-coordinator"],
    },
    {
      key: "PG Program",
      label: "PG Program",
      concerned_roles: ["PG-coordinator"],
    },
    {
      key: "Seat Matrix of Ranchi-Hub",
      label: "Seat Matrix of Ranchi-Hub",
      concerned_roles: [],
    },
    {
      key: "Placements of students",
      label: "Placements of students",
      concerned_roles: [],
    },
    {
      key: "Laboratory facilities",
      label: "Laboratory facilities",
      concerned_roles: [],
    },
    {
      key: "Library facility",
      label: "Library facility",
      concerned_roles: [],
    },
    {
      key: "Student celebrations",
      label: "Any celebrations involving students",
      concerned_roles: [],
    },
    {
      key: "Passed-out students",
      label: "Details of passed-out students with research titles",
      concerned_roles: [],
    },
  ];

  // Initialize once
  if (!stateList.length) {
    defaultSubs.forEach((sub) => {
      stateList.push({
        id: "acad_" + sub.key.replace(/\s+/g, "_"),
        key: sub.key,
        title: sub.label,
        concerned_roles: sub.concerned_roles,
        blocks: [],
        is_custom: false,
      });
    });
  }

  function rebuild() {
    container.innerHTML = "";
    stateList.forEach((sub, idx) => {
      container.appendChild(renderSubsection(sub, idx));
    });
  }

  function renderSubsection(sub, index) {
    const card = document.createElement("div");
    card.className = "section-card";

    const canEditTitle = sub.is_custom === true;

    card.innerHTML = `
      <div class="section-card-head">
        ${
          canEditTitle
            ? `<input type="text" class="section-card-title-input" value="${sub.title}" placeholder="Custom subsection title">`
            : `<div class="section-card-title">${sub.title}</div>`
        }
        <div class="section-card-actions">
          ${
            sub.is_custom
              ? `<button class="btn btn-danger btn-sm sc-del">🗑 Remove</button>`
              : ""
          }
        </div>
      </div>

      <div class="section-card-body">
        ${
          sub.concerned_roles?.length
            ? `<div class="small-text" style="margin-bottom:6px;">
                 Concerned to: ${sub.concerned_roles.join(", ")}
               </div>`
            : ""
        }

        <button class="btn btn-secondary sc-add-block">➕ Add Content Block</button>

        <div class="sc-block-container" style="margin-top:10px;"></div>
      </div>
    `;

    // Editable title
    if (canEditTitle) {
      const inp = card.querySelector(".section-card-title-input");
      inp.addEventListener("input", (e) => {
        sub.title = e.target.value.trim();
      });
    }

    // Remove subsection
    const delBtn = card.querySelector(".sc-del");
    if (delBtn) {
      delBtn.addEventListener("click", () => {
        if (!confirm("Delete this custom subsection?")) return;
        stateList.splice(index, 1);
        rebuild();
      });
    }

    // Add content block
    const addBlockBtn = card.querySelector(".sc-add-block");
    const blockContainer = card.querySelector(".sc-block-container");

    addBlockBtn.addEventListener("click", () => {
      SectionEngine.createBlock(
        blockContainer,
        "academic_activities",
        sub.blocks
      );
    });

    // Render existing blocks (with figures/tables restored)
    sub.blocks.forEach((blk) => {
      const ui = SectionEngine._renderBlock(blk, sub.blocks);
      blockContainer.appendChild(ui);

      // 🔵 IMPORTANT: restore figures + tables + captions
      if (SectionEngine.restoreBlockAssets) {
        SectionEngine.restoreBlockAssets(blk, ui);
      }
    });

    return card;
  }

  // Add custom subsection
  const addCustomBtn = document.getElementById("acadAddCustomSubBtn");
  addCustomBtn?.addEventListener("click", () => {
    const title = prompt("Enter custom subsection title:");
    if (!title) return;

    stateList.push({
      id: "acad_custom_" + Date.now(),
      key: "custom",
      title: title.trim(),
      concerned_roles: [],
      blocks: [],
      is_custom: true,
    });

    rebuild();
  });

  rebuild();
}

window.initAcademicSection = initAcademicSection;
