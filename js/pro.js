// pro.js -- the professional site controller. the one with the nice fonts.
// shares data.js (PROJECTS, FAQ_KB, etc.) and faq.js (same module, different CSS).
// it's the same content. it just wears a blazer.

const ProSite = (() => {

  /* NAVIGATION -- scroll shadow, mobile menu, active link highlighting.
     the nav that knows where you are on the page and quietly judges you for it. */
  function initNav() {
    const nav = document.getElementById('pro-nav');
    const toggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('nav-mobile-menu');

    // scroll shadow: adds a class after 8px scroll so the nav doesn't float like a ghost
    window.addEventListener('scroll', () => {
      if (!nav) return;
      nav.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });

    // mobile toggle: hamburger opens, link click closes. the classic contract.
    if (toggle && mobileMenu) {
      toggle.addEventListener('click', () => {
        const open = mobileMenu.classList.toggle('open');
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
      });
      // close menu when a link is tapped (otherwise it just... stays open forever)
      mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          mobileMenu.classList.remove('open');
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // active link highlighting as you scroll: uses IntersectionObserver.
    // fancy name. it just checks if a section is on screen. very practical.
    const sections = document.querySelectorAll('[data-section]');
    const navLinks = document.querySelectorAll('.nav-link[data-target]');
    if (sections.length && navLinks.length) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const id = e.target.dataset.section;
            navLinks.forEach(l => l.classList.toggle('active', l.dataset.target === id));
          }
        });
      }, { rootMargin: '-15% 0px -70% 0px' });
      sections.forEach(s => obs.observe(s));
    }
  }

  /* SCROLL REVEAL -- elements fade in as you scroll past them.
     unobserved after triggering so it doesn't keep checking. efficient and dramatic. */
  function initReveal() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }

  /* PROJECT GRID + FILTER -- builds the card grid from PROJECTS data, then filters by brand.
     all placeholder cards right now. the grid itself works perfectly. very on-brand. */
  const BRAND_LABELS = { dk: 'Talvrek', vl: 'Embrvaal', em: 'Veltrun' };

  function buildProjectGrid() {
    const grid = document.getElementById('proj-grid');
    if (!grid || typeof PROJECTS === 'undefined') return;

    grid.innerHTML = '';

    Object.entries(PROJECTS).forEach(([key, p]) => {
      if (p.type === 'folder') return; // confidential folder stays in the OS view. not here. shoo.

      const card = document.createElement('div');
      card.className = 'proj-card reveal';
      card.dataset.brand = p.brand;
      card.dataset.proj = key;
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Open ${p.name} project`);

      const tagsHtml = (p.tags || []).slice(0, 2).map(t =>
        `<span class="proj-card-tag">${t}</span>`
      ).join('');

      card.innerHTML = `
        <div class="proj-card-header">
          <div class="proj-card-icon">${p.ico}</div>
          <div class="proj-brand-dot proj-brand-${p.brand}"></div>
        </div>
        <div class="proj-card-name">${p.name}</div>
        <div class="proj-card-desc">${p.blurb.substring(0, 90)}${p.blurb.length > 90 ? '…' : ''}</div>
        <div class="proj-card-footer">
          <div class="proj-card-tags-wrap">${tagsHtml}</div>
          <div class="proj-card-open" aria-hidden="true">↗</div>
        </div>`;

      card.addEventListener('click', () => openModal(key));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(key); }
      });
      grid.appendChild(card);
    });

    initReveal(); // re-observe the newly injected cards or they'll never animate in
  }

  function initFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        const f = btn.dataset.filter;
        document.querySelectorAll('.proj-card').forEach(card => {
          const show = f === 'all' || card.dataset.brand === f;
          card.classList.toggle('hidden', !show);
        });
      });
    });
  }

  /* PROJECT MODAL -- the overlay that pops up when you click a project card.
     tabbed layout, scrollable body, closes on Escape or click-outside like a civilized modal. */
  let currentModal = null;

  function openModal(key) {
    const p = PROJECTS[key];
    if (!p) return;

    const overlay = document.getElementById('proj-modal');
    if (!overlay) return;

    // fill in the modal header with this project's icon, name, and division
    overlay.querySelector('#modal-icon').textContent = p.ico;
    overlay.querySelector('#modal-name').textContent = p.name;
    overlay.querySelector('#modal-brand').textContent = BRAND_LABELS[p.brand] || p.brand;

    // build tabs and panels dynamically from the tab definitions below
    const tabsEl = overlay.querySelector('#modal-tabs');
    const bodyEl = overlay.querySelector('#modal-body');

    const tabDefs = [
      { id: 'overview',  label: 'Overview',  html: buildModalOverview(p) },
      { id: 'devlog',    label: 'Devlog',    html: buildModalDevlog(p) },
      { id: 'install',   label: 'Install',   html: buildModalInstall(p) },
      { id: 'sysreq',    label: 'Sys Req',   html: buildModalSysReq(p) },
      { id: 'media',     label: 'Media',     html: buildModalMedia(p) },
    ];

    tabsEl.innerHTML = '';
    bodyEl.innerHTML = '';

    tabDefs.forEach((td, i) => {
      const tab = document.createElement('div');
      tab.className = 'modal-tab' + (i === 0 ? ' on' : '');
      tab.textContent = td.label;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      tab.addEventListener('click', () => {
        tabsEl.querySelectorAll('.modal-tab').forEach(t => { t.classList.remove('on'); t.setAttribute('aria-selected','false'); });
        bodyEl.querySelectorAll('.modal-panel').forEach(t => t.classList.remove('on'));
        tab.classList.add('on'); tab.setAttribute('aria-selected','true');
        bodyEl.querySelector('#mpanel-' + td.id).classList.add('on');
      });
      tabsEl.appendChild(tab);

      const panel = document.createElement('div');
      panel.className = 'modal-panel' + (i === 0 ? ' on' : '');
      panel.id = 'mpanel-' + td.id;
      panel.setAttribute('role', 'tabpanel');
      panel.innerHTML = td.html;
      bodyEl.appendChild(panel);
    });

    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    currentModal = key;

    // auto-focus the close button so keyboard users can escape immediately
    requestAnimationFrame(() => {
      const closeBtn = overlay.querySelector('.modal-close');
      if (closeBtn) closeBtn.focus();
    });
  }

  function closeModal() {
    const overlay = document.getElementById('proj-modal');
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentModal = null;
  }

  function initModal() {
    const overlay = document.getElementById('proj-modal');
    if (!overlay) return;

    overlay.querySelector('.modal-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && currentModal) closeModal();
    });
  }

  /* modal panel builders -- one function per tab. they build HTML strings.
     placeholder content in media tab until there are actual screenshots to show. */
  function buildModalOverview(p) {
    const badgesHtml = (p.tags || []).map(t => `<span class="mp-badge">${t}</span>`).join('');
    const dlHtml = p.dl
      ? `<button class="mp-dl-btn" onclick="window.open('#','_blank')">${p.dlLabel || '⬇ Download'}</button>`
      : `<span class="mp-badge mp-badge-unavail">Not yet available</span>`;
    return `
      <p class="mp-blurb">${p.blurb}</p>
      <div class="mp-badges">
        ${badgesHtml}
        <span class="mp-badge mp-badge-age">Age ${p.age}</span>
      </div>
      ${dlHtml}`;
  }

  function buildModalDevlog(p) {
    if (!p.devlog || p.devlog.length === 0) {
      return `<span class="mp-section-label">Development Log</span><p class="mp-placeholder">No entries yet.</p>`;
    }
    return `<span class="mp-section-label">Development Log</span>` +
      p.devlog.map(e => `
        <div class="mp-log-entry">
          <div class="mp-log-date">${e.date}</div>
          <div class="mp-log-title">${e.title}</div>
          <div class="mp-log-body">${e.body}</div>
        </div>`).join('');
  }

  function buildModalInstall(p) {
    if (!p.dl) return `<span class="mp-section-label">Installation</span><p class="mp-placeholder">Not yet available for download.</p>`;
    if (!p.install || p.install.length === 0) {
      return `<span class="mp-section-label">Installation</span><p class="mp-placeholder">No installation required. Click Download on the Overview tab.</p>`;
    }
    return `<span class="mp-section-label">Installation Steps</span>` +
      p.install.map((s, i) => `
        <div class="mp-install-step">
          <span class="mp-step-num">${String(i+1).padStart(2,'0')}</span>
          <span class="mp-step-txt">${s}</span>
        </div>`).join('');
  }

  function buildModalSysReq(p) {
    if (!p.req || p.req.length === 0) {
      return `<span class="mp-section-label">System Requirements</span><p class="mp-placeholder">No specific requirements.</p>`;
    }
    const rows = p.req.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('');
    return `<span class="mp-section-label">System Requirements</span><table class="mp-req-table">${rows}</table>`;
  }

  function buildModalMedia(p) {
    return `
      <span class="mp-section-label">Screenshots</span>
      <div class="mp-ss-grid">
        <div class="mp-ss-box">SCREENSHOT 01</div>
        <div class="mp-ss-box">SCREENSHOT 02</div>
        <div class="mp-ss-box">SCREENSHOT 03</div>
        <div class="mp-ss-box">SCREENSHOT 04</div>
      </div>
      <span class="mp-section-label">Video</span>
      <div class="mp-ss-box" style="height:100px;">▶ Trailer: embed YouTube iframe here</div>
      <p class="mp-placeholder" style="margin-top:8px;">Replace placeholder boxes with real media in production.</p>`;
  }

  /* NEWS FEED -- renders the news items from NEWS_DATA in data.js.
     currently one item. it's a rebrand announcement. more will come. eventually. */
  function buildNews() {
    const list = document.getElementById('news-list');
    if (!list) return;
    list.innerHTML = '';
    NEWS_DATA.forEach(n => {
      const row = document.createElement('div');
      row.className = 'news-row';
      row.innerHTML = `
        <div class="news-row-date">${n.date}</div>
        <div class="news-row-content">
          <div class="news-row-brand news-brand-${n.brand}">${NEWS_BRAND_LABEL[n.brand]}</div>
          <div class="news-row-title">${n.title}</div>
          <div class="news-row-body">${n.body}</div>
        </div>
        <div class="news-row-badge">${n.brand === 'all' ? 'Studio' : NEWS_BRAND_LABEL[n.brand]}</div>`;
      list.appendChild(row);
    });
  }

  /* DIVISION CARDS -- clicking a division card activates the filter and scrolls to projects.
     two things at once. efficient. the user doesn't have to figure it out themselves. */
  function initDivCards() {
    document.querySelectorAll('.div-card[data-brand]').forEach(card => {
      card.addEventListener('click', () => {
        const brand = card.dataset.brand;
        // activate filter and scroll to projects section
        const sec = document.getElementById('projects');
        if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* SWITCH TO CYBERPUNK SITE -- the footer button that sends you to the OS version.
     for people who looked at this clean site and thought "needs more scanlines." */
  function initSwitchBtn() {
    document.querySelectorAll('[data-switch-site]').forEach(btn => {
      btn.addEventListener('click', () => { window.location.href = 'index.html'; });
    });
  }

  /* HERO CARDS -- subtle mouse parallax on the stacked cards in the hero section.
     hover-only. doesn't run on touch devices because tilting cards with your finger is silly. */
  function initHeroParallax() {
    const visual = document.querySelector('.hero-visual');
    const cards = document.querySelectorAll('.hero-card');
    if (!visual || !cards.length) return;

    if (window.matchMedia('(hover: hover)').matches) {
      document.addEventListener('mousemove', e => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        cards.forEach((c, i) => {
          const depth = (i + 1) * 4;
          const baseRot = [2, -1.5, 1][i] || 0;
          c.style.transform = `rotate(${baseRot + dx * 1.5}deg) translate(${dx * depth}px, ${dy * depth}px)`;
        });
      }, { passive: true });
    }
  }

  /* INIT -- runs everything in order. if you add a new section, add it here too.
     yes, in order. no, it doesn't matter most of the time. it matters sometimes. */
  function init() {
    initNav();
    buildProjectGrid();
    initFilter();
    initModal();
    buildNews();
    initDivCards();
    initSwitchBtn();
    initReveal();
    initHeroParallax();
    FAQ.init();
    FAQ.boot();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

/* theme toggle -- light/dark. remembers your choice in localStorage.
   falls back to OS preference if you haven't picked yet. very thoughtful. */
(function initTheme() {
  const html      = document.documentElement;
  const btn       = document.getElementById('theme-toggle');
  const iconEl    = btn && btn.querySelector('.theme-toggle-icon');
  const labelEl   = btn && btn.querySelector('.theme-toggle-label');
  const DARK_KEY  = 'pro-theme';

  function applyTheme(dark) {
    html.setAttribute('data-theme', dark ? 'dark' : 'light');
    if (iconEl)  iconEl.textContent  = dark ? '☽' : '☀︎';
    if (labelEl) labelEl.textContent = dark ? 'Dark' : 'Light';
    if (btn)     btn.setAttribute('aria-pressed', String(dark));
    try { localStorage.setItem(DARK_KEY, dark ? 'dark' : 'light'); } catch(e){}
  }

  // restore saved preference, or fall back to OS preference if there isn't one
  let saved;
  try { saved = localStorage.getItem(DARK_KEY); } catch(e){}
  const prefersDark = saved
    ? saved === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark);

  if (btn) {
    btn.addEventListener('click', () => {
      const nowDark = html.getAttribute('data-theme') !== 'dark';
      applyTheme(nowDark);
    });
  }

  // sync with OS preference changes only if the user hasn't manually picked a theme
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    let stored;
    try { stored = localStorage.getItem(DARK_KEY); } catch(err){}
    if (!stored) applyTheme(e.matches);
  });
})();
