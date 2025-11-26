// js/export-pdf.js

// -------------------------------
// Small helpers
// -------------------------------
function hasText(str) {
  return !!(str && String(str).trim());
}

function hasArrayContent(arr) {
  return Array.isArray(arr) && arr.length > 0;
}

function getInstituteName() {
  return (
    (AppState.basic_info && AppState.basic_info.institute_name_short) ||
    "ICAR-Institute"
  );
}

function getYear() {
  return (
    (AppState.basic_info && AppState.basic_info.year) ||
    (AppState.sections["basic-info"] && AppState.sections["basic-info"].year) ||
    new Date().getFullYear()
  );
}

function getFacultyName() {
  return (
    (AppState.basic_info && AppState.basic_info.faculty_name) ||
    (AppState.sections["basic-info"] &&
      AppState.sections["basic-info"].facultyName) ||
    "Faculty"
  );
}

// SectionEngine block: title, text, figures, tables
function hasBlockContent(blk) {
  if (!blk) return false;
  const hasT = hasText(blk.text);
  const hasTitle = hasText(blk.title);
  const hasFig = hasArrayContent(blk.figures);
  const hasTab = hasArrayContent(blk.tables);
  return hasT || hasTitle || hasFig || hasTab;
}

// Replace [FIG-n] → "Figure n", [TAB-n] → "Table n"
function replaceFigureTableRefs(text) {
  if (!text) return "";
  let out = text;
  out = out.replace(/\[FIG-(\d+)\]/g, (_m, n) => `Figure ${n}`);
  out = out.replace(/\[TAB-(\d+)\]/g, (_m, n) => `Table ${n}`);
  return out;
}

// -------------------------------
// Generic paragraph writer
// -------------------------------
function writeParagraph(doc, text, state) {
  const {
    pageWidth,
    pageHeight,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
  } = state;
  let y = state.cursorY;

  if (!text || !text.trim()) return y;

  const maxWidth = pageWidth - marginLeft - marginRight;
  const paragraphs = text.split(/\n\s*\n/); // blank line => new paragraph

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);

  paragraphs.forEach((para, idx) => {
    const lines = doc.splitTextToSize(para.trim(), maxWidth);

    lines.forEach((line) => {
      if (y > pageHeight - marginBottom) {
        doc.addPage();
        y = marginTop;
      }
      doc.text(line, marginLeft, y);
      y += 14;
    });

    if (idx < paragraphs.length - 1) {
      y += 6;
    }
  });

  return y;
}

function writeSectionTitle(doc, label, state, isFirstPage) {
  const { marginLeft, marginTop } = state;
  let y = state.cursorY;

  if (!isFirstPage) {
    doc.addPage();
    y = marginTop;
  }

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.text(label, marginLeft, y);
  y += 24;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);

  state.cursorY = y;
}

function writeSubheading(doc, text, state) {
  const { pageHeight, marginLeft, marginBottom, marginTop } = state;
  let y = state.cursorY;

  if (y > pageHeight - marginBottom - 30) {
    doc.addPage();
    y = marginTop;
  }

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(13);
  doc.text(text, marginLeft, y);
  y += 18;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);

  state.cursorY = y;
}

// -------------------------------
// AutoTable for XLSX-style rows
// -------------------------------
function renderXlsxTable(doc, rows, state) {
  if (!rows || !rows.length) return;

  const head = [rows[0].map((c) => (c == null ? "" : String(c)))];
  const body = rows
    .slice(1)
    .map((r) => r.map((c) => (c == null ? "" : String(c))));

  const startY = state.cursorY + 10;
  doc.autoTable({
    head,
    body,
    startY,
    margin: { left: state.marginLeft, right: state.marginRight },
    styles: { font: "Helvetica", fontSize: 9 },
    headStyles: { fillColor: [102, 126, 234], textColor: 255, halign: "left" },
    theme: "grid",
  });

  const finalY = doc.lastAutoTable.finalY || startY;
  state.cursorY = finalY + 16;
}

// AutoTable for object-rows (simple tables)
function renderObjectTable(doc, rows, state, columnMap, headerLabel) {
  const cleanRows = (rows || []).filter((r) => {
    if (!r) return false;
    return Object.values(r).some((v) => hasText(v));
  });
  if (!cleanRows.length) return;

  const { marginLeft, marginTop, marginBottom, pageHeight } = state;

  if (state.cursorY > pageHeight - marginBottom - 60) {
    doc.addPage();
    state.cursorY = marginTop;
  }

  if (hasText(headerLabel)) {
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text(headerLabel, marginLeft, state.cursorY);
    state.cursorY += 16;
  }

  const head = [columnMap.map((c) => c.header)];
  const body = cleanRows.map((row) =>
    columnMap.map((c) => (row[c.key] != null ? String(row[c.key]) : ""))
  );

  const startY = state.cursorY + 4;
  doc.autoTable({
    head,
    body,
    startY,
    margin: { left: state.marginLeft, right: state.marginRight },
    styles: { font: "Helvetica", fontSize: 9 },
    headStyles: { fillColor: [102, 126, 234], textColor: 255, halign: "left" },
    theme: "grid",
  });

  const finalY = doc.lastAutoTable.finalY || startY;
  state.cursorY = finalY + 16;
}

