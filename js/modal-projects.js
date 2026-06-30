/* ============================================================
   modal-projects.js — Platform icon registry and project card
   HTML builder for the division modal.
   Depends on: modal-core.js (must load before this file)

   Exposes window._DKModalProjects = { projectCard, loadAllPlatformIcons }
   so modal-core.js can call them when opening a division.
   ============================================================ */
(function () {
  'use strict';

  /* ── Platform → Simple Icons slug ────────────────────────── */
  const PLATFORM_SLUG = {
    'steam':       'steam',
    'itch.io':     'itchdotio',
    'spotify':     'spotify',
    'soundcloud':  'soundcloud',
    'youtube':     'youtube',
    'bandcamp':    'bandcamp',
    'android':     'android',
    'ios':         'apple',
    'playstation': 'playstation',
    'xbox':        'xbox',
    'nintendo':    'nintendoswitch',
    'web':         'googlechrome',
    'github':      'github',
    'linux':       'linux',
  };

  /* Custom inline SVGs for platforms missing from Simple Icons */
  const CUSTOM_PLATFORM_SVGS = {
    'windows': `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
    </svg>`,
    'macos': `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4.5 12.5h-9v-1.5c0-2.5 4.5-3.75 4.5-3.75S7.5 11 7.5 8.5H9c0 1.5 3 2.25 3 2.25S15 9.75 15 8.5h1.5c0 2.5-4.5 3.75-4.5 3.75s4.5 1.25 4.5 3.75v1.5z"/>
    </svg>`,
    'pc': `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
    </svg>`,
    'mobile': `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
    </svg>`,
  };

  const SI_CDN    = 'https://cdn.simpleicons.org';
  const iconCache = {};

  /* ── Project card HTML builder ────────────────────────────── */
  function projectCard(p) {
    const iconHtml = p.icon
      ? `<div class="project-icon"><img src="${p.icon}" alt="" loading="lazy" /></div>`
      : `<div class="project-icon-fallback" aria-hidden="true">${p.name.charAt(0).toUpperCase()}</div>`;
    const statusHtml = window.DKProjectStatus?.renderStatus(p.status) || '';

    const isExternal = p.href && /^https?:\/\//.test(p.href);
    const tag   = p.href ? 'a' : 'div';
    const attrs = p.href
      ? `href="${p.href}"${isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''}`
      : 'role="button" tabindex="0"';

    const platforms    = p.platforms || [];
    const platformHTML = platforms.length > 0 ? `
      <div class="project-platforms" aria-label="Available on: ${platforms.join(', ')}">
        ${platforms.map(pl => `
          <span class="platform-icon"
                data-platform="${pl.toLowerCase()}"
                title="${pl}">
          </span>`).join('')}
      </div>` : '';

    return `
      <${tag} class="project-card" ${attrs}
           data-project="${p.id}"
           aria-label="${p.name} \u2014 ${p.tagline}">
        ${iconHtml}
        ${statusHtml}
        <p class="project-name">${p.name}</p>
        <p class="project-tagline">${p.tagline}</p>
        ${platformHTML}
      </${tag}>`;
  }

  /* ── Platform icon loading ────────────────────────────────── */
  function getBodyEl() {
    return document.querySelector('#division-modal .modal-body');
  }

  async function loadAllPlatformIcons() {
    const bodyEl = getBodyEl();
    if (!bodyEl) return;
    const slots = bodyEl.querySelectorAll('.platform-icon[data-platform]');
    const seen  = new Set();
    for (const slot of slots) {
      const key = slot.dataset.platform;
      if (!seen.has(key)) { seen.add(key); loadPlatformIcon(key); }
    }
  }

  async function loadPlatformIcon(platformKey) {
    if (CUSTOM_PLATFORM_SVGS[platformKey]) {
      setIconSlots(platformKey, CUSTOM_PLATFORM_SVGS[platformKey]);
      return;
    }

    const slug = PLATFORM_SLUG[platformKey] || platformKey.replace(/[^a-z0-9]/g, '');
    const url  = `${SI_CDN}/${slug}/currentColor`;

    if (iconCache[slug]) { setIconSlots(platformKey, iconCache[slug]); return; }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.status);
      let svg = await res.text();
      svg = svg.replace(/width="[^"]*"/, 'width="13"').replace(/height="[^"]*"/, 'height="13"');
      iconCache[slug] = svg;
      setIconSlots(platformKey, svg);
    } catch {
      const fallback = `<svg viewBox="0 0 13 13"><text x="6.5" y="10"
        text-anchor="middle" font-size="9" font-family="sans-serif"
        fill="currentColor">${platformKey.charAt(0).toUpperCase()}</text></svg>`;
      setIconSlots(platformKey, fallback);
    }
  }

  function setIconSlots(platformKey, svgHtml) {
    const bodyEl = getBodyEl();
    bodyEl?.querySelectorAll(`.platform-icon[data-platform="${platformKey}"]`)
      .forEach(slot => { slot.innerHTML = svgHtml; });
  }

  /* ── Expose to modal-core.js ─────────────────────────────── */
  window._DKModalProjects = { projectCard, loadAllPlatformIcons };
})();
