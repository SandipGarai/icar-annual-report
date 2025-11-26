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
  // 10.3.1 Budget Utilization
  // =====================================

  const budgetDiv = document.getElementById("budgetUtilTable");
  const budgetFooterInput = document.getElementById("budgetFooterInput");
  const budgetCustomContainer = document.getElementById("budgetCustomPreview");

  if (!state.budget_utilization) {
    state.budget_utilization = { rows: [], footer: "", custom_tables: [] };
  }
  if (!Array.isArray(state.budget_utilization.rows)) {
    state.budget_utilization.rows = [];
  }
  if (!Array.isArray(state.budget_utilization.custom_tables)) {
    state.budget_utilization.custom_tables = [];
  }
  if (!state.budget_utilization._tableBlock) {
    state.budget_utilization._tableBlock = {
      tables: state.budget_utilization.custom_tables,
    };
  }

  budgetFooterInput.value =
    state.budget_utilization.footer || "GIA-General (Non-scheme) 1270";
  budgetFooterInput.addEventListener("input", (e) => {
    state.budget_utilization.footer = e.target.value;
  });

  function loadDefaultBudgetRows() {
    state.budget_utilization.rows = [
      {
        head: "GIA General, Other than NEH TSP & SCSP",
        re: "",
        exp: "",
        exp_pct: "",
        be: "",
        upto: "",
        upto_pct: "",
      },
      {
        head: "GIA Capital, Other than NEH TSP & SCSP",
        re: "",
        exp: "",
        exp_pct: "",
        be: "",
        upto: "",
        upto_pct: "",
      },
      {
        head: "GIA General, NEH",
        re: "",
        exp: "",
        exp_pct: "",
        be: "",
        upto: "",
        upto_pct: "",
      },
      {
        head: "GIA Capital, NEH",
        re: "",
        exp: "",
        exp_pct: "",
        be: "",
        upto: "",
        upto_pct: "",
      },
      {
        head: "GIA General, TSP",
        re: "",
        exp: "",
        exp_pct: "",
        be: "",
        upto: "",
        upto_pct: "",
      },
      {
        head: "GIA Capital, TSP",
        re: "",
        exp: "",
        exp_pct: "",
        be: "",
        upto: "",
        upto_pct: "",
      },
      {
        head: "GIA General, SCSP",
        re: "",
        exp: "",
        exp_pct: "",
        be: "",
        upto: "",
        upto_pct: "",
      },
      {
        head: "GIA Capital, SCSP",
        re: "",
        exp: "",
        exp_pct: "",
        be: "",
        upto: "",
        upto_pct: "",
      },
      {
        head: "Total",
        re: "",
        exp: "",
        exp_pct: "",
        be: "",
        upto: "",
        upto_pct: "",
      },
    ];
    renderBudget();
  }

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

    let sumRE = 0;
    let sumExp = 0;
    let sumUpto = 0;

    state.budget_utilization.rows.forEach((row, idx) => {
      if (!row) state.budget_utilization.rows[idx] = row = {};
      row.head = row.head || "";
      row.re = row.re || "";
      row.exp = row.exp || "";
      row.exp_pct = row.exp_pct || "";
      row.be = row.be || "";
      row.upto = row.upto || "";
      row.upto_pct = row.upto_pct || "";

      const isTotal =
        typeof row.head === "string" && row.head.toLowerCase() === "total";

      if (!isTotal) {
        const reVal = parseFloat(row.re) || 0;
        const expVal = parseFloat(row.exp) || 0;
        const upVal = parseFloat(row.upto) || 0;

        sumRE += reVal;
        sumExp += expVal;
        sumUpto += upVal;

        if (reVal && expVal) {
          row.exp_pct = ((reVal * 100) / expVal).toFixed(2);
        }
        if (upVal && expVal) {
          row.upto_pct = ((upVal * 100) / expVal).toFixed(2);
        }
      }

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

      inputs[0].addEventListener("input", (e) => {
        row.head = e.target.value;
      });
      inputs[1].addEventListener("input", (e) => {
        row.re = e.target.value;
        renderBudget();
      });
      inputs[2].addEventListener("input", (e) => {
        row.exp = e.target.value;
        renderBudget();
      });
      inputs[3].addEventListener("input", (e) => {
        row.exp_pct = e.target.value;
      });
      inputs[4].addEventListener("input", (e) => {
        row.be = e.target.value;
      });
      inputs[5].addEventListener("input", (e) => {
        row.upto = e.target.value;
        renderBudget();
      });
      inputs[6].addEventListener("input", (e) => {
        row.upto_pct = e.target.value;
      });

      tr.cells[7].querySelector(".del").addEventListener("click", () => {
        if (!confirm("Delete this row?")) return;
        state.budget_utilization.rows.splice(idx, 1);
        renderBudget();
      });

      tbody.appendChild(tr);
    });

    const totalRow = state.budget_utilization.rows.find(
      (r) => r && typeof r.head === "string" && r.head.toLowerCase() === "total"
    );

    if (totalRow) {
      totalRow.re = sumRE ? sumRE.toFixed(2) : "";
      totalRow.exp = sumExp ? sumExp.toFixed(2) : "";
      totalRow.upto = sumUpto ? sumUpto.toFixed(2) : "";

      const nonTotalRows = state.budget_utilization.rows.filter(
        (r) => r && r.head && r.head.toLowerCase() !== "total"
      );
      if (nonTotalRows.length) {
        const avgExpPct =
          nonTotalRows.reduce(
            (acc, r) => acc + (parseFloat(r.exp_pct) || 0),
            0
          ) / nonTotalRows.length;
        const avgUptoPct =
          nonTotalRows.reduce(
            (acc, r) => acc + (parseFloat(r.upto_pct) || 0),
            0
          ) / nonTotalRows.length;

        totalRow.exp_pct = avgExpPct.toFixed(2);
        totalRow.upto_pct = avgUptoPct.toFixed(2);
      }
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    budgetDiv.appendChild(table);
  }

  document
    .getElementById("initBudgetTableBtn")
    .addEventListener("click", loadDefaultBudgetRows);

  function renderBudgetCustomTables() {
    if (!budgetCustomContainer) return;
    budgetCustomContainer.innerHTML = "";
    state.budget_utilization.custom_tables.forEach((tbl) => {
      renderTableCard(tbl, budgetCustomContainer);
    });
  }

  document.getElementById("uploadBudgetXlsx").addEventListener("click", () => {
    openTableModal(state.budget_utilization._tableBlock, budgetCustomContainer);
  });

  renderBudget();
  renderBudgetCustomTables();

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
    const baseYear = AppState.basic_info.year; // example: 2025

    thead.innerHTML = `
      <tr>
        <th>Head</th>
        <th>FY (${prevFY})</th>
        <th>FY (${currFY}) upto 31-12-${baseYear}</th>
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
      `;

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
  // 10.10 Staff Positions / Appointments / Promotions / Transfers / New joining
  // (Option A figs + tables)
  // =====================================

  const staffDiv = document.getElementById("staffPositionsContainer");
  if (!state.staff_positions) {
    state.staff_positions = {
      appointments: [],
      promotions: [],
      transfers: [],
      new_joining: [],
    };
  }

  const staffMeta = [
    { key: "appointments", title: "Appointments" },
    { key: "promotions", title: "Promotions" },
    { key: "transfers", title: "Transfers" },
    { key: "new_joining", title: "New Joining" },
  ];

  function renderStaffPositions() {
    staffDiv.innerHTML = "";

    staffMeta.forEach((meta) => {
      const list =
        state.staff_positions[meta.key] ||
        (state.staff_positions[meta.key] = []);

      const wrap = document.createElement("div");
      wrap.className = "dev-block";
      wrap.innerHTML = `
        <h4>${meta.title}</h4>
        <button class="btn btn-secondary btn-sm addItem">➕ Add ${meta.title} Person</button>
        <div class="items"></div>
      `;

      const itemsDiv = wrap.querySelector(".items");

      wrap.querySelector(".addItem").addEventListener("click", () => {
        list.push({ note: "", tables: [], figures: [] });
        renderStaffPositions();
      });

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

        card.querySelector(".delItem").addEventListener("click", () => {
          if (!confirm("Remove this item?")) return;
          list.splice(idx, 1);
          renderStaffPositions();
        });

        itemsDiv.appendChild(card);
      });

      staffDiv.appendChild(wrap);
    });
  }

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