// -------------------------------
// Images
// -------------------------------
function loadImageForPdf(figObj) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let src = figObj.base64 || "";
    if (src && !src.startsWith("data:")) {
      const mime = figObj.mimeType || figObj.type || "image/png";
      src = `data:${mime};base64,${src}`;
    }
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function renderSectionFigures(doc, figures, state, sectionLabel) {
  if (!figures || !figures.length) return;

  const {
    pageWidth,
    pageHeight,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
  } = state;
  let y = state.cursorY;

  // "Figures – [Section]"
  if (y > pageHeight - marginBottom - 40) {
    doc.addPage();
    y = marginTop;
  }
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`Figures – ${sectionLabel}`, marginLeft, y);
  y += 20;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);

  for (let i = 0; i < figures.length; i++) {
    const fig = figures[i];
    if (!fig) continue;

    let img;
    try {
      img = await loadImageForPdf(fig);
    } catch {
      continue;
    }

    const maxWidth = pageWidth - marginLeft - marginRight;
    const maxHeight = 260;

    let w = img.width;
    let h = img.height;
    const scale = Math.min(maxWidth / w, maxHeight / h, 1);
    w *= scale;
    h *= scale;

    if (y + h + 50 > pageHeight - marginBottom) {
      doc.addPage();
      y = marginTop;
    }

    const x = marginLeft + (maxWidth - w) / 2;
    const src =
      fig.base64 && fig.base64.startsWith("data:")
        ? fig.base64
        : `data:${fig.mimeType || fig.type || "image/png"};base64,${
            fig.base64
          }`;

    doc.addImage(src, "JPEG", x, y, w, h);
    y += h + 10;

    const num = fig.localIndex || i + 1;
    const caption = fig.caption || "";
    const capText = `Figure ${num}: ${caption}`;
    const lines = doc.splitTextToSize(capText, maxWidth);
    lines.forEach((line) => {
      if (y > pageHeight - marginBottom - 20) {
        doc.addPage();
        y = marginTop;
      }
      doc.text(line, marginLeft, y);
      y += 12;
    });

    y += 10;
  }

  state.cursorY = y;
}

async function renderSectionTables(doc, tables, state, sectionLabel) {
  if (!tables || !tables.length) return;

  const { pageHeight, marginLeft, marginTop, marginBottom } = state;
  let y = state.cursorY;

  if (y > pageHeight - marginBottom - 40) {
    doc.addPage();
    y = marginTop;
  }

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`Tables – ${sectionLabel}`, marginLeft, y);
  y += 16;
  state.cursorY = y;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);

  for (let i = 0; i < tables.length; i++) {
    const t = tables[i];
    if (!t) continue;

    const num = t.localIndex || i + 1;
    const caption = t.caption || "";
    const capText = `Table ${num}: ${caption}`;

    const capLines = doc.splitTextToSize(
      capText,
      doc.internal.pageSize.getWidth() - marginLeft * 2
    );
    for (const line of capLines) {
      if (
        state.cursorY >
        doc.internal.pageSize.getHeight() - marginBottom - 20
      ) {
        doc.addPage();
        state.cursorY = marginTop;
      }
      doc.text(line, marginLeft, state.cursorY);
      state.cursorY += 12;
    }

    renderXlsxTable(doc, t.rows || [], state);
  }
}

// -------------------------------
// Section 0 – Basic Information
// -------------------------------
async function renderBasicInfoSection(doc, state) {
  const b0 = AppState.sections["basic-info"] || {};
  const bi = AppState.basic_info || {};

  const anyContent =
    hasText(b0.instName) ||
    hasText(b0.facultyName) ||
    hasText(b0.text) ||
    hasText(b0.execSummary) ||
    hasText(bi.institute_name_short) ||
    hasText(bi.faculty_name);

  if (!anyContent) return; // skip entire section if truly empty (unlikely)

  writeSectionTitle(doc, "0. Basic Information", state, true);

  const lines = [
    `Institute: ${bi.institute_name_short || b0.instName || ""}`,
    `Faculty Name: ${bi.faculty_name || b0.facultyName || ""}`,
    `Division: ${b0.division || ""}${
      b0.division === "Other" && b0.divisionOther
        ? " (" + b0.divisionOther + ")"
        : ""
    }`,
    `Year: ${bi.year || b0.year || getYear()}`,
  ];

  let text = lines.filter((l) => l.trim()).join("\n");
  if (hasText(b0.text)) {
    text += "\n\nShort summary:\n" + replaceFigureTableRefs(b0.text);
  }
  if (hasText(b0.execSummary)) {
    text += "\n\nExecutive Summary:\n" + replaceFigureTableRefs(b0.execSummary);
  }

  state.cursorY = writeParagraph(doc, text, state);
}

