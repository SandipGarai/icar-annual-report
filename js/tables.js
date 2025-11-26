// js/tables.js — FINAL CLEAN VERSION

let currentTableBlock = null;
let currentTableListElement = null;
let parsedTableData = null;

/* ------------------------------
   OPEN TABLE MODAL
-------------------------------- */
function openTableModal(blockData, listEl) {
  currentTableBlock = blockData;
  currentTableListElement = listEl;

  parsedTableData = null;
  document.getElementById("tableModal").classList.remove("hidden");

  document.getElementById("tblFileInput").value = "";
  document.getElementById("tblCaptionInput").value = "";
  document.getElementById("tblPreview").innerHTML = "";
}

document.getElementById("tblFileInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const name = file.name.toLowerCase();
  const ext = name.split(".").pop();

  if (!["csv", "xlsx", "xls"].includes(ext)) {
    showAlert("Please upload .csv / .xlsx / .xls only.", "error");
    e.target.value = "";
    return;
  }

  const reader = new FileReader();

  // Handle CSV separately
  if (ext === "csv") {
    reader.onload = function (ev) {
      const text = ev.target.result;
      const rows = text
        .trim()
        .split("\n")
        .map((line) => line.split(","));

      parsedTableData = rows;
      renderPreview(rows);
    };
    reader.readAsText(file);
    return;
  }

  // XLSX / XLS handling
  reader.onload = function (ev) {
    const arrayBuffer = ev.target.result;
    const uint8 = new Uint8Array(arrayBuffer);

    try {
      const workbook = XLSX.read(uint8, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      parsedTableData = rows;
      renderPreview(rows);
    } catch (err) {
      console.error("XLSX Parse error:", err);
      showAlert("Unable to read table. File may be corrupted.", "error");
    }
  };

  reader.readAsArrayBuffer(file);
});

/* ------------------------------
   RENDER TABLE PREVIEW
-------------------------------- */
function renderPreview(rows) {
  const prev = document.getElementById("tblPreview");
  let html = `<div class="preview-table"><table>`;

  rows.forEach((r) => {
    html += "<tr>";
    r.forEach((c) => {
      html += `<td>${c !== undefined ? c : ""}</td>`;
    });
    html += "</tr>";
  });

  html += "</table></div>";
  prev.innerHTML = html;
}

/* ------------------------------
   INSERT TABLE INTO BLOCK
-------------------------------- */
document.getElementById("tblInsertBtn").addEventListener("click", () => {
  if (!parsedTableData) {
    showAlert("Upload a valid table file first.", "error");
    return;
  }

  const caption = document.getElementById("tblCaptionInput").value.trim();
  if (!caption) {
    showAlert("Please enter a caption.", "error");
    return;
  }

  AppState.local_counters.table++;
  const localIndex = AppState.local_counters.table;
  const placeholder = `[TAB-${localIndex}]`;

  const tableObj = {
    id: "tbl_" + Date.now(),
    localIndex,
    caption,
    citePlaceholder: placeholder,
    rows: parsedTableData,
  };

  currentTableBlock.tables.push(tableObj);
  renderTableCard(tableObj, currentTableListElement);

  insertPlaceholderIntoFocusedText(placeholder);

  document.getElementById("tableModal").classList.add("hidden");
  showAlert("Table added successfully.", "success");
});

/* ------------------------------
   CANCEL BUTTON
-------------------------------- */
document.getElementById("tblCancelBtn").addEventListener("click", () => {
  document.getElementById("tableModal").classList.add("hidden");
});

/* ------------------------------
   TABLE CARD PREVIEW LIST
-------------------------------- */
function renderTableCard(tbl, container) {
  const div = document.createElement("div");
  div.className = "tbl-card";
  div.innerHTML = `
    <div class="small-text">
      <b>${tbl.citePlaceholder}</b> — ${tbl.caption}
    </div>
  `;
  container.appendChild(div);
}

/* ------------------------------
   INSERT PLACEHOLDER INTO TEXTAREA
-------------------------------- */
function insertPlaceholderIntoFocusedText(placeholder) {
  const active = document.activeElement;
  if (!active || active.tagName !== "TEXTAREA") return;

  const start = active.selectionStart;
  const end = active.selectionEnd;
  const text = active.value;

  active.value = text.substring(0, start) + placeholder + text.substring(end);
  active.dispatchEvent(new Event("input"));
}
// -------------------------------------------------------------
// FIX: Global preview renderer for restored tables (Outreach)
// -------------------------------------------------------------
window.renderTablePreview = function (rows) {
  if (!rows || !rows.length) return "";

  let html = "<table class='mini-preview-table'>";
  rows.forEach((r) => {
    html += "<tr>";
    r.forEach((c) => {
      html += `<td>${c || ""}</td>`;
    });
    html += "</tr>";
  });
  html += "</table>";

  return html;
};

window.openTableModal = openTableModal;
