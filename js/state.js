// js/state.js

window.AppState = {
  meta: {
    submissionId: null,
    lastSavedAt: null,
  },
  basic_info: {
    institute_name_short: "ICAR-IIAB",
    faculty_name: "",
    roles: [],
    division: {
      type: "predefined",
      value: "",
      other_text: "",
    },
    year: new Date().getFullYear(),
    executive_summary: "",
  },
  sections: {
    "basic-info": {
      instName: "",
      facultyName: "",
      roles: [],
      division: "",
      divisionOther: "",
      year: new Date().getFullYear(),
      text: "", // for 50–100 words summary
      execSummary: "", // Executive summary moved inside basic info
    },
    research_accomplishments: [],
    academic_activities: [],
    outreach_activities: [],
    other_institutional_activities: {
      itmu: {
        text: "",
        tables: [],
        figures: [],
      },
      abi: {
        text: "",
        tables: [],
        figures: [],
      },
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
      trainings_organized: [], // table rows
      events_attended: [], // table rows
    },

    conferences_symposia: {
      attended: [], // table rows
    },
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
      // 10.1 Ongoing Research Projects (Institutional)
      institutional_projects: [],

      // 10.2 Ongoing Research Projects (External)
      external_projects: [],

      // 10.3 Budget Utilization & Revenue Generation
      budget_utilization: {
        rows: [], // main ICAR heads table
        custom_table: null, // optional uploaded .xlsx (rows+name)
        footer: "GIA-General (Non-scheme) 1270",
      },
      revenue_generation: {
        rows: [], // simple table
      },

      // 10.4 Developmental Works
      developmental_works: {
        lab: [], // [{text, figures:[]}]
        farm: [],
        infrastructure: [],
        other: [],
      },

      // 10.5 Important Committees
      committees: {
        qrt: { text: "", members: [] }, // members: [{role, names}]
        rac: { text: "", members: [] },
        imc: { text: "", members: [] },
        irc: { text: "", members: [] },
        other: { text: "", members: [] },
      },

      // 10.6 Nodal Officers & Responsibilities
      nodal_officers: {
        rows: [], // [{responsibility, officer}]
      },

      // 10.7 Distinguished Visitors etc.
      distinguished_visitors: [], // [{name, designation, date, figures:[]}]
      new_facilities: [], // [{facility, date, note, tables:[], figures:[]}]
      infra_in_progress: [], // [{name, note, figures:[]}]
      staff_positions: {
        appointments: [], // [{note, tables:[], figures:[]}]
        promotions: [],
        transfers: [],
        new_joining: [],
      },
      institute_in_media: [], // [{date, publisher, note, figures:[]}]
      other_activities: [], // [{note, tables:[], figures:[]}]
    },
  },
  local_counters: {
    figure: 0,
    table: 0,
  },
};

window.cloneAppState = function () {
  return JSON.parse(JSON.stringify(window.AppState));
};
