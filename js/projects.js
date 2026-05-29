// projects.js -- project detail window builder
// also contains fake PDF, DOCX, and XLSX renderers because why not
// it's a fake OS. fake documents are on brand.

const Projects = (() => {

  /* STANDARD PROJECT TAB BUILDERS
     overview, screenshots, videos, devlog, install, sysreq.
     most of them are placeholder content right now. the structure is real though. */

  function buildOverview(p) {
    if (p.teaserOnly) {
      return `
        <div class="det-hero">
          <div style="font-size:30px;margin-bottom:8px;">${p.ico}</div>
          <div class="det-title">${p.name}</div>
          <div class="det-blurb">${p.blurb}</div>
          <div class="det-meta">
            ${(p.tags || []).map(t => `<span class="det-badge">${t}</span>`).join('')}
            <span class="det-badge det-age">AGE ${p.age}</span>
          </div>
          <div class="det-placeholder" style="margin-top:12px;">Find it. Play it.</div>
        </div>`;
    }
    const dlHtml = p.dl
      ? `<button class="dl-btn" onclick="window.open('#','_blank')">${p.dlLabel || '⬇ DOWNLOAD'}</button>`
      : `<span class="det-badge det-unavail">NOT YET AVAILABLE</span>`;
    return `
      <div class="det-hero">
        <div style="font-size:30px;margin-bottom:8px;">${p.ico}</div>
        <div class="det-title">${p.name}</div>
        <div class="det-blurb">${p.blurb}</div>
        <div class="det-meta">
          ${p.tags.map(t => `<span class="det-badge">${t}</span>`).join('')}
          <span class="det-badge det-age">AGE ${p.age}</span>
        </div>
        ${dlHtml}
      </div>`;
  }

  function buildScreenshots(p) {
    return `
      <div class="det-section-label">◈ SCREENSHOTS &amp; MEDIA</div>
      <div class="ss-grid">
        <div class="ss-box">SCREENSHOT 01</div>
        <div class="ss-box">SCREENSHOT 02</div>
        <div class="ss-box">SCREENSHOT 03</div>
        <div class="ss-box">SCREENSHOT 04</div>
      </div>
      <div class="det-placeholder">[ swap these for real &lt;img&gt; tags when screenshots exist ]</div>`;
  }

  function buildVideos(p) {
    return `
      <div class="det-section-label">◈ VIDEOS</div>
      <div class="yt-box">▶ TRAILER: [ paste a YouTube iframe here when it exists ]</div>
      <div class="yt-box">▶ SHOWCASE: [ another YouTube iframe. you know the drill. ]</div>
      <div class="det-placeholder">[ paste YouTube video IDs here. future you will know what to do. ]</div>`;
  }

  function buildDevlog(p) {
    if (!p.devlog || p.devlog.length === 0) {
      return `<div class="det-section-label">◈ DEVELOPMENT LOG</div><div class="det-placeholder">No devlog entries yet.</div>`;
    }
    return `
      <div class="det-section-label">◈ DEVELOPMENT LOG</div>
      ${p.devlog.map(e => `
        <div class="log-entry">
          <div class="log-date">${e.date}</div>
          <div class="log-title">${e.title}</div>
          <div class="log-body">${e.body}</div>
        </div>`).join('')}`;
  }

  function buildInstall(p) {
    if (!p.dl) {
      return `
        <div class="det-section-label">◈ DOWNLOAD &amp; INSTALLATION</div>
        <div class="det-badge det-unavail" style="display:inline-block;margin-bottom:8px;">NOT YET AVAILABLE FOR DOWNLOAD</div>
        <div class="det-placeholder">Check the devlog for progress updates.</div>`;
    }
    if (!p.install || p.install.length === 0) {
      return `<div class="det-section-label">◈ DOWNLOAD &amp; INSTALLATION</div>
        <div class="det-placeholder">No installation required. Click the download button on the Overview tab.</div>
        <div style="margin-top:12px;"><button class="dl-btn" onclick="window.open('#','_blank')">${p.dlLabel || '⬇ DOWNLOAD'}</button></div>`;
    }
    return `
      <div class="det-section-label">◈ DOWNLOAD &amp; INSTALLATION</div>
      ${p.install.map((s, i) => `
        <div class="inst-step">
          <div class="inst-num">${String(i + 1).padStart(2, '0')}</div>
          <div class="inst-txt">${s}</div>
        </div>`).join('')}
      <div style="margin-top:14px;">
        <button class="dl-btn" onclick="window.open('#','_blank')">${p.dlLabel || '⬇ DOWNLOAD'}</button>
      </div>`;
  }

  function buildSysReq(p) {
    if (!p.req || p.req.length === 0) {
      return `<div class="det-section-label">◈ SYSTEM REQUIREMENTS</div>
        <div class="det-placeholder">No specific system requirements for this project.</div>`;
    }
    return `
      <div class="det-section-label">◈ SYSTEM REQUIREMENTS</div>
      ${p.req.map(r => `
        <div class="req-row">
          <span class="req-k">${r[0]}</span>
          <span class="req-v">${r[1]}</span>
        </div>`).join('')}`;
  }

  /* FAKE DOCUMENT RENDERERS
     they look like PDFs, DOCXs, and XLSXs. they are not.
     they are carefully crafted HTML that lies to your eyes. gloriously. */

  function renderPDF(file) {
    const pages = file.pages || [];
    const pagesHtml = pages.map((pg, i) => `
      <div class="fake-pdf-page">
        <div class="fpdf-pagenum">PAGE ${i + 1} / ${pages.length}</div>
        <div class="fpdf-heading">${pg.heading}</div>
        ${pg.subheading ? `<div class="fpdf-subheading">${pg.subheading}</div>` : ''}
        <div class="fpdf-rule"></div>
        ${pg.body.map(para => `<p class="fpdf-para">${para}</p>`).join('')}
        <div class="fpdf-footer">
          <span>${file.label}</span>
          <span>DRAVKNOX INTERNAL · CONFIDENTIAL</span>
          <span>${i + 1}</span>
        </div>
      </div>`).join('');

    return `
      <div class="fake-doc-wrap fake-pdf-wrap">
        <div class="fake-doc-toolbar">
          <span class="fdoc-icon">📄</span>
          <span class="fdoc-name">${file.name}</span>
          <span class="fdoc-badge fdoc-badge-pdf">PDF</span>
          <span class="fdoc-pages">${pages.length} PAGES</span>
        </div>
        <div class="fake-pdf-viewer">
          ${pagesHtml}
        </div>
      </div>`;
  }

  function renderDOCX(file) {
    const sections = file.sections || [];
    const sectionsHtml = sections.map(sec => `
      <div class="fdocx-section">
        <div class="fdocx-heading">${sec.heading}</div>
        ${sec.tag ? `<div class="fdocx-tag">${sec.tag}</div>` : ''}
        <div class="fdocx-rule"></div>
        <div class="fdocx-body">${sec.content.replace(/\n/g, '<br><br>')}</div>
      </div>`).join('');

    return `
      <div class="fake-doc-wrap fake-docx-wrap">
        <div class="fake-doc-toolbar">
          <span class="fdoc-icon">📝</span>
          <span class="fdoc-name">${file.name}</span>
          <span class="fdoc-badge fdoc-badge-docx">DOCX</span>
          <span class="fdoc-pages">${sections.length} SECTIONS</span>
        </div>
        <div class="fake-docx-page">
          <div class="fdocx-header">
            <span>${file.label}</span>
            <span>Dravknox Studios · INTERNAL</span>
          </div>
          <div class="fdocx-rule-header"></div>
          ${sectionsHtml}
          <div class="fdocx-footer">
            <div class="fdocx-footer-left">CONFIDENTIAL: DO NOT DISTRIBUTE</div>
            <div class="fdocx-footer-right">Dravknox Studios Internal Archive · 2026</div>
          </div>
        </div>
      </div>`;
  }

  function renderXLSX(file) {
    const buildSheet = (sheet) => {
      const headerRow = sheet.headers.map(h => `<th class="fxlsx-th">${h}</th>`).join('');
      const dataRows = sheet.rows.map((row, ri) => {
        const cells = row.map(cell => {
          const isRedacted = cell === '[REDACTED]';
          const isClassified = cell === 'CLASSIFIED';
          let cls = ri % 2 === 0 ? ' fxlsx-even' : '';
          if (isRedacted || isClassified) cls = ' fxlsx-redacted';
          return `<td class="fxlsx-td${cls}">${cell}</td>`;
        }).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      return `
        <div class="fxlsx-table-wrap">
          <table class="fxlsx-table">
            <thead><tr>${headerRow}</tr></thead>
            <tbody>${dataRows}</tbody>
          </table>
        </div>`;
    };

    const uid = 'xlsx-' + file.id;
    const sheetTabsHtml = (file.sheets || []).map((s, i) =>
      `<div class="fxlsx-sheettab${i === 0 ? ' on' : ''}" data-sheetidx="${i}">${s.name}</div>`
    ).join('');
    const sheetPanelsHtml = (file.sheets || []).map((s, i) =>
      `<div class="fxlsx-sheetpanel${i === 0 ? ' on' : ''}" data-sheetpanel="${i}">${buildSheet(s)}</div>`
    ).join('');

    return `
      <div class="fake-doc-wrap fake-xlsx-wrap" id="${uid}">
        <div class="fake-doc-toolbar">
          <span class="fdoc-icon">📊</span>
          <span class="fdoc-name">${file.name}</span>
          <span class="fdoc-badge fdoc-badge-xlsx">XLSX</span>
          <span class="fdoc-pages">${(file.sheets || []).length} SHEETS</span>
        </div>
        <div class="fxlsx-formula-bar">
          <span class="fxlsx-cell-ref">A1</span>
          <span class="fxlsx-formula-sep">fx</span>
          <span class="fxlsx-formula-val">${file.label}</span>
        </div>
        <div class="fxlsx-panels">
          ${sheetPanelsHtml}
        </div>
        <div class="fxlsx-tabs">
          ${sheetTabsHtml}
        </div>
      </div>`;
  }

  function renderFile(file) {
    switch (file.type) {
      case 'pdf':  return renderPDF(file);
      case 'docx': return renderDOCX(file);
      case 'xlsx': return renderXLSX(file);
      default:     return `<div class="det-placeholder">Unknown file type: ${file.type}</div>`;
    }
  }

  /* wire XLSX sheet tabs after DOM insertion -- tabs don't work until they're in the DOM.
     classic. call this every time you inject XLSX HTML or the tabs will just sit there looking pretty. */
  function wireXLSXTabs(container) {
    container.querySelectorAll('.fake-xlsx-wrap').forEach(wrap => {
      wrap.querySelectorAll('.fxlsx-sheettab').forEach(tab => {
        tab.addEventListener('click', () => {
          const idx = tab.dataset.sheetidx;
          wrap.querySelectorAll('.fxlsx-sheettab').forEach(t => t.classList.remove('on'));
          wrap.querySelectorAll('.fxlsx-sheetpanel').forEach(p => p.classList.remove('on'));
          tab.classList.add('on');
          const panel = wrap.querySelector(`[data-sheetpanel="${idx}"]`);
          if (panel) panel.classList.add('on');
        });
      });
    });
  }

  /* FOLDER VIEWER -- two-pane layout: file list on the left, document viewer on the right.
     like a budget file explorer. a very good-looking budget file explorer. */

  function openFolder(p) {
    const win = document.getElementById('sw-proj');
    const titleEl = document.getElementById('proj-wttl');
    const tabsEl = document.getElementById('proj-tabs');
    const panelsEl = document.getElementById('proj-panels');
    if (!win || !titleEl || !tabsEl || !panelsEl) return;

    titleEl.textContent = '// 🗂️ ' + p.name;
    tabsEl.innerHTML = '';
    panelsEl.innerHTML = '';

    const mainPanel = document.createElement('div');
    mainPanel.className = 'ptabpanel on';
    mainPanel.id = 'ppanel-folder';
    mainPanel.style.padding = '0';
    mainPanel.style.height = '100%';
    mainPanel.style.overflow = 'hidden';
    mainPanel.style.display = 'flex';
    mainPanel.style.flexDirection = 'column';

    mainPanel.innerHTML = `
      <div class="folder-layout">
        <div class="folder-sidebar">
          <div class="folder-sidebar-header">
            <span class="folder-path">📁 dk:/CONFIDENTIAL/</span>
          </div>
          <div class="folder-file-list" id="folder-file-list">
            ${(p.files || []).map((f, i) => `
              <div class="folder-file-item${i === 0 ? ' on' : ''}" data-fileidx="${i}" tabindex="0" role="button" aria-label="Open ${f.name}">
                <span class="ffi-icon">${f.icon}</span>
                <div class="ffi-info">
                  <div class="ffi-name">${f.name}</div>
                  <div class="ffi-type">${f.type.toUpperCase()} · ${f.label.substring(0, 28)}${f.label.length > 28 ? '…' : ''}</div>
                </div>
              </div>`).join('')}
          </div>
          <div class="folder-sidebar-footer">
            <span class="folder-count">${(p.files || []).length} FILES · CLASSIFIED</span>
          </div>
        </div>
        <div class="folder-viewer" id="folder-viewer">
          ${p.files && p.files.length > 0 ? renderFile(p.files[0]) : '<div class="det-placeholder">No files.</div>'}
        </div>
      </div>`;

    panelsEl.appendChild(mainPanel);

    // wire XLSX tabs for whichever file loads first (otherwise the tabs do nothing)
    wireXLSXTabs(mainPanel);

    const listEl   = mainPanel.querySelector('#folder-file-list');
    const viewerEl = mainPanel.querySelector('#folder-viewer');

    if (listEl && viewerEl) {
      listEl.querySelectorAll('.folder-file-item').forEach(item => {
        const handler = () => {
          listEl.querySelectorAll('.folder-file-item').forEach(i => i.classList.remove('on'));
          item.classList.add('on');
          const idx = parseInt(item.dataset.fileidx, 10);
          const file = (p.files || [])[idx];
          if (file) {
            viewerEl.innerHTML = renderFile(file);
            viewerEl.scrollTop = 0;
            wireXLSXTabs(viewerEl);
          }
        };
        item.addEventListener('click', handler);
        item.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
        });
      });
    }

    OS.openShared('proj');
  }

  /* STANDARD OPEN -- the normal project view with tabs.
     if the project is a folder it bails early and calls openFolder instead.
     otherwise: six tabs, all the info, very official looking. */

  function open(key) {
    const p = PROJECTS[key];
    if (!p) return;

    if (p.type === 'folder') { openFolder(p); return; }

    const win = document.getElementById('sw-proj');
    const titleEl = document.getElementById('proj-wttl');
    const tabsEl = document.getElementById('proj-tabs');
    const panelsEl = document.getElementById('proj-panels');
    if (!win || !titleEl || !tabsEl || !panelsEl) return;

    titleEl.textContent = '// ' + p.name;
    tabsEl.innerHTML = '';
    panelsEl.innerHTML = '';

    const tabDefs = p.teaserOnly
      ? [
          { id: 'overview', label: 'OVERVIEW', html: buildOverview(p) },
          { id: 'notes', label: 'NOTES', html: `<div class="det-section-label">◈ PROJECT NOTES</div><div class="det-placeholder">No direct launch path from this listing.<br>Find it. Play it.</div>` },
        ]
      : [
          { id: 'overview',    label: 'OVERVIEW',    html: buildOverview(p) },
          { id: 'screenshots', label: 'SCREENSHOTS', html: buildScreenshots(p) },
          { id: 'videos',      label: 'VIDEOS',      html: buildVideos(p) },
          { id: 'devlog',      label: 'DEVLOG',      html: buildDevlog(p) },
          { id: 'install',     label: 'INSTALL',     html: buildInstall(p) },
          { id: 'sysreq',      label: 'SYS REQ',     html: buildSysReq(p) },
        ];

    tabDefs.forEach((td, i) => {
      const tab = document.createElement('div');
      tab.className = 'ptab' + (i === 0 ? ' on' : '');
      tab.textContent = td.label;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      tab.addEventListener('click', () => {
        tabsEl.querySelectorAll('.ptab').forEach(t => { t.classList.remove('on'); t.setAttribute('aria-selected','false'); });
        panelsEl.querySelectorAll('.ptabpanel').forEach(t => t.classList.remove('on'));
        tab.classList.add('on');
        tab.setAttribute('aria-selected', 'true');
        document.getElementById('ppanel-' + td.id).classList.add('on');
      });
      tabsEl.appendChild(tab);

      const panel = document.createElement('div');
      panel.className = 'ptabpanel' + (i === 0 ? ' on' : '');
      panel.id = 'ppanel-' + td.id;
      panel.setAttribute('role', 'tabpanel');
      panel.innerHTML = td.html;
      panelsEl.appendChild(panel);
    });

    OS.openShared('proj');
  }

  return { open };

})();
