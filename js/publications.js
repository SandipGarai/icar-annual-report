// js/publications.js

function initPublicationsSection() {
  const st = AppState.sections.publications;

  // Collapsible headers
  document.querySelectorAll(".pub-category-block").forEach((block) => {
    const headerBtn = block.querySelector(".pub-toggle-btn");
    const content = block.querySelector(".pub-content");

    if (!headerBtn || !content) return;

    headerBtn.addEventListener("click", () => {
      const isOpen = content.classList.contains("expanded");
      if (isOpen) {
        content.classList.remove("expanded");
        headerBtn.textContent = "▼";
      } else {
        content.classList.add("expanded");
        headerBtn.textContent = "▲";
      }
    });
  });

  // Add buttons
  document.querySelectorAll(".pub-add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;
      if (!category) return;
      addPublicationEntry(category);
    });
  });

  // Render any existing entries from state
  const cats = st.categories || {};
  Object.keys(cats).forEach((cat) => {
    const list = document.getElementById("pub-list-" + cat);
    if (!list) return;
    list.innerHTML = "";
    (cats[cat] || []).forEach((pub) => renderPublicationRow(cat, pub, list));
  });
}

function addPublicationEntry(category) {
  const stCat = AppState.sections.publications.categories[category];
  if (!stCat) return;

  const newPub = {
    id: "pub_" + Date.now() + "_" + Math.random().toString(36).slice(2),
    apa: "",
    if_value: "",
    naas: "",
  };

  stCat.push(newPub);

  const list = document.getElementById("pub-list-" + category);
  if (!list) return;

  renderPublicationRow(category, newPub, list);
}

function renderPublicationRow(category, pub, container) {
  const row = document.createElement("div");
  row.className = "publication-entry";

  row.innerHTML = `
    <div class="form-group">
      <label>APA-7 Citation</label>
      <textarea class="cb-textarea" placeholder="Enter full APA-7 style reference with DOI/URL if available"></textarea>
    </div>

    <div class="row-two">
      <div class="form-group">
        <label>Impact Factor (IF) or NAAS (if IF not available)</label>
        <input type="text" class="if-input" placeholder="e.g. 3.25 or NA" />
        <div class="small-text">
          If a numeric IF is entered, NAAS will auto-calculate as IF + 6 (editable).
        </div>
      </div>
      <div class="form-group">
        <label>NAAS Rating</label>
        <input type="text" class="naas-input" placeholder="Auto or manual" />
      </div>
    </div>

    <div class="form-group" style="text-align:right;margin-top:6px">
      <button type="button" class="btn btn-danger btn-sm pub-remove-btn">Remove</button>
    </div>
  `;

  const apaEl = row.querySelector("textarea");
  const ifEl = row.querySelector(".if-input");
  const naasEl = row.querySelector(".naas-input");
  const rmBtn = row.querySelector(".pub-remove-btn");

  // Restore existing data (if re-render)
  apaEl.value = pub.apa || "";
  ifEl.value = pub.if_value || "";
  naasEl.value = pub.naas || "";

  apaEl.addEventListener("input", () => {
    pub.apa = apaEl.value;
  });

  ifEl.addEventListener("input", () => {
    const v = ifEl.value.trim();
    pub.if_value = v;

    const numeric = parseFloat(v);
    if (!isNaN(numeric)) {
      const naas = (numeric + 6).toFixed(2);
      naasEl.value = naas;
      pub.naas = naas;
    } else if (v.toUpperCase() === "NA") {
      // allow manual entry
      pub.naas = naasEl.value;
    } else {
      // neither numeric nor NA → clear auto calc
      // let user type NAAS manually if they wish
    }
  });

  naasEl.addEventListener("input", () => {
    pub.naas = naasEl.value;
  });

  rmBtn.addEventListener("click", () => {
    // remove from state
    const arr = AppState.sections.publications.categories[category];
    const idx = arr.findIndex((x) => x.id === pub.id);
    if (idx >= 0) arr.splice(idx, 1);
    row.remove();
  });

  container.appendChild(row);
}

window.initPublicationsSection = initPublicationsSection;
