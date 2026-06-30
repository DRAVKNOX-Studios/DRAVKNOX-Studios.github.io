/* ============================================================
   bg-layers.js — The four draw layers: code rain, geometry,
   notes, and cross-layer collision sparks.
   Depends on: bg-core.js (must load before this file)

   Reads window._BGState for shared canvas/palette/highlight.
   Exposes window._BGLayers = { initAll, drawAll }.
   ============================================================ */
(function () {
  'use strict';

  /* Lazy accessor — _BGState is set by bg-core.js on the same tick */
  const S = () => window._BGState;

  /* ── CODE TOKENS ─────────────────────────────────────────── */
  const CODE_TOKENS = [
    'const','let','fn()','void','async','await','return','class',
    'import','export','null','true','false','new','this',
    '=>','{}','[]','&&','||','!==','===','++','--','>>=',
    '0x1F','0xFF','NaN','Inf','<T>','[key]','*mut','::new',
    '.map(','.then(','.filter(','.reduce(',
    'try{','catch','throw','break','while','for(','if(',
    '01101','11010','00110','10011',
    'git push','npm i','cargo b','make all',
    'null ptr','segfault','heap[]','stack<>',
    '\u03b1','\u03b2','\u03bb','\u03a3','\u2202','\u2207','\u221e','\u03c0',
  ];

  const codeStreams = [];

  function makeStream() {
    const { W, H, rand, randInt, pick } = S();
    return {
      x:      rand(0, W),
      y:      rand(-H * 0.5, H),
      tokens: Array.from({ length: randInt(5, 14) }, () => ({
        text:  pick(CODE_TOKENS),
        alpha: rand(0.05, 0.28),
        size:  rand(9, 15),
      })),
      gap:    rand(15, 26),
      speed:  rand(0.5, 2.2),
      age:    0,
      maxAge: randInt(150, 500),
      glitch: 0,
      glitchX: 0,
    };
  }

  function initCode() {
    const { W } = S();
    codeStreams.length = 0;
    const n = Math.max(35, Math.floor(W * 0.055));
    for (let i = 0; i < n; i++) codeStreams.push(makeStream());
  }

  function drawCode() {
    const { ctx, W, H, highlight, rgba, rand, randInt, pick, drawGlow } = S();
    const h        = highlight.layer === 'code' ? highlight.amount : 0;
    const alphaMod = highlight.layer && highlight.layer !== 'code' && highlight.amount > 0.02
      ? 1 - highlight.amount * 0.58 : 1;

    ctx.save();
    ctx.textBaseline = 'top';
    drawGlow('code', h * 0.15, 0.42);

    for (let s = 0; s < codeStreams.length; s++) {
      const st = codeStreams[s];
      st.y += st.speed;
      st.age++;

      if (Math.random() < 0.004) { st.glitch = randInt(4, 14); st.glitchX = rand(-4, 4); }
      if (st.glitch > 0) st.glitch--;
      const ox = st.glitch > 0 ? st.glitchX : 0;

      if (Math.random() < 0.018) {
        const i = randInt(0, st.tokens.length - 1);
        st.tokens[i].text  = pick(CODE_TOKENS);
        st.tokens[i].alpha = rand(0.05, 0.28);
      }

      for (let t = 0; t < st.tokens.length; t++) {
        const tk = st.tokens[t];
        const ty = st.y + t * st.gap;
        if (ty < -24 || ty > H + 24) continue;
        const ef          = Math.min(ty / (H * 0.06), (H - ty) / (H * 0.06), 1);
        const centerBias  = 1 - Math.min(Math.abs(st.x - W * 0.5) / (W * 0.5), 1);
        const drawX       = st.x + (W * 0.5 - st.x) * h * 0.08;
        ctx.globalAlpha   = Math.max(0, tk.alpha * ef * alphaMod * (1 + h * (1.4 + centerBias * 1.35)));
        ctx.fillStyle     = rgba('code', 1);
        ctx.font          = `${tk.size}px "JetBrains Mono", monospace`;
        ctx.fillText(tk.text, drawX + ox, ty);
      }

      if (st.y > H + st.tokens.length * st.gap + 40 || st.age > st.maxAge) {
        codeStreams[s]   = makeStream();
        codeStreams[s].y = rand(-H * 0.3, -20);
      }
    }
    ctx.restore();
  }

  /* ── GEOMETRY ────────────────────────────────────────────── */
  const geoShapes = [];

  function makeShape(px, py, pr, isFrag) {
    const { W, H, rand, randInt, pick } = S();
    const sides = pick([3, 4, 5, 6, 8]);
    const r = pr ? pr * rand(0.2, 0.5) : rand(14, 65);
    return {
      x:        px ?? rand(0, W),
      y:        py ?? rand(0, H),
      r, sides,
      angle:    rand(0, Math.PI * 2),
      rotSpeed: rand(0.003, 0.018) * (Math.random() < 0.5 ? 1 : -1),
      vx:       isFrag ? rand(-1.2, 1.2) : rand(-0.18, 0.18),
      vy:       isFrag ? rand(-1.2, 1.2) : rand(-0.14, 0.14),
      alpha:    isFrag ? rand(0.10, 0.22) : rand(0.05, 0.16),
      pulse:    rand(0, Math.PI * 2),
      isFrag,
      fragAge:  0,
      fragLife: isFrag ? randInt(50, 140) : Infinity,
      shatterAt: isFrag ? Infinity : randInt(280, 700),
      age:      0,
    };
  }

  function initGeo() {
    const { W } = S();
    geoShapes.length = 0;
    const n = Math.max(10, Math.floor(W * 0.014));
    for (let i = 0; i < n; i++) geoShapes.push(makeShape());
  }

  function polyPath(cx, cy, r, sides, angle) {
    const { ctx } = S();
    ctx.beginPath();
    for (let i = 0; i <= sides; i++) {
      const a = (i / sides) * Math.PI * 2 + angle;
      i === 0
        ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
        : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
    }
    ctx.closePath();
  }

  function drawGeo() {
    const { ctx, W, H, highlight, rgba, randInt, drawGlow } = S();
    const h        = highlight.layer === 'geo' ? highlight.amount : 0;
    const alphaMod = highlight.layer && highlight.layer !== 'geo' && highlight.amount > 0.02
      ? 1 - highlight.amount * 0.58 : 1;

    ctx.save();
    const dead = [];
    drawGlow('geo', h * 0.13, 0.5);

    for (let i = 0; i < geoShapes.length; i++) {
      const s = geoShapes[i];
      s.age++; s.angle += s.rotSpeed;
      s.x += s.vx; s.y += s.vy; s.pulse += 0.02;

      if (s.x < -s.r * 2)   s.x = W + s.r;
      if (s.x > W + s.r * 2) s.x = -s.r;
      if (s.y < -s.r * 2)   s.y = H + s.r;
      if (s.y > H + s.r * 2) s.y = -s.r;

      if (s.isFrag) {
        s.fragAge++;
        if (s.fragAge >= s.fragLife) { dead.push(i); continue; }
        s.vx *= 0.985; s.vy *= 0.985;
      }

      if (!s.isFrag && s.age === s.shatterAt) {
        const frags = randInt(3, 7);
        for (let f = 0; f < frags; f++) geoShapes.push(makeShape(s.x, s.y, s.r, true));
        s.shatterAt = s.age + randInt(280, 700);
        s.age = 0;
      }

      const fadeOut = s.isFrag ? 1 - s.fragAge / s.fragLife : 1;
      const pa      = s.alpha * (0.65 + 0.35 * Math.sin(s.pulse)) * fadeOut * alphaMod * (1 + h * 2.1);
      const drawX   = s.x + (W * 0.5 - s.x) * h * 0.34;
      const drawY   = s.y + (H * 0.48 - s.y) * h * 0.22;
      const drawR   = s.r * (1 + h * 0.28);

      ctx.strokeStyle = rgba('geo', 1);
      ctx.lineWidth   = (s.isFrag ? 0.6 : 1.0) * (1 + h * 0.6);

      ctx.globalAlpha = pa;
      polyPath(drawX, drawY, drawR, s.sides, s.angle);
      ctx.stroke();

      ctx.globalAlpha = pa * 0.45;
      polyPath(drawX, drawY, drawR * 0.5, s.sides, s.angle + Math.PI / s.sides);
      ctx.stroke();

      ctx.globalAlpha = pa * 0.75;
      ctx.fillStyle   = rgba('geo', 1);
      for (let v = 0; v < s.sides; v++) {
        const a = (v / s.sides) * Math.PI * 2 + s.angle;
        ctx.beginPath();
        ctx.arc(
          drawX + drawR * Math.cos(a),
          drawY + drawR * Math.sin(a),
          (s.isFrag ? 1 : 1.6) * (1 + h * 0.45), 0, Math.PI * 2
        );
        ctx.fill();
      }

      for (let j = i + 1; j < geoShapes.length; j++) {
        const b  = geoShapes[j];
        const dx = s.x - b.x, dy = s.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 200) {
          ctx.globalAlpha = (1 - d / 200) * 0.06 * alphaMod * (1 + h);
          ctx.strokeStyle = rgba('geo', 1);
          ctx.lineWidth   = 0.4 * (1 + h * 0.6);
          const bx = b.x + (W * 0.5 - b.x) * h * 0.34;
          const by = b.y + (H * 0.48 - b.y) * h * 0.22;
          ctx.beginPath(); ctx.moveTo(drawX, drawY); ctx.lineTo(bx, by); ctx.stroke();
        }
      }
    }

    for (let i = dead.length - 1; i >= 0; i--) geoShapes.splice(dead[i], 1);

    const base = Math.max(10, Math.floor(W * 0.014));
    const real = geoShapes.filter(s => !s.isFrag).length;
    for (let i = real; i < base; i++) geoShapes.push(makeShape());

    ctx.restore();
  }

  /* ── NOTES ───────────────────────────────────────────────── */
  const SYMBOLS = [
    '\u2669','\u266a','\u266b','\u266c','\u266d','\u266f',
    '~','\u2248','\u223f','\u224b','\u2307',
    '|','||','\u00ac','\u00a6',
  ];

  const noteParticles = [];

  function makeNote() {
    const { W, H, rand } = S();
    const goesUp = Math.random() < 0.72;
    return {
      x:       rand(0, W),
      y:       goesUp ? rand(H * 0.2, H + 20) : rand(-20, H * 0.8),
      char:    S().pick(SYMBOLS),
      size:    rand(11, 30),
      alpha:   rand(0.07, 0.26),
      vy:      goesUp ? -rand(0.2, 0.8) : rand(0.15, 0.5),
      vx:      rand(-0.12, 0.12),
      spin:    rand(0, Math.PI * 2),
      spinSpd: rand(-0.04, 0.04),
      wobble:  rand(0, Math.PI * 2),
      wobbleF: rand(0.01, 0.04),
      wobbleA: rand(4, 18),
      pulse:   rand(0, Math.PI * 2),
    };
  }

  function initNotes() {
    const { W } = S();
    noteParticles.length = 0;
    const n = Math.max(40, Math.floor(W * 0.06));
    for (let i = 0; i < n; i++) noteParticles.push(makeNote());
  }

  function drawNotes() {
    const { ctx, W, H, highlight, rgba, drawGlow } = S();
    const h        = highlight.layer === 'note' ? highlight.amount : 0;
    const alphaMod = highlight.layer && highlight.layer !== 'note' && highlight.amount > 0.02
      ? 1 - highlight.amount * 0.58 : 1;

    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.textAlign    = 'center';
    drawGlow('note', h * 0.14, 0.5);

    for (let i = 0; i < noteParticles.length; i++) {
      const p = noteParticles[i];
      p.y += p.vy; p.x += p.vx;
      p.wobble += p.wobbleF; p.spin += p.spinSpd; p.pulse += 0.022;

      if (p.y < -40)    { noteParticles[i] = makeNote(); noteParticles[i].y = H + 20; continue; }
      if (p.y > H + 40) { noteParticles[i] = makeNote(); noteParticles[i].y = -20;   continue; }
      if (p.x < -20)    p.x = W + 10;
      if (p.x > W + 20) p.x = -10;

      const ef    = Math.min(Math.abs(p.y) / (H * 0.06), Math.abs(H - p.y) / (H * 0.06), 1);
      const pa    = Math.max(0, p.alpha * (0.75 + 0.25 * Math.sin(p.pulse)) * ef * alphaMod * (1 + h * 2.15));
      const drawX = p.x + (W * 0.5 - p.x) * h * 0.38;
      const drawY = p.y + (H * 0.48 - p.y) * h * 0.18;

      ctx.globalAlpha = pa;
      ctx.fillStyle   = rgba('note', 1);
      ctx.font        = `${p.size * (1 + h * 0.22)}px serif`;

      ctx.save();
      ctx.translate(drawX + Math.sin(p.wobble) * p.wobbleA * (1 + h * 0.4), drawY);
      ctx.rotate(p.spin);
      ctx.fillText(p.char, 0, 0);
      ctx.restore();

      for (let j = i + 1; j < noteParticles.length; j++) {
        const q  = noteParticles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 90) {
          ctx.globalAlpha = (1 - d / 90) * 0.09 * alphaMod * (1 + h);
          ctx.strokeStyle = rgba('note', 1);
          ctx.lineWidth   = 0.5 * (1 + h * 0.6);
          const qx = q.x + (W * 0.5 - q.x) * h * 0.38;
          const qy = q.y + (H * 0.48 - q.y) * h * 0.18;
          ctx.beginPath(); ctx.moveTo(drawX, drawY); ctx.lineTo(qx, qy); ctx.stroke();
        }
      }
    }

    ctx.textAlign = 'left';
    ctx.restore();
  }

  /* ── SPARKS ──────────────────────────────────────────────── */
  const sparks = [];

  function spawnSpark(x, y) {
    const { rand, randInt } = S();
    for (let i = 0; i < randInt(3, 7); i++) {
      const angle = rand(0, Math.PI * 2);
      const speed = rand(0.5, 2.5);
      sparks.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: randInt(20, 50),
        age:  0,
        size: rand(1.5, 3.5),
      });
    }
  }

  function drawSparks() {
    const { ctx, W, H, highlight, pal, drawGlow } = S();
    const h = highlight.layer === 'spark' ? highlight.amount : 0;
    drawGlow('spark', h * 0.1, 0.52);

    if (Math.random() < 0.15) {
      for (const s of geoShapes) {
        if (s.isFrag) continue;
        for (const p of noteParticles) {
          const dx = s.x - p.x, dy = s.y - p.y;
          if (dx * dx + dy * dy < 60 * 60 && Math.random() < 0.06) {
            spawnSpark(s.x + dx * 0.5, s.y + dy * 0.5);
            break;
          }
        }
        break;
      }
    }

    ctx.save();
    const dead = [];
    for (let i = 0; i < sparks.length; i++) {
      const sp = sparks[i];
      sp.x += sp.vx; sp.y += sp.vy;
      sp.vx *= 0.91; sp.vy *= 0.91;
      sp.age++;
      if (sp.age >= sp.life) { dead.push(i); continue; }

      const t  = sp.age / sp.life;
      const gc = pal('geo'), nc = pal('note');
      const r  = Math.round(gc.r + (nc.r - gc.r) * t);
      const g  = Math.round(gc.g + (nc.g - gc.g) * t);
      const b  = Math.round(gc.b + (nc.b - gc.b) * t);
      ctx.globalAlpha = (1 - t) * 0.7 * (1 + h * 1.4);
      ctx.fillStyle   = `rgb(${r},${g},${b})`;
      ctx.beginPath();
      ctx.arc(
        sp.x + (W * 0.5 - sp.x) * h * 0.24,
        sp.y + (H * 0.48 - sp.y) * h * 0.16,
        sp.size * (1 - t) * (1 + h * 0.8), 0, Math.PI * 2
      );
      ctx.fill();
    }
    for (let i = dead.length - 1; i >= 0; i--) sparks.splice(dead[i], 1);
    ctx.restore();
  }

  /* ── Public layer API ────────────────────────────────────── */
  window._BGLayers = {
    initAll() {
      initCode();
      initGeo();
      initNotes();
      sparks.length = 0;
    },
    drawAll() {
      drawCode();
      drawGeo();
      drawNotes();
      drawSparks();
    },
  };
})();
