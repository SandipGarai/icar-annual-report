// js/ui.js

// Count words helper
function countWords(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

// Advanced alert system (correct one)
window.showAlert = function (msg, type = "success", allowHTML = false) {
  const box = document.getElementById("statusBox"); // THIS is correct element
  if (!box) return;

  box.classList.remove("hidden", "alert-success", "alert-error");

  if (type === "success") box.classList.add("alert-success");
  else box.classList.add("alert-error");

  if (allowHTML) box.innerHTML = msg;
  else box.textContent = msg;

  setTimeout(() => {
    box.classList.add("hidden");
  }, 5000);
};

// Expose utility
window.countWords = countWords;
