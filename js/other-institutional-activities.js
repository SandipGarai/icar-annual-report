// ----------------------------------------------------------
// OTHER INSTITUTIONAL ACTIVITIES – FIXED & FULLY WORKING
// ----------------------------------------------------------

const OA_MAX_WORDS = 250;

// -------------------- WORD COUNTER ------------------------
function setupWordCounter(textArea, counter, maxWords) {
  function update() {
    const words = (textArea.value || "").trim().split(/\s+/).filter(Boolean);
    counter.textContent = `${words.length} / ${maxWords} words`;

    if (words.length > maxWords) {
      textArea.value = words.slice(0, maxWords).join(" ");
    }
  }
  textArea.addEventListener("input", update);
  update();
}

// ---------------- SAFE ARRAY ----------------
function safeArray(x) {
  return Array.isArray(x) ? x : [];
}

// ---------------- RENDER FIGURES ----------------
function renderFigureList(containerId, arr) {
  arr = safeArray(arr);
  const el = document.getElementById(containerId);
  if (!el) return;

  el.innerHTML = "";
  arr.forEach((fig) => {
    const d = document.createElement("div");
    d.className = "fig-card";
    d.innerHTML = `<div class="small-text"><b>${fig.citePlaceholder}</b> — ${fig.caption}</div>`;
    el.appendChild(d);
  });
}

// ---------------- RENDER TABLES ----------------
function renderTableList(containerId, arr) {
  arr = safeArray(arr);
  const el = document.getElementById(containerId);
  if (!el) return;

  el.innerHTML = "";
  arr.forEach((tbl) => {
    const d = document.createElement("div");
    d.className = "tbl-card";
    d.innerHTML = `<div class="small-text"><b>${tbl.citePlaceholder}</b> — ${tbl.caption}</div>`;
    el.appendChild(d);
  });
}

// ---------------- ADD FIGURE WRAPPER ----------------
function addFigure(targetList, refreshFn) {
  window.openFigureModal(
    { figures: targetList },
    {
      appendChild: () => {
        // after modal insertion
        refreshFn();
      },
    }
  );
}

// ---------------- ADD TABLE WRAPPER ----------------
function addTable(targetList, refreshFn) {
  window.openTableModal(
    { tables: targetList },
    {
      appendChild: () => {
        refreshFn();
      },
    }
  );
}

// ----------------------------------------------------------
// INITIALIZER
// ----------------------------------------------------------
function initOtherInstitActivities() {
  const state = AppState.sections.other_institutional_activities;

  // Ensure arrays
  state.itmu.figures = safeArray(state.itmu.figures);
  state.itmu.tables = safeArray(state.itmu.tables);
  state.abi.figures = safeArray(state.abi.figures);
  state.abi.tables = safeArray(state.abi.tables);
  state.meetings.forEach((m) => {
    m.figures = safeArray(m.figures);
    m.tables = safeArray(m.tables);
  });

  // --------------------------------------------------------
  // ITMU
  // --------------------------------------------------------
  const itmuText = document.getElementById("itmuText");
  const itmuWords = document.getElementById("itmuWords");
  itmuText.value = state.itmu.text;
  setupWordCounter(itmuText, itmuWords, OA_MAX_WORDS);

  itmuText.addEventListener("input", () => {
    state.itmu.text = itmuText.value;
  });

  renderFigureList("itmuFigures", state.itmu.figures);
  renderTableList("itmuTables", state.itmu.tables);

  document.getElementById("addItmuFigure").onclick = () =>
    addFigure(state.itmu.figures, () =>
      renderFigureList("itmuFigures", state.itmu.figures)
    );

  document.getElementById("addItmuTable").onclick = () =>
    addTable(state.itmu.tables, () =>
      renderTableList("itmuTables", state.itmu.tables)
    );

  // --------------------------------------------------------
  // ABI
  // --------------------------------------------------------
  const abiText = document.getElementById("abiText");
  const abiWords = document.getElementById("abiWords");
  abiText.value = state.abi.text;
  setupWordCounter(abiText, abiWords, OA_MAX_WORDS);

  abiText.addEventListener("input", () => {
    state.abi.text = abiText.value;
  });

  renderFigureList("abiFigures", state.abi.figures);
  renderTableList("abiTables", state.abi.tables);

  document.getElementById("addAbiFigure").onclick = () =>
    addFigure(state.abi.figures, () =>
      renderFigureList("abiFigures", state.abi.figures)
    );

  document.getElementById("addAbiTable").onclick = () =>
    addTable(state.abi.tables, () =>
      renderTableList("abiTables", state.abi.tables)
    );

  // --------------------------------------------------------
  // IMPORTANT MEETINGS
  // --------------------------------------------------------
  const meetingContainer = document.getElementById("meetingsContainer");

  function renderMeetings() {
    meetingContainer.innerHTML = "";

    state.meetings.forEach((m, idx) => {
      const blk = document.createElement("div");
      blk.className = "meeting-block";
      blk.style.border = "1px solid #e5e7eb";
      blk.style.padding = "12px";
      blk.style.borderRadius = "8px";
      blk.style.marginBottom = "14px";

      blk.innerHTML = `
        <h4>${m.title}</h4>

        <label>Description (max 250 words)</label>
        <textarea class="mtxt" data-i="${idx}">${m.text}</textarea>
        <div class="word-count" id="wc_${idx}"></div>

        <label>Figures</label>
        <div id="mf_${idx}"></div>
        <button class="btn btn-primary btn-sm" id="addMF_${idx}">➕ Add Figure</button>

        <label style="margin-top:10px;">Tables</label>
        <div id="mt_${idx}"></div>
        <button class="btn btn-primary btn-sm" id="addMT_${idx}">➕ Add Table</button>

        <button class="btn btn-danger btn-sm" data-del="${idx}" style="margin-top:10px;">🗑 Remove Meeting</button>
      `;

      meetingContainer.appendChild(blk);

      // Text
      const txt = blk.querySelector(".mtxt");
      const wcEl = blk.querySelector(`#wc_${idx}`);
      setupWordCounter(txt, wcEl, OA_MAX_WORDS);

      txt.addEventListener("input", (e) => (m.text = e.target.value));

      // Figures
      renderFigureList(`mf_${idx}`, m.figures);
      document.getElementById(`addMF_${idx}`).onclick = () =>
        addFigure(m.figures, () => renderFigureList(`mf_${idx}`, m.figures));

      // Tables
      renderTableList(`mt_${idx}`, m.tables);
      document.getElementById(`addMT_${idx}`).onclick = () =>
        addTable(m.tables, () => renderTableList(`mt_${idx}`, m.tables));
    });

    // Remove meeting
    meetingContainer.querySelectorAll("button[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.del);
        state.meetings.splice(idx, 1);
        renderMeetings();
      });
    });
  }

  // Add new meeting type
  document.getElementById("addMeetingType").onclick = () => {
    const title = prompt("Enter meeting title:");
    if (!title) return;

    state.meetings.push({
      id: "m_" + Date.now(),
      title,
      text: "",
      tables: [],
      figures: [],
    });

    renderMeetings();
  };

  renderMeetings();
}

window.initOtherInstitActivities = initOtherInstitActivities;
