// js/annexures.js

function initAnnexuresSection() {
  const state = AppState.sections.annexures;

  // ---------- Helpers ----------

  function calcDurationYMD(start, end) {
    if (!start || !end) return "";
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s) || isNaN(e) || e < s) return "";

    if (
      s.getFullYear() === e.getFullYear() &&
      s.getMonth() === e.getMonth() &&
      s.getDate() === e.getDate()
    ) {
      return "1 day";
    }

    let y = e.getFullYear() - s.getFullYear();
    let m = e.getMonth() - s.getMonth();
    let d = e.getDate() - s.getDate();

    if (d < 0) {
      m -= 1;
      const prevMonth = new Date(e.getFullYear(), e.getMonth(), 0);
      d += prevMonth.getDate();
    }
    if (m < 0) {
      y -= 1;
      m += 12;
    }

    const parts = [];
    if (y > 0) parts.push(y + (y === 1 ? " year" : " years"));
    if (m > 0) parts.push(m + (m === 1 ? " month" : " months"));
    if (d > 0) parts.push(d + (d === 1 ? " day" : " days"));
    return parts.join(" ");
  }

  function getYearLabels() {
    const baseYear = AppState.basic_info?.year
      ? parseInt(AppState.basic_info.year, 10)
      : new Date().getFullYear();

    const prevFY = `${baseYear - 1}-${baseYear}`;
    const currFY = `${baseYear}-${baseYear + 1}`;
    const uptoYear = baseYear - 1;
    return { prevFY, currFY, uptoYear };
  }

  // =====================================
  // 10.1 Ongoing Research Projects (Institutional)
  // =====================================

  const instDiv = document.getElementById("instProjTable");
  if (!Array.isArray(state.institutional_projects)) {
    state.institutional_projects = [];
  }

  function renderInstProj() {
    instDiv.innerHTML = "";

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    thead.innerHTML = `
      <tr>
        <th>Sl. No.</th>
        <th>PI</th>
        <th>Co-PI(s)</th>
        <th>Project Title</th>
        <th>Project Code</th>
        <th>Budget (Lakhs)</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Duration</th>
        <th>Action</th>
      </tr>
    `;

    state.institutional_projects.forEach((row, idx) => {
      if (!row) state.institutional_projects[idx] = row = {};

      row.pi = row.pi || AppState.basic_info?.faculty_name || "";
      row.copi = row.copi || "";
      row.title = row.title || "";
      row.code = row.code || "";
      row.budget = row.budget || "";
      row.start_date = row.start_date || "";
      row.end_date = row.end_date || "";
      row.duration = row.duration || "";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td><input type="text" value="${row.pi}"></td>
        <td><input type="text" value="${row.copi}"></td>
        <td><input type="text" value="${row.title}"></td>
        <td><input type="text" value="${row.code}"></td>
        <td><input type="number" value="${row.budget}"></td>
        <td><input type="date" value="${row.start_date}"></td>
        <td><input type="date" value="${row.end_date}"></td>
        <td class="dur-cell">${row.duration || ""}</td>
        <td><button class="btn btn-danger btn-sm del">🗑</button></td>
      `;

      tr.cells[1].querySelector("input").addEventListener("input", (e) => {
        row.pi = e.target.value;
      });
      tr.cells[2].querySelector("input").addEventListener("input", (e) => {
        row.copi = e.target.value;
      });
      tr.cells[3].querySelector("input").addEventListener("input", (e) => {
        row.title = e.target.value;
      });
      tr.cells[4].querySelector("input").addEventListener("input", (e) => {
        row.code = e.target.value;
      });
      tr.cells[5].querySelector("input").addEventListener("input", (e) => {
        row.budget = e.target.value;
      });

      tr.cells[6].querySelector("input").addEventListener("change", (e) => {
        row.start_date = e.target.value;
        row.duration = calcDurationYMD(row.start_date, row.end_date);
        renderInstProj();
      });
      tr.cells[7].querySelector("input").addEventListener("change", (e) => {
        row.end_date = e.target.value;
        row.duration = calcDurationYMD(row.start_date, row.end_date);
        renderInstProj();
      });

      tr.cells[9].querySelector(".del").addEventListener("click", () => {
        if (!confirm("Delete this project?")) return;
        state.institutional_projects.splice(idx, 1);
        renderInstProj();
      });

      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    instDiv.appendChild(table);
  }

  document.getElementById("addInstProjRow").addEventListener("click", () => {
    state.institutional_projects.push({});
    renderInstProj();
  });

  renderInstProj();

  // =====================================
  // 10.2 Ongoing Research Projects (External)
  // =====================================

  const extDiv = document.getElementById("extProjTable");
  if (!Array.isArray(state.external_projects)) {
    state.external_projects = [];
  }

  function renderExtProj() {
    extDiv.innerHTML = "";

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    thead.innerHTML = `
      <tr>
        <th>Sl. No.</th>
        <th>PI</th>
        <th>Co-PI(s)</th>
        <th>Project Title</th>
        <th>Project Code</th>
        <th>Funding Agency</th>
        <th>Budget (Lakhs)</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Duration</th>
        <th>Action</th>
      </tr>
    `;

    state.external_projects.forEach((row, idx) => {
      if (!row) state.external_projects[idx] = row = {};

      row.pi = row.pi || AppState.basic_info?.faculty_name || "";
      row.copi = row.copi || "";
      row.title = row.title || "";
      row.code = row.code || "";
      row.agency = row.agency || "";
      row.budget = row.budget || "";
      row.start_date = row.start_date || "";
      row.end_date = row.end_date || "";
      row.duration = row.duration || "";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td><input type="text" value="${row.pi}"></td>
        <td><input type="text" value="${row.copi}"></td>
        <td><input type="text" value="${row.title}"></td>
        <td><input type="text" value="${row.code}"></td>
        <td><input type="text" value="${row.agency}"></td>
        <td><input type="number" value="${row.budget}"></td>
        <td><input type="date" value="${row.start_date}"></td>
        <td><input type="date" value="${row.end_date}"></td>
        <td class="dur-cell">${row.duration || ""}</td>
        <td><button class="btn btn-danger btn-sm del">🗑</button></td>
      `;

      tr.cells[1].querySelector("input").addEventListener("input", (e) => {
        row.pi = e.target.value;
      });
      tr.cells[2].querySelector("input").addEventListener("input", (e) => {
        row.copi = e.target.value;
      });
      tr.cells[3].querySelector("input").addEventListener("input", (e) => {
        row.title = e.target.value;
      });
      tr.cells[4].querySelector("input").addEventListener("input", (e) => {
        row.code = e.target.value;
      });
      tr.cells[5].querySelector("input").addEventListener("input", (e) => {
        row.agency = e.target.value;
      });
      tr.cells[6].querySelector("input").addEventListener("input", (e) => {
        row.budget = e.target.value;
      });

      tr.cells[7].querySelector("input").addEventListener("change", (e) => {
        row.start_date = e.target.value;
        row.duration = calcDurationYMD(row.start_date, row.end_date);
        renderExtProj();
      });
      tr.cells[8].querySelector("input").addEventListener("change", (e) => {
        row.end_date = e.target.value;
        row.duration = calcDurationYMD(row.start_date, row.end_date);
        renderExtProj();
      });

      tr.cells[10].querySelector(".del").addEventListener("click", () => {
        if (!confirm("Delete this project?")) return;
        state.external_projects.splice(idx, 1);
        renderExtProj();
      });

      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    extDiv.appendChild(table);
  }

  document.getElementById("addExtProjRow").addEventListener("click", () => {
    state.external_projects.push({});
    renderExtProj();
  });

  renderExtProj();

  // =====================================
  // 10.3.1 Budget Utilization  (CLEAN VERSION, NO XLSX UPLOAD)
  // =====================================

  const budgetDiv = document.getElementById("budgetUtilTable");

  // State preparation
  if (!state.budget_utilization) {
    state.budget_utilization = { rows: [] };
  }
  if (!Array.isArray(state.budget_utilization.rows)) {
    state.budget_utilization.rows = [];
  }

  // ------------------------------
  // % Calculation Helper
  // ------------------------------
  function updateBudgetRow(row) {
    const re = parseFloat(row.re) || 0;
    const exp = parseFloat(row.exp) || 0;
    const upto = parseFloat(row.upto) || 0;
    const be = parseFloat(row.be) || 0;

    row.exp_pct = re > 0 ? ((exp / re) * 100).toFixed(2) : "";
    row.upto_pct = be > 0 ? ((upto / be) * 100).toFixed(2) : "";
  }

  // ------------------------------
  // Compute Total Row
  // ------------------------------
  function updateBudgetTotals() {
    const rows = state.budget_utilization.rows;

    let totalRow = rows.find((r) => r.head?.toLowerCase() === "total");
    if (!totalRow) {
      totalRow = { head: "Total" };
      rows.push(totalRow);
    }

    let sumRE = 0,
      sumExp = 0,
      sumUpto = 0,
      sumBE = 0;

    rows.forEach((r) => {
      if (!r || r.head?.toLowerCase() === "total") return;

      sumRE += parseFloat(r.re) || 0;
      sumExp += parseFloat(r.exp) || 0;
      sumUpto += parseFloat(r.upto) || 0;
      sumBE += parseFloat(r.be) || 0;
    });

    totalRow.re = sumRE.toFixed(2);
    totalRow.exp = sumExp.toFixed(2);
    totalRow.upto = sumUpto.toFixed(2);
    totalRow.be = sumBE.toFixed(2);

    // Average % for total row
    const nonTotals = rows.filter((r) => r.head?.toLowerCase() !== "total");

    const avgExpPct =
      nonTotals.reduce((a, r) => a + (parseFloat(r.exp_pct) || 0), 0) /
      (nonTotals.length || 1);

    const avgUptoPct =
      nonTotals.reduce((a, r) => a + (parseFloat(r.upto_pct) || 0), 0) /
      (nonTotals.length || 1);

    totalRow.exp_pct = avgExpPct.toFixed(2);
    totalRow.upto_pct = avgUptoPct.toFixed(2);
  }

  // ------------------------------
  // Add New Row Above Total
  // ------------------------------
  function addBudgetRow() {
    const rows = state.budget_utilization.rows;

    const newRow = {
      head: "",
      re: "",
      exp: "",
      exp_pct: "",
      be: "",
      upto: "",
      upto_pct: "",
    };

    const totalIndex = rows.findIndex((r) => r.head?.toLowerCase() === "total");

    if (totalIndex === -1) {
      rows.push(newRow);
    } else {
      rows.splice(totalIndex, 0, newRow);
    }

    updateBudgetTotals();
    renderBudget();
  }

  // ------------------------------
  // Bind Add Row Button
  // ------------------------------
  function bindBudgetButtons() {
    const addBtn = document.getElementById("budgetAddRowBtn");
    if (addBtn) addBtn.addEventListener("click", addBudgetRow);
  }

  // ------------------------------
  // Render UI Table
  // ------------------------------
  function renderBudget() {
    budgetDiv.innerHTML = "";

    const { prevFY, currFY, uptoYear } = getYearLabels();

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    thead.innerHTML = `
    <tr>
      <th>Head</th>
      <th>RE (${prevFY})</th>
      <th>Total expenditure (${prevFY})</th>
      <th>Total expenditure (%)</th>
      <th>BE (${currFY})</th>
      <th>Total expenditure upto 31-12-${uptoYear}</th>
      <th>Total expenditure upto 31-12-${uptoYear} (%)</th>
      <th>Action</th>
    </tr>
  `;

    // Sort rows to keep Total at bottom
    state.budget_utilization.rows.sort((a, b) => {
      const aT = a.head?.toLowerCase() === "total";
      const bT = b.head?.toLowerCase() === "total";
      return aT === bT ? 0 : aT ? 1 : -1;
    });

    // Render rows
    state.budget_utilization.rows.forEach((row, idx) => {
      if (!row) state.budget_utilization.rows[idx] = row = {};
      row.head = row.head || "";
      row.re = row.re || "";
      row.exp = row.exp || "";
      row.exp_pct = row.exp_pct || "";
      row.be = row.be || "";
      row.upto = row.upto || "";
      row.upto_pct = row.upto_pct || "";

      const tr = document.createElement("tr");
      tr.innerHTML = `
      <td><input type="text" value="${row.head}"></td>
      <td><input type="number" value="${row.re}"></td>
      <td><input type="number" value="${row.exp}"></td>
      <td><input type="text" value="${row.exp_pct}"></td>
      <td><input type="number" value="${row.be}"></td>
      <td><input type="number" value="${row.upto}"></td>
      <td><input type="text" value="${row.upto_pct}"></td>
      <td><button class="btn btn-danger btn-sm del">🗑</button></td>
    `;

      const inputs = tr.querySelectorAll("td input");

      // Input handlers
      inputs[0].addEventListener("input", (e) => (row.head = e.target.value));

      inputs[1].addEventListener("input", (e) => {
        row.re = e.target.value;
        updateBudgetRow(row);
        updateBudgetTotals();
      });

      inputs[2].addEventListener("input", (e) => {
        row.exp = e.target.value;
        updateBudgetRow(row);
        updateBudgetTotals();
      });

      inputs[3].addEventListener("input", (e) => {
        row.exp_pct = e.target.value;
      });

      inputs[4].addEventListener("input", (e) => {
        row.be = e.target.value;
        updateBudgetRow(row);
        updateBudgetTotals();
      });

      inputs[5].addEventListener("input", (e) => {
        row.upto = e.target.value;
        updateBudgetRow(row);
        updateBudgetTotals();
      });

      inputs[6].addEventListener("input", (e) => {
        row.upto_pct = e.target.value;
      });

      tr.querySelector(".del").addEventListener("click", () => {
        if (!confirm("Delete this row?")) return;
        state.budget_utilization.rows.splice(idx, 1);
        renderBudget();
      });

      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    budgetDiv.appendChild(table);
  }

  // ------------------------------
  // Preload default rows button
  // ------------------------------
  document
    .getElementById("initBudgetTableBtn")
    .addEventListener("click", () => {
      state.budget_utilization.rows = [
        { head: "GIA General, Other than NEH TSP & SCSP" },
        { head: "GIA Capital, Other than NEH TSP & SCSP" },
        { head: "GIA General, NEH" },
        { head: "GIA Capital, NEH" },
        { head: "GIA General, TSP" },
        { head: "GIA Capital, TSP" },
        { head: "GIA General, SCSP" },
        { head: "GIA Capital, SCSP" },
        { head: "Total" },
      ];

      renderBudget();
    });

  // INITIAL RENDER
  renderBudget();
  bindBudgetButtons();

  // =====================================
  // 10.3.1 (A) Other Details
  // =====================================

  if (!state.budget_utilization.other_details) {
    state.budget_utilization.other_details = {
      text: "",
      tables: [],
      figures: [],
    };
  }

  const otherText = document.getElementById("budgetOtherText");
  const otherTableDiv = document.getElementById("budgetOtherTables");
  const otherFigureDiv = document.getElementById("budgetOtherFigures");

  otherText.value = state.budget_utilization.other_details.text || "";

  otherText.addEventListener("input", (e) => {
    state.budget_utilization.other_details.text = e.target.value;
  });

  // Render tables
  function renderOtherTables() {
    otherTableDiv.innerHTML = "";
    state.budget_utilization.other_details.tables.forEach((tbl) => {
      renderTableCard(tbl, otherTableDiv);
    });
  }

  // Render figures
  function renderOtherFigures() {
    otherFigureDiv.innerHTML = "";
    state.budget_utilization.other_details.figures.forEach((fig) => {
      renderFigureCard(fig, otherFigureDiv);
    });
  }

  // Add Table
  document
    .getElementById("addBudgetOtherTable")
    .addEventListener("click", () => {
      openTableModal(state.budget_utilization.other_details, otherTableDiv);
    });

  // Add Figure
  document
    .getElementById("addBudgetOtherFigure")
    .addEventListener("click", () => {
      openFigureModal(state.budget_utilization.other_details, otherFigureDiv);
    });

  // Initial render
  renderOtherTables();
  renderOtherFigures();

  // =====================================
  // 10.3.2 Revenue Generation
  // =====================================

  const revDiv = document.getElementById("revenueTable");
  if (!state.revenue_generation) state.revenue_generation = { rows: [] };
  if (!Array.isArray(state.revenue_generation.rows)) {
    state.revenue_generation.rows = [];
  }

  function renderRevenue() {
    revDiv.innerHTML = "";

    const { prevFY, currFY } = getYearLabels();
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const baseYear = AppState.basic_info?.year
      ? parseInt(AppState.basic_info.year, 10)
      : new Date().getFullYear();

    thead.innerHTML = `
      <tr>
        <th>Head</th>
        <th>FY (${prevFY})</th>
        <th>FY (${currFY}) upto 31-12-${baseYear}</th>
        <th>Action</th>
      </tr>
    `;

    state.revenue_generation.rows.forEach((row, idx) => {
      if (!row) state.revenue_generation.rows[idx] = row = {};
      row.head = row.head || "";
      row.prev = row.prev || "";
      row.curr = row.curr || "";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="text" value="${row.head}"></td>
        <td><input type="number" value="${row.prev}"></td>
        <td><input type="number" value="${row.curr}"></td>
        <td><button class="btn btn-danger btn-sm del">🗑</button></td>
      `;

      tr.querySelector(".del").addEventListener("click", () => {
        if (!confirm("Delete this row?")) return;
        state.revenue_generation.rows.splice(idx, 1);
        renderRevenue();
      });

      tr.cells[0].querySelector("input").addEventListener("input", (e) => {
        row.head = e.target.value;
      });
      tr.cells[1].querySelector("input").addEventListener("input", (e) => {
        row.prev = e.target.value;
      });
      tr.cells[2].querySelector("input").addEventListener("input", (e) => {
        row.curr = e.target.value;
      });

      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    revDiv.appendChild(table);
  }

  document.getElementById("addRevenueRow").addEventListener("click", () => {
    if (!state.revenue_generation.rows.length) {
      state.revenue_generation.rows.push({
        head: "Revenue generation",
        prev: "",
        curr: "",
      });
    } else {
      state.revenue_generation.rows.push({ head: "", prev: "", curr: "" });
    }
    renderRevenue();
  });

  renderRevenue();

  // =====================================
  // 10.4 Developmental Works (Figures only, Option A)
  // =====================================

  const devContainer = document.getElementById("devWorksContainer");
  if (!state.developmental_works) {
    state.developmental_works = {
      lab: [],
      farm: [],
      infrastructure: [],
      other: [],
    };
  }

  const devSections = [
    { key: "lab", title: "Laboratory Development" },
    { key: "farm", title: "Farm Development" },
    { key: "infrastructure", title: "Infrastructure Development" },
    { key: "other", title: "Other Developmental Works" },
  ];

  function renderDevWorks() {
    devContainer.innerHTML = "";

    devSections.forEach((sec) => {
      const items =
        state.developmental_works[sec.key] ||
        (state.developmental_works[sec.key] = []);
      const wrap = document.createElement("div");
      wrap.className = "dev-block";

      wrap.innerHTML = `
        <h4>${sec.title}</h4>
        <button class="btn btn-secondary btn-sm addDev">➕ Add Work</button>
        <div class="dev-items"></div>
      `;

      const itemsDiv = wrap.querySelector(".dev-items");

      wrap.querySelector(".addDev").addEventListener("click", () => {
        items.push({ text: "", figures: [] });
        renderDevWorks();
      });

      items.forEach((it, idx) => {
        if (!it) items[idx] = it = {};
        if (!Array.isArray(it.figures)) it.figures = [];
        it.text = it.text || "";

        const block = document.createElement("div");
        block.className = "dev-item-card";
        block.innerHTML = `
          <textarea class="text-input dev-text" rows="2" placeholder="20–40 words">${it.text}</textarea>
          <div class="upload-group">
            <button class="btn add-figure-btn addFig">➕ Add Figure</button>
          </div>
          <div class="fig-block"></div>
          <button class="btn btn-danger btn-sm delItem">🗑 Remove</button>
        `;

        block
          .querySelector(".dev-text")
          .addEventListener("input", (e) => (it.text = e.target.value));

        const figBlock = block.querySelector(".fig-block");

        function renderDevFigs() {
          figBlock.innerHTML = "";
          (it.figures || []).forEach((fig) => {
            renderFigureCard(fig, figBlock);
          });
        }

        block.querySelector(".addFig").addEventListener("click", () => {
          if (!Array.isArray(it.figures)) it.figures = [];
          openFigureModal(it, figBlock);
        });

        renderDevFigs();

        block.querySelector(".delItem").addEventListener("click", () => {
          if (!confirm("Remove this work item?")) return;
          items.splice(idx, 1);
          renderDevWorks();
        });

        itemsDiv.appendChild(block);
      });

      devContainer.appendChild(wrap);
    });
  }

  renderDevWorks();

  // =====================================
  // 10.5 Important Committees
  // =====================================

  const committeesDiv = document.getElementById("committeesContainer");
  if (!state.committees) {
    state.committees = {
      qrt: { text: "", members: [] },
      rac: { text: "", members: [] },
      imc: { text: "", members: [] },
      irc: { text: "", members: [] },
      other: { text: "", members: [] },
    };
  }

  const commMeta = [
    { key: "qrt", title: "Quinquennial Review Team (QRT)" },
    { key: "rac", title: "Research Advisory Committee (RAC)" },
    { key: "imc", title: "Institute Management Committee (IMC)" },
    { key: "irc", title: "Institute Research Council (IRC)" },
    { key: "other", title: "Other Committees" },
  ];

  function renderCommittees() {
    committeesDiv.innerHTML = "";

    commMeta.forEach((meta) => {
      const obj =
        state.committees[meta.key] ||
        (state.committees[meta.key] = { text: "", members: [] });
      if (!Array.isArray(obj.members)) obj.members = [];

      const wrap = document.createElement("div");
      wrap.className = "committee-card";
      wrap.innerHTML = `
        <h4>${meta.title}</h4>

        <label>Summary (200–250 words)</label>
        <textarea class="text-input comm-text" rows="3">${obj.text}</textarea>

        <!-- NEW FIGURE UPLOAD OPTION (OPTION A) -->
        <div class="upload-group" style="margin-top:8px;">
          <button class="btn add-figure-btn addCommFig">➕ Add Figure</button>
        </div>
        <div class="cb-figure-list comm-figures"></div>

        <h5>Committee Composition</h5>
        <button class="btn btn-secondary btn-sm addMember">➕ Add Row</button>
        <div class="table-container comm-table"></div>
      `;

      wrap
        .querySelector(".comm-text")
        .addEventListener("input", (e) => (obj.text = e.target.value));
      /* Add Figures to Committees (OPTION A GLOBAL MODAL) */
      const figList = wrap.querySelector(".comm-figures");

      function renderCommFigures() {
        figList.innerHTML = "";
        (obj.figures || []).forEach((fig) => {
          renderFigureCard(fig, figList);
        });
      }

      wrap.querySelector(".addCommFig").addEventListener("click", () => {
        if (!obj.figures) obj.figures = [];
        openFigureModal(obj, figList);
      });

      renderCommFigures();

      const tDiv = wrap.querySelector(".comm-table");

      function renderMembers() {
        tDiv.innerHTML = "";
        if (!obj.members.length) return;

        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const tbody = document.createElement("tbody");

        thead.innerHTML = `
          <tr>
            <th>Chairman / Members</th>
            <th>Names & Designations</th>
            <th>Action</th>
          </tr>
        `;

        obj.members.forEach((row, idx) => {
          if (!row) obj.members[idx] = row = {};
          row.role = row.role || "";
          row.names = row.names || "";

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td><input type="text" value="${row.role}"></td>
            <td><input type="text" value="${row.names}"></td>
            <td><button class="btn btn-danger btn-sm del">🗑</button></td>
          `;

          tr.cells[0]
            .querySelector("input")
            .addEventListener("input", (e) => (row.role = e.target.value));
          tr.cells[1]
            .querySelector("input")
            .addEventListener("input", (e) => (row.names = e.target.value));
          tr.cells[2].querySelector(".del").addEventListener("click", () => {
            obj.members.splice(idx, 1);
            renderMembers();
          });

          tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        tDiv.appendChild(table);
      }

      wrap.querySelector(".addMember").addEventListener("click", () => {
        obj.members.push({ role: "", names: "" });
        renderMembers();
      });

      renderMembers();
      committeesDiv.appendChild(wrap);
    });
  }

  renderCommittees();

  // =====================================
  // 10.6 Nodal Officers & Responsibilities
  // =====================================

  const nodalDiv = document.getElementById("nodalTable");
  if (!state.nodal_officers) state.nodal_officers = { rows: [] };
  if (!Array.isArray(state.nodal_officers.rows)) {
    state.nodal_officers.rows = [];
  }

  const defaultResponsibilities = [
    "NEH",
    "PME",
    "ITMU",
    "Rajbhasha Implementation",
    "TSP",
    "HRD",
    "Library",
    "RAC member Secretary",
    "Media Prabhari",
    "Swachha Bharat Abhiyan",
    "SCSP",
    "ICAR-MIS",
    "ERP",
    "AEBAS",
    "MGMG",
    "RTI",
    "ABI",
    "ARMS",
    "Vigilance",
    "KRISHI Portal",
    "NIC",
    "GeM",
    "e-office",
    "e-HRMS 2.0",
    "SPARROW",
  ];

  function renderNodal() {
    nodalDiv.innerHTML = "";

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    thead.innerHTML = `
      <tr>
        <th>Sl. No.</th>
        <th>Responsibilities</th>
        <th>Nodal Officers</th>
        <th>Action</th>
      </tr>
    `;

    state.nodal_officers.rows.forEach((row, idx) => {
      if (!row) state.nodal_officers.rows[idx] = row = {};
      row.responsibility = row.responsibility || "";
      row.officer = row.officer || "";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td><input type="text" value="${row.responsibility}"></td>
        <td><input type="text" value="${row.officer}"></td>
        <td><button class="btn btn-danger btn-sm del">🗑</button></td>
      `;

      tr.cells[1]
        .querySelector("input")
        .addEventListener(
          "input",
          (e) => (row.responsibility = e.target.value)
        );
      tr.cells[2]
        .querySelector("input")
        .addEventListener("input", (e) => (row.officer = e.target.value));
      tr.cells[3].querySelector(".del").addEventListener("click", () => {
        state.nodal_officers.rows.splice(idx, 1);
        renderNodal();
      });

      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    nodalDiv.appendChild(table);
  }

  document
    .getElementById("loadDefaultNodalRows")
    .addEventListener("click", () => {
      state.nodal_officers.rows = defaultResponsibilities.map((r) => ({
        responsibility: r,
        officer: "",
      }));
      renderNodal();
    });

  document.getElementById("addNodalRow").addEventListener("click", () => {
    state.nodal_officers.rows.push({ responsibility: "", officer: "" });
    renderNodal();
  });

  renderNodal();

  // =====================================
  // 10.7 Distinguished Visitors (Figures via Option A)
  // =====================================

  const visitorsDiv = document.getElementById("visitorsContainer");
  if (!Array.isArray(state.distinguished_visitors)) {
    state.distinguished_visitors = [];
  }

  function renderVisitors() {
    visitorsDiv.innerHTML = "";

    state.distinguished_visitors.forEach((v, idx) => {
      if (!v) state.distinguished_visitors[idx] = v = {};
      if (!Array.isArray(v.figures)) v.figures = [];
      v.name = v.name || "";
      v.designation = v.designation || "";
      v.date = v.date || "";

      const card = document.createElement("div");
      card.className = "dev-item-card";
      card.innerHTML = `
        <h4>Visitor ${idx + 1}</h4>
        <label>Name</label>
        <input type="text" class="text-input name" value="${v.name}">
        <label>Designation</label>
        <input type="text" class="text-input desig" value="${v.designation}">
        <label>Date of Visit</label>
        <input type="date" class="text-input date" value="${v.date}">
        <div class="upload-group" style="margin-top:8px;">
          <button class="btn add-figure-btn addFig">➕ Add Figure</button>
        </div>
        <div class="fig-block"></div>
        <button class="btn btn-danger btn-sm delVisitor" style="margin-top:6px;">🗑 Remove</button>
      `;

      card.querySelector(".name").addEventListener("input", (e) => {
        v.name = e.target.value;
      });
      card.querySelector(".desig").addEventListener("input", (e) => {
        v.designation = e.target.value;
      });
      card.querySelector(".date").addEventListener("change", (e) => {
        v.date = e.target.value;
      });

      const figBlock = card.querySelector(".fig-block");

      function renderVisitorFigs() {
        figBlock.innerHTML = "";
        (v.figures || []).forEach((fig) => {
          renderFigureCard(fig, figBlock);
        });
      }

      card.querySelector(".addFig").addEventListener("click", () => {
        if (!Array.isArray(v.figures)) v.figures = [];
        openFigureModal(v, figBlock);
      });

      renderVisitorFigs();

      card.querySelector(".delVisitor").addEventListener("click", () => {
        if (!confirm("Remove this visitor?")) return;
        state.distinguished_visitors.splice(idx, 1);
        renderVisitors();
      });

      visitorsDiv.appendChild(card);
    });
  }

  document.getElementById("addVisitor").addEventListener("click", () => {
    state.distinguished_visitors.push({
      name: "",
      designation: "",
      date: "",
      figures: [],
    });
    renderVisitors();
  });

  renderVisitors();

  // =====================================
  // 10.8 Inauguration of New Facilities (Option A figs + tables)
  // =====================================

  const newFacilitiesDiv = document.getElementById("newFacilitiesContainer");
  if (!Array.isArray(state.new_facilities)) {
    state.new_facilities = [];
  }

  function renderNewFacilities() {
    newFacilitiesDiv.innerHTML = "";

    state.new_facilities.forEach((f, idx) => {
      if (!f) state.new_facilities[idx] = f = {};
      if (!Array.isArray(f.tables)) f.tables = [];
      if (!Array.isArray(f.figures)) f.figures = [];
      f.facility = f.facility || "";
      f.date = f.date || "";
      f.note = f.note || "";

      const card = document.createElement("div");
      card.className = "dev-item-card";
      card.innerHTML = `
        <h4>Facility ${idx + 1}</h4>
        <label>Facility Name</label>
        <input type="text" class="text-input fac-name" value="${f.facility}">
        <label>Date</label>
        <input type="date" class="text-input fac-date" value="${f.date}">
        <label>Short Note (optional)</label>
        <textarea class="text-input fac-note" rows="2">${f.note}</textarea>

        <div class="upload-group">
          <button class="btn add-table-btn addTable">➕ Add Table</button>
          <button class="btn add-figure-btn addFig">➕ Add Figure</button>
        </div>
        <div class="table-block"></div>
        <div class="fig-block"></div>

        <button class="btn btn-danger btn-sm delFacility" style="margin-top:6px;">🗑 Remove</button>
      `;

      card.querySelector(".fac-name").addEventListener("input", (e) => {
        f.facility = e.target.value;
      });
      card.querySelector(".fac-date").addEventListener("change", (e) => {
        f.date = e.target.value;
      });
      card.querySelector(".fac-note").addEventListener("input", (e) => {
        f.note = e.target.value;
      });

      const tableBlock = card.querySelector(".table-block");
      const figBlock = card.querySelector(".fig-block");

      function renderFacilityTables() {
        tableBlock.innerHTML = "";
        (f.tables || []).forEach((tbl) => {
          renderTableCard(tbl, tableBlock);
        });
      }

      function renderFacilityFigs() {
        figBlock.innerHTML = "";
        (f.figures || []).forEach((fig) => {
          renderFigureCard(fig, figBlock);
        });
      }

      card.querySelector(".addTable").addEventListener("click", () => {
        if (!Array.isArray(f.tables)) f.tables = [];
        openTableModal(f, tableBlock);
      });

      card.querySelector(".addFig").addEventListener("click", () => {
        if (!Array.isArray(f.figures)) f.figures = [];
        openFigureModal(f, figBlock);
      });

      renderFacilityTables();
      renderFacilityFigs();

      card.querySelector(".delFacility").addEventListener("click", () => {
        if (!confirm("Remove this facility?")) return;
        state.new_facilities.splice(idx, 1);
        renderNewFacilities();
      });

      newFacilitiesDiv.appendChild(card);
    });
  }

  document.getElementById("addNewFacility").addEventListener("click", () => {
    state.new_facilities.push({
      facility: "",
      date: "",
      note: "",
      tables: [],
      figures: [],
    });
    renderNewFacilities();
  });

  renderNewFacilities();

  // =====================================
  // 10.9 Infrastructure Development in Progress (Figures Option A)
  // =====================================

  const infraDiv = document.getElementById("infraProgressContainer");
  if (!Array.isArray(state.infra_in_progress)) {
    state.infra_in_progress = [];
  }

  function renderInfraProgress() {
    infraDiv.innerHTML = "";

    state.infra_in_progress.forEach((it, idx) => {
      if (!it) state.infra_in_progress[idx] = it = {};
      if (!Array.isArray(it.figures)) it.figures = [];
      it.name = it.name || "";
      it.note = it.note || "";

      const card = document.createElement("div");
      card.className = "dev-item-card";
      card.innerHTML = `
        <h4>Infrastructure ${idx + 1}</h4>
        <label>Infrastructure Name</label>
        <input type="text" class="text-input infra-name" value="${it.name}">
        <label>Short Note (optional)</label>
        <textarea class="text-input infra-note" rows="2">${it.note}</textarea>

        <div class="upload-group">
          <button class="btn add-figure-btn addFig">➕ Add Figure</button>
        </div>
        <div class="fig-block"></div>

        <button class="btn btn-danger btn-sm delInfra" style="margin-top:6px;">🗑 Remove</button>
      `;

      card.querySelector(".infra-name").addEventListener("input", (e) => {
        it.name = e.target.value;
      });
      card.querySelector(".infra-note").addEventListener("input", (e) => {
        it.note = e.target.value;
      });

      const figBlock = card.querySelector(".fig-block");

      function renderInfraFigs() {
        figBlock.innerHTML = "";
        (it.figures || []).forEach((fig) => {
          renderFigureCard(fig, figBlock);
        });
      }

      card.querySelector(".addFig").addEventListener("click", () => {
        if (!Array.isArray(it.figures)) it.figures = [];
        openFigureModal(it, figBlock);
      });

      renderInfraFigs();

      card.querySelector(".delInfra").addEventListener("click", () => {
        if (!confirm("Remove this item?")) return;
        state.infra_in_progress.splice(idx, 1);
        renderInfraProgress();
      });

      infraDiv.appendChild(card);
    });
  }

  document
    .getElementById("addInfraInProgress")
    .addEventListener("click", () => {
      state.infra_in_progress.push({
        name: "",
        note: "",
        figures: [],
      });
      renderInfraProgress();
    });

  renderInfraProgress();

  // =====================================
  // 10.10 Staff Positions / Appointments / Promotions / Transfers / New Joining
  // =====================================

  const staffDiv = document.getElementById("staffPositionsContainer");
  if (!AppState.sections.annexures.staff_positions) {
    AppState.sections.annexures.staff_positions = {};
  }
  state.staff_positions = AppState.sections.annexures.staff_positions;
  const sp = state.staff_positions;

  // BaseYear (dynamic)
  const baseYear = AppState.basic_info?.year
    ? parseInt(AppState.basic_info.year, 10)
    : new Date().getFullYear();

  // ----- Ensure staff strength structure -----
  if (!sp.strength) {
    sp.strength = {
      scientific: { rows: [] },
      administrative: { rows: [] },
      technical: { rows: [] },
      other_staff: [],
    };
  }

  ["scientific", "administrative", "technical"].forEach((g) => {
    if (!Array.isArray(sp.strength[g].rows)) sp.strength[g].rows = [];
  });

  if (!Array.isArray(sp.strength.other_staff)) sp.strength.other_staff = [];

  // ---- default rows + totals ----
  function initDefaultStaffRows() {
    if (!sp.strength.scientific.rows.length) {
      sp.strength.scientific.rows = [
        {
          category: "RMP (Director + Joint Director)",
          sanctioned: "",
          filled: "",
          baseyear: "",
        },
        {
          category: "Principal Scientist",
          sanctioned: "",
          filled: "",
          baseyear: "",
        },
        {
          category: "Senior Scientist",
          sanctioned: "",
          filled: "",
          baseyear: "",
        },
        { category: "Scientist", sanctioned: "", filled: "", baseyear: "" },
        { category: "Total", sanctioned: "0", filled: "0", baseyear: "" },
      ];
    }

    if (!sp.strength.administrative.rows.length) {
      sp.strength.administrative.rows = [
        { category: "CAO (SG)", sanctioned: "", filled: "", baseyear: "" },
        { category: "Comptroller", sanctioned: "", filled: "", baseyear: "" },
        { category: "Sr. F&AO", sanctioned: "", filled: "", baseyear: "" },
        { category: "CF & AO", sanctioned: "", filled: "", baseyear: "" },
        { category: "Sr. AO", sanctioned: "", filled: "", baseyear: "" },
        { category: "AO", sanctioned: "", filled: "", baseyear: "" },
        { category: "AAO", sanctioned: "", filled: "", baseyear: "" },
        { category: "PS", sanctioned: "", filled: "", baseyear: "" },
        { category: "PA", sanctioned: "", filled: "", baseyear: "" },
        { category: "Assistant", sanctioned: "", filled: "", baseyear: "" },
        { category: "UDC", sanctioned: "", filled: "", baseyear: "" },
        { category: "LDC", sanctioned: "", filled: "", baseyear: "" },
        {
          category: "Official Language Staff",
          sanctioned: "",
          filled: "",
          baseyear: "",
        },
        { category: "Total", sanctioned: "0", filled: "0", baseyear: "" },
      ];
    }

    if (!sp.strength.technical.rows.length) {
      sp.strength.technical.rows = [
        { category: "T-1", sanctioned: "", filled: "", baseyear: "" },
        { category: "T-3", sanctioned: "", filled: "", baseyear: "" },
        { category: "T-6", sanctioned: "", filled: "", baseyear: "" },
        { category: "Total", sanctioned: "0", filled: "0", baseyear: "" },
      ];
    }
  }

  function updateStaffTotals(group) {
    const rows = group.rows || [];

    let totalRow = rows.find((r) => r.category?.toLowerCase() === "total");

    if (!totalRow) {
      totalRow = {
        category: "Total",
        sanctioned: "0",
        filled: "0",
        baseyear: "0",
      };
      rows.push(totalRow);
    }

    let san = 0,
      fil = 0,
      base = 0;

    rows.forEach((r) => {
      if (!r || r.category?.toLowerCase() === "total") return;
      san += Number(r.sanctioned) || 0;
      fil += Number(r.filled) || 0;
      base += Number(r.baseyear) || 0;
    });

    totalRow.sanctioned = san.toString();
    totalRow.filled = fil.toString();
    totalRow.baseyear = base.toString();
  }

  // ----- meta -----
  const strengthMeta = [
    { key: "scientific", title: "Scientific Staff" },
    { key: "administrative", title: "Administrative Staff" },
    { key: "technical", title: "Technical Staff" },
  ];

  const staffMeta = [
    { key: "appointments", title: "Appointments" },
    { key: "promotions", title: "Promotions" },
    { key: "transfers", title: "Transfers" },
    { key: "new_joining", title: "New Joining" },
  ];

  ["appointments", "promotions", "transfers", "new_joining"].forEach((k) => {
    if (!Array.isArray(sp[k])) sp[k] = [];
  });

  // ------- MAIN RENDER -------
  function renderStaffPositions() {
    staffDiv.innerHTML = "";

    // A. STAFF STRENGTH
    initDefaultStaffRows();

    const strengthWrap = document.createElement("div");
    strengthWrap.className = "dev-block";
    strengthWrap.innerHTML = `<h4>Staff Strength</h4>`;

    strengthMeta.forEach((meta) => {
      const group = sp.strength[meta.key];
      const card = document.createElement("div");
      card.className = "dev-item-card";

      card.innerHTML = `
      <h5>${meta.title}</h5>
      <div class="upload-group" style="margin-bottom:8px;">
        <button class="btn btn-secondary btn-sm initDefault">↺ Load Default</button>
        <button class="btn btn-secondary btn-sm addRow">➕ Add Row</button>
      </div>
      <div class="table-container staff-strength-table"></div>
    `;

      const tblDiv = card.querySelector(".staff-strength-table");

      function renderStrengthTable() {
        tblDiv.innerHTML = "";
        const rows = group.rows;
        if (!rows.length) {
          tblDiv.innerHTML = `
            <p style="color:#777;font-style:italic;">
              Click <b>↺ Load Default</b> to display Staff Strength table.
            </p>`;
          return;
        }

        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const tbody = document.createElement("tbody");

        thead.innerHTML = `
        <tr>
          <th>Sl. No.</th>
          <th>Category</th>
          <th>Sanctioned</th>
          <th>Filled</th>
          <th>${baseYear}</th>
          <th>Action</th>
        </tr>
      `;

        table.appendChild(thead);
        table.appendChild(tbody);

        function syncTotalRowInputs() {
          const totalRowObj = rows.find(
            (r) => r.category?.toLowerCase() === "total"
          );
          if (!totalRowObj) return;

          const allTrs = tbody.querySelectorAll("tr");
          const totalIndex = rows.indexOf(totalRowObj);
          const tr = allTrs[totalIndex];
          if (!tr) return;

          const inputs = tr.querySelectorAll("input");
          inputs[1].value = totalRowObj.sanctioned;
          inputs[2].value = totalRowObj.filled;
          inputs[3].value = totalRowObj.baseyear;
        }

        rows.forEach((row, idx) => {
          const tr = document.createElement("tr");

          tr.innerHTML = `
          <td>${idx + 1}</td>
          <td><input type="text" value="${row.category || ""}"></td>
          <td><input type="number" value="${row.sanctioned || ""}"></td>
          <td><input type="number" value="${row.filled || ""}"></td>
          <td><input type="number" value="${row.baseyear || ""}"></td>
          <td><button class="btn btn-danger btn-sm del">🗑</button></td>
        `;

          const [cat, san, fil, by] = tr.querySelectorAll("input");

          cat.addEventListener("input", (e) => {
            row.category = e.target.value;
            AppState.sections.annexures.staff_positions.strength[meta.key].rows[
              idx
            ].category = e.target.value;
          });

          san.addEventListener("input", (e) => {
            row.sanctioned = e.target.value;
            AppState.sections.annexures.staff_positions.strength[meta.key].rows[
              idx
            ].sanctioned = e.target.value;
            updateStaffTotals(group);
            syncTotalRowInputs();
          });

          fil.addEventListener("input", (e) => {
            row.filled = e.target.value;
            AppState.sections.annexures.staff_positions.strength[meta.key].rows[
              idx
            ].filled = e.target.value;
            updateStaffTotals(group);
            syncTotalRowInputs();
          });

          by.addEventListener("input", (e) => {
            row.baseyear = e.target.value;
            AppState.sections.annexures.staff_positions.strength[meta.key].rows[
              idx
            ].baseyear = e.target.value;
            updateStaffTotals(group);
            syncTotalRowInputs();
          });

          tr.querySelector(".del").addEventListener("click", () => {
            if (!confirm("Delete this row?")) return;
            rows.splice(idx, 1);
            updateStaffTotals(group);
            renderStrengthTable();
          });

          tbody.appendChild(tr);
        });

        updateStaffTotals(group);
        syncTotalRowInputs();
        tblDiv.appendChild(table);
      }

      card.querySelector(".initDefault").addEventListener("click", () => {
        sp.strength[meta.key].rows = [];
        initDefaultStaffRows();
        updateStaffTotals(group);
        renderStrengthTable();
      });

      card.querySelector(".addRow").addEventListener("click", () => {
        const rows = group.rows;

        const newRow = {
          category: "",
          sanctioned: "",
          filled: "",
          baseyear: "",
        };

        const totalIdx = rows.findIndex(
          (r) => r.category?.toLowerCase() === "total"
        );

        if (totalIdx === -1) rows.push(newRow);
        else rows.splice(totalIdx, 0, newRow);

        updateStaffTotals(group);
        renderStrengthTable();
      });

      updateStaffTotals(group);
      renderStrengthTable();

      strengthWrap.appendChild(card);
    });

    staffDiv.appendChild(strengthWrap);

    // ------- OTHER STAFF -------
    const otherWrap = document.createElement("div");
    otherWrap.className = "dev-block";
    otherWrap.innerHTML = `
    <h4>Other Staff (if any)</h4>
    <button class="btn btn-secondary btn-sm addOtherStaff">➕ Add Item</button>
    <div class="items"></div>
  `;

    const itemsDiv = otherWrap.querySelector(".items");

    function renderOtherStaff() {
      itemsDiv.innerHTML = "";
      sp.strength.other_staff.forEach((it, idx) => {
        if (!it) sp.strength.other_staff[idx] = it = {};
        if (!Array.isArray(it.tables)) it.tables = [];
        if (!Array.isArray(it.figures)) it.figures = [];
        it.note = it.note || "";

        const card = document.createElement("div");
        card.className = "dev-item-card";
        card.innerHTML = `
        <textarea class="text-input note" rows="2" placeholder="Remarks">${it.note}</textarea>
        <div class="upload-group">
          <button class="btn add-table-btn addTable">➕ Add Table</button>
          <button class="btn add-figure-btn addFig">➕ Add Figure</button>
        </div>
        <div class="table-block"></div>
        <div class="fig-block"></div>
        <button class="btn btn-danger btn-sm delItem" style="margin-top:6px;">🗑 Remove</button>
      `;

        const noteField = card.querySelector(".note");
        noteField.addEventListener("input", (e) => {
          it.note = e.target.value;
        });

        const tableBlock = card.querySelector(".table-block");
        const figBlock = card.querySelector(".fig-block");

        function renderTables() {
          tableBlock.innerHTML = "";
          it.tables.forEach((tbl) => renderTableCard(tbl, tableBlock));
        }

        function renderFigs() {
          figBlock.innerHTML = "";
          it.figures.forEach((fig) => renderFigureCard(fig, figBlock));
        }

        card.querySelector(".addTable").addEventListener("click", () => {
          openTableModal(it, tableBlock);
        });

        card.querySelector(".addFig").addEventListener("click", () => {
          openFigureModal(it, figBlock);
        });

        card.querySelector(".delItem").addEventListener("click", () => {
          if (!confirm("Remove this item?")) return;
          sp.strength.other_staff.splice(idx, 1);
          renderOtherStaff();
        });

        renderTables();
        renderFigs();
        itemsDiv.appendChild(card);
      });
    }

    otherWrap.querySelector(".addOtherStaff").addEventListener("click", () => {
      sp.strength.other_staff.push({ note: "", tables: [], figures: [] });
      renderOtherStaff();
    });

    renderOtherStaff();
    staffDiv.appendChild(otherWrap);

    // ------- B. Appointments/Promotions/Transfers/New Joining -------
    staffMeta.forEach((meta) => {
      const list = sp[meta.key];

      const wrap = document.createElement("div");
      wrap.className = "dev-block";
      wrap.innerHTML = `
      <h4>${meta.title}</h4>
      <button class="btn btn-secondary btn-sm addItem">➕ Add ${meta.title} Person</button>
      <div class="items"></div>
    `;

      wrap.querySelector(".addItem").addEventListener("click", () => {
        list.push({ note: "", tables: [], figures: [] });
        renderStaffPositions();
      });

      const itemsDiv2 = wrap.querySelector(".items");

      list.forEach((it, idx) => {
        if (!it) list[idx] = it = {};
        if (!Array.isArray(it.tables)) it.tables = [];
        if (!Array.isArray(it.figures)) it.figures = [];
        it.note = it.note || "";

        const card = document.createElement("div");
        card.className = "dev-item-card";

        card.innerHTML = `
        <textarea class="text-input note" rows="2" placeholder="Comments / details">${it.note}</textarea>
        <div class="upload-group">
          <button class="btn add-table-btn addTable">➕ Add Table</button>
          <button class="btn add-figure-btn addFig">➕ Add Figure</button>
        </div>
        <div class="table-block"></div>
        <div class="fig-block"></div>
        <button class="btn btn-danger btn-sm delItem" style="margin-top:6px;">🗑 Remove</button>
      `;

        card.querySelector(".note").addEventListener("input", (e) => {
          it.note = e.target.value;
        });

        const tableBlock = card.querySelector(".table-block");
        const figBlock = card.querySelector(".fig-block");

        function renderTables() {
          tableBlock.innerHTML = "";
          it.tables.forEach((tbl) => renderTableCard(tbl, tableBlock));
        }

        function renderFigs() {
          figBlock.innerHTML = "";
          it.figures.forEach((fig) => renderFigureCard(fig, figBlock));
        }

        card
          .querySelector(".addTable")
          .addEventListener("click", () => openTableModal(it, tableBlock));

        card
          .querySelector(".addFig")
          .addEventListener("click", () => openFigureModal(it, figBlock));

        card.querySelector(".delItem").addEventListener("click", () => {
          if (!confirm("Remove this item?")) return;
          list.splice(idx, 1);
          renderStaffPositions();
        });

        renderTables();
        renderFigs();
        itemsDiv2.appendChild(card);
      });

      staffDiv.appendChild(wrap);
    });
  }

  // INITIAL RENDER
  renderStaffPositions();

  // =====================================
  // 10.11 Institute in media (Figures Option A)
  // =====================================

  const mediaDiv = document.getElementById("mediaContainer");
  if (!Array.isArray(state.institute_in_media)) {
    state.institute_in_media = [];
  }

  function renderMedia() {
    mediaDiv.innerHTML = "";

    state.institute_in_media.forEach((m, idx) => {
      if (!m) state.institute_in_media[idx] = m = {};
      if (!Array.isArray(m.figures)) m.figures = [];
      m.date = m.date || "";
      m.publisher = m.publisher || "";
      m.note = m.note || "";

      const card = document.createElement("div");
      card.className = "dev-item-card";
      card.innerHTML = `
        <h4>Media Item ${idx + 1}</h4>
        <label>Date of Publication</label>
        <input type="date" class="text-input m-date" value="${m.date}">
        <label>Publisher</label>
        <input type="text" class="text-input m-pub" value="${m.publisher}">
        <label>Short Note (optional)</label>
        <textarea class="text-input m-note" rows="2">${m.note}</textarea>

        <div class="upload-group">
          <button class="btn add-figure-btn addFig">➕ Add Figure (clipping)</button>
        </div>
        <div class="fig-block"></div>

        <button class="btn btn-danger btn-sm delMedia" style="margin-top:6px;">🗑 Remove</button>
      `;

      card.querySelector(".m-date").addEventListener("change", (e) => {
        m.date = e.target.value;
      });
      card.querySelector(".m-pub").addEventListener("input", (e) => {
        m.publisher = e.target.value;
      });
      card.querySelector(".m-note").addEventListener("input", (e) => {
        m.note = e.target.value;
      });

      const figBlock = card.querySelector(".fig-block");

      function renderMediaFigs() {
        figBlock.innerHTML = "";
        (m.figures || []).forEach((fig) => {
          renderFigureCard(fig, figBlock);
        });
      }

      card.querySelector(".addFig").addEventListener("click", () => {
        if (!Array.isArray(m.figures)) m.figures = [];
        openFigureModal(m, figBlock);
      });

      renderMediaFigs();

      card.querySelector(".delMedia").addEventListener("click", () => {
        if (!confirm("Remove this media item?")) return;
        state.institute_in_media.splice(idx, 1);
        renderMedia();
      });

      mediaDiv.appendChild(card);
    });
  }

  document.getElementById("addMediaItem").addEventListener("click", () => {
    state.institute_in_media.push({
      date: "",
      publisher: "",
      note: "",
      figures: [],
    });
    renderMedia();
  });

  renderMedia();

  // =====================================
  // 10.12 Other activities (Option A figs + tables)
  // =====================================

  const otherDiv = document.getElementById("otherActivitiesContainer");
  if (!Array.isArray(state.other_activities)) {
    state.other_activities = [];
  }

  function renderOtherActivities() {
    otherDiv.innerHTML = "";

    state.other_activities.forEach((it, idx) => {
      if (!it) state.other_activities[idx] = it = {};
      if (!Array.isArray(it.tables)) it.tables = [];
      if (!Array.isArray(it.figures)) it.figures = [];
      it.note = it.note || "";

      const card = document.createElement("div");
      card.className = "dev-item-card";
      card.innerHTML = `
        <h4>Activity ${idx + 1}</h4>
        <textarea class="text-input note" rows="2" placeholder="Remarks">${
          it.note
        }</textarea>

        <div class="upload-group">
          <button class="btn add-table-btn addTable">➕ Add Table</button>
          <button class="btn add-figure-btn addFig">➕ Add Figure</button>
        </div>
        <div class="table-block"></div>
        <div class="fig-block"></div>

        <button class="btn btn-danger btn-sm delActivity" style="margin-top:6px;">🗑 Remove</button>
      `;

      card.querySelector(".note").addEventListener("input", (e) => {
        it.note = e.target.value;
      });

      const tableBlock = card.querySelector(".table-block");
      const figBlock = card.querySelector(".fig-block");

      function renderTables() {
        tableBlock.innerHTML = "";
        (it.tables || []).forEach((tbl) => {
          renderTableCard(tbl, tableBlock);
        });
      }

      function renderFigs() {
        figBlock.innerHTML = "";
        (it.figures || []).forEach((fig) => {
          renderFigureCard(fig, figBlock);
        });
      }

      card.querySelector(".addTable").addEventListener("click", () => {
        if (!Array.isArray(it.tables)) it.tables = [];
        openTableModal(it, tableBlock);
      });

      card.querySelector(".addFig").addEventListener("click", () => {
        if (!Array.isArray(it.figures)) it.figures = [];
        openFigureModal(it, figBlock);
      });

      renderTables();
      renderFigs();

      card.querySelector(".delActivity").addEventListener("click", () => {
        if (!confirm("Remove this activity?")) return;
        state.other_activities.splice(idx, 1);
        renderOtherActivities();
      });

      otherDiv.appendChild(card);
    });
  }

  document.getElementById("addOtherActivity").addEventListener("click", () => {
    state.other_activities.push({
      note: "",
      tables: [],
      figures: [],
    });
    renderOtherActivities();
  });

  renderOtherActivities();
}

window.initAnnexuresSection = initAnnexuresSection;
