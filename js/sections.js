/*****************************************************************
 * UNIVERSAL CONTENT BLOCK ENGINE
 *****************************************************************/

window.SectionEngine = {
  createBlock(container, sectionId, parentPath) {
    const state = AppState.sections[sectionId];
    if (!state) return;

    const blockId =
      "blk_" + Date.now() + "_" + Math.floor(Math.random() * 9999);

    const blockData = {
      id: blockId,
      title: "",
      text: "",
      maxWords: 250,
      figures: [],
      tables: [],
    };

    parentPath.push(blockData);

    const blockEl = this._renderBlock(blockData, parentPath);
    container.appendChild(blockEl);

    showAlert("New content block added.", "success");
  },

  _renderBlock(blockData, parentListRef) {
    const wrapper = document.createElement("div");
    wrapper.className = "content-block";

    wrapper.innerHTML = `
      <div class="cb-header">
        <input type="text" class="cb-title" placeholder="Subheading Title (optional)" value="${blockData.title}">
        <button class="btn btn-danger cb-delete">🗑 Remove</button>
      </div>

      <div class="cb-body">
        <label>Description (200–250 words)</label>
        <textarea class="cb-textarea">${blockData.text}</textarea>

        <div class="small-text">
          Word count: <span class="cb-wordcount">0</span>
        </div>

        <div class="cb-uploads">
          <div class="cb-upload-box">
            <label>Figures</label>
            <button class="add-figure-btn cb-add-figure">➕ Add Figure</button>
            <div class="cb-figure-list"></div>
          </div>

          <div class="cb-upload-box">
            <label>Tables</label>
            <button class="add-table-btn cb-add-table">➕ Add Table</button>
            <div class="cb-table-list"></div>
          </div>
        </div>
      </div>
    `;

    /* TITLE BINDING */
    wrapper.querySelector(".cb-title").addEventListener("input", (e) => {
      blockData.title = e.target.value.trim();
    });

    /* TEXT + WORDCOUNT */
    const textEl = wrapper.querySelector(".cb-textarea");
    const countEl = wrapper.querySelector(".cb-wordcount");

    const updateCount = () => {
      const wc = countWords(textEl.value || "");
      countEl.textContent = wc;
      blockData.text = textEl.value;

      countEl.style.color = wc < 200 || wc > 250 ? "#b91c1c" : "#065f46";
    };

    textEl.addEventListener("input", updateCount);
    updateCount();

    /* DELETE BLOCK */
    wrapper.querySelector(".cb-delete").addEventListener("click", () => {
      if (!confirm("Delete this block?")) return;

      const idx = parentListRef.indexOf(blockData);
      if (idx !== -1) parentListRef.splice(idx, 1);

      wrapper.remove();
      showAlert("Block removed.", "success");
    });

    /* FIGURE BUTTON */
    wrapper.querySelector(".cb-add-figure").addEventListener("click", () => {
      window.openFigureModal(
        blockData,
        wrapper.querySelector(".cb-figure-list")
      );
    });

    /* TABLE BUTTON */
    wrapper.querySelector(".cb-add-table").addEventListener("click", () => {
      window.openTableModal(blockData, wrapper.querySelector(".cb-table-list"));
    });

    return wrapper;
  },

  /*****************************************************************
   * 🔥 RESTORE ALL BLOCK ASSETS ON LOAD
   *****************************************************************/
  restoreBlockAssets(blockData, wrapper) {
    if (!blockData || !wrapper) return;

    /* Restore Title */
    const titleEl = wrapper.querySelector(".cb-title");
    if (titleEl) titleEl.value = blockData.title || "";

    /* Restore Text */
    const txt = wrapper.querySelector(".cb-textarea");
    if (txt) txt.value = blockData.text || "";

    /* Restore Wordcount */
    const wcEl = wrapper.querySelector(".cb-wordcount");
    if (txt && wcEl) {
      const wc = countWords(txt.value || "");
      wcEl.textContent = wc;
      wcEl.style.color = wc < 200 || wc > 250 ? "#b91c1c" : "#065f46";
    }

    /* Restore FIGURES */
    const figList = wrapper.querySelector(".cb-figure-list");
    if (figList && Array.isArray(blockData.figures)) {
      figList.innerHTML = "";
      blockData.figures.forEach((fig) => {
        // Must match figures.js function name
        if (window.renderFigureCard) {
          window.renderFigureCard(fig, figList);
        }
      });
    }

    /* Restore TABLES */
    const tblList = wrapper.querySelector(".cb-table-list");
    if (tblList && Array.isArray(blockData.tables)) {
      tblList.innerHTML = "";
      blockData.tables.forEach((tbl) => {
        if (window.renderTablePreview) {
          const html = window.renderTablePreview(tbl.rows || []);
          const div = document.createElement("div");
          div.className = "tbl-card";
          div.innerHTML = `
            <div class="small-text">
              <b>${tbl.citePlaceholder}</b> — ${tbl.caption}
            </div>
            ${html}
          `;
          tblList.appendChild(div);
        }
      });
    }
  },
};
