(function () {
  'use strict';

  function collectImages(container) {
    var sources = [];
    if (!container) return sources;
    container.querySelectorAll('[data-lightbox]').forEach(function (el) {
      var src = el.dataset.lightboxSrc || el.src || el.href || '';
      var alt = el.dataset.lightboxAlt || el.alt || el.title || '';
      if (src) sources.push({ src: src, alt: alt });
    });
    return sources;
  }

  function bindContainer(container) {
    container.querySelectorAll('[data-lightbox]').forEach(function (el, i) {
      var images = collectImages(container);
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', function (e) {
        e.preventDefault();
        if (window.Lightbox) window.Lightbox.open(images, i);
      });
    });
  }

  function init() {
    document.querySelectorAll('[data-lightbox-group]').forEach(function (group) {
      bindContainer(group);
    });
    bindContainer(document.body);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.LightboxInit = { rebind: bindContainer, collect: collectImages };
}());
