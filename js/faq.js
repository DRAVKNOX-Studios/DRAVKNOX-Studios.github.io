// faq.js -- simulated chatbot FAQ for DK_ASSIST
// it's not AI. it's vibes-driven keyword matching. and it works fine. don't @ me.

const FAQ = (() => {

  let booted = false;

  /* helpers -- timestamp, message bubbles, the typing dots nobody asked for but everyone likes */
  function ts() {
    const n = new Date();
    return String(n.getHours()).padStart(2,'0') + ':' + String(n.getMinutes()).padStart(2,'0');
  }

  function addMsg(text, who) {
    return new Promise(resolve => {
      const msgs = document.getElementById('faq-msgs');
      if (!msgs) { resolve(); return; }

      const wrap = document.createElement('div');
      wrap.className = 'fmsg ' + who;

      const meta = document.createElement('div');
      meta.className = 'fmsg-meta';
      meta.textContent = who === 'bot' ? 'DK_ASSIST · ' + ts() : 'YOU · ' + ts();

      const bub = document.createElement('div');
      bub.className = 'fbubble';
      bub.textContent = text;

      wrap.appendChild(meta);
      wrap.appendChild(bub);
      msgs.appendChild(wrap);
      msgs.scrollTop = msgs.scrollHeight;
      resolve();
    });
  }

  function showTyping() {
    const msgs = document.getElementById('faq-msgs');
    if (!msgs) return;
    const el = document.createElement('div');
    el.className = 'fmsg bot';
    el.id = 'faq-typing';
    const meta = document.createElement('div');
    meta.className = 'fmsg-meta';
    meta.textContent = 'DK_ASSIST · ' + ts();
    const bub = document.createElement('div');
    bub.className = 'fbubble';
    bub.innerHTML = '<div class="ftyping"><div class="ftd"></div><div class="ftd"></div><div class="ftd"></div></div>';
    el.appendChild(meta);
    el.appendChild(bub);
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById('faq-typing');
    if (el) el.remove();
  }

  /* keyword matching -- not GPT. not even close. but it doesn't hallucinate either, so. */
  function tokenize(input) {
    return input.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
  }

  // simple suffix stemmer: strips common endings so "making" matches "make"
  // is it perfect? absolutely not. does it cover 90% of cases? shockingly yes.
  function stem(w) {
    return w.replace(/ing$|ed$|er$|ers$|s$|es$|ly$/, '');
  }

  function match(input) {
    const raw   = tokenize(input);
    const stems = raw.map(stem);

    // bigrams from raw tokens for phrase matching ("open source", "bug report", etc.)
    const bigrams = [];
    for (let i = 0; i < raw.length - 1; i++) bigrams.push(raw[i] + ' ' + raw[i + 1]);

    let best = null, bestScore = -Infinity;

    FAQ_KB.forEach(entry => {
      let score = 0;
      const entryStems = entry.keys.map(stem);

      entry.keys.forEach((k, ki) => {
        const ks = entryStems[ki];
        const kTokens = k.split(' ');

        if (kTokens.length > 1) {
          // multi-word key: check bigrams first (high value match)
          if (bigrams.includes(k)) { score += 5; return; }
          // partial phrase overlap as fallback
          if (kTokens.every(kt => raw.includes(kt))) { score += 4; return; }
        }

        // exact raw word match
        if (raw.includes(k))   { score += 3; return; }
        // exact stem match
        if (stems.includes(ks)) { score += 2; return; }
        // partial substring: raw word starts with key or vice versa (typo tolerance)
        if (raw.some(w => w.length > 2 && (w.startsWith(k) || k.startsWith(w)))) { score += 1; return; }
        // stem substring fallback for the truly desperate
        if (stems.some(s => s.length > 2 && (s.startsWith(ks) || ks.startsWith(s)))) { score += 0.5; }
      });

      // normalize by key count so a giant key array doesn't always win unfairly
      const normalized = score / Math.sqrt(entry.keys.length);
      if (normalized > bestScore) { bestScore = normalized; best = entry; }
    });

    // minimum threshold: if the match is this weak, we just admit we don't know
    if (bestScore < 0.8) {
      return { answer: FAQ_FALLBACKS[Math.floor(Math.random() * FAQ_FALLBACKS.length)] };
    }
    return best;
  }

  /* suggestions -- the little chips that make people think the bot is smarter than it is */
  function buildSuggestions(list) {
    const el = document.getElementById('faq-sugs');
    if (!el) return;
    el.innerHTML = '';
    (list || FAQ_SUGGESTIONS).forEach(s => {
      const btn = document.createElement('div');
      btn.className = 'fsug';
      btn.textContent = s;
      btn.addEventListener('click', () => {
        const inp = document.getElementById('faq-inp');
        if (inp) inp.value = s;
        send();
      });
      el.appendChild(btn);
    });
  }

  /* send message -- takes user input, runs it through the matcher, pretends to think */
  async function send() {
    const inp = document.getElementById('faq-inp');
    if (!inp) return;
    const txt = inp.value.trim();
    if (!txt) return;
    inp.value = '';

    // clear suggestions so the old ones don't haunt us
    const sugsEl = document.getElementById('faq-sugs');
    if (sugsEl) sugsEl.innerHTML = '';

    await addMsg(txt, 'usr');
    showTyping();

    const result = match(txt);
    const delay = 550 + Math.random() * 550;

    setTimeout(async () => {
      removeTyping();
      await addMsg(result.answer, 'bot');

      // random follow-up suggestions so it feels "dynamic" (it is not dynamic)
      const followups = FAQ_SUGGESTIONS
        .filter(() => Math.random() > 0.45)
        .slice(0, 4);
      buildSuggestions(followups);

      const msgs = document.getElementById('faq-msgs');
      if (msgs) msgs.scrollTop = msgs.scrollHeight;
    }, delay);
  }

  /* boot sequence -- runs once when the FAQ window opens. very dramatic for 3 lines of text. */
  async function boot() {
    if (booted) return;
    booted = true;

    await new Promise(r => setTimeout(r, 350));
    await addMsg('DK_ASSIST v1.0 online. All knowledge banks loaded.', 'bot');
    await new Promise(r => setTimeout(r, 500));
    await addMsg('Ask me anything about Dravknox Studios, the three divisions, projects, downloads, or licensing.', 'bot');
    buildSuggestions();
  }

  /* public init -- wires up the input and send button. that's it. honestly pretty humble. */
  function init() {
    const inp = document.getElementById('faq-inp');
    const sendBtn = document.getElementById('faq-send');

    if (inp) {
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') send();
      });
    }
    if (sendBtn) {
      sendBtn.addEventListener('click', send);
    }
  }

  return { init, boot };

})();
