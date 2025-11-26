// js/research-accomplishments.js

function initResearchSection() {
  const root = AppState.sections.research_accomplishments;
  const container = document.getElementById("projectContainer");

  const rebuild = () => {
    container.innerHTML = "";
    root.forEach((proj, i) => container.appendChild(renderProject(proj, i)));
  };

  rebuild();

  document.getElementById("addProjectBtn").addEventListener("click", () => {
    root.push({
      project_title: "",
      subheadings: [],
    });
    rebuild();
  });

  function renderProject(project, index) {
    const wrapper = document.createElement("div");
    wrapper.className = "ra-project";

    wrapper.innerHTML = `
      <div class="ra-project-head">
        <input type="text" class="ra-title" placeholder="Project Title" value="${project.project_title}">
        <button class="btn btn-danger btn-remove ra-remove">🗑 Remove Project</button>
      </div>

      <button class="btn btn-outline ra-add-sub">➕ Add Subheading</button>
      <div class="ra-sub-container"></div>
    `;

    /* Bind project title */
    wrapper.querySelector(".ra-title").addEventListener("input", (e) => {
      project.project_title = e.target.value.trim();
    });

    /* Remove project */
    wrapper.querySelector(".ra-remove").addEventListener("click", () => {
      if (!confirm("Delete entire project?")) return;
      root.splice(index, 1);
      container.innerHTML = "";
      root.forEach((p, i) => container.appendChild(renderProject(p, i)));
    });

    /* Add subheading */
    wrapper.querySelector(".ra-add-sub").addEventListener("click", () => {
      project.subheadings.push({
        title: "",
        blocks: [],
      });
      rebuild();
    });

    /* Render subheadings */
    const subC = wrapper.querySelector(".ra-sub-container");
    project.subheadings.forEach((sub, i) => {
      subC.appendChild(renderSubheading(sub, project, i));
    });

    return wrapper;
  }

  function renderSubheading(sub, project, subIndex) {
    const wrap = document.createElement("div");
    wrap.className = "ra-sub";

    wrap.innerHTML = `
      <div class="ra-sub-head">
        <input type="text" class="ra-subtitle" placeholder="Subheading" value="${sub.title}">
        <button class="btn btn-danger btn-remove ra-sub-remove">🗑 Remove</button>
      </div>

      <button class="btn btn-secondary ra-add-block">➕ Add Content Block</button>
      <div class="ra-block-container"></div>
    `;

    /* Bind title */
    wrap.querySelector(".ra-subtitle").addEventListener("input", (e) => {
      sub.title = e.target.value.trim();
    });

    /* Remove subheading */
    wrap.querySelector(".ra-sub-remove").addEventListener("click", () => {
      if (!confirm("Remove this subheading?")) return;
      project.subheadings.splice(subIndex, 1);
      initResearchSection();
    });

    /* Add block */
    wrap.querySelector(".ra-add-block").addEventListener("click", () => {
      SectionEngine.createBlock(
        wrap.querySelector(".ra-block-container"),
        "research_accomplishments",
        sub.blocks
      );
    });

    /* Render blocks */
    const blkC = wrap.querySelector(".ra-block-container");
    sub.blocks.forEach((blk) => {
      const blkUI = SectionEngine._renderBlock(blk, sub.blocks);
      blkC.appendChild(blkUI);

      // IMPORTANT: restore saved text, figures, tables, captions
      SectionEngine.restoreBlockAssets(blk, blkUI);
    });

    return wrap;
  }
}

window.initResearchSection = initResearchSection;
