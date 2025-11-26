// js/awards-recognition.js — FINAL Option-A Global Modal Version

function initAwardsRecognitionSection() {
  const state = AppState.sections.awards_recognition;

  if (!Array.isArray(state.awards)) state.awards = [];
  if (!Array.isArray(state.recognitions)) state.recognitions = [];

  const awardsDiv = document.getElementById("awardsTableContainer");
  const recDiv = document.getElementById("recognitionContainer");

  /* ============================================================
     A W A R D S   T A B L E
  ============================================================ */
  function renderAwards() {
    awardsDiv.innerHTML = "";

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    thead.innerHTML = `
      <tr>
        <th>Sl. No.</th>
        <th>Award Details</th>
        <th>Event / Organiser</th>
        <th>Date</th>
        <th>Awardee(s)</th>
        <th>Figures</th>
        <th>Action</th>
      </tr>
    `;

    state.awards.forEach((row, idx) => {
      if (!row) state.awards[idx] = row = {};
      row.details = row.details || "";
      row.organiser = row.organiser || "";
      row.date = row.date || "";
      row.awardees = row.awardees || "";
      row.figures = row.figures || [];

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td><input type="text" class="text-input" value="${row.details}"></td>
        <td><input type="text" class="text-input" value="${row.organiser}"></td>
        <td><input type="date" class="text-input" value="${row.date}"></td>
        <td><input type="text" class="text-input" value="${row.awardees}"></td>

        <td>
          <button class="add-figure-btn">➕ Add Figure</button>
          <div class="cb-figure-list"></div>
        </td>

        <td>
          <button class="btn btn-danger btn-sm del-row">🗑</button>
        </td>
      `;

      /* Bind Inputs */
      tr.cells[1].querySelector("input").addEventListener("input", (e) => {
        row.details = e.target.value;
      });

      tr.cells[2].querySelector("input").addEventListener("input", (e) => {
        row.organiser = e.target.value;
      });

      tr.cells[3].querySelector("input").addEventListener("change", (e) => {
        row.date = e.target.value;
      });

      tr.cells[4].querySelector("input").addEventListener("input", (e) => {
        row.awardees = e.target.value;
      });

      /* FIGURES — Option A Global Modal */
      const figList = tr.cells[5].querySelector(".cb-figure-list");

      function rerenderAwardFigures() {
        figList.innerHTML = "";
        row.figures.forEach((fig) => renderFigureCard(fig, figList));
      }
      rerenderAwardFigures();

      tr.cells[5]
        .querySelector(".add-figure-btn")
        .addEventListener("click", () => {
          openFigureModal(row, figList); // <-- Global modal
        });

      /* Delete row */
      tr.cells[6].querySelector(".del-row").addEventListener("click", () => {
        if (!confirm("Delete this award?")) return;
        state.awards.splice(idx, 1);
        renderAwards();
      });

      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    awardsDiv.appendChild(table);
  }

  /* ============================================================
     R E C O G N I T I O N S   (Card layout)
  ============================================================ */
  function renderRecognitions() {
    recDiv.innerHTML = "";

    state.recognitions.forEach((item, idx) => {
      if (!item) state.recognitions[idx] = item = {};
      item.text = item.text || "";
      item.figures = item.figures || [];

      const div = document.createElement("div");
      div.className = "recognition-card";

      div.innerHTML = `
        <h4>Recognition ${idx + 1}</h4>

        <textarea class="text-input rec-text" rows="3">${item.text}</textarea>

        <div class="upload-group">
          <button class="add-figure-btn">➕ Add Figure</button>
        </div>

        <div class="cb-figure-list"></div>

        <button class="btn btn-danger btn-sm remove-rec">🗑 Remove</button>

        <hr>
      `;

      /* Bind text */
      div.querySelector(".rec-text").addEventListener("input", (e) => {
        item.text = e.target.value;
      });

      /* FIGURES — Global Modal */
      const figList = div.querySelector(".cb-figure-list");

      function rerenderRecFigures() {
        figList.innerHTML = "";
        item.figures.forEach((fig) => renderFigureCard(fig, figList));
      }
      rerenderRecFigures();

      div
        .querySelector(".add-figure-btn")
        .addEventListener("click", () => openFigureModal(item, figList));

      /* Delete card */
      div.querySelector(".remove-rec").addEventListener("click", () => {
        if (!confirm("Remove this recognition?")) return;
        state.recognitions.splice(idx, 1);
        renderRecognitions();
      });

      recDiv.appendChild(div);
    });
  }

  /* ============================================================
     ADD BUTTONS
  ============================================================ */

  document.getElementById("addAwardRow").addEventListener("click", () => {
    state.awards.push({
      details: "",
      organiser: "",
      date: "",
      awardees: "",
      figures: [],
    });
    renderAwards();
  });

  document
    .getElementById("addRecognitionItem")
    .addEventListener("click", () => {
      state.recognitions.push({
        text: "",
        figures: [],
      });
      renderRecognitions();
    });

  /* Initial load */
  renderAwards();
  renderRecognitions();
}

window.initAwardsRecognitionSection = initAwardsRecognitionSection;
