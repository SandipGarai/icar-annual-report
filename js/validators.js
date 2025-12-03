/******************************************************
 * validators.js
 * Central validation engine for all sections.
 * Validates:
 *  - Word limits
 *  - Required fields
 *  - Citation placeholders ([FIG-x], [TAB-x])
 *  - Table/Figure arrays
 *  - Missing essential metadata
 ******************************************************/

/******************************************************
 * GENERIC UTILITIES
 ******************************************************/
function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function hasInvalidCitation(text) {
  if (!text) return false;
  const ok = text.match(/\[(FIG|TAB)-\d+\]/g);
  // If no match OR stray "[" or "]", return true
  return /\[.*?\]/g.test(text) && !ok;
}

/******************************************************
 * VALIDATION RULES BY SECTION
 ******************************************************/
const VALIDATION_RULES = {
  "executive-summary": {
    fields: [{ key: "text", maxWords: 350, label: "Executive Summary" }],
  },

  "research-accomplishments": {
    fields: [{ key: "text", maxWords: 300, label: "Research Accomplishments" }],
  },

  "academic-activities": {
    fields: [{ key: "text", maxWords: 250, label: "Academic Activities" }],
  },

  "outreach-activities": {
    fields: [{ key: "text", maxWords: 250, label: "Outreach Activities" }],
  },

  "other-institutional-activities": {
    itmuMax: 250,
    abiMax: 250,
    meetingMax: 250,
  },

  "training-capacity": {
    entryMax: 150,
  },

  "conferences-symposia": {
    entryMax: 150,
  },

  linkages: {
    entryMax: 200,
  },

  "awards-recognition": {
    recognitionMax: 150,
  },

  publications: {
    apaMax: 1000, // 1000 words for APA (practically unlimited)
  },
};

/******************************************************
 * VALIDATE A SPECIFIC SECTION
 ******************************************************/
function validateSection(sectionKey, sectionData) {
  const errors = [];

  switch (sectionKey) {
    /*******************************
     * Executive Summary, Research,
     * Academic, Outreach
     *******************************/
    case "executive-summary":
    case "research-accomplishments":
    case "academic-activities":
    case "outreach-activities": {
      const rules = VALIDATION_RULES[sectionKey];
      rules.fields.forEach((rule) => {
        if (countWords(sectionData.text) > rule.maxWords) {
          errors.push(`${rule.label} exceeds ${rule.maxWords} words.`);
        }
        if (hasInvalidCitation(sectionData.text)) {
          errors.push(`${rule.label} contains invalid citation format.`);
        }
      });
      break;
    }

    /*******************************
     * Training & Conferences
     *******************************/
    case "training-capacity": {
      sectionData.list.forEach((item, idx) => {
        if (
          countWords(item.description) >
          VALIDATION_RULES["training-capacity"].entryMax
        ) {
          errors.push(
            `Training entry ${idx + 1} exceeds ${
              VALIDATION_RULES["training-capacity"].entryMax
            } words.`
          );
        }
      });
      break;
    }

    case "conferences-symposia": {
      sectionData.list.forEach((item, idx) => {
        if (
          countWords(item.description) >
          VALIDATION_RULES["conferences-symposia"].entryMax
        ) {
          errors.push(
            `Conference entry ${idx + 1} exceeds ${
              VALIDATION_RULES["conferences-symposia"].entryMax
            } words.`
          );
        }
      });
      break;
    }

    /*******************************
     * Linkages
     *******************************/
    case "linkages": {
      sectionData.items.forEach((item, idx) => {
        if (
          countWords(item.description) > VALIDATION_RULES["linkages"].entryMax
        ) {
          errors.push(
            `Linkage entry ${idx + 1} exceeds ${
              VALIDATION_RULES["linkages"].entryMax
            } words.`
          );
        }
      });
      break;
    }

    /*******************************
     * Awards & Recognition
     *******************************/
    case "awards-recognition": {
      sectionData.recognitions.forEach((r, idx) => {
        if (
          countWords(r.text) >
          VALIDATION_RULES["awards-recognition"].recognitionMax
        ) {
          errors.push(
            `Recognition ${idx + 1} exceeds ${
              VALIDATION_RULES["awards-recognition"].recognitionMax
            } words.`
          );
        }
      });
      break;
    }

    /*******************************
     * Publications (APA)
     *******************************/
    case "publications": {
      Object.values(sectionData.categories).forEach((categoryArr) => {
        categoryArr.forEach((pub, idx) => {
          if (countWords(pub.apa) > VALIDATION_RULES["publications"].apaMax) {
            errors.push(`APA citation ${idx + 1} exceeds allowed size.`);
          }
          if (hasInvalidCitation(pub.apa)) {
            errors.push(
              `APA citation ${idx + 1} contains invalid citation placeholders.`
            );
          }
        });
      });
      break;
    }

    /*******************************
     * Other Institutional Activities
     *******************************/
    case "other-institutional-activities": {
      const rules = VALIDATION_RULES["other-institutional-activities"];

      // ITMU
      if (countWords(sectionData.itmu.text) > rules.itmuMax) {
        errors.push(`ITMU description exceeds ${rules.itmuMax} words.`);
      }

      // ABI
      if (countWords(sectionData.abi.text) > rules.abiMax) {
        errors.push(`ABI description exceeds ${rules.abiMax} words.`);
      }

      // Meetings
      sectionData.meetings.forEach((m, idx) => {
        if (countWords(m.text) > rules.meetingMax) {
          errors.push(
            `Meeting "${m.title}" exceeds ${rules.meetingMax} words.`
          );
        }
      });

      break;
    }

    default:
      break;
  }

  return errors;
}

/******************************************************
 * VALIDATION FOR FULL SUBMISSION (All Sections)
 * NOTE: Year validation removed as it auto-fills
 ******************************************************/
function validateAllSections() {
  const errors = [];

  for (const secKey of Object.keys(AppState.sections)) {
    const secData = AppState.sections[secKey];
    const e = validateSection(secKey, secData);
    errors.push(...e);
  }

  return errors;
}

/******************************************************
 * HOOK VALIDATION INTO submit.js
 ******************************************************/
function validateBeforeSubmit() {
  const errors = validateAllSections();
  if (errors.length > 0) {
    alert("Cannot submit. Please fix the following:\n\n" + errors.join("\n"));
    return false;
  }
  return true;
}

// Expose globally
window.validateBeforeSubmit = validateBeforeSubmit;
window.validateSection = validateSection;