// -------------------------------
// Section 1 – Research Accomplishments
// -------------------------------
async function renderResearchSection(doc, state) {
  const arr = AppState.sections.research_accomplishments;
  if (!Array.isArray(arr)) return;

  // Filter out projects & subheadings with no content
  const projectsWithContent = arr
    .map((proj) => {
      const subFiltered = (proj.subheadings || [])
        .map((sub) => {
          const blocks = (sub.blocks || []).filter(hasBlockContent);
          if (!blocks.length && !hasText(sub.title)) return null;
          return { ...sub, blocks };
        })
        .filter(Boolean);

      const hasProjTitle = hasText(proj.project_title);
      if (!subFiltered.length && !hasProjTitle) return null;

      return { ...proj, subheadings: subFiltered };
    })
    .filter(Boolean);

  if (!projectsWithContent.length) return; // skip whole section

  writeSectionTitle(doc, "1. Research Accomplishments", state, false);

  const sectionFigures = [];
  const sectionTables = [];

  projectsWithContent.forEach((proj, pIdx) => {
    const title = proj.project_title || `Project ${pIdx + 1}`;
    writeSubheading(doc, `1.${pIdx + 1} ${title}`, state);

    (proj.subheadings || []).forEach((sub, sIdx) => {
      const stitle = sub.title || `Subheading ${sIdx + 1}`;
      writeSubheading(doc, stitle, state);

      (sub.blocks || []).forEach((blk) => {
        const text = replaceFigureTableRefs(blk.text || "");
        state.cursorY = writeParagraph(doc, text, state);

        if (Array.isArray(blk.figures)) {
          blk.figures.forEach((f) => sectionFigures.push(f));
        }
        if (Array.isArray(blk.tables)) {
          blk.tables.forEach((t) => sectionTables.push(t));
        }
      });
    });
  });

  await renderSectionFigures(
    doc,
    sectionFigures,
    state,
    "Research Accomplishments"
  );
  await renderSectionTables(
    doc,
    sectionTables,
    state,
    "Research Accomplishments"
  );
}

// -------------------------------
// Section 2 – Academic Activities
// -------------------------------
async function renderAcademicSection(doc, state) {
  const arr = AppState.sections.academic_activities;
  if (!Array.isArray(arr)) return;

  const subsWithContent = arr
    .map((sub) => {
      const blocks = (sub.blocks || []).filter(hasBlockContent);
      if (!blocks.length && !hasText(sub.title) && !hasText(sub.key))
        return null;
      return { ...sub, blocks };
    })
    .filter(Boolean);

  if (!subsWithContent.length) return;

  writeSectionTitle(doc, "2. Academic Activities", state, false);

  const sectionFigures = [];
  const sectionTables = [];

  subsWithContent.forEach((sub, idx) => {
    const label = sub.title || sub.key || `Academic Subsection ${idx + 1}`;
    writeSubheading(doc, label, state);

    (sub.blocks || []).forEach((blk) => {
      if (hasText(blk.title)) {
        writeSubheading(doc, blk.title, state);
      }
      const text = replaceFigureTableRefs(blk.text || "");
      state.cursorY = writeParagraph(doc, text, state);

      if (Array.isArray(blk.figures))
        blk.figures.forEach((f) => sectionFigures.push(f));
      if (Array.isArray(blk.tables))
        blk.tables.forEach((t) => sectionTables.push(t));
    });
  });

  await renderSectionFigures(doc, sectionFigures, state, "Academic Activities");
  await renderSectionTables(doc, sectionTables, state, "Academic Activities");
}

// -------------------------------
// Section 3 – Outreach Activities
// -------------------------------
async function renderOutreachSection(doc, state) {
  const arr = AppState.sections.outreach_activities;
  if (!Array.isArray(arr)) return;

  const subsWithContent = arr
    .map((sub) => {
      const blocks = (sub.blocks || []).filter(hasBlockContent);
      if (!blocks.length && !hasText(sub.title) && !hasText(sub.key))
        return null;
      return { ...sub, blocks };
    })
    .filter(Boolean);

  if (!subsWithContent.length) return;

  writeSectionTitle(doc, "3. Outreach Activities", state, false);

  const sectionFigures = [];
  const sectionTables = [];

  subsWithContent.forEach((sub, idx) => {
    const label = sub.title || sub.key || `Outreach Subsection ${idx + 1}`;
    writeSubheading(doc, label, state);

    (sub.blocks || []).forEach((blk) => {
      if (hasText(blk.title)) {
        writeSubheading(doc, blk.title, state);
      }
      const text = replaceFigureTableRefs(blk.text || "");
      state.cursorY = writeParagraph(doc, text, state);

      if (Array.isArray(blk.figures))
        blk.figures.forEach((f) => sectionFigures.push(f));
      if (Array.isArray(blk.tables))
        blk.tables.forEach((t) => sectionTables.push(t));
    });
  });

  await renderSectionFigures(doc, sectionFigures, state, "Outreach Activities");
  await renderSectionTables(doc, sectionTables, state, "Outreach Activities");
}

// -------------------------------
// Section 4 – Other Institutional Activities
// -------------------------------
async function renderOtherInstitutionalSection(doc, state) {
  const sec = AppState.sections.other_institutional_activities;
  if (!sec) return;

  const hasUnitContent = (u) =>
    u &&
    (hasText(u.text) ||
      hasArrayContent(u.tables) ||
      hasArrayContent(u.figures));

  const meetingsWithContent = (sec.meetings || []).filter(
    (m) =>
      hasText(m.text) || hasArrayContent(m.tables) || hasArrayContent(m.figures)
  );

  const anyContent =
    hasUnitContent(sec.itmu) ||
    hasUnitContent(sec.abi) ||
    meetingsWithContent.length > 0;

  if (!anyContent) return;

  writeSectionTitle(doc, "4. Other Institutional Activities", state, false);

  const sectionFigures = [];
  const sectionTables = [];

  if (hasUnitContent(sec.itmu)) {
    writeSubheading(doc, "4.1 ITMU", state);
    if (hasText(sec.itmu.text)) {
      state.cursorY = writeParagraph(
        doc,
        replaceFigureTableRefs(sec.itmu.text),
        state
      );
    }
    (sec.itmu.tables || []).forEach((t) => sectionTables.push(t));
    (sec.itmu.figures || []).forEach((f) => sectionFigures.push(f));
  }

  if (hasUnitContent(sec.abi)) {
    writeSubheading(doc, "4.2 ABI", state);
    if (hasText(sec.abi.text)) {
      state.cursorY = writeParagraph(
        doc,
        replaceFigureTableRefs(sec.abi.text),
        state
      );
    }
    (sec.abi.tables || []).forEach((t) => sectionTables.push(t));
    (sec.abi.figures || []).forEach((f) => sectionFigures.push(f));
  }

  if (meetingsWithContent.length) {
    writeSubheading(doc, "4.3 Meetings", state);

    meetingsWithContent.forEach((m, idx) => {
      const title = m.title || `Meeting ${idx + 1}`;
      writeSubheading(doc, title, state);

      if (hasText(m.text)) {
        state.cursorY = writeParagraph(
          doc,
          replaceFigureTableRefs(m.text),
          state
        );
      }
      (m.tables || []).forEach((t) => sectionTables.push(t));
      (m.figures || []).forEach((f) => sectionFigures.push(f));
    });
  }

  await renderSectionFigures(
    doc,
    sectionFigures,
    state,
    "Other Institutional Activities"
  );
  await renderSectionTables(
    doc,
    sectionTables,
    state,
    "Other Institutional Activities"
  );
}

