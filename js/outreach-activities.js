// js/outreach.js

function initOutreachSection() {
  const container = document.getElementById("outreachContainer");
  const stateList = AppState.sections.outreach_activities;

  const defaultSubs = [
    {
      key: "TSP",
      title: "Tribal Sub Plan (TSP)",
      concerned_roles: ["TSP I/C"],
      is_custom: false,
      editable_title: false,
      helper:
        "Add activities like Kisan Gosthi, Training & Input distribution, etc. as separate content blocks.",
    },
    {
      key: "SCSP",
      title: "Schedule Caste Sub-Plan (SCSP)",
      concerned_roles: ["SCSP I/C"],
      is_custom: false,
      editable_title: false,
      helper: "Add activities under SCSP with brief descriptions.",
    },
    {
      key: "NEH",
      title: "NEH Component",
      concerned_roles: ["NEH I/C"],
      is_custom: false,
      editable_title: false,
      helper: "Add NEH-related outreach activities.",
    },
    {
      key: "MGMG",
      title: "Mera Gaon Mera Gaurav (MGMG)",
      concerned_roles: ["MGMG I/C"],
      is_custom: false,
      editable_title: false,
      helper: "Add village/cluster-wise outreach details.",
    },
    {
      key: "Other",
      title: "Other (specify)",
      concerned_roles: [],
      is_custom: true,
      editable_title: true,
      helper: "Specify the outreach programme name in the title field.",
    },
  ];

  // Initialize once if empty
  if (!stateList.length) {
    defaultSubs.forEach((sub) => {
      stateList.push({
        id: "out_" + sub.key,
        key: sub.key,
        title: sub.title,
        concerned_roles: sub.concerned_roles,
        blocks: [],
        is_custom: sub.is_custom,
        editable_title: sub.editable_title,
        helper: sub.helper || "",
      });
    });
  }

  function rebuild() {
    container.innerHTML = "";
    stateList.forEach((sub, idx) => {
      container.appendChild(renderOutreachSubsection(sub, idx));
    });
  }

  function renderOutreachSubsection(sub, index) {
    const card = document.createElement("div");
    card.className = "section-card";

    const canEditTitle = sub.editable_title === true || sub.is_custom === true;

    card.innerHTML = `
      <div class="section-card-head">
        ${
          canEditTitle
            ? `<input type="text" class="section-card-title-input" value="${
                sub.title || ""
              }" placeholder="Outreach subsection title">`
            : `<div class="section-card-title">${sub.title}</div>`
        }
        <div class="section-card-actions">
          ${
            sub.is_custom
              ? `<button class="btn btn-light btn-sm out-del">🗑</button>`
              : ""
          }
        </div>
      </div>

      <div class="section-card-body">
        ${
          sub.concerned_roles && sub.concerned_roles.length
            ? `<div class="small-text" style="margin-bottom:4px;">
                 Concerned to: ${sub.concerned_roles.join(", ")}
               </div>`
            : ""
        }
        ${
          sub.helper
            ? `<div class="small-text" style="margin-bottom:6px;">${sub.helper}</div>`
            : ""
        }

        <button class="btn btn-outline out-add-block">➕ Add Outreach Activity</button>

        <div class="sc-block-container" style="margin-top:10px;"></div>
      </div>
    `;

    // Title binding (for editable ones)
    if (canEditTitle) {
      const tInput = card.querySelector(".section-card-title-input");
      tInput.addEventListener("input", (e) => {
        sub.title = e.target.value.trim();
      });
    }

    // Delete custom subsection
    const delBtn = card.querySelector(".out-del");
    if (delBtn) {
      delBtn.addEventListener("click", () => {
        if (!confirm("Delete this outreach subsection?")) return;
        stateList.splice(index, 1);
        rebuild();
      });
    }

    // Add activity (content block)
    const addBlockBtn = card.querySelector(".out-add-block");
    const blockContainer = card.querySelector(".sc-block-container");

    addBlockBtn.addEventListener("click", () => {
      SectionEngine.createBlock(
        blockContainer,
        "outreach_activities",
        sub.blocks
      );
    });

    // Render existing blocks
    sub.blocks.forEach((blk) => {
      const blkUI = SectionEngine._renderBlock(blk, sub.blocks);
      blockContainer.appendChild(blkUI);

      // 🔥 Restore saved text, wordcount, figures, tables after reload
      SectionEngine.restoreBlockAssets(blk, blkUI);
    });

    return card;
  }

  // Add completely new custom outreach subsection
  const addCustomBtn = document.getElementById("outreachAddCustomSubBtn");
  addCustomBtn?.addEventListener("click", () => {
    const t = prompt("Enter custom outreach subsection title:");
    if (!t) return;
    stateList.push({
      id: "out_custom_" + Date.now(),
      key: "custom",
      title: t.trim(),
      concerned_roles: [],
      blocks: [],
      is_custom: true,
      editable_title: true,
      helper: "",
    });
    rebuild();
  });

  rebuild();
}

window.initOutreachSection = initOutreachSection;
