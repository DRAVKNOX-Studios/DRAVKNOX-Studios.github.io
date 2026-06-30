(function () {
  'use strict';

  var images  = [];
  var current = 0;
  var zoom    = 1;
  var ZOOM_STEP = 0.25;
  var ZOOM_MIN  = 1;
  var ZOOM_MAX  = 4;

  var lb        = document.getElementById('lightbox');
  var backdrop  = lb.querySelector('.lightbox-backdrop');
  var imgWrap   = lb.querySelector('.lightbox-img-wrap');
  var img       = lb.querySelector('.lightbox-img');
  var caption   = lb.querySelector('.lightbox-caption');
  var counter   = lb.querySelector('.lightbox-counter');
  var strip     = lb.querySelector('.lightbox-strip');
  var btnPrev   = lb.querySelector('.lightbox-nav.prev');
  var btnNext   = lb.querySelector('.lightbox-nav.next');
  var btnClose  = lb.querySelector('.lightbox-close');
  var btnZoomIn = lb.querySelector('.lightbox-zoom-in');
  var btnZoomOut= lb.querySelector('.lightbox-zoom-out');
  var btnZoomReset = lb.querySelector('.lightbox-zoom-reset');
  var zoomLevel = lb.querySelector('.lightbox-zoom-level');

  var touchStartX = 0;
  var touchStartY = 0;

  function open(list, index) {
    images  = list;
    current = index;
    buildStrip();
    showImage(current);
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lb.focus();
  }

  function close() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    resetZoom();
  }

  function showImage(idx) {
    var item = images[idx];
    img.classList.remove('is-loaded');
    resetZoom();
    img.onload = function () { img.classList.add('is-loaded'); };
    img.src = item.src;
    img.alt = item.alt || '';
    caption.textContent = item.alt || item.src.split('/').pop();
    counter.textContent = (idx + 1) + ' / ' + images.length;
    btnPrev.hidden = images.length < 2;
    btnNext.hidden = images.length < 2;
    updateStrip(idx);
  }

  function navigate(dir) {
    current = (current + dir + images.length) % images.length;
    showImage(current);
  }

  function applyZoom() {
    if (zoom <= 1) {
      img.style.transform = '';
      img.classList.remove('is-zoomed');
      imgWrap.style.cursor = '';
    } else {
      img.style.transform = 'scale(' + zoom + ')';
      img.classList.add('is-zoomed');
    }
    zoomLevel.textContent = Math.round(zoom * 100) + '%';
    btnZoomOut.disabled = zoom <= ZOOM_MIN;
    btnZoomIn.disabled  = zoom >= ZOOM_MAX;
    btnZoomReset.disabled = zoom === 1;
  }

  function resetZoom() {
    zoom = 1;
    applyZoom();
  }

  function zoomIn() {
    zoom = Math.min(ZOOM_MAX, parseFloat((zoom + ZOOM_STEP).toFixed(2)));
    applyZoom();
  }

  function zoomOut() {
    zoom = Math.max(ZOOM_MIN, parseFloat((zoom - ZOOM_STEP).toFixed(2)));
    applyZoom();
  }

  function buildStrip() {
    strip.innerHTML = '';
    if (images.length < 2) { strip.hidden = true; return; }
    strip.hidden = false;
    images.forEach(function (item, i) {
      var t = document.createElement('img');
      t.src = item.src;
      t.alt = item.alt || '';
      t.className = 'lightbox-thumb';
      t.loading = 'lazy';
      t.addEventListener('click', function () {
        current = i;
        showImage(i);
      });
      strip.appendChild(t);
    });
  }

  function updateStrip(idx) {
    var thumbs = strip.querySelectorAll('.lightbox-thumb');
    thumbs.forEach(function (t, i) {
      t.classList.toggle('is-active', i === idx);
    });
    if (thumbs[idx]) {
      thumbs[idx].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }
  }

  btnClose.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  btnPrev.addEventListener('click', function () { navigate(-1); });
  btnNext.addEventListener('click', function () { navigate(1); });
  btnZoomIn.addEventListener('click', zoomIn);
  btnZoomOut.addEventListener('click', zoomOut);
  btnZoomReset.addEventListener('click', resetZoom);

  imgWrap.addEventListener('wheel', function (e) {
    if (!lb.classList.contains('is-open')) return;
    e.preventDefault();
    if (e.deltaY < 0) zoomIn(); else zoomOut();
  }, { passive: false });

  lb.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape')     { close(); return; }
    if (e.key === 'ArrowLeft')  { navigate(-1); return; }
    if (e.key === 'ArrowRight') { navigate(1);  return; }
    if (e.key === '+' || e.key === '=') { zoomIn();  return; }
    if (e.key === '-')                  { zoomOut(); return; }
    if (e.key === '0')                  { resetZoom(); }
  });

  lb.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  lb.addEventListener('touchend', function (e) {
    if (zoom > 1) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) {
      navigate(dx < 0 ? 1 : -1);
    }
  }, { passive: true });

  window.Lightbox = { open: open, close: close };
}());