// -------------------------------
// Section 5 – Training & Capacity Building
// -------------------------------
async function renderTrainingSection(doc, state) {
  const sec = AppState.sections.training_capacity_building;
  if (!sec) return;

  const rowsWithContent = (rows) =>
    (rows || []).filter((r) => {
      if (!r) return false;
      return Object.values(r).some((v) => hasText(v));
    });

  const trainings = rowsWithContent(sec.trainings_organized);
  const events = rowsWithContent(sec.events_attended);

  const anyContent =
    hasText(sec.note) || trainings.length > 0 || events.length > 0;

  if (!anyContent) return;

  writeSectionTitle(doc, "5. Training & Capacity Building", state, false);

  if (hasText(sec.note)) {
    writeSubheading(doc, "Overview", state);
    state.cursorY = writeParagraph(
      doc,
      replaceFigureTableRefs(sec.note),
      state
    );
  }

  if (trainings.length) {
    renderObjectTable(
      doc,
      trainings,
      state,
      [
        { key: "program_title", header: "Title" },
        { key: "start_date", header: "Start Date" },
        { key: "end_date", header: "End Date" },
        { key: "duration", header: "Duration" },
        { key: "place", header: "Venue" },
        { key: "participants", header: "Participants" },
      ],
      "Trainings Organized"
    );
  }

  if (events.length) {
    renderObjectTable(
      doc,
      events,
      state,
      [
        { key: "title", header: "Title" },
        { key: "start_date", header: "Start Date" },
        { key: "end_date", header: "End Date" },
        { key: "duration", header: "Duration" },
        { key: "place", header: "Venue" },
      ],
      "Events Attended"
    );
  }
}

// -------------------------------
// Section 6 – Conferences / Symposia
// -------------------------------
async function renderConferencesSection(doc, state) {
  const sec = AppState.sections.conferences_symposia;
  if (!sec) return;

  const rowsWithContent = (rows) =>
    (rows || []).filter((r) => {
      if (!r) return false;
      return Object.values(r).some((v) => hasText(v));
    });

  const attended = rowsWithContent(sec.attended);
  if (!attended.length) return;

  writeSectionTitle(doc, "6. Conferences / Symposia Attended", state, false);

  renderObjectTable(
    doc,
    attended,
    state,
    [
      { key: "title", header: "Title" },
      { key: "type", header: "Type" },
      { key: "place", header: "Place" },
      { key: "start_date", header: "From" },
      { key: "end_date", header: "To" },
      { key: "role", header: "Role" },
    ],
    "Events Attended"
  );
}

// -------------------------------
// Section 7 – Linkages & Collaborations
// -------------------------------
async function renderLinkagesSection(doc, state) {
  const sec = AppState.sections.linkages;
  if (!sec) return;

  const colls = sec.collaborations || [];

  // Two possible shapes:
  // 1) Each item has .blocks (SectionEngine style)
  // 2) Each item itself is a "block" { text, tables, figures }
  const sectionFigures = [];
  const sectionTables = [];

  const itemsWithContent = colls.filter((c) => {
    if (!c) return false;
    if (Array.isArray(c.blocks)) {
      return c.blocks.some(hasBlockContent);
    }
    return hasBlockContent(c);
  });

  if (!itemsWithContent.length) return;

  writeSectionTitle(doc, "7. Linkages & Collaborations", state, false);

  itemsWithContent.forEach((item, idx) => {
    const title = item.title || item.partner || `Collaboration ${idx + 1}`;
    writeSubheading(doc, title, state);

    if (Array.isArray(item.blocks)) {
      item.blocks.filter(hasBlockContent).forEach((blk) => {
        if (hasText(blk.title)) writeSubheading(doc, blk.title, state);
        const text = replaceFigureTableRefs(blk.text || "");
        state.cursorY = writeParagraph(doc, text, state);
        (blk.figures || []).forEach((f) => sectionFigures.push(f));
        (blk.tables || []).forEach((t) => sectionTables.push(t));
      });
    } else {
      const text = replaceFigureTableRefs(item.text || "");
      state.cursorY = writeParagraph(doc, text, state);
      (item.figures || []).forEach((f) => sectionFigures.push(f));
      (item.tables || []).forEach((t) => sectionTables.push(t));
    }
  });

  await renderSectionFigures(doc, sectionFigures, state, "Linkages");
  await renderSectionTables(doc, sectionTables, state, "Linkages");
}

