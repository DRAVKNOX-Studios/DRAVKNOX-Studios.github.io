/* ============================================================
   modal-core.js — Division modal: open/close, focus trap,
   event wiring, and public DKModal API.
   Depends on: modal-projects.js (must load before this file)
   ============================================================ */
(function () {
  'use strict';

  /* ── Division display metadata ───────────────────────────── */
  const DIVISION_META = {
    talvrek:  { label: 'Talvrek',  sub: 'Software Division' },
    embrvaal: { label: 'Embrvaal', sub: 'Games & Content'   },
    veltrun:  { label: 'Veltrun',  sub: 'Music Division'    },
  };

  /* ── DOM refs ─────────────────────────────────────────────── */
  const modal    = document.getElementById('division-modal');
  const backdrop = modal?.querySelector('.modal-backdrop');
  const closeBtn = modal?.querySelector('.modal-close');
  const titleEl  = modal?.querySelector('.modal-title');
  const subEl    = modal?.querySelector('.modal-division-label');
  const bodyEl   = modal?.querySelector('.modal-body');
  const noteEl   = modal?.querySelector('.modal-footer-note');

  if (!modal) { console.warn('[DK Modal] #division-modal not found.'); return; }

  /* ── Open ─────────────────────────────────────────────────── */
  function open(division) {
    const meta     = DIVISION_META[division] || { label: division, sub: '' };
    const projects = (window.DK_PROJECTS || []).filter(p => p.division === division);
    const mp       = window._DKModalProjects;

    modal.dataset.division = division;
    titleEl.textContent    = meta.label;
    subEl.textContent      = meta.sub;

    if (projects.length === 0) {
      bodyEl.innerHTML = `
        <div class="modal-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <path d="M8 21h8M12 17v4"/>
          </svg>
          <span>No Projects yet!</span>
        </div>`;
    } else {
      bodyEl.innerHTML = `<div class="project-grid">${projects.map(mp.projectCard).join('')}</div>`;
      requestAnimationFrame(() => mp.loadAllPlatformIcons());
    }

    if (noteEl) noteEl.textContent = `${projects.length} project${projects.length !== 1 ? 's' : ''}`;

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
    bodyEl.scrollTop = 0;
  }

  /* ── Close ────────────────────────────────────────────────── */
  function close() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    if (modal._triggerEl) { modal._triggerEl.focus(); modal._triggerEl = null; }
  }

  /* ── Event wiring ─────────────────────────────────────────── */
  function init() {
    document.querySelectorAll('[data-action="open-division"]').forEach(btn => {
      btn.addEventListener('click', () => { modal._triggerEl = btn; open(btn.dataset.division); });
    });

    closeBtn?.addEventListener('click', close);
    backdrop?.addEventListener('click', close);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });

    bodyEl?.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.project-card')) {
        e.preventDefault();
        e.target.closest('.project-card').click();
      }
    });

    bodyEl?.addEventListener('click', e => {
      const card = e.target.closest('.project-card[role="button"]');
      if (card) console.log(`[DK Modal] No-href project clicked: ${card.dataset.project} — Phase 2`);
    });

    /* Focus trap */
    modal.addEventListener('keydown', e => {
      if (e.key !== 'Tab' || !modal.classList.contains('is-open')) return;
      const focusable = Array.from(
        modal.querySelectorAll('button, [href], [tabindex="0"]')
      ).filter(el => !el.disabled && el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first)       { e.preventDefault(); last.focus();  }
      else if (!e.shiftKey && document.activeElement === last)  { e.preventDefault(); first.focus(); }
    });
  }

  /* ── Public API ──────────────────────────────────────────── */
  window.DKModal = { open, close };

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
