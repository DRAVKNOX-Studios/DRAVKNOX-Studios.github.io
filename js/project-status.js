(function () {
  'use strict';

  const STATUSES = {
    'active-dev': {
      label: 'Active dev',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/><path d="M5 5l14 14"/></svg>`
    },
    released: {
      label: 'Released',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/><circle cx="12" cy="12" r="10"/></svg>`
    },
    cancelled: {
      label: 'Cancelled',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6"/><path d="M9 9l6 6"/></svg>`
    },
    archived: {
      label: 'Archived',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9"/><path d="M10 13h4"/></svg>`
    }
  };

  function normalizeStatus(status) {
    return String(status || 'archived').toLowerCase().replace(/\s+/g, '-');
  }

  function getStatus(status) {
    return STATUSES[normalizeStatus(status)] || STATUSES.archived;
  }

  function renderStatus(status) {
    const statusKey = normalizeStatus(status);
    const statusData = getStatus(status);
    return `
      <span class="project-status project-status-${statusKey}">
        ${statusData.icon}
        <span>${statusData.label}</span>
      </span>`;
  }

  window.DKProjectStatus = { getStatus, renderStatus, normalizeStatus };
})();