// -------------------------------
// Section 8 – Awards & Recognition  (NEW)
// -------------------------------
async function renderAwardsSection(doc, state) {
  const sec = AppState.sections.awards_recognition;
  if (!sec) return;

  const awards = Array.isArray(sec.awards) ? sec.awards : [];
  const recognitions = Array.isArray(sec.recognitions) ? sec.recognitions : [];

  const awardsFilled = awards.filter(
    (a) =>
      hasText(a.details) ||
      hasText(a.organiser) ||
      hasText(a.date) ||
      hasText(a.awardees) ||
      hasArrayContent(a.figures)
  );

  const recFilled = recognitions.filter(
    (r) => hasText(r.text) || hasArrayContent(r.figures)
  );

  if (!awardsFilled.length && !recFilled.length) return;

  writeSectionTitle(doc, "8. Awards & Recognition", state, false);

  const sectionFigures = [];
  const sectionTables = [];

  // ------------------------------------------------------------
  // 8.1 AWARDS — render as CLEAN TABLE, not paragraphs
  // ------------------------------------------------------------
  if (awardsFilled.length) {
    writeSubheading(doc, "8.1 Awards", state);

    const header = [
      "Sl No",
      "Details",
      "Organiser",
      "Date",
      "Awardees",
      "Figure Ref",
    ];

    const body = awardsFilled.map((a, i) => {
      // Collect figures but do NOT embed in table
      let figureRefText = "";
      if (Array.isArray(a.figures)) {
        a.figures.forEach((f) => sectionFigures.push(f));
        figureRefText = a.figures
          .map((f) => `Figure ${f.localIndex || ""}`)
          .join(", ");
      }

      return [
        String(i + 1),
        replaceFigureTableRefs(a.details || ""),
        replaceFigureTableRefs(a.organiser || ""),
        replaceFigureTableRefs(a.date || ""),
        replaceFigureTableRefs(a.awardees || ""),
        figureRefText,
      ];
    });

    const startY = state.cursorY + 6;

    doc.autoTable({
      head: [header],
      body,
      startY,
      margin: { left: state.marginLeft, right: state.marginRight },
      styles: { font: "Helvetica", fontSize: 9 },
      theme: "grid",
      headStyles: { fillColor: [102, 126, 234], textColor: 255 },
    });

    state.cursorY = doc.lastAutoTable.finalY + 20;
  }

  // ------------------------------------------------------------
  // 8.2 RECOGNITIONS — text + collect figures
  // ------------------------------------------------------------
  if (recFilled.length) {
    writeSubheading(doc, "8.2 Recognitions", state);

    recFilled.forEach((r, i) => {
      const text = `${i + 1}. ${replaceFigureTableRefs(r.text || "")}`;
      state.cursorY = writeParagraph(doc, text, state);

      if (Array.isArray(r.figures)) {
        r.figures.forEach((f) => sectionFigures.push(f));
      }
    });
  }

  // ------------------------------------------------------------
  // Append ALL FIGURES at end of Awards section
  // ------------------------------------------------------------
  await renderSectionFigures(
    doc,
    sectionFigures,
    state,
    "Awards & Recognition"
  );
}

// -------------------------------
// Section 9 – Publications
// -------------------------------
async function renderPublicationsSection(doc, state) {
  const sec = AppState.sections.publications;
  if (!sec || !sec.categories) return;

  const cats = sec.categories;

  const categoryLabels = {
    research_papers: "Research Papers",
    review_papers: "Review Papers",
    books: "Books",
    book_chapters: "Book Chapters",
    newsletters: "Newsletters",
    popular_articles: "Popular Articles",
    conference_abstracts: "Conference Abstracts",
    extension_folders: "Extension Folders / Leaflets",
    other: "Other Publications",
  };

  const catKeys = Object.keys(categoryLabels);

  const hasAnyPub = catKeys.some((key) => {
    const arr = cats[key] || [];
    return arr.some((p) => Object.values(p || {}).some((v) => hasText(v)));
  });

  if (!hasAnyPub) return;

  writeSectionTitle(doc, "9. Publications", state, false);

  catKeys.forEach((key, idx) => {
    const list = (cats[key] || []).filter((p) =>
      Object.values(p || {}).some((v) => hasText(v))
    );
    if (!list.length) return;

    const label = categoryLabels[key] || `Category ${idx + 1}`;
    writeSubheading(doc, label, state);

    list.forEach((p, i) => {
      // Try to use 'citation' field if present, otherwise join values
      const citation =
        p.citation ||
        p.ref ||
        Object.values(p || {})
          .map((v) => (v != null ? String(v) : ""))
          .join("; ");

      const para = `${i + 1}. ${citation}`;
      state.cursorY = writeParagraph(doc, para, state);
    });
  });
}

