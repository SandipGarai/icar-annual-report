// js/state.js

// Global AppState
window.AppState = {
  meta: {
    submissionId: null,
    lastSavedAt: null,
  },

  // -------------------------------------------------
  // BASIC INFO (canonical source)
  // -------------------------------------------------
  basic_info: {
    institute_name_short: "IIAB",
    faculty_name: "",
    roles: [],
    division: {
      type: "predefined", // "predefined" or "other"
      value: "", // e.g., "Crop Improvement"
      other_text: "", // text when type = "other"
    },
    year: new Date().getFullYear(),
    executive_summary: "",
  },

  sections: {
    // -------------------------------------------------
    // UI-bound shadow copy for basic-info screen
    // -------------------------------------------------
    "basic-info": {
      instName: "",
      facultyName: "",
      roles: [],
      division: {
        type: "predefined",
        value: "",
        other_text: "",
      },
      year: new Date().getFullYear(),
      text: "",
      execSummary: "",
    },

    // -------------------------------------------------
    // IMPORTANT — DIVISION BASED RESEARCH MODEL
    // MUST be an object, NOT an array
    // -------------------------------------------------
    research_accomplishments: {
      // dynamically created keys:
      // "Crop Improvement": [],
      // "Crop Production": [],
      // "Other": [],
    },

    academic_activities: [],
    outreach_activities: [],

    other_institutional_activities: {
      itmu: { text: "", tables: [], figures: [] },
      abi: { text: "", tables: [], figures: [] },
      meetings: [
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
      ],
    },

    training_capacity_building: {
      note: "",
      trainings_organized: [],
      events_attended: [],
    },

    conferences_symposia: { attended: [] },

    linkages: {
      collaborations: [],
    },

    awards_recognition: {
      awards: [],
      recognitions: [],
    },

    publications: {
      categories: {
        research_papers: [],
        review_papers: [],
        books: [],
        book_chapters: [],
        newsletters: [],
        popular_articles: [],
        conference_abstracts: [],
        extension_folders: [],
        other: [],
      },
    },

    annexures: {
      institutional_projects: [],
      external_projects: [],

      budget_utilization: {
        rows: [],
        custom_table: null,
        other_details: {
          text: "",
          tables: [],
          figures: [],
        },
      },

      revenue_generation: { rows: [] },

      developmental_works: {
        lab: [],
        farm: [],
        infrastructure: [],
        other: [],
      },

      committees: {
        qrt: { text: "", members: [] },
        rac: { text: "", members: [] },
        imc: { text: "", members: [] },
        irc: { text: "", members: [] },
        other: { text: "", members: [] },
      },

      nodal_officers: { rows: [] },

      distinguished_visitors: [],
      new_facilities: [],
      infra_in_progress: [],

      staff_positions: {
        appointments: [],
        promotions: [],
        transfers: [],
        new_joining: [],
      },

      institute_in_media: [],
      other_activities: [],
    },
  },

  local_counters: {
    figure: 0,
    table: 0,
  },
};

// -------------------------------------------------
// SAFE deep clone for draft-saving
// -------------------------------------------------
window.cloneAppState = function () {
  if (window.structuredClone) return structuredClone(window.AppState);
  return JSON.parse(JSON.stringify(window.AppState));
};

// -------------------------------------------------
// GLOBAL FLAGS
// -------------------------------------------------
window.__draftLoaded = false;
// Means: "basic_info + sections['basic-info'] are initialised/synced"
window.__basicInfoReady = false;
