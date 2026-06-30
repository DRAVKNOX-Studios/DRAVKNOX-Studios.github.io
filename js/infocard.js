/* ============================================================
   infocard.js — Renders the info card from DK_DATA + DK_PROJECTS.
   Separate from all other JS. Wired via <script> in index.html.
   ============================================================ */
(function () {
  'use strict';

  function render() {
    const card = document.getElementById('info-card');
    if (!card) return;

    const studio   = window.DK_DATA?.studio   || {};
    const founder  = window.DK_DATA?.founder  || {};
    const projects = window.DK_PROJECTS       || [];

    /* Currently building: last project entry per division */
    const divisionOrder  = ['talvrek', 'embrvaal', 'veltrun'];
    const divisionLabels = {
      talvrek:  'Talvrek · Software',
      embrvaal: 'Embrvaal · Games',
      veltrun:  'Veltrun · Music',
    };

    const building = divisionOrder
      .map(div => {
        const list = projects.filter(p => p.division === div);
        if (!list.length) return null;
        return { div, name: list[list.length - 1].name };
      })
      .filter(Boolean);

    const buildingHTML = building.length
      ? building.map(b => `
          <div class="ic-building-item">
            <div class="ic-building-dot" data-division="${b.div}"></div>
            <div class="ic-building-text">
              <span class="ic-building-project">${b.name}</span>
              <span class="ic-building-division">${divisionLabels[b.div]}</span>
            </div>
          </div>`).join('')
      : `<span style="font-size:0.6rem;color:var(--text-muted)">Nothing listed yet</span>`;

    const aboutParas = (studio.about || ['An independent creative studio.'])
      .map(p => `<p class="ic-about-text">${p}</p>`).join('');

    const avatarHTML = founder.avatar
      ? `<img src="${founder.avatar}" alt="${founder.name}" />`
      : `<span class="ic-founder-avatar-fallback">${(founder.name || 'F').charAt(0)}</span>`;

    const locationHTML = founder.location ? `
      <span class="ic-location">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
        ${founder.location}
      </span>` : '';

    const statusHTML = founder.status
      ? `<span class="ic-status">${founder.status}</span>` : '';

    card.innerHTML = `
      <div class="ic-section">
        <div class="ic-section-label">About the Studio</div>
        <div class="ic-studio-name">${studio.name || 'Dravknox'} ${studio.suffix || 'Studios'}</div>
        <div class="ic-studio-year">Est. <span>${studio.founded || '—'}</span></div>
        ${aboutParas}
        ${studio.mission ? `<blockquote class="ic-mission">"${studio.mission}"</blockquote>` : ''}
      </div>

      <div class="ic-divider"></div>

      <div class="ic-section">
        <div class="ic-section-label">Currently Building</div>
        <div class="ic-building-list">${buildingHTML}</div>
      </div>

      <div class="ic-divider"></div>

      <div class="ic-section">
        <div class="ic-section-label">About the Founder</div>
        <div class="ic-founder-header">
          <div class="ic-founder-avatar">${avatarHTML}</div>
          <div class="ic-founder-meta">
            <span class="ic-founder-name">${founder.name || 'Founder'}</span>
            <span class="ic-founder-role">${founder.role || 'Solo Developer'}</span>
          </div>
        </div>
        ${founder.bio ? `<p class="ic-founder-bio">${founder.bio}</p>` : ''}
        <div class="ic-founder-footer">
          ${locationHTML}
          ${statusHTML}
        </div>
      </div>
    `;
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', render)
    : render();

  window.DKInfo = { rerender: render };
})();
