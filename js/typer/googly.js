// Makes the logo's googly eyes drift around at random, the way the actual
// in-app icon does. Purely decorative, purely fun.

(function () {
  const EYE_CENTERS = {
    1: { cx: 23, cy: 20 },
    2: { cx: 41, cy: 20 }
  };
  const MAX_OFFSET = 2.4;

  function randomOffset() {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * MAX_OFFSET;
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist
    };
  }

  function wiggle() {
    const pupils = document.querySelectorAll('.googly-pupil');
    pupils.forEach((pupil) => {
      const eyeId = pupil.dataset.eye;
      const base = EYE_CENTERS[eyeId];
      if (!base) return;
      const offset = randomOffset();
      pupil.style.transition = 'cx 0.35s ease, cy 0.35s ease';
      pupil.setAttribute('cx', base.cx + offset.x);
      pupil.setAttribute('cy', base.cy + offset.y);
    });
  }

  function scheduleNext() {
    const delay = 900 + Math.random() * 1800;
    setTimeout(() => {
      wiggle();
      scheduleNext();
    }, delay);
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.googly-pupil')) {
      scheduleNext();
    }
  });
})();
