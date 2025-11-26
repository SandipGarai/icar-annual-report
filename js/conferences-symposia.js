// js/conferences.js

function initConferencesSection() {
  const state = AppState.sections.conferences_symposia;

  if (!Array.isArray(state.attended)) {
    state.attended = [];
  }

  const container = document.getElementById("conferenceTableContainer");

  function renderTable() {
    container.innerHTML = "";

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    thead.innerHTML = `
      <tr>
        <th>Sl. No.</th>
        <th>Name</th>
        <th>Title</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Duration</th>
        <th>Place</th>
        <th>Action</th>
      </tr>
    `;

    state.attended.forEach((row, idx) => {
      if (!row) state.attended[idx] = row = {};

      row.name = row.name || "";
      row.title = row.title || "";
      row.start_date = row.start_date || "";
      row.end_date = row.end_date || "";
      row.duration = row.duration || "";
      row.place = row.place || "";

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td class="duration-cell"></td>
        <td></td>
        <td></td>
      `;

      // Name
      const nameTd = tr.cells[1];
      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.value = row.name;
      nameInput.addEventListener("input", (e) => {
        row.name = e.target.value;
      });
      nameTd.appendChild(nameInput);

      // Title
      const titleTd = tr.cells[2];
      const titleInput = document.createElement("input");
      titleInput.type = "text";
      titleInput.value = row.title;
      titleInput.addEventListener("input", (e) => {
        row.title = e.target.value;
      });
      titleTd.appendChild(titleInput);

      // Start
      const sTd = tr.cells[3];
      const sInput = document.createElement("input");
      sInput.type = "date";
      sInput.value = row.start_date;
      sInput.addEventListener("change", (e) => {
        row.start_date = e.target.value;
        row.duration = calculateYMDDuration(row.start_date, row.end_date);
        renderTable();
      });
      sTd.appendChild(sInput);

      // End
      const eTd = tr.cells[4];
      const eInput = document.createElement("input");
      eInput.type = "date";
      eInput.value = row.end_date;
      eInput.addEventListener("change", (e2) => {
        row.end_date = e2.target.value;
        row.duration = calculateYMDDuration(row.start_date, row.end_date);
        renderTable();
      });
      eTd.appendChild(eInput);

      // Duration
      tr.querySelector(".duration-cell").textContent = row.duration || "";

      // Place
      const placeTd = tr.cells[6];
      const placeInput = document.createElement("input");
      placeInput.type = "text";
      placeInput.value = row.place;
      placeInput.addEventListener("input", (e) => {
        row.place = e.target.value;
      });
      placeTd.appendChild(placeInput);

      // Delete
      const actTd = tr.cells[7];
      const delBtn = document.createElement("button");
      delBtn.className = "btn btn-danger";
      delBtn.textContent = "🗑 Remove";
      delBtn.addEventListener("click", () => {
        if (!confirm("Delete this entry?")) return;
        state.attended.splice(idx, 1);
        renderTable();
      });
      actTd.appendChild(delBtn);

      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
  }

  // Add row button
  document.getElementById("addConferenceRow").addEventListener("click", () => {
    state.attended.push({
      name: "",
      title: "",
      start_date: "",
      end_date: "",
      duration: "",
      place: "",
    });
    renderTable();
  });

  renderTable();
}

window.initConferencesSection = initConferencesSection;