// -------------------------------
// Section 10 – Annexures
// -------------------------------
async function renderAnnexuresSection(doc, state) {
  const sec = AppState.sections.annexures;
  if (!sec) return;

  const anyContent =
    hasArrayContent(sec.institutional_projects) ||
    hasArrayContent(sec.external_projects) ||
    (sec.budget_utilization &&
      (hasArrayContent(sec.budget_utilization.rows) ||
        (sec.budget_utilization.custom_table &&
          hasArrayContent(sec.budget_utilization.custom_table.rows)))) ||
    (sec.revenue_generation && hasArrayContent(sec.revenue_generation.rows)) ||
    (sec.developmental_works &&
      (hasArrayContent(sec.developmental_works.lab) ||
        hasArrayContent(sec.developmental_works.farm) ||
        hasArrayContent(sec.developmental_works.infrastructure) ||
        hasArrayContent(sec.developmental_works.other))) ||
    (sec.committees &&
      (hasText(sec.committees.qrt?.text) ||
        hasText(sec.committees.rac?.text) ||
        hasText(sec.committees.imc?.text) ||
        hasText(sec.committees.irc?.text) ||
        hasText(sec.committees.other?.text) ||
        hasArrayContent(sec.committees.qrt?.members) ||
        hasArrayContent(sec.committees.rac?.members) ||
        hasArrayContent(sec.committees.imc?.members) ||
        hasArrayContent(sec.committees.irc?.members) ||
        hasArrayContent(sec.committees.other?.members))) ||
    (sec.nodal_officers && hasArrayContent(sec.nodal_officers.rows)) ||
    hasArrayContent(sec.distinguished_visitors) ||
    hasArrayContent(sec.new_facilities) ||
    hasArrayContent(sec.infra_in_progress) ||
    (sec.staff_positions &&
      (hasArrayContent(sec.staff_positions.appointments) ||
        hasArrayContent(sec.staff_positions.promotions) ||
        hasArrayContent(sec.staff_positions.transfers) ||
        hasArrayContent(sec.staff_positions.new_joining))) ||
    hasArrayContent(sec.institute_in_media) ||
    hasArrayContent(sec.other_activities);

  if (!anyContent) return;

  writeSectionTitle(doc, "10. Annexures", state, false);

  const sectionFigures = [];
  const sectionTables = [];

  // 10.1 Institutional projects
  if (hasArrayContent(sec.institutional_projects)) {
    writeSubheading(
      doc,
      "10.1 Ongoing Research Projects (Institutional)",
      state
    );
    renderObjectTable(
      doc,
      sec.institutional_projects,
      state,
      [
        { key: "pi", header: "PI" },
        { key: "copi", header: "Co-PI(s)" },
        { key: "title", header: "Project Title" },
        { key: "code", header: "Project Code" },
        { key: "budget", header: "Budget (Lakhs)" },
        { key: "start_date", header: "Start Date" },
        { key: "end_date", header: "End Date" },
        { key: "duration", header: "Duration" },
      ],
      ""
    );
  }

  // 10.2 External projects
  if (hasArrayContent(sec.external_projects)) {
    writeSubheading(doc, "10.2 Ongoing Research Projects (External)", state);
    renderObjectTable(
      doc,
      sec.external_projects,
      state,
      [
        { key: "pi", header: "PI" },
        { key: "copi", header: "Co-PI(s)" },
        { key: "title", header: "Project Title" },
        { key: "code", header: "Project Code" },
        { key: "agency", header: "Funding Agency" },
        { key: "budget", header: "Budget (Lakhs)" },
        { key: "start_date", header: "Start Date" },
        { key: "end_date", header: "End Date" },
        { key: "duration", header: "Duration" },
      ],
      ""
    );
  }

  // 10.3 Budget Utilization & Revenue Generation
  if (
    sec.budget_utilization &&
    (hasArrayContent(sec.budget_utilization.rows) ||
      (sec.budget_utilization.custom_table &&
        hasArrayContent(sec.budget_utilization.custom_table.rows)))
  ) {
    writeSubheading(doc, "10.3.1 Budget Utilization", state);

    if (hasArrayContent(sec.budget_utilization.rows)) {
      const rows = sec.budget_utilization.rows;
      const header = [
        "Head",
        "RE",
        "Total Expenditure",
        "Total Expenditure (%)",
        "BE",
        "Upto 31-12",
        "Upto 31-12 (%)",
      ];
      const body = rows.map((r) => [
        r.head || "",
        r.re || "",
        r.exp || "",
        r.exp_pct || "",
        r.be || "",
        r.upto || "",
        r.upto_pct || "",
      ]);

      const startY = state.cursorY + 8;
      doc.autoTable({
        head: [header],
        body,
        startY,
        margin: { left: state.marginLeft, right: state.marginRight },
        styles: { font: "Helvetica", fontSize: 9 },
        headStyles: {
          fillColor: [102, 126, 234],
          textColor: 255,
          halign: "left",
        },
        theme: "grid",
      });
      const finalY = doc.lastAutoTable.finalY || startY;
      state.cursorY = finalY + 16;
    }

    if (
      sec.budget_utilization.custom_table &&
      hasArrayContent(sec.budget_utilization.custom_table.rows)
    ) {
      writeSubheading(
        doc,
        "Custom Budget Table – " +
          (sec.budget_utilization.custom_table.name || ""),
        state
      );
      renderXlsxTable(doc, sec.budget_utilization.custom_table.rows, state);
    }

    if (hasText(sec.budget_utilization.footer)) {
      state.cursorY = writeParagraph(doc, sec.budget_utilization.footer, state);
    }
  }

  if (sec.revenue_generation && hasArrayContent(sec.revenue_generation.rows)) {
    writeSubheading(doc, "10.3.2 Revenue Generation", state);
    renderObjectTable(
      doc,
      sec.revenue_generation.rows,
      state,
      [
        { key: "head", header: "Head" },
        { key: "prev", header: "FY (Previous)" },
        { key: "curr", header: "FY (Current)" },
      ],
      ""
    );
  }

  // 10.4 Developmental works (lab, farm, infra, other)
  const dev = sec.developmental_works || {};
  const devSections = [
    { key: "lab", title: "10.4.1 Laboratory Development" },
    { key: "farm", title: "10.4.2 Farm Development" },
    { key: "infrastructure", title: "10.4.3 Infrastructure Development" },
    { key: "other", title: "10.4.4 Other Developmental Works" },
  ];

  devSections.forEach((ds) => {
    const list = dev[ds.key] || [];
    const filled = list.filter(
      (it) => it && (hasText(it.text) || hasArrayContent(it.figures))
    );
    if (!filled.length) return;

    writeSubheading(doc, ds.title, state);
    filled.forEach((it, i) => {
      const para = `${i + 1}. ${replaceFigureTableRefs(it.text || "")}`;
      state.cursorY = writeParagraph(doc, para, state);
      (it.figures || []).forEach((f) => sectionFigures.push(f));
    });
  });

  // 10.5 Important Committees
  const comm = sec.committees || {};
  const commMeta = [
    { key: "qrt", title: "10.5.1 QRT" },
    { key: "rac", title: "10.5.2 RAC" },
    { key: "imc", title: "10.5.3 IMC" },
    { key: "irc", title: "10.5.4 IRC" },
    { key: "other", title: "10.5.5 Other Committees" },
  ];

  commMeta.forEach((m) => {
    const obj = comm[m.key] || {};
    const members = obj.members || [];
    const memFilled = members.filter(
      (r) => r && (hasText(r.role) || hasText(r.names))
    );
    if (!hasText(obj.text) && !memFilled.length) return;

    writeSubheading(doc, m.title, state);

    if (hasText(obj.text)) {
      state.cursorY = writeParagraph(
        doc,
        replaceFigureTableRefs(obj.text),
        state
      );
    }

    if (memFilled.length) {
      renderObjectTable(
        doc,
        memFilled,
        state,
        [
          { key: "role", header: "Chairman / Members" },
          { key: "names", header: "Names & Designations" },
        ],
        "Committee Composition"
      );
    }
  });

  // 10.6 Nodal Officers
  if (sec.nodal_officers && hasArrayContent(sec.nodal_officers.rows)) {
    writeSubheading(doc, "10.6 Nodal Officers & Responsibilities", state);
    renderObjectTable(
      doc,
      sec.nodal_officers.rows,
      state,
      [
        { key: "responsibility", header: "Responsibilities" },
        { key: "officer", header: "Nodal Officer(s)" },
      ],
      ""
    );
  }

  // 10.7 Distinguished Visitors
  if (hasArrayContent(sec.distinguished_visitors)) {
    const vs = sec.distinguished_visitors.filter(
      (v) =>
        v &&
        (hasText(v.name) ||
          hasText(v.designation) ||
          hasText(v.date) ||
          hasArrayContent(v.figures))
    );
    if (vs.length) {
      writeSubheading(doc, "10.7 Distinguished Visitors", state);
      vs.forEach((v, i) => {
        const txt = [v.name || "", v.designation || "", v.date || ""]
          .filter(Boolean)
          .join(", ");
        const para = `${i + 1}. ${txt}`;
        state.cursorY = writeParagraph(doc, para, state);
        (v.figures || []).forEach((f) => sectionFigures.push(f));
      });
    }
  }

  // 10.8 Inauguration of New Facilities
  if (hasArrayContent(sec.new_facilities)) {
    const fs = sec.new_facilities.filter(
      (f) =>
        f &&
        (hasText(f.facility) ||
          hasText(f.date) ||
          hasText(f.note) ||
          hasArrayContent(f.figures) ||
          hasArrayContent(f.tables))
    );
    if (fs.length) {
      writeSubheading(doc, "10.8 Inauguration of New Facilities", state);
      fs.forEach((f, i) => {
        const head = [f.facility || "", f.date || ""]
          .filter(Boolean)
          .join(" — ");
        let para = `${i + 1}. ${head}`;
        if (hasText(f.note)) {
          para += "\n" + replaceFigureTableRefs(f.note);
        }
        state.cursorY = writeParagraph(doc, para, state);
        (f.figures || []).forEach((g) => sectionFigures.push(g));
        (f.tables || []).forEach((t) => sectionTables.push(t));
      });
    }
  }

  // 10.9 Infrastructure in progress
  if (hasArrayContent(sec.infra_in_progress)) {
    const is = sec.infra_in_progress.filter(
      (it) =>
        it &&
        (hasText(it.name) || hasText(it.note) || hasArrayContent(it.figures))
    );
    if (is.length) {
      writeSubheading(
        doc,
        "10.9 Infrastructure Development in Progress",
        state
      );
      is.forEach((it, i) => {
        let para = `${i + 1}. ${it.name || ""}`;
        if (hasText(it.note)) {
          para += "\n" + replaceFigureTableRefs(it.note);
        }
        state.cursorY = writeParagraph(doc, para, state);
        (it.figures || []).forEach((f) => sectionFigures.push(f));
      });
    }
  }

  // 10.10 Staff Positions / Appointments / Promotions / Transfers / New joining
  if (sec.staff_positions) {
    const sp = sec.staff_positions;
    const buckets = [
      { key: "appointments", title: "10.10.1 Appointments" },
      { key: "promotions", title: "10.10.2 Promotions" },
      { key: "transfers", title: "10.10.3 Transfers" },
      { key: "new_joining", title: "10.10.4 New Joining" },
    ];

    buckets.forEach((b) => {
      const list = (sp[b.key] || []).filter(
        (it) =>
          it &&
          (hasText(it.note) ||
            hasArrayContent(it.tables) ||
            hasArrayContent(it.figures))
      );
      if (!list.length) return;

      writeSubheading(doc, b.title, state);
      list.forEach((it, i) => {
        if (hasText(it.note)) {
          const para = `${i + 1}. ${replaceFigureTableRefs(it.note)}`;
          state.cursorY = writeParagraph(doc, para, state);
        }
        (it.figures || []).forEach((f) => sectionFigures.push(f));
        (it.tables || []).forEach((t) => sectionTables.push(t));
      });
    });
  }

  // 10.11 Institute in media
  if (hasArrayContent(sec.institute_in_media)) {
    const ms = sec.institute_in_media.filter(
      (m) =>
        m &&
        (hasText(m.date) ||
          hasText(m.publisher) ||
          hasText(m.note) ||
          hasArrayContent(m.figures))
    );
    if (ms.length) {
      writeSubheading(doc, "10.11 Institute in Media", state);
      ms.forEach((m, i) => {
        const head = [m.date || "", m.publisher || ""]
          .filter(Boolean)
          .join(" — ");
        let para = `${i + 1}. ${head}`;
        if (hasText(m.note)) {
          para += "\n" + replaceFigureTableRefs(m.note);
        }
        state.cursorY = writeParagraph(doc, para, state);
        (m.figures || []).forEach((f) => sectionFigures.push(f));
      });
    }
  }

  // 10.12 Other activities
  if (hasArrayContent(sec.other_activities)) {
    const os = sec.other_activities.filter(
      (it) =>
        it &&
        (hasText(it.note) ||
          hasArrayContent(it.tables) ||
          hasArrayContent(it.figures))
    );
    if (os.length) {
      writeSubheading(doc, "10.12 Other Activities", state);
      os.forEach((it, i) => {
        if (hasText(it.note)) {
          const para = `${i + 1}. ${replaceFigureTableRefs(it.note)}`;
          state.cursorY = writeParagraph(doc, para, state);
        }
        (it.figures || []).forEach((f) => sectionFigures.push(f));
        (it.tables || []).forEach((t) => sectionTables.push(t));
      });
    }
  }

  // Now render all Annexures figures + tables at end of section
  await renderSectionFigures(doc, sectionFigures, state, "Annexures");
  await renderSectionTables(doc, sectionTables, state, "Annexures");
}

