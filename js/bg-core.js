/* ============================================================
   bg-core.js — Canvas bootstrap, palette, highlight state,
   resize, main loop, and public DKBackground API.
   Depends on: bg-layers.js (must load after this file)

   Exposes window._BGState for bg-layers.js to read/write:
     { canvas, ctx, W, H, paused, highlight, pal, rgba,
       rand, randInt, pick, isLight, drawGlow }
   ============================================================ */
(function () {
  'use strict';

  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, raf;
  let paused = false;

  /* ── Helpers ─────────────────────────────────────────────── */
  const rand    = (a, b) => Math.random() * (b - a) + a;
  const randInt = (a, b) => Math.floor(rand(a, b + 1));
  const pick    = arr   => arr[randInt(0, arr.length - 1)];
  const isLight = ()    => document.documentElement.dataset.theme === 'light';

  /* ── Palette ──────────────────────────────────────────────── */
  const DARK = {
    code: { r: 184, g: 208, b: 224 },
    geo:  { r: 192, g: 48,  b: 32  },
    note: { r: 26,  g: 78,  b: 204 },
  };
  const LIGHT = {
    code: { r: 60,  g: 90,  b: 130 },
    geo:  { r: 160, g: 28,  b: 16  },
    note: { r: 18,  g: 52,  b: 160 },
  };

  function pal(key) {
    return isLight() ? LIGHT[key] : DARK[key];
  }
  function rgba(key, alpha) {
    const c = pal(key);
    return `rgba(${c.r},${c.g},${c.b},${alpha})`;
  }

  /* ── Highlight state ─────────────────────────────────────── */
  const DIVISION_LAYER = {
    talvrek:  'code',
    embrvaal: 'geo',
    veltrun:  'note',
    vault:    'spark',
  };

  const highlight = { layer: null, requested: null, amount: 0 };

  function drawGlow(key, alpha, scale) {
    if (alpha <= 0) return;
    const c = pal(key === 'spark' ? 'geo' : key);
    const g = ctx.createRadialGradient(
      W * 0.5, H * 0.48, 0,
      W * 0.5, H * 0.48, Math.max(W, H) * scale
    );
    g.addColorStop(0,    `rgba(${c.r},${c.g},${c.b},${alpha})`);
    g.addColorStop(0.38, `rgba(${c.r},${c.g},${c.b},${alpha * 0.38})`);
    g.addColorStop(1,    `rgba(${c.r},${c.g},${c.b},0)`);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  /* ── Shared state namespace for bg-layers.js ─────────────── */
  window._BGState = {
    get canvas() { return canvas; },
    get ctx()    { return ctx;    },
    get W()      { return W;      },
    get H()      { return H;      },
    get highlight() { return highlight; },
    pal, rgba, rand, randInt, pick, isLight, drawGlow,
  };

  /* ── Resize ──────────────────────────────────────────────── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    window._BGLayers?.initAll();
  }

  /* ── Main loop ───────────────────────────────────────────── */
  function loop() {
    if (!paused) {
      if (highlight.requested) highlight.layer = highlight.requested;
      highlight.amount += ((highlight.requested ? 1 : 0) - highlight.amount) * 0.08;
      if (!highlight.requested && highlight.amount < 0.01) {
        highlight.amount = 0;
        highlight.layer  = null;
      }
      ctx.clearRect(0, 0, W, H);
      window._BGLayers?.drawAll();
    }
    raf = requestAnimationFrame(loop);
  }

  /* ── Public API ──────────────────────────────────────────── */
  window.DKBackground = {
    pause()    { paused = true;  },
    resume()   { paused = false; },
    toggle()   { paused ? this.resume() : this.pause(); },
    isPaused() { return paused; },
    highlight(division) {
      highlight.requested = DIVISION_LAYER[division] || null;
    },
    clearHighlight(division) {
      if (!division || highlight.requested === DIVISION_LAYER[division])
        highlight.requested = null;
    },
  };

  /* ── Boot ────────────────────────────────────────────────── */
  function init() {
    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(loop);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
