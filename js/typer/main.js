// Renders every data-driven section of the page from TYPER_CONTENT,
// plus small nav behaviors (mobile menu toggle, active link highlight).

(function () {
  var ICONS = {
    android: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 18V9.5a6 6 0 0 1 12 0V18" stroke-linecap="round"/><path d="M4 13h2M18 13h2" stroke-linecap="round"/><path d="M8 21v-2M16 21v-2" stroke-linecap="round"/><path d="M8.5 6 7 4M15.5 6 17 4" stroke-linecap="round"/><circle cx="9.5" cy="9.5" r="0.8" fill="currentColor"/><circle cx="14.5" cy="9.5" r="0.8" fill="currentColor"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.4 9.4 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 7 4 12l5 5M15 7l5 5-5 5"/></svg>'
  };

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function renderQuotes() {
    var wrap = document.getElementById('quoteStack');
    if (!wrap) return;
    TYPER_CONTENT.quotes.forEach(function (q) {
      wrap.appendChild(el('div', 'quote-bubble', '"' + q + '"'));
    });
  }

  function renderFeatures() {
    var grid = document.getElementById('featureGrid');
    if (!grid) return;
    TYPER_CONTENT.features.forEach(function (f) {
      var card = el('div', 'feature-card');
      card.appendChild(el('h3', null, f.title));
      card.appendChild(el('p', null, f.body));
      grid.appendChild(card);
    });
  }

  function renderStats() {
    var grid = document.getElementById('statsGrid');
    if (!grid) return;
    TYPER_CONTENT.stats.forEach(function (s) {
      var card = el('div', 'stat-card');
      card.appendChild(el('div', 'stat-value', s.value + '<span class="stat-unit">' + s.unit + '</span>'));
      card.appendChild(el('div', 'stat-label', s.label));
      grid.appendChild(card);
    });
    var hood = document.getElementById('hoodList');
    if (hood) {
      TYPER_CONTENT.underTheHood.forEach(function (line) {
        hood.appendChild(el('li', null, line));
      });
    }
  }

  function renderRequirements() {
    var minCard = document.getElementById('reqMin');
    var maxCard = document.getElementById('reqMax');
    if (minCard) {
      TYPER_CONTENT.requirements.min.forEach(function (pair) {
        var row = el('div', 'req-row');
        row.appendChild(el('span', 'label', pair[0]));
        row.appendChild(el('span', 'value', pair[1]));
        minCard.appendChild(row);
      });
    }
    if (maxCard) {
      TYPER_CONTENT.requirements.max.forEach(function (pair) {
        var row = el('div', 'req-row');
        row.appendChild(el('span', 'label', pair[0]));
        row.appendChild(el('span', 'value', pair[1]));
        maxCard.appendChild(row);
      });
    }
  }

  function renderAudience() {
    var yes = document.getElementById('audienceYes');
    var no  = document.getElementById('audienceNo');
    if (yes) TYPER_CONTENT.forYou.forEach(function (line) { yes.appendChild(el('li', null, line)); });
    if (no)  TYPER_CONTENT.notForYou.forEach(function (line) { no.appendChild(el('li', null, line)); });
  }

  function renderGallery() {
    var grid = document.getElementById('galleryGrid');
    if (!grid) return;
    TYPER_CONTENT.screenshots.forEach(function (shot) {
      var src = 'assets/typer/' + shot.file;
      var item = el('div', 'gallery-item');
      var img = document.createElement('img');
      img.src = src;
      img.alt = shot.label;
      img.loading = 'lazy';
      img.dataset.lightbox    = '';
      img.dataset.lightboxSrc = src;
      img.dataset.lightboxAlt = shot.label;
      item.appendChild(img);
      item.appendChild(el('div', 'gallery-caption', shot.label));
      grid.appendChild(item);
    });
  }

  function renderLinkCards(containerId, items) {
    var grid = document.getElementById(containerId);
    if (!grid) return;
    items.forEach(function (item) {
      var card = el('div', 'link-card' + (item.primary ? ' primary' : ''));
      if (item.icon) card.appendChild(el('div', 'link-icon', ICONS[item.icon] || ''));
      card.appendChild(el('h3', null, item.name));
      card.appendChild(el('p', null, item.desc));
      var link = el('a', 'btn ' + (item.primary ? 'btn-primary' : 'btn-ghost'), 'Open ↗');
      link.href = item.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      card.appendChild(link);
      grid.appendChild(card);
    });
  }

  function initNav() {
    var toggle = document.getElementById('navToggle');
    var nav    = document.getElementById('mainNav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () { nav.classList.toggle('open'); });
      nav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { nav.classList.remove('open'); });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderQuotes();
    renderFeatures();
    renderStats();
    renderRequirements();
    renderAudience();
    renderGallery();
    renderLinkCards('downloadGrid', TYPER_CONTENT.downloads);
    renderLinkCards('codeGrid', TYPER_CONTENT.codeLinks);
    initNav();
  });
}());
