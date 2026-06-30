/* ============================================================
   dropup-render.js — Contact dropup: icon registry, list
   rendering and item builder.
   Depends on: dropup-core.js (must load before this file)

   Exposes window._DKDropupRender = { render }
   so dropup-core.js can call it to populate the list.
   ============================================================ */
(function () {
  'use strict';

  /* ── Simple Icons slug map ────────────────────────────────── */
  const SLUG_MAP = {
    'github':        'github',
    'twitter':       'x',
    'x':             'x',
    'instagram':     'instagram',
    'youtube':       'youtube',
    'discord':       'discord',
    'linkedin':      'linkedin',
    'spotify':       'spotify',
    'twitch':        'twitch',
    'tiktok':        'tiktok',
    'reddit':        'reddit',
    'bluesky':       'bluesky',
    'mastodon':      'mastodon',
    'soundcloud':    'soundcloud',
    'bandcamp':      'bandcamp',
    'itch.io':       'itchdotio',
    'steam':         'steam',
    'patreon':       'patreon',
    'ko-fi':         'kofi',
    'buymeacoffee':  'buymeacoffee',
    'behance':       'behance',
    'dribbble':      'dribbble',
    'devto':         'devdotto',
    'dev.to':        'devdotto',
    'medium':        'medium',
    'substack':      'substack',
    'threads':       'threads',
    'snapchat':      'snapchat',
    'pinterest':     'pinterest',
    'whatsapp':      'whatsapp',
    'telegram':      'telegram',
    'email':         'maildotru',
    'mail':          'minutemailer',
  };

  /* Platforms that use a custom inline SVG */
  const CUSTOM_ICONS = {
    'email': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
               <rect x="2" y="4" width="20" height="16" rx="2"/>
               <path d="M2 7l10 7 10-7"/>
             </svg>`,
    'mail':  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
               <rect x="2" y="4" width="20" height="16" rx="2"/>
               <path d="M2 7l10 7 10-7"/>
             </svg>`,
  };

  const SI_CDN    = 'https://cdn.simpleicons.org';
  const iconCache = {};

  /* ── Render full list ─────────────────────────────────────── */
  async function render(list) {
    const contacts = window.DK_CONTACTS || [];
    list.innerHTML = '';

    if (contacts.length === 0) {
      list.innerHTML = `<li class="dropup-item is-display-only">
        <span class="dropup-text"><span class="dropup-username">No contacts listed</span></span>
      </li>`;
      return;
    }

    for (const c of contacts) {
      const li = buildItem(c);
      list.appendChild(li);
      loadIcon(c.platform, li);
    }
  }

  /* ── Build one list item ──────────────────────────────────── */
  function buildItem(c) {
    const key     = c.platform.toLowerCase();
    const hasLink = c.href && c.href.trim() !== '';

    const el = document.createElement(hasLink ? 'a' : 'span');
    el.className = `dropup-item${hasLink ? '' : ' is-display-only'}`;

    if (hasLink) {
      el.href = c.href;
      if (/^https?:\/\//.test(c.href)) {
        el.target = '_blank';
        el.rel    = 'noopener noreferrer';
      }
      el.setAttribute('aria-label', `${c.platform} \u2014 ${c.username}`);
    }

    el.innerHTML = `
      <span class="dropup-icon" data-platform="${key}">
        <span class="dropup-icon-fallback">${key.charAt(0)}</span>
      </span>
      <span class="dropup-text">
        <span class="dropup-platform">${c.platform}</span>
        <span class="dropup-username">${c.username}</span>
      </span>
      ${!hasLink ? '<span class="dropup-badge">soon</span>' : ''}
    `;

    return el;
  }

  /* ── Fetch and inject Simple Icons SVG ───────────────────── */
  async function loadIcon(platform, itemEl) {
    const key      = platform.toLowerCase();
    const iconSlot = itemEl.querySelector('.dropup-icon');
    if (!iconSlot) return;

    if (CUSTOM_ICONS[key]) { iconSlot.innerHTML = CUSTOM_ICONS[key]; return; }

    const slug = SLUG_MAP[key] || key;
    const url  = `${SI_CDN}/${slug}/currentColor`;

    if (iconCache[slug]) { iconSlot.innerHTML = iconCache[slug]; return; }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status}`);
      const svgText = await res.text();
      iconCache[slug] = svgText;
      iconSlot.innerHTML = svgText;
      const svg = iconSlot.querySelector('svg');
      if (svg) { svg.setAttribute('width', '16'); svg.setAttribute('height', '16'); }
    } catch {
      /* Leave letter fallback */
    }
  }

  /* ── Expose to dropup-core.js ────────────────────────────── */
  window._DKDropupRender = { render };
})();
