(function () {
  'use strict';

  function initSidebar() {
    const triggers = [
      {
        trigger: document.getElementById('stats-trigger'),
        button: document.getElementById('btn-stats'),
      },
      {
        trigger: document.getElementById('info-trigger'),
        button: document.getElementById('btn-info'),
      },
    ].filter(item => item.trigger && item.button);

    const closeAll = except => {
      triggers.forEach(({ trigger, button }) => {
        if (trigger === except) return;
        trigger.classList.remove('is-open');
        trigger.closest('aside')?.classList.remove('is-panel-open');
        button.setAttribute('aria-expanded', 'false');
      });
    };

    triggers.forEach(({ trigger, button }) => {
      button.setAttribute('aria-expanded', 'false');

      button.addEventListener('click', event => {
        event.stopPropagation();
        const willOpen = !trigger.classList.contains('is-open');
        closeAll(trigger);
        trigger.classList.toggle('is-open', willOpen);
        trigger.closest('aside')?.classList.toggle('is-panel-open', willOpen);
        button.setAttribute('aria-expanded', String(willOpen));
        if (!willOpen) button.blur();
      });
    });

    document.addEventListener('click', event => {
      if (triggers.some(({ trigger }) => trigger.contains(event.target))) return;
      closeAll();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeAll();
        if (triggers.some(({ trigger }) => trigger.contains(document.activeElement))) {
          document.activeElement.blur();
        }
      }
    });

    window.DKSidebarCards = { close: () => closeAll() };
  }

  function initDivisionBackgroundHover() {
    document.querySelectorAll('.division-card[data-division]').forEach(card => {
      const division = card.dataset.division;
      card.addEventListener('mouseenter', () => window.DKBackground?.highlight(division));
      card.addEventListener('focus', () => window.DKBackground?.highlight(division));
      card.addEventListener('mouseleave', () => window.DKBackground?.clearHighlight(division));
      card.addEventListener('blur', () => window.DKBackground?.clearHighlight(division));
    });
  }

  function init() {
    initSidebar();
    initDivisionBackgroundHover();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
