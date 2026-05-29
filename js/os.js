// os.js -- Payne-less UI: Great Grand-daddy core: boot, windows, drag, taskbar
// it's a fake OS. in a browser. because a scrolling landing page is boring.
// don't question it, just enjoy the window chrome.

const OS = (() => {

  let curBrand = null;
  let topZ = 50;
  let dragState = null;
  const openDesktopWins = { dk: new Set(), vl: new Set(), em: new Set() };
  const openSharedWins = new Set();
  const winState = {}; // id -> { prevStyle }

  /* BOOT -- picks a division, turns on the screen, injects all the widgets. one job. */
  function boot(brand) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('s' + brand).classList.add('active');
    curBrand = brand;
    updateClock();
    document.body.setAttribute('data-active-brand', brand);
    injectDesktopWidgets(brand);
    injectMobileLauncher(brand);
    injectMotionToggle(brand);
  }

  function goBack() {
    if (curBrand) {
      document.querySelectorAll(`#s${curBrand} .win`).forEach(w => w.classList.remove('open','minimized','fullscreen'));
      openDesktopWins[curBrand] = new Set();
      document.querySelectorAll('.shared-win').forEach(w => w.classList.remove('open','minimized','fullscreen'));
      openSharedWins.clear();
      closeAllStartMenus();
      updateTaskbar();
    // remove the mobile dock so it doesn't haunt the next brand
      document.querySelectorAll('.launcher-wrap').forEach(d => d.remove());
    }
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('sb').classList.add('active');
    curBrand = null;
    document.body.removeAttribute('data-active-brand');
  }

  /* DESKTOP WINDOWS -- open, close, minimize, fullscreen. classic stuff. */
  function spawnPosition(el) {
    const root = document.getElementById('R');
    if (!root) return;
    const alreadyMoved = el.dataset.spawned;
    if (alreadyMoved) return;
    el.dataset.spawned = '1';
    const rw = root.offsetWidth;
    const rh = root.offsetHeight;
    const ww = el.offsetWidth || 420;
    const wh = el.offsetHeight || 360;
    const taskbarH = 44 + 22;
    const jitterX = Math.round((Math.random() - 0.5) * 160);
    const jitterY = Math.round((Math.random() - 0.5) * 80);
    const x = Math.max(10, Math.min(rw - ww - 10, Math.round((rw - ww) / 2) + jitterX));
    const y = Math.max(10, Math.min(rh - wh - taskbarH - 10, Math.round((rh - wh - taskbarH) / 2.8) + jitterY));
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
  }

  function openDesktopWin(winId) {
    const el = document.getElementById(winId);
    if (!el) return;
    el.classList.remove('minimized');
    el.classList.add('open');
    spawnPosition(el);
    const brand = winId.split('-')[0];
    if (openDesktopWins[brand]) openDesktopWins[brand].add(winId);
    bringToFront(el);
    updateTaskbar();
    closeAllStartMenus();
    requestAnimationFrame(() => {
      const closeBtn = el.querySelector('.wb.cl');
      if (closeBtn) closeBtn.focus();
    });
  }

  function closeDesktopWin(winId) {
    const el = document.getElementById(winId);
    if (el) { el.classList.remove('open','minimized','fullscreen'); delete el.dataset.spawned; }
    const brand = winId.split('-')[0];
    if (openDesktopWins[brand]) openDesktopWins[brand].delete(winId);
    delete winState[winId];
    updateTaskbar();
  }

  function minimizeWin(id) {
    const el = document.getElementById(id);
    if (!el || !el.classList.contains('open')) return;
    el.classList.add('minimized');
    updateTaskbar();
  }

  function toggleFullscreen(id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.classList.contains('fullscreen')) {
      el.classList.remove('fullscreen');
      const prev = winState[id] && winState[id].prevStyle;
      if (prev) { el.style.width = prev.w; el.style.height = prev.h; el.style.top = prev.t; el.style.left = prev.l; }
    } else {
      winState[id] = { prevStyle: { w: el.style.width||el.offsetWidth+'px', h: el.style.height||el.offsetHeight+'px', t: el.style.top||'60px', l: el.style.left||'120px' } };
      el.classList.add('fullscreen');
    }
    bringToFront(el);
  }

  /* SHARED WINDOWS -- news, contact, FAQ, founder. same window, every division. efficient. */
  function openShared(key) {
    const el = document.getElementById('sw-' + key);
    if (!el) return;
    el.classList.remove('minimized');
    el.classList.add('open');
    spawnPosition(el);
    openSharedWins.add(key);
    bringToFront(el);
    updateTaskbar();
    closeAllStartMenus();
    if (key === 'faq') FAQ.boot();
    requestAnimationFrame(() => {
      if (key === 'faq') {
        const inp = document.getElementById('faq-inp');
        if (inp) inp.focus();
      } else {
        const closeBtn = el.querySelector('.wb.cl');
        if (closeBtn) closeBtn.focus();
      }
    });
  }

  function closeShared(key) {
    const el = document.getElementById('sw-' + key);
    if (el) { el.classList.remove('open','minimized','fullscreen'); delete el.dataset.spawned; }
    openSharedWins.delete(key);
    delete winState['sw-' + key];
    updateTaskbar();
  }

  /* Z-ORDER -- whoever clicked last wins. democracy for windows. */
  function bringToFront(el) { topZ++; el.style.zIndex = topZ; }

  /* TASKBAR -- the strip at the bottom that proves windows are open. very official. */
  function updateTaskbar() {
    if (!curBrand) return;
    const tb = document.getElementById(curBrand + '-tb');
    if (!tb) return;
    tb.innerHTML = '';

    openDesktopWins[curBrand].forEach(winId => {
      const el = document.getElementById(winId);
      const isMin = el && el.classList.contains('minimized');
      const label = winId.replace(curBrand + '-', '').toUpperCase();
      const btn = createTaskBtn(label, isMin, () => {
        const el2 = document.getElementById(winId);
        if (!el2) return;
        if (el2.classList.contains('minimized')) { el2.classList.remove('minimized'); bringToFront(el2); }
        else bringToFront(el2);
        updateTaskbar();
      });
      tb.appendChild(btn);
    });

    openSharedWins.forEach(key => {
      const labels = { founder:'FOUNDER', news:'NEWS', contact:'CONTACT', faq:'SIGIL', proj:'PROJECT' };
      const el = document.getElementById('sw-' + key);
      const isMin = el && el.classList.contains('minimized');
      const btn = createTaskBtn(labels[key] || key.toUpperCase(), isMin, () => {
        const el2 = document.getElementById('sw-' + key);
        if (!el2) return;
        if (el2.classList.contains('minimized')) { el2.classList.remove('minimized'); bringToFront(el2); }
        else bringToFront(el2);
        updateTaskbar();
      });
      tb.appendChild(btn);
    });
  }

  function createTaskBtn(label, minimized, onClick) {
    const btn = document.createElement('div');
    btn.className = 'ttask' + (minimized ? '' : ' on');
    btn.textContent = label;
    btn.addEventListener('click', onClick);
    return btn;
  }

  /* START MENU -- it opens, it closes, it closes when you click somewhere else. that's it. */
  function toggleStartMenu(smId) {
    const menu = document.getElementById(smId);
    if (!menu) return;
    const isOpen = menu.classList.contains('open');
    closeAllStartMenus();
    if (!isOpen) menu.classList.add('open');
  }
  function closeAllStartMenus() { document.querySelectorAll('.smenu').forEach(m => m.classList.remove('open')); }

  /* DRAG (mouse + touch) -- yes, you can actually drag the windows. yes, on mobile too.
     no, I don't know why I did that. it was fun to build. */
  function clientXY(e) {
    if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  function startDrag(e, el) {
    if (el.classList.contains('fullscreen')) return;
    if (window.innerWidth < 768) return;
    const root = document.getElementById('R');
    if (!root) return;
    const rootRect = root.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    bringToFront(el);
    const { x, y } = clientXY(e);
    dragState = { el, ox: x - elRect.left, oy: y - elRect.top, rootRect };
    e.preventDefault();
  }

  function onDragMove(e) {
    if (!dragState) return;
    const { el, ox, oy, rootRect } = dragState;
    const { x, y } = clientXY(e);
    let px = x - rootRect.left - ox;
    let py = y - rootRect.top - oy;
    px = Math.max(0, Math.min(px, rootRect.width - el.offsetWidth));
    py = Math.max(0, Math.min(py, rootRect.height - el.offsetHeight - 42));
    el.style.left = px + 'px';
    el.style.top  = py + 'px';
  }

  function onDragEnd() { dragState = null; }

  /* DESKTOP WIDGETS -- the stats panel on the right. fake progress bars. real vibes. */
  const DESK_DATA = {
    dk: {
      stats: [
        { label: 'Status', value: 'SOON', sub: 'Rebrand underway' },
        { label: 'Projects', value: 'N/A', sub: 'Please stand by' },
        { label: 'Releases', value: 'N/A', sub: 'Please stand by' },
        { label: 'FOSS', value: 'YES', sub: 'Core commitment' },
      ],
      recent: [
        { text: "We're just getting started. The names are done, the products will be too.", time: 'now' },
      ],
      sysinfo: [
        { label: 'Rebrand', pct: 80, val: 'Active' },
        { label: 'Products', pct: 10, val: 'WIP' },
        { label: 'FOSS pipeline', pct: 20, val: 'Building' },
        { label: 'Accounts', pct: 60, val: 'Setting up' },
      ]
    },
    vl: {
      stats: [
        { label: 'Status', value: 'SOON', sub: 'Rebrand underway' },
        { label: 'Games', value: 'N/A', sub: 'Please stand by' },
        { label: '3D Art', value: 'N/A', sub: 'Please stand by' },
        { label: 'Engine', value: 'GODOT', sub: 'Confirmed' },
      ],
      recent: [
        { text: "We're just getting started. The names are done, the products will be too.", time: 'now' },
      ],
      sysinfo: [
        { label: 'Rebrand', pct: 80, val: 'Active' },
        { label: 'Games', pct: 5, val: 'Early dev' },
        { label: '3D renders', pct: 30, val: 'Coming' },
        { label: 'Content', pct: 10, val: 'Building' },
      ]
    },
    em: {
      stats: [
        { label: 'Status', value: 'SOON', sub: 'Rebrand underway' },
        { label: 'Releases', value: 'N/A', sub: 'Please stand by' },
        { label: 'Platform', value: 'YT', sub: 'YouTube' },
        { label: 'Source', value: 'CC0', sub: 'Remixes' },
      ],
      recent: [
        { text: "We're just getting started. The names are done, the products will be too.", time: 'now' },
      ],
      sysinfo: [
        { label: 'Rebrand', pct: 80, val: 'Active' },
        { label: 'Remixes', pct: 10, val: 'WIP' },
        { label: 'YouTube', pct: 5, val: 'Setting up' },
        { label: 'Game audio', pct: 15, val: 'Building' },
      ]
    }
  };

  // tablet icon definitions (yes, there are three layouts. mobile, tablet, desktop.
  // yes, they all have separate icon lists. yes, they're identical. I know.)
  const TABLET_ITEMS = {
    dk: [
      { ico: '🏢', lbl: 'ABOUT',   win: 'dk-about' },
      { ico: '👤', lbl: 'FOUNDER', shared: 'founder' },
      { ico: '📡', lbl: 'NEWS',    shared: 'news' },
      { ico: '📨', lbl: 'CONTACT', shared: 'contact' },
      { ico: '🤖', lbl: 'SIGIL',   shared: 'faq' },
    ],
    vl: [
      { ico: '🐦', lbl: 'FLOPPY BIRD', link: '404.html' },
      { ico: '🏢', lbl: 'ABOUT',   win: 'vl-about' },
      { ico: '👤', lbl: 'FOUNDER', shared: 'founder' },
      { ico: '📡', lbl: 'NEWS',    shared: 'news' },
      { ico: '📨', lbl: 'CONTACT', shared: 'contact' },
      { ico: '🤖', lbl: 'SIGIL',   shared: 'faq' },
    ],
    em: [
      { ico: '🏢', lbl: 'ABOUT',   win: 'em-about' },
      { ico: '👤', lbl: 'FOUNDER', shared: 'founder' },
      { ico: '📡', lbl: 'NEWS',    shared: 'news' },
      { ico: '📨', lbl: 'CONTACT', shared: 'contact' },
      { ico: '🤖', lbl: 'SIGIL',   shared: 'faq' },
    ],
  };

  function injectDesktopWidgets(brand) {
    const screen = document.getElementById('s' + brand);
    if (!screen) return;
    screen.querySelectorAll('.desk-col').forEach(el => el.remove());
    const data = DESK_DATA[brand];
    if (!data) return;
    const desk = screen.querySelector('.desk');
    if (!desk) return;

    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1100;

    const col = document.createElement('div');
    col.className = 'desk-col';

    const origHdr = desk.querySelector('.hdr-widget');
    if (origHdr) col.appendChild(origHdr.cloneNode(true));

    const statsEl = document.createElement('div');
    statsEl.className = 'desk-stats';
    data.stats.forEach(s => {
      const d = document.createElement('div');
      d.className = 'dstat';
      d.innerHTML = `<div class="dstat-label">${s.label}</div><div class="dstat-value">${s.value}</div><div class="dstat-sub">${s.sub}</div>`;
      statsEl.appendChild(d);
    });
    col.appendChild(statsEl);

    const bottomRow = document.createElement('div');
    bottomRow.className = 'desk-bottom-row';

    const recEl = document.createElement('div');
    recEl.className = 'desk-recent';
    recEl.innerHTML = `<div class="desk-recent-title">Recent activity</div>`;
    data.recent.forEach(r => {
      const item = document.createElement('div');
      item.className = 'drec-item';
      item.innerHTML = `<div class="drec-dot"></div><div class="drec-text">${r.text}</div><div class="drec-time">${r.time}</div>`;
      recEl.appendChild(item);
    });
    bottomRow.appendChild(recEl);

    const sysEl = document.createElement('div');
    sysEl.className = 'desk-sysinfo';
    sysEl.innerHTML = `<div class="desk-sysinfo-title">System status</div>`;
    data.sysinfo.forEach(s => {
      const row = document.createElement('div');
      row.className = 'dsys-row';
      row.innerHTML = `<div class="dsys-label">${s.label}</div><div class="dsys-bar-wrap"><div class="dsys-bar" style="width:${s.pct}%"></div></div><div class="dsys-val">${s.val}</div>`;
      sysEl.appendChild(row);
    });
    bottomRow.appendChild(sysEl);
    col.appendChild(bottomRow);

    // tablet icon grid: only injected between 768px and 1100px.
    // desktop gets the sidebar icons. mobile gets the launcher. tablet gets both and neither.
    if (isTablet) {
      const grid = document.createElement('div');
      grid.className = 'desk-tablet-grid';
      (TABLET_ITEMS[brand] || []).forEach(item => {
        const btn = document.createElement('div');
        btn.className = 'desk-tablet-icon';
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('aria-label', item.lbl);
        btn.innerHTML = `<div class="desk-tablet-icon-box">${item.ico}</div><div class="desk-tablet-icon-lbl">${item.lbl}</div>`;
        btn.addEventListener('click', () => {
          if (item.shared) openShared(item.shared);
          else if (item.win) openDesktopWin(item.win);
          else if (item.proj) Projects.open(item.proj);
          else if (item.link) window.location.href = item.link;
        });
        btn.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
        });
        grid.appendChild(btn);
      });
      col.appendChild(grid);
    }

    desk.appendChild(col);
  }

  /* MOTION TOGGLE -- for people whose brains stage a revolt when things move too much.
     respectable. the orbs are a lot. */
  let motionReduced = false;

  function injectMotionToggle(brand) {
    const tray = document.querySelector(`#s${brand} .tray`);
    if (!tray || tray.querySelector('.motion-toggle')) return;
    const btn = document.createElement('button');
    btn.className = 'motion-toggle';
    btn.textContent = 'MOTION';
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('title', 'Toggle motion reduction');
    btn.addEventListener('click', () => {
      motionReduced = !motionReduced;
      document.documentElement.classList.toggle('reduce-motion', motionReduced);
      document.querySelectorAll('.motion-toggle').forEach(b => {
        b.classList.toggle('active', motionReduced);
        b.setAttribute('aria-pressed', String(motionReduced));
        b.textContent = motionReduced ? 'MOTION OFF' : 'MOTION';
      });
    });
    const clk = tray.querySelector('.tclk');
    tray.insertBefore(btn, clk);
  }

  function updateClock() {
    const n = new Date();
    const t = String(n.getHours()).padStart(2,'0') + ':' + String(n.getMinutes()).padStart(2,'0');
    ['dk','vl','em'].forEach(b => { const c = document.getElementById(b+'-clk'); if (c) c.textContent = t; });
  }

  /* EVENT WIRING -- attaches every click, keydown, and touch to the thing it's supposed to do.
     it's a lot of addEventListener calls. that's just how it is. */
  function wireEvents() {
    const root = document.getElementById('R');

    document.querySelectorAll('.bcard[data-brand]').forEach(el => {
      el.addEventListener('click', () => boot(el.dataset.brand));
      el.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' '){ e.preventDefault(); boot(el.dataset.brand); } });
    });

    const proCard = document.getElementById('boot-pro-card');
      if (proCard) {
        proCard.addEventListener('click', () => { window.location.href = 'index-pro.html'; });
        proCard.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = 'index-pro.html'; }
        });
      }

    document.querySelectorAll('[data-back]').forEach(el => el.addEventListener('click', goBack));

    document.querySelectorAll('.di[data-win]').forEach(el => {
      el.addEventListener('click', () => openDesktopWin(el.dataset.win));
      el.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' '){ e.preventDefault(); openDesktopWin(el.dataset.win); } });
    });

    document.querySelectorAll('.di[data-link]').forEach(el => {
      el.addEventListener('click', () => { window.location.href = el.dataset.link; });
      el.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' '){ e.preventDefault(); window.location.href = el.dataset.link; } });
    });

    // desktop icons that open project views (e.g. the Confidential folder, very spooky)
    document.querySelectorAll('.di[data-proj]').forEach(el => {
      el.addEventListener('click', () => Projects.open(el.dataset.proj));
      el.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' '){ e.preventDefault(); Projects.open(el.dataset.proj); } });
    });

    document.querySelectorAll('.di.shared-trigger[data-shared], .smi.shared-trigger[data-shared]').forEach(el => {
      el.addEventListener('click', () => openShared(el.dataset.shared));
    });

    document.querySelectorAll('.smi[data-win]').forEach(el => el.addEventListener('click', () => openDesktopWin(el.dataset.win)));
    document.querySelectorAll('.smi[data-link]').forEach(el => el.addEventListener('click', () => { window.location.href = el.dataset.link; }));
    document.querySelectorAll('.smi[data-back]').forEach(el => el.addEventListener('click', goBack));

    // start menu items that also open project views (yes both places. consistency.)
    document.querySelectorAll('.smi[data-proj]').forEach(el => {
      el.addEventListener('click', () => Projects.open(el.dataset.proj));
    });

    // close buttons: red circle, top-left, as nature intended
    document.querySelectorAll('.win .wb.cl[data-close]').forEach(el => {
      el.addEventListener('click', e => { e.stopPropagation(); closeDesktopWin(el.dataset.close); });
    });
    document.querySelectorAll('.shared-win .wb.cl[data-close-shared]').forEach(el => {
      el.addEventListener('click', e => { e.stopPropagation(); closeShared(el.dataset.closeShared); });
    });

    // minimize buttons: yellow circle, sends the window to the taskbar to think about what it did
    document.querySelectorAll('.win .wb.mn').forEach(el => {
      el.addEventListener('click', e => { e.stopPropagation(); const w = el.closest('.win'); if (w) minimizeWin(w.id); });
    });
    document.querySelectorAll('.shared-win .wb.mn').forEach(el => {
      el.addEventListener('click', e => { e.stopPropagation(); const w = el.closest('.shared-win'); if (w) { const key = w.id.replace('sw-',''); w.classList.add('minimized'); updateTaskbar(); } });
    });

    // fullscreen/maximize buttons: green circle. it works. it's satisfying. try it.
    document.querySelectorAll('.win .wb.mx').forEach(el => {
      el.addEventListener('click', e => { e.stopPropagation(); const w = el.closest('.win'); if (w) toggleFullscreen(w.id); });
    });
    document.querySelectorAll('.shared-win .wb.mx').forEach(el => {
      el.addEventListener('click', e => { e.stopPropagation(); const w = el.closest('.shared-win'); if (w) toggleFullscreen(w.id); });
    });

    document.querySelectorAll('.sbtn[data-sm]').forEach(el => {
      el.addEventListener('click', e => { e.stopPropagation(); toggleStartMenu(el.dataset.sm); });
    });

    document.querySelectorAll('.wbar[data-win]').forEach(el => {
      el.addEventListener('mousedown', e => {
        if (e.target.classList.contains('wb')) return;
        const winId = el.dataset.win;
        const winEl = document.getElementById(winId) || el.closest('.win') || el.closest('.shared-win');
        if (winEl) startDrag(e, winEl);
      });
      el.addEventListener('touchstart', e => {
        if (e.target.classList.contains('wb')) return;
        const winId = el.dataset.win;
        const winEl = document.getElementById(winId) || el.closest('.win') || el.closest('.shared-win');
        if (winEl) startDrag(e, winEl);
      }, { passive: false });
    });

    document.querySelectorAll('.win, .shared-win').forEach(el => {
      el.addEventListener('mousedown', () => bringToFront(el));
      el.addEventListener('touchstart', () => bringToFront(el), { passive: true });
    });

    document.querySelectorAll('.pc[data-proj]').forEach(el => {
      el.addEventListener('click', () => Projects.open(el.dataset.proj));
      el.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' '){ e.preventDefault(); Projects.open(el.dataset.proj); } });
    });

    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd);

    if (root) {
      root.addEventListener('click', e => {
        if (!e.target.closest('.smenu') && !e.target.closest('.sbtn')) closeAllStartMenus();
      });
    }

    // focus trap: Tab key cycles through the topmost window only.
    // accessibility matters. also it just feels right.
    document.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      let topWin = null; let topZ2 = -1;
      document.querySelectorAll('.win.open:not(.minimized), .shared-win.open:not(.minimized)').forEach(w => {
        const z = parseInt(w.style.zIndex || 0, 10);
        if (z > topZ2) { topZ2 = z; topWin = w; }
      });
      if (!topWin) return;
      const focusable = Array.from(topWin.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter(el => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // Escape key: closes the topmost window like a normal person would expect
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      let topWin = null; let topZ2 = -1;
      document.querySelectorAll('.win.open:not(.minimized), .shared-win.open:not(.minimized)').forEach(w => {
        const z = parseInt(w.style.zIndex || 0, 10);
        if (z > topZ2) { topZ2 = z; topWin = w; }
      });
      if (topWin) {
        const closeBtn = topWin.querySelector('.wb.cl');
        if (closeBtn) closeBtn.click();
      }
    });
  }

  /* MOBILE LAUNCHER -- the phone layout. swipe between app grid and widgets.
     because draggable windows on a 390px screen is technically possible but spiritually wrong. */
  const LAUNCHER_ITEMS = {
    dk: [
      { ico: '🏢', lbl: 'ABOUT',   win: 'dk-about' },
      { ico: '👤', lbl: 'FOUNDER', shared: 'founder' },
      { ico: '📡', lbl: 'NEWS',    shared: 'news' },
      { ico: '📨', lbl: 'CONTACT', shared: 'contact' },
      { ico: '🤖', lbl: 'SIGIL',   shared: 'faq' },
    ],
    vl: [
      { ico: '🐦', lbl: 'FLOPPY BIRD', link: '404.html' },
      { ico: '🏢', lbl: 'ABOUT',   win: 'vl-about' },
      { ico: '👤', lbl: 'FOUNDER', shared: 'founder' },
      { ico: '📡', lbl: 'NEWS',    shared: 'news' },
      { ico: '📨', lbl: 'CONTACT', shared: 'contact' },
      { ico: '🤖', lbl: 'SIGIL',   shared: 'faq' },
    ],
    em: [
      { ico: '🏢', lbl: 'ABOUT',   win: 'em-about' },
      { ico: '👤', lbl: 'FOUNDER', shared: 'founder' },
      { ico: '📡', lbl: 'NEWS',    shared: 'news' },
      { ico: '📨', lbl: 'CONTACT', shared: 'contact' },
      { ico: '🤖', lbl: 'SIGIL',   shared: 'faq' },
    ],
  };

  function injectMobileLauncher(brand) {
    if (window.innerWidth >= 768) return;

    const screen = document.getElementById('s' + brand);
    if (!screen) return;
    screen.querySelectorAll('.launcher-wrap').forEach(el => el.remove());

    const desk = screen.querySelector('.desk');
    if (!desk) return;

    const wrap = document.createElement('div');
    wrap.className = 'launcher-wrap';

    const origHdr = desk.querySelector('.hdr-widget');
    if (origHdr) wrap.appendChild(origHdr.cloneNode(true));

    const scroll = document.createElement('div');
    scroll.className = 'launcher-scroll';
    scroll.setAttribute('role', 'region');
    scroll.setAttribute('aria-label', 'Launcher pages');

    // PAGE 0: app icon grid
    const pageApps = document.createElement('div');
    pageApps.className = 'launcher-page';
    const grid = document.createElement('div');
    grid.className = 'launcher-grid';
    grid.setAttribute('role', 'list');
    (LAUNCHER_ITEMS[brand] || []).forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'launcher-icon';
      btn.setAttribute('aria-label', item.lbl);
      btn.setAttribute('role', 'listitem');
      btn.innerHTML = `<div class="launcher-icon-box" aria-hidden="true">${item.ico}</div><div class="launcher-icon-lbl">${item.lbl}</div>`;
      btn.addEventListener('click', () => {
        if (item.shared) openShared(item.shared);
        else if (item.win) openDesktopWin(item.win);
        else if (item.proj) Projects.open(item.proj);
        else if (item.link) window.location.href = item.link;
      });
      grid.appendChild(btn);
    });
    pageApps.appendChild(grid);
    scroll.appendChild(pageApps);

    // PAGE 1: widgets (the ones that make it look like a real OS)
    const pageWidgets = document.createElement('div');
    pageWidgets.className = 'launcher-page';
    const widgetData = DESK_DATA[brand];
    if (widgetData) {
      const statsEl = document.createElement('div');
      statsEl.className = 'desk-stats';
      widgetData.stats.forEach(s => {
        const d = document.createElement('div');
        d.className = 'dstat';
        d.innerHTML = `<div class="dstat-label">${s.label}</div><div class="dstat-value">${s.value}</div><div class="dstat-sub">${s.sub}</div>`;
        statsEl.appendChild(d);
      });
      pageWidgets.appendChild(statsEl);

      const recEl = document.createElement('div');
      recEl.className = 'desk-recent';
      recEl.innerHTML = `<div class="desk-recent-title">Recent activity</div>`;
      widgetData.recent.forEach(r => {
        const item = document.createElement('div');
        item.className = 'drec-item';
        item.innerHTML = `<div class="drec-dot"></div><div class="drec-text">${r.text}</div><div class="drec-time">${r.time}</div>`;
        recEl.appendChild(item);
      });
      pageWidgets.appendChild(recEl);

      const sysEl = document.createElement('div');
      sysEl.className = 'desk-sysinfo';
      sysEl.innerHTML = `<div class="desk-sysinfo-title">System status</div>`;
      widgetData.sysinfo.forEach(s => {
        const row = document.createElement('div');
        row.className = 'dsys-row';
        row.innerHTML = `<div class="dsys-label">${s.label}</div><div class="dsys-bar-wrap"><div class="dsys-bar" style="width:${s.pct}%"></div></div><div class="dsys-val">${s.val}</div>`;
        sysEl.appendChild(row);
      });
      pageWidgets.appendChild(sysEl);
    }
    scroll.appendChild(pageWidgets);
    wrap.appendChild(scroll);

    // page indicator dots: because how else would you know there are two pages
    const dots = document.createElement('div');
    dots.className = 'launcher-dots';
    dots.setAttribute('aria-hidden', 'true');
    const dot0 = document.createElement('div'); dot0.className = 'ldot on';
    const dot1 = document.createElement('div'); dot1.className = 'ldot';
    dots.appendChild(dot0);
    dots.appendChild(dot1);
    wrap.appendChild(dots);

    scroll.addEventListener('scroll', () => {
      const page = Math.round(scroll.scrollLeft / scroll.offsetWidth);
      dot0.classList.toggle('on', page === 0);
      dot1.classList.toggle('on', page === 1);
    }, { passive: true });

    desk.appendChild(wrap);
  }

  /* INIT -- wires everything up. called once. if this breaks, everything breaks. no pressure. */
  function init() {
    wireEvents();
    FAQ.init();
    updateClock();
    setInterval(updateClock, 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { boot, goBack, openShared, closeShared, openDesktopWin, closeDesktopWin };

})();
