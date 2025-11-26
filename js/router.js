// js/router.js

const SectionRegistry = {
  "basic-info": {
    path: "sections/basic-info.html",
    init: initBasicInfoSection,
  },
  "research-accomplishments": {
    path: "sections/research-accomplishments.html",
    init: initResearchSection,
  },
  "academic-activities": {
    path: "sections/academic-activities.html",
    init: initAcademicSection,
  },
  "outreach-activities": {
    path: "sections/outreach-activities.html",
    init: initOutreachSection,
  },
  "other-institutional-activities": {
    path: "sections/other-institutional-activities.html",
    init: initOtherInstitActivities,
  },
  "training-capacity": {
    path: "sections/training-capacity.html",
    init: initTrainingSection,
  },
  "conferences-symposia": {
    path: "sections/conferences-symposia.html",
    init: initConferencesSection,
  },
  linkages: {
    path: "sections/linkages.html",
    init: initLinkagesSection,
  },
  "awards-recognition": {
    path: "sections/awards-recognition.html",
    init: initAwardsRecognitionSection,
  },
  publications: {
    path: "sections/publications.html",
    init: initPublicationsSection,
  },
  annexures: {
    path: "sections/annexures.html",
    init: initAnnexuresSection,
  },
};

async function loadSection(sectionId) {
  const entry = SectionRegistry[sectionId];
  if (!entry) return;

  const content = document.getElementById("content");
  if (!content) return;

  try {
    const resp = await fetch(entry.path + "?v=" + Date.now());
    const html = await resp.text();
    content.innerHTML = html;
    entry.init();
  } catch (err) {
    console.error("Error loading section:", err);
    content.innerHTML = `<p style="color:#b91c1c">Error loading section: ${
      err.message || err
    }</p>`;
  }
}

function setActiveNav(sectionId) {
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.section === sectionId);
  });
}

function initSimplePlaceholder(text) {
  const box = document.getElementById("section-placeholder-box");
  if (box) {
    box.textContent = text;
  }
}
// ------------------------------------
// FIX: Define global Router wrapper
// ------------------------------------
window.Router = {
  load: function (sectionId) {
    setActiveNav(sectionId);
    loadSection(sectionId);
  },
};

window.loadSection = loadSection;
window.setActiveNav = setActiveNav;
