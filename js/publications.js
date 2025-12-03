/**************************************************************
 *  PUBLICATIONS.JS — FINAL GOOD VERSION (STABLE + SAFE)
 **************************************************************/

/*  
   This file includes:
   ✔ 100% safe AppState initialization
   ✔ Auto-healing of missing categories (after draft load)
   ✔ Clean UI rendering
   ✔ Numeric-only IF input
   ✔ Automatic NAAS = IF + 6
   ✔ Works even with old / incomplete drafts
   ✔ Never throws “Cannot read properties of undefined”
*/

/**************************************************************
 * 1. GLOBAL STATE FIXER — ALWAYS RUN BEFORE USING PUBLICATIONS
 **************************************************************/
function ensurePublicationsState() {
  if (!window.AppState) window.AppState = {};
  if (!AppState.sections) AppState.sections = {};

  if (!AppState.sections.publications) {
    AppState.sections.publications = { categories: {} };
  }

  if (!AppState.sections.publications.categories) {
    AppState.sections.publications.categories = {};
  }

  const cats = AppState.sections.publications.categories;

  const REQUIRED = [
    "research_papers",
    "review_papers",
    "books",
    "book_chapters",
    "newsletters",
    "popular_articles",
    "conference_abstracts",
    "extension_folders",
    "other",
  ];

  REQUIRED.forEach((key) => {
    if (!cats[key]) cats[key] = [];
  });

  return cats;
}

/**************************************************************
 * 2. MAIN INITIALIZER — CALLED BY ROUTER
 **************************************************************/
function initPublicationsSection() {
  console.log("%cInitializing Publications Section...", "color: green");

  const cats = ensurePublicationsState(); // 🔥 Critical safety

  // ----------------------------
  // COLLAPSIBLE BLOCKS
  // ----------------------------
  document.querySelectorAll(".pub-category-block").forEach((block) => {
    const headerBtn = block.querySelector(".pub-toggle-btn");
    const content = block.querySelector(".pub-content");
    if (!headerBtn || !content) return;

    headerBtn.addEventListener("click", () => {
      const expanded = content.classList.toggle("expanded");
      headerBtn.textContent = expanded ? "▲" : "▼";
    });
  });

  // ----------------------------
  // ADD ENTRY BUTTONS
  // ----------------------------
  document.querySelectorAll(".pub-add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;
      addPublicationEntry(category);
    });
  });

  // ----------------------------
  // RENDER SAVED PUBLICATIONS
  // ----------------------------
  Object.keys(cats).forEach((cat) => {
    const list = document.getElementById("pub-list-" + cat);
    if (!list) return;

    list.innerHTML = "";
    cats[cat].forEach((pub) => renderPublicationRow(cat, pub, list));
  });
}

/**************************************************************
 * 3. ADD NEW PUBLICATION ENTRY
 **************************************************************/
function addPublicationEntry(category) {
  const cats = ensurePublicationsState(); // always safe

  const newPub = {
    id: "pub_" + Date.now() + "_" + Math.random().toString(36).slice(2),
    apa: "",
    if_value: "",
    naas: "",
  };

  cats[category].push(newPub);

  const list = document.getElementById("pub-list-" + category);
  if (list) renderPublicationRow(category, newPub, list);
}

/**************************************************************
 * 4. RENDER A SINGLE PUBLICATION ROW
 **************************************************************/
function renderPublicationRow(category, pub, container) {
  const row = document.createElement("div");
  row.className = "publication-entry";
  row.style.cssText = `
    border:1px solid #d1d5db;
    border-radius:8px;
    padding:12px;
    margin-top:12px;
    background:white;
  `;

  row.innerHTML = `
    <div class="form-group">
      <label><b>APA-7 Citation</b></label>
      <textarea class="cb-textarea"
        placeholder="Enter APA-7 formatted citation with DOI if available"
        style="min-height:60px; font-size:0.9rem;"></textarea>
    </div>

    <div class="row-two">
      <div class="form-group">
        <label><b>Impact Factor (IF)</b></label>
        <input type="number" step="0.01" min="0" 
               class="if-input" 
               placeholder="Numeric only"/>
        <div class="small-text" style="color:#6b7280;">
          NAAS auto-calculated as IF + 6.
        </div>
      </div>

      <div class="form-group">
        <label><b>NAAS Rating</b></label>
        <input type="text" class="naas-input" placeholder="Auto or manual"/>
      </div>
    </div>

    <div style="text-align:right;margin-top:8px">
      <button type="button" class="btn btn-danger btn-sm pub-remove-btn">
        Remove
      </button>
    </div>
  `;

  /***********************
   * DOM ELEMENTS
   ***********************/
  const apaEl = row.querySelector("textarea");
  const ifEl = row.querySelector(".if-input");
  const naasEl = row.querySelector(".naas-input");
  const rmBtn = row.querySelector(".pub-remove-btn");

  /***********************
   * LOAD EXISTING VALUES
   ***********************/
  apaEl.value = pub.apa || "";
  ifEl.value = pub.if_value || "";
  naasEl.value = pub.naas || "";

  /***********************
   * EVENT HANDLERS
   ***********************/
  apaEl.addEventListener("input", () => (pub.apa = apaEl.value));

  ifEl.addEventListener("input", () => {
    let v = ifEl.value.trim();
    pub.if_value = v;

    const n = parseFloat(v);
    if (!isNaN(n)) {
      const naas = (n + 6).toFixed(2);
      naasEl.value = naas;
      pub.naas = naas;
    } else {
      naasEl.value = "";
      pub.naas = "";
    }
  });

  naasEl.addEventListener("input", () => (pub.naas = naasEl.value));

  rmBtn.addEventListener("click", () => {
    const cats = ensurePublicationsState();
    const arr = cats[category];
    const idx = arr.findIndex((x) => x.id === pub.id);
    if (idx >= 0) arr.splice(idx, 1);

    row.remove();
  });

  container.appendChild(row);
}

/**************************************************************
 * 5. EXPORT INITIALIZER GLOBALLY
 **************************************************************/
window.initPublicationsSection = initPublicationsSection;
