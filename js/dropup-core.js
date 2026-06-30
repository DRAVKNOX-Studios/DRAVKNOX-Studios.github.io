/* ============================================================
   dropup-core.js — Contact dropup: open/close/toggle, event
   wiring, and public DKDropup API.
   Depends on: dropup-render.js (must load before this file)
   ============================================================ */
(function () {
  'use strict';

  /* ── DOM refs ─────────────────────────────────────────────── */
  const trigger = document.getElementById('ctrl-contact');
  const dropup  = document.getElementById('contact-dropup');
  const list    = dropup?.querySelector('.dropup-list');

  if (!trigger || !dropup || !list) {
    console.warn('[DK Dropup] Required elements not found.');
    return;
  }

  /* ── Open / close ─────────────────────────────────────────── */
  let isOpen = false;

  function open() {
    if (isOpen) return;
    isOpen = true;
    window.DKSidebarCards?.close();
    window.DKChatbot?.close();
    window._DKDropupRender?.render(list);
    dropup.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    dropup.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  function toggle() { isOpen ? close() : open(); }

  /* ── Event wiring ─────────────────────────────────────────── */
  function init() {
    trigger.addEventListener('click', e => { e.stopPropagation(); toggle(); });

    document.addEventListener('click', e => {
      if (isOpen && !dropup.contains(e.target) && e.target !== trigger) close();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) { close(); trigger.focus(); }
    });

    dropup.addEventListener('click', e => e.stopPropagation());

    trigger.setAttribute('aria-expanded',  'false');
    trigger.setAttribute('aria-haspopup',  'listbox');
    trigger.setAttribute('aria-controls',  'contact-dropup');

    /* Pre-render so first open is instant */
    window._DKDropupRender?.render(list);
  }

  /* ── Public API ──────────────────────────────────────────── */
  window.DKDropup = { open, close, toggle };

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
