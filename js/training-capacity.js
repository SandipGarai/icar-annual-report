// js/training-section.js

function initTrainingSection() {
  const state = AppState.sections.training_capacity_building;

  const orgContainer = document.getElementById("trainingOrganizedTable");
  const attContainer = document.getElementById("trainingAttendedTable");

  // Ensure arrays
  if (!Array.isArray(state.trainings_organized)) state.trainings_organized = [];
  if (!Array.isArray(state.trainings_attended)) state.trainings_attended = [];

  /* ---------- Render trainings organized ---------- */
  function renderOrganized() {
    orgContainer.innerHTML = "";

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    thead.innerHTML = `
      <tr>
        <th>Sl. No.</th>
        <th>Training Name</th>
        <th>No. of Participants</th>
        <th>Organizer</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Duration</th>
        <th>Place</th>
        <th>Action</th>
      </tr>
    `;

    state.trainings_organized.forEach((row, idx) => {
      const tr = document.createElement("tr");

      // Ensure row object keys
      if (!row) state.trainings_organized[idx] = row = {};
      row.name = row.name || "";
      row.participants = row.participants || "";
      row.organizer = row.organizer || "";
      row.start_date = row.start_date || "";
      row.end_date = row.end_date || "";
      row.duration = row.duration || "";
      row.place = row.place || "";

      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td></td>
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

      // Participants
      const partTd = tr.cells[2];
      const partInput = document.createElement("input");
      partInput.type = "number";
      partInput.min = "0";
      partInput.value = row.participants;
      partInput.addEventListener("input", (e) => {
        row.participants = e.target.value;
      });
      partTd.appendChild(partInput);

      // Organizer
      const orgTd = tr.cells[3];
      const orgInput = document.createElement("input");
      orgInput.type = "text";
      orgInput.value = row.organizer;
      orgInput.addEventListener("input", (e) => {
        row.organizer = e.target.value;
      });
      orgTd.appendChild(orgInput);

      // Start date
      const sTd = tr.cells[4];
      const sInput = document.createElement("input");
      sInput.type = "date";
      sInput.value = row.start_date;
      sInput.addEventListener("change", (e) => {
        row.start_date = e.target.value;
        row.duration = calculateYMDDuration(row.start_date, row.end_date);
        renderOrganized();
      });
      sTd.appendChild(sInput);

      // End date
      const eTd = tr.cells[5];
      const eInput = document.createElement("input");
      eInput.type = "date";
      eInput.value = row.end_date;
      eInput.addEventListener("change", (e2) => {
        row.end_date = e2.target.value;
        row.duration = calculateYMDDuration(row.start_date, row.end_date);
        renderOrganized();
      });
      eTd.appendChild(eInput);

      // Duration (readonly text)
      tr.querySelector(".duration-cell").textContent = row.duration || "";

      // Place
      const placeTd = tr.cells[7];
      const placeInput = document.createElement("input");
      placeInput.type = "text";
      placeInput.value = row.place;
      placeInput.addEventListener("input", (e) => {
        row.place = e.target.value;
      });
      placeTd.appendChild(placeInput);

      // Delete button
      const actTd = tr.cells[8];
      const delBtn = document.createElement("button");
      delBtn.className = "btn btn-danger";
      delBtn.textContent = "🗑 Remove";
      delBtn.addEventListener("click", () => {
        if (!confirm("Delete this training?")) return;
        state.trainings_organized.splice(idx, 1);
        renderOrganized();
      });
      actTd.appendChild(delBtn);

      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    orgContainer.appendChild(table);
  }

  /* ---------- Render trainings attended ---------- */
  function renderAttended() {
    attContainer.innerHTML = "";

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
        <th>Organizer</th>
        <th>Action</th>
      </tr>
    `;

    state.trainings_attended.forEach((row, idx) => {
      const tr = document.createElement("tr");

      if (!row) state.trainings_attended[idx] = row = {};
      row.name = row.name || "";
      row.title = row.title || "";
      row.start_date = row.start_date || "";
      row.end_date = row.end_date || "";
      row.duration = row.duration || "";
      row.organizer = row.organizer || "";

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

      // Start date
      const sTd = tr.cells[3];
      const sInput = document.createElement("input");
      sInput.type = "date";
      sInput.value = row.start_date;
      sInput.addEventListener("change", (e) => {
        row.start_date = e.target.value;
        row.duration = calculateYMDDuration(row.start_date, row.end_date);
        renderAttended();
      });
      sTd.appendChild(sInput);

      // End date
      const eTd = tr.cells[4];
      const eInput = document.createElement("input");
      eInput.type = "date";
      eInput.value = row.end_date;
      eInput.addEventListener("change", (e2) => {
        row.end_date = e2.target.value;
        row.duration = calculateYMDDuration(row.start_date, row.end_date);
        renderAttended();
      });
      eTd.appendChild(eInput);

      // Duration
      tr.querySelector(".duration-cell").textContent = row.duration || "";

      // Organizer
      const orgTd = tr.cells[6];
      const orgInput = document.createElement("input");
      orgInput.type = "text";
      orgInput.value = row.organizer;
      orgInput.addEventListener("input", (e) => {
        row.organizer = e.target.value;
      });
      orgTd.appendChild(orgInput);

      // Delete
      const actTd = tr.cells[7];
      const delBtn = document.createElement("button");
      delBtn.className = "btn btn-danger";
      delBtn.textContent = "🗑 Remove";
      delBtn.addEventListener("click", () => {
        if (!confirm("Delete this entry?")) return;
        state.trainings_attended.splice(idx, 1);
        renderAttended();
      });
      actTd.appendChild(delBtn);

      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    attContainer.appendChild(table);
  }

  // Add row buttons
  document
    .getElementById("addTrainingOrganizedRow")
    .addEventListener("click", () => {
      state.trainings_organized.push({
        name: "",
        participants: "",
        organizer: "",
        start_date: "",
        end_date: "",
        duration: "",
        place: "",
      });
      renderOrganized();
    });

  document
    .getElementById("addTrainingAttendedRow")
    .addEventListener("click", () => {
      state.trainings_attended.push({
        name: "",
        title: "",
        start_date: "",
        end_date: "",
        duration: "",
        organizer: "",
      });
      renderAttended();
    });

  // Initial render
  if (!state.trainings_organized.length) {
    // Optionally start with one empty row:
    // state.trainings_organized.push({});
  }
  if (!state.trainings_attended.length) {
    // state.trainings_attended.push({});
  }

  renderOrganized();
  renderAttended();
}

window.initTrainingSection = initTrainingSection;
