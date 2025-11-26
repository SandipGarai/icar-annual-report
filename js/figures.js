// js/figures.js

let currentFigureBlock = null;
let currentFigureListElement = null;

function openFigureModal(blockData, listEl) {
  currentFigureBlock = blockData;
  currentFigureListElement = listEl;

  document.getElementById("figureModal").classList.remove("hidden");
  document.getElementById("figFileInput").value = "";
  document.getElementById("figCaptionInput").value = "";
  document.getElementById("figPreview").classList.add("hidden");
}

document
  .getElementById("figFileInput")
  .addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (evt) {
      const img = document.getElementById("figPreview");
      img.src = evt.target.result;
      img.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });

document.getElementById("figInsertBtn").addEventListener("click", () => {
  const fileInput = document.getElementById("figFileInput");
  const caption = document.getElementById("figCaptionInput").value.trim();

  if (!fileInput.files.length) {
    showAlert("Please select an image.", "error");
    return;
  }
  if (!caption) {
    showAlert("Please enter a caption.", "error");
    return;
  }

  // Assign local [FIG-n]
  AppState.local_counters.figure++;
  const localIndex = AppState.local_counters.figure;
  const placeholder = `[FIG-${localIndex}]`;

  // Read base64
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function (evt) {
    const figObj = {
      id: "fig_" + Date.now(),
      localIndex,
      caption,
      citePlaceholder: placeholder,
      base64: evt.target.result,
      fileName: file.name,
      mimeType: file.type,
    };

    currentFigureBlock.figures.push(figObj);
    renderFigureCard(figObj, currentFigureListElement);

    // Insert placeholder into text area if focused
    insertPlaceholderIntoFocusedText(placeholder);

    document.getElementById("figureModal").classList.add("hidden");
    showAlert("Figure added.", "success");
  };
  reader.readAsDataURL(file);
});

// Cancel
document.getElementById("figCancelBtn").addEventListener("click", () => {
  document.getElementById("figureModal").classList.add("hidden");
});

/* Helper: Render small card below block */
function renderFigureCard(fig, container) {
  const div = document.createElement("div");
  div.className = "fig-card";
  div.innerHTML = `
    <div class="small-text"><b>${fig.citePlaceholder}</b> — ${fig.caption}</div>
  `;
  container.appendChild(div);
}

/* Insert placeholder at cursor */
function insertPlaceholderIntoFocusedText(placeholder) {
  const active = document.activeElement;
  if (!active || active.tagName !== "TEXTAREA") return;

  const start = active.selectionStart;
  const end = active.selectionEnd;
  const text = active.value;

  active.value = text.substring(0, start) + placeholder + text.substring(end);
  active.dispatchEvent(new Event("input"));
}

/**
 * Render a simple list of figure cards into a container.
 * Used by Other Institutional Activities and other sections.
 */
function renderFigureList(figures, containerEl) {
  if (!containerEl) return;
  containerEl.innerHTML = "";

  (figures || []).forEach((fig) => {
    const card = document.createElement("div");
    card.className = "fig-card";

    const placeholder = fig.citePlaceholder || "[FIG]";
    const caption = fig.caption || "";

    card.innerHTML = `
      <div class="small-text">
        <strong>${placeholder}</strong> — ${caption}
      </div>
    `;

    containerEl.appendChild(card);
  });
}

window.renderFigureList = renderFigureList;

window.openFigureModal = openFigureModal;
