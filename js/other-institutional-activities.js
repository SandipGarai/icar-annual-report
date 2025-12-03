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

// ---------------- DEFAULT MEETINGS ----------------
function getDefaultMeetings() {
  return [
    {
      id: "qrt",
      title: "Quinquennial Review Team (QRT) Meeting",
      text: "",
      tables: [],
      figures: [],
    },
    {
      id: "rac",
      title: "Research Advisory Committee (RAC) Meeting",
      text: "",
      tables: [],
      figures: [],
    },
    {
      id: "irc",
      title: "Institute Research Council (IRC) Meeting",
      text: "",
      tables: [],
      figures: [],
    },
  ];
}

// ----------------------------------------------------------
// INITIALIZER (FIXED)
// ----------------------------------------------------------
function initOtherInstitActivities() {
  // Get state
  let state = AppState.sections.other_institutional_activities;

  // --------------------------------------------------------
  // SAFETY: if draft was cleared or state is missing, rebuild structure
  // --------------------------------------------------------
  if (!state || typeof state !== "object") {
    AppState.sections.other_institutional_activities = {
      itmu: { text: "", tables: [], figures: [] },
      abi: { text: "", tables: [], figures: [] },
      meetings: getDefaultMeetings(),
    };
    state = AppState.sections.other_institutional_activities;
  }

  // Ensure sub-objects exist
  if (!state.itmu || typeof state.itmu !== "object") {
    state.itmu = { text: "", tables: [], figures: [] };
  }

  if (!state.abi || typeof state.abi !== "object") {
    state.abi = { text: "", tables: [], figures: [] };
  }

  // Ensure meetings array exists
  if (!Array.isArray(state.meetings)) {
    state.meetings = getDefaultMeetings();
  }

  // If meetings array is empty, add defaults
  if (state.meetings.length === 0) {
    state.meetings = getDefaultMeetings();
  }

  // Ensure arrays in itmu and abi
  state.itmu.figures = safeArray(state.itmu.figures);
  state.itmu.tables = safeArray(state.itmu.tables);
  state.abi.figures = safeArray(state.abi.figures);
  state.abi.tables = safeArray(state.abi.tables);

  // Rebuild meeting objects safely and ensure arrays
  state.meetings = state.meetings.map((m) => ({
    id: m.id || "m_" + Date.now(),
    title: m.title || "Untitled Meeting",
    text: m.text || "",
    tables: safeArray(m.tables),
    figures: safeArray(m.figures),
  }));

  // --------------------------------------------------------
  // ITMU
  // --------------------------------------------------------
  const itmuText = document.getElementById("itmuText");
  const itmuWords = document.getElementById("itmuWords");

  if (!itmuText || !itmuWords) {
    console.warn("ITMU elements not found");
    return;
  }

  itmuText.value = state.itmu.text || "";
  setupWordCounter(itmuText, itmuWords, OA_MAX_WORDS);
  itmuText.addEventListener("input", () => {
    state.itmu.text = itmuText.value;
  });

  renderFigureList("itmuFigures", state.itmu.figures);
  renderTableList("itmuTables", state.itmu.tables);

  const addItmuFigBtn = document.getElementById("addItmuFigure");
  if (addItmuFigBtn) {
    addItmuFigBtn.onclick = () =>
      addFigure(state.itmu.figures, () =>
        renderFigureList("itmuFigures", state.itmu.figures)
      );
  }

  const addItmuTabBtn = document.getElementById("addItmuTable");
  if (addItmuTabBtn) {
    addItmuTabBtn.onclick = () =>
      addTable(state.itmu.tables, () =>
        renderTableList("itmuTables", state.itmu.tables)
      );
  }

  // --------------------------------------------------------
  // ABI
  // --------------------------------------------------------
  const abiText = document.getElementById("abiText");
  const abiWords = document.getElementById("abiWords");

  if (!abiText || !abiWords) {
    console.warn("ABI elements not found");
    return;
  }

  abiText.value = state.abi.text || "";
  setupWordCounter(abiText, abiWords, OA_MAX_WORDS);

  abiText.addEventListener("input", () => {
    state.abi.text = abiText.value;
  });

  renderFigureList("abiFigures", state.abi.figures);
  renderTableList("abiTables", state.abi.tables);

  const addAbiFigBtn = document.getElementById("addAbiFigure");
  if (addAbiFigBtn) {
    addAbiFigBtn.onclick = () =>
      addFigure(state.abi.figures, () =>
        renderFigureList("abiFigures", state.abi.figures)
      );
  }

  const addAbiTabBtn = document.getElementById("addAbiTable");
  if (addAbiTabBtn) {
    addAbiTabBtn.onclick = () =>
      addTable(state.abi.tables, () =>
        renderTableList("abiTables", state.abi.tables)
      );
  }

  // --------------------------------------------------------
  // IMPORTANT MEETINGS
  // --------------------------------------------------------
  const meetingContainer = document.getElementById("meetingsContainer");

  if (!meetingContainer) {
    console.warn("Meeting container not found");
    return;
  }

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
        <textarea class="mtxt" data-i="${idx}" style="width:100%; min-height:100px;">${
        m.text || ""
      }</textarea>
        <div class="word-count" id="wc_${idx}"></div>

        <label style="margin-top:10px;">Figures</label>
        <div id="mf_${idx}"></div>
        <button class="btn btn-primary btn-sm" id="addMF_${idx}">➕ Add Figure</button>

        <label style="margin-top:10px;">Tables</label>
        <div id="mt_${idx}"></div>
        <button class="btn btn-primary btn-sm" id="addMT_${idx}">➕ Add Table</button>

        <button class="btn btn-danger btn-sm" data-del="${idx}" style="margin-top:10px;">🗑 Remove Meeting</button>
      `;

      meetingContainer.appendChild(blk);

      // Text + Counter
      const txt = blk.querySelector(".mtxt");
      const wcEl = blk.querySelector(`#wc_${idx}`);

      if (txt && wcEl) {
        setupWordCounter(txt, wcEl, OA_MAX_WORDS);
        txt.addEventListener("input", (e) => {
          m.text = e.target.value;
        });
      }

      // Figures
      renderFigureList(`mf_${idx}`, m.figures);
      const addFigBtn = document.getElementById(`addMF_${idx}`);
      if (addFigBtn) {
        addFigBtn.onclick = () =>
          addFigure(m.figures, () => renderFigureList(`mf_${idx}`, m.figures));
      }

      // Tables
      renderTableList(`mt_${idx}`, m.tables);
      const addTabBtn = document.getElementById(`addMT_${idx}`);
      if (addTabBtn) {
        addTabBtn.onclick = () =>
          addTable(m.tables, () => renderTableList(`mt_${idx}`, m.tables));
      }
    });

    // Delete Meeting
    meetingContainer.querySelectorAll("button[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.del);
        if (confirm(`Remove "${state.meetings[idx].title}"?`)) {
          state.meetings.splice(idx, 1);
          renderMeetings();
        }
      });
    });
  }

  // Add new meeting type
  const addMeetingBtn = document.getElementById("addMeetingType");
  if (addMeetingBtn) {
    addMeetingBtn.onclick = () => {
      const title = prompt("Enter meeting title:");
      if (!title || title.trim() === "") return;

      state.meetings.push({
        id: "m_" + Date.now(),
        title: title.trim(),
        text: "",
        tables: [],
        figures: [],
      });

      renderMeetings();
    };
  }

  // Initial render of meetings
  renderMeetings();
}

window.initOtherInstitActivities = initOtherInstitActivities;
