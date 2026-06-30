/* ============================================================
   theme.js — Theme & motion toggle with localStorage persistence
   ============================================================ */
(function () {
  'use strict';

  const ROOT = document.documentElement;
  const THEME_KEY  = 'dk-theme';
  const MOTION_KEY = 'dk-motion';

  function getSaved(key, fallback) {
    try { return localStorage.getItem(key) || fallback; }
    catch { return fallback; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, val); } catch {}
  }

  /* ── Theme ─────────────────────────────────────────────────── */
  let currentTheme = getSaved(THEME_KEY, 'dark');

  function applyTheme(theme, animate = true) {
    if (!animate) document.body.classList.add('no-transition');
    ROOT.dataset.theme = theme;
    currentTheme = theme;
    save(THEME_KEY, theme);
    syncThemeBtn();
    if (!animate) {
      ROOT.offsetHeight; // force reflow
      document.body.classList.remove('no-transition');
    }
  }

  function syncThemeBtn() {
    const btn = document.getElementById('ctrl-theme');
    if (!btn) return;
    const light = currentTheme === 'light';
    btn.setAttribute('aria-pressed', light ? 'true' : 'false');
    btn.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    btn.title = light ? 'Dark mode' : 'Light mode';
  }

  /* ── Motion ─────────────────────────────────────────────────── */
  let motionOn = getSaved(MOTION_KEY, 'on') === 'on';

  if (!localStorage.getItem(MOTION_KEY)) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) motionOn = false;
  }

  function applyMotion(on) {
    motionOn = on;
    document.body.dataset.motion = on ? 'on' : 'off';
    save(MOTION_KEY, on ? 'on' : 'off');
    syncMotionBtn();
    if (window.DKBackground) on ? window.DKBackground.resume() : window.DKBackground.pause();
  }

  function syncMotionBtn() {
    const btn = document.getElementById('ctrl-motion');
    if (!btn) return;
    btn.setAttribute('aria-pressed', motionOn ? 'false' : 'true');
    btn.setAttribute('aria-label', motionOn ? 'Disable animation' : 'Enable animation');
    btn.title = motionOn ? 'Disable animation' : 'Enable animation';
  }

  /* ── Boot ───────────────────────────────────────────────────── */
  function init() {
    applyTheme(currentTheme, false);
    applyMotion(motionOn);
    document.getElementById('ctrl-theme')?.addEventListener('click', () => applyTheme(currentTheme === 'dark' ? 'light' : 'dark'));
    document.getElementById('ctrl-motion')?.addEventListener('click', () => applyMotion(!motionOn));
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

  window.DKTheme  = { apply: applyTheme  };
  window.DKMotion = { apply: applyMotion };
})();
