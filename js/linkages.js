// js/linkages.js — FINAL, cleaned, Option-A modals integrated

function initLinkagesSection() {
  const state = AppState.sections.linkages;
  if (!Array.isArray(state.collaborations)) state.collaborations = [];

  const container = document.getElementById("linkagesContainer");

  /* ============================================================
     RENDER
  ============================================================ */
  function render() {
    container.innerHTML = "";

    state.collaborations.forEach((item, idx) => {
      // Ensure structure
      if (!item) state.collaborations[idx] = item = {};
      if (!Array.isArray(item.figures)) item.figures = [];
      if (!Array.isArray(item.tables)) item.tables = [];
      if (!item.text) item.text = "";

      const block = document.createElement("div");
      block.className = "linkages-item-block";

      block.innerHTML = `
        <h3 class="subsection-title">Collaboration ${idx + 1}</h3>

        <label>Description (max 250 words)</label>
        <textarea class="txt" rows="4">${item.text}</textarea>
        <div class="small-text">(You may use [FIG-1], [TAB-1] inside text)</div>

        <div class="upload-group">
          <button class="btn add-figure-btn">➕ Add Figure</button>
          <button class="btn add-table-btn">➕ Add Table</button>
        </div>

        <div class="cb-figure-list"></div>
        <div class="cb-table-list"></div>

        <button class="btn btn-danger btn-sm remove-item">🗑 Remove Item</button>
        <hr>
      `;

      /* --- Bind text area --- */
      const ta = block.querySelector(".txt");
      ta.addEventListener("input", (e) => {
        item.text = e.target.value;
      });

      /* ============================================================
         FIGURES — USING GLOBAL FIGURE MODAL
      ============================================================ */
      const figList = block.querySelector(".cb-figure-list");

      function rerenderFigures() {
        figList.innerHTML = "";
        item.figures.forEach((fig) => renderFigureCard(fig, figList));
      }
      rerenderFigures();

      block.querySelector(".add-figure-btn").addEventListener("click", () => {
        openFigureModal(item, figList); // OPTION-A
      });

      /* ============================================================
         TABLES — USING GLOBAL TABLE MODAL
      ============================================================ */
      const tblList = block.querySelector(".cb-table-list");

      function rerenderTables() {
        tblList.innerHTML = "";
        item.tables.forEach((tbl) => renderTableCard(tbl, tblList));
      }
      rerenderTables();

      block.querySelector(".add-table-btn").addEventListener("click", () => {
        openTableModal(item, tblList); // OPTION-A
      });

      /* ============================================================
         DELETE ENTRY
      ============================================================ */
      block.querySelector(".remove-item").addEventListener("click", () => {
        if (!confirm("Remove this linkage entry?")) return;
        state.collaborations.splice(idx, 1);
        render();
      });

      container.appendChild(block);
    });
  }

  /* ============================================================
     ADD ITEM BUTTON
  ============================================================ */
  document.getElementById("addLinkageItem").addEventListener("click", () => {
    state.collaborations.push({
      text: "",
      figures: [],
      tables: [],
    });
    render();
  });

  render();
}

window.initLinkagesSection = initLinkagesSection;
