/* ============================================================
   statscard.js — Computes and renders the stats card.
   Reads: window.DK_DATA (studio.js) + window.DK_PROJECTS (projects.js)
   No fetch. Separate from all other JS.
   ============================================================ */
(function () {
  'use strict';

  /* ── Compute stats from data ────────────────────────────────── */
  function compute() {
    const studio   = window.DK_DATA?.studio   || {};
    const projects = window.DK_PROJECTS       || [];

    const founded   = studio.founded || new Date().getFullYear();
    const daysBuilding = Math.floor(
      (Date.now() - new Date(`${founded}-01-01`).getTime()) / 86_400_000
    );

    const totalProjects  = projects.length;
    const divisions      = [...new Set(projects.map(p => p.division))].length;

    /* Aggregate language weights across all projects */
    const langMap = {};
    for (const p of projects) {
      for (const l of (p.languages || [])) {
        langMap[l.name] = (langMap[l.name] || 0) + l.pct;
      }
    }
    /* Sort by weight, take top 5, normalise to 100% */
    const langEntries = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const langTotal = langEntries.reduce((s, [, v]) => s + v, 0);
    const langs = langEntries.map(([name, raw]) => ({
      name,
      pct: langTotal > 0 ? Math.round((raw / langTotal) * 100) : 0,
    }));

    /* Unique platforms across all projects */
    const platforms = [...new Set(projects.flatMap(p => p.platforms || []))].sort();

    return { founded, daysBuilding, totalProjects, divisions, langs, platforms };
  }

  /* ── Render into the card ───────────────────────────────────── */
  function render(stats) {
    const card = document.getElementById('stats-card');
    if (!card) return;

    const today = new Date().toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });

    const langBars = stats.langs.length > 0
      ? stats.langs.map(l => `
          <div class="sc-lang">
            <div class="sc-lang-row">
              <span class="sc-lang-name">${l.name}</span>
              <span class="sc-lang-pct">${l.pct}%</span>
            </div>
            <div class="sc-lang-bar-bg">
              <div class="sc-lang-bar-fill" data-lang="${l.name}" style="width:${l.pct}%"></div>
            </div>
          </div>`).join('')
      : `<span class="sc-lang-name" style="color:var(--text-muted);font-size:0.58rem">No code projects yet</span>`;

    const platformTags = stats.platforms.length > 0
      ? stats.platforms.map(p => `<span class="sc-platform-tag">${p}</span>`).join('')
      : `<span class="sc-platform-tag">TBD</span>`;

    card.innerHTML = `
      <div class="sc-header">
        <span class="sc-title">Studio Stats</span>
        <span class="sc-updated">${today}</span>
      </div>

      <div class="sc-stats">
        <div class="sc-stat">
          <span class="sc-stat-label">Founded</span>
          <span class="sc-stat-value accent">${stats.founded}</span>
        </div>
        <div class="sc-stat">
          <span class="sc-stat-label">Days building</span>
          <span class="sc-stat-value">${stats.daysBuilding.toLocaleString()}</span>
        </div>
        <div class="sc-stat">
          <span class="sc-stat-label">Total projects</span>
          <span class="sc-stat-value">${stats.totalProjects}</span>
        </div>
        <div class="sc-stat">
          <span class="sc-stat-label">Active divisions</span>
          <span class="sc-stat-value">${stats.divisions}</span>
        </div>
      </div>

      <div class="sc-divider"></div>

      <div class="sc-lang-title">Languages & Tech</div>
      <div class="sc-langs">${langBars}</div>

      <div class="sc-divider"></div>

      <div class="sc-lang-title">Ships on</div>
      <div class="sc-platforms">${platformTags}</div>
    `;
  }

  /* ── Boot ───────────────────────────────────────────────────── */
  function init() {
    const stats = compute();
    render(stats);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

  window.DKStats = { recompute: () => render(compute()) };
})();
