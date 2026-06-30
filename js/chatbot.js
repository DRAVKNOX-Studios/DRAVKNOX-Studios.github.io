(function () {
  'use strict';

  const data = window.DK_CHATBOT;
  const trigger = document.getElementById('ctrl-chatbot');
  const panel = document.getElementById('chatbot-panel');
  const closeBtn = panel?.querySelector('.chatbot-close');
  const messages = panel?.querySelector('.chatbot-messages');
  const chips = panel?.querySelector('.chatbot-chips');
  const form = panel?.querySelector('.chatbot-form');
  const input = document.getElementById('chatbot-input');

  if (!data || !trigger || !panel || !messages || !chips || !form || !input) return;

  const stopWords = new Set([
    'a','an','and','are','be','can','do','does','for','from','how','i','in','is','it','me','of','on','or','please','the','this','to','what','where','who','why','with','you','your'
  ]);

  const dictionary = buildDictionary();
  let isOpen = false;
  let hasGreeted = false;

  function pick(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function shuffle(items) {
    return [...items].sort(() => Math.random() - 0.5);
  }

  function clean(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s']/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .flatMap(word => (data.normalizer[word] || word).split(' '))
      .join(' ');
  }

  function tokens(text) {
    return clean(text)
      .split(' ')
      .filter(word => word.length > 1 && !stopWords.has(word));
  }

  function uniqueTokens(text) {
    return [...new Set(tokens(text))];
  }

  function buildDictionary() {
    return data.faq.map(entry => {
      const questionText = entry.questions.join(' ');
      return {
        ...entry,
        tokens: uniqueTokens(questionText),
        variants: entry.questions.map(question => ({
          question,
          clean: clean(question),
          tokens: uniqueTokens(question)
        }))
      };
    });
  }

  function scoreEntry(message, entry) {
    const query = uniqueTokens(message);
    const cleaned = clean(message);
    if (!query.length) return 0;

    const tokenHits = query.filter(word => entry.tokens.includes(word)).length;
    const tokenScore = tokenHits / Math.max(query.length, entry.tokens.length * 0.45);
    const phraseScore = entry.variants.reduce((best, variant) => {
      if (cleaned.includes(variant.clean) || variant.clean.includes(cleaned)) return Math.max(best, 1);
      const hits = query.filter(word => variant.tokens.includes(word)).length;
      return Math.max(best, hits / Math.max(query.length, variant.tokens.length));
    }, 0);

    return Math.min(1, tokenScore * 0.58 + phraseScore * 0.42);
  }

  function ranked(message) {
    return dictionary
      .map(entry => ({ entry, score: scoreEntry(message, entry) }))
      .sort((a, b) => b.score - a.score);
  }

  function addMessage(role, text, options = []) {
    const item = document.createElement('article');
    item.className = `chat-message ${role === 'user' ? 'is-user' : 'is-bot'}`;

    const avatar = document.createElement('span');
    avatar.className = role === 'user' ? 'chatbot-avatar user-avatar' : 'chatbot-avatar bot-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = role === 'user' ? '' : 'S';

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;

    item.append(avatar, bubble);

    if (options.length) {
      const optionWrap = document.createElement('div');
      optionWrap.className = 'chat-suggestions';
      options.forEach(question => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chat-chip';
        button.textContent = question;
        button.addEventListener('click', () => ask(question));
        optionWrap.appendChild(button);
      });
      bubble.appendChild(optionWrap);
    }

    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  }

  function renderChips(source = data.faq) {
    chips.innerHTML = '';
    shuffle(source)
      .slice(0, 4)
      .map(entry => pick(entry.questions))
      .forEach(question => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chat-chip';
        button.textContent = question;
        button.addEventListener('click', () => ask(question));
        chips.appendChild(button);
      });
  }

  function answer(message) {
    const matches = ranked(message);
    const best = matches[0];
    if (best?.score >= 0.3) {
      addMessage('bot', pick(best.entry.answers));
      renderChips();
      return;
    }

    const near = matches.filter(match => match.score >= 0.08).slice(0, 5);
    if (near.length >= 3) {
      const suggestions = near.map(match => pick(match.entry.questions));
      while (suggestions.length < 5) suggestions.push(pick(shuffle(data.faq)[0].questions));
      addMessage('bot', pick(data.bot.fallback), suggestions.slice(0, 5));
      renderChips(near.map(match => match.entry));
      return;
    }

    addMessage('bot', pick(data.bot.miss));
    renderChips();
  }

  function ask(text) {
    const message = text.trim();
    if (!message) return;
    addMessage('user', message);
    input.value = '';
    window.setTimeout(() => answer(message), 220);
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    window.DKSidebarCards?.close();
    window.DKDropup?.close();
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    if (!hasGreeted) {
      hasGreeted = true;
      addMessage('bot', pick(data.bot.opener));
      renderChips();
    }
    window.setTimeout(() => input.focus(), 80);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
  }

  function toggle() {
    isOpen ? close() : open();
  }

  function init() {
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      toggle();
    });

    closeBtn?.addEventListener('click', e => {
      e.stopPropagation();
      close();
      trigger.focus();
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      ask(input.value);
    });

    panel.addEventListener('click', e => e.stopPropagation());

    document.addEventListener('click', e => {
      if (isOpen && !panel.contains(e.target) && e.target !== trigger) close();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) {
        close();
        trigger.focus();
      }
    });

    renderChips();
  }

  window.DKChatbot = { open, close, toggle, ask };

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