// -------------------------------
// MAIN: Build jsPDF document
// -------------------------------
async function buildAnnualPdfDoc() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const state = {
    pageWidth,
    pageHeight,
    marginLeft: 50,
    marginRight: 50,
    marginTop: 70,
    marginBottom: 60,
    cursorY: 70,
  };

  const institute = getInstituteName();
  const year = getYear();
  const faculty = getFacultyName();

  // Cover / first page header
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.text(
    `${institute} – Annual Report ${year}`,
    state.marginLeft,
    state.cursorY
  );
  state.cursorY += 24;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Faculty: ${faculty}`, state.marginLeft, state.cursorY);
  state.cursorY += 30;

  // Render sections 0–10
  await renderBasicInfoSection(doc, state);
  await renderResearchSection(doc, state);
  await renderAcademicSection(doc, state);
  await renderOutreachSection(doc, state);
  await renderOtherInstitutionalSection(doc, state);
  await renderTrainingSection(doc, state);
  await renderConferencesSection(doc, state);
  await renderLinkagesSection(doc, state);
  await renderAwardsSection(doc, state);
  await renderPublicationsSection(doc, state);
  await renderAnnexuresSection(doc, state);

  // Add header + footer (page numbers) on all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // header
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(9);
    doc.text(`${institute} | Annual Report ${year}`, state.marginLeft, 30);

    // footer: page number
    const footerText = `Page ${i} of ${pageCount}`;
    const textWidth = doc.getTextWidth(footerText);
    doc.text(footerText, (pageWidth - textWidth) / 2, pageHeight - 30);
  }

  return doc;
}

// -------------------------------
// PUBLIC FUNCTIONS
// -------------------------------
async function downloadAnnualPDF() {
  const doc = await buildAnnualPdfDoc();
  const fname = `${getInstituteName().replace(
    /\s+/g,
    "_"
  )}_AnnualReport_${getYear()}_${getFacultyName().replace(/\s+/g, "_")}.pdf`;
  doc.save(fname);
}

async function downloadAnnualReportZip() {
  const doc = await buildAnnualPdfDoc();
  const pdfBlob = doc.output("blob");

  const zip = new JSZip();
  const baseName = `${getInstituteName().replace(
    /\s+/g,
    "_"
  )}_AnnualReport_${getYear()}_${getFacultyName().replace(/\s+/g, "_")}`;

  zip.file(`${baseName}.pdf`, pdfBlob);
  zip.file(`${baseName}.json`, JSON.stringify(AppState, null, 2));

  const zipBlob = await zip.generateAsync({ type: "blob" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(zipBlob);
  a.download = `${baseName}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Expose for submit.js
window.downloadAnnualReportZip = downloadAnnualReportZip;

// Hook Export as PDF button
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("exportPdfBtn")?.addEventListener("click", () => {
    downloadAnnualPDF().catch((err) => {
      console.error(err);
      alert("Failed to generate PDF: " + (err.message || err));
    });
  });
});
