// Drives the fake-but-fun keyboard tester widget in the hero.
// Tapping the on-screen keys types into the screen and tracks a live WPM count.

(function () {
  const ROWS = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'back'],
    ['123', ',', 'space', '.', 'enter']
  ];

  let screenEl, wpmEl;
  let buffer = '';
  let shiftOn = false;
  let startTime = null;

  function keyLabel(key) {
    switch (key) {
      case 'shift': return '⇧';
      case 'back': return '⌫';
      case 'space': return ' ';
      case 'enter': return '↵';
      default: return shiftOn ? key.toUpperCase() : key;
    }
  }

  function keyClass(key) {
    if (key === 'space') return 'tester-key wide';
    if (key === 'enter') return 'tester-key enter';
    if (key === 'shift' || key === 'back' || key === '123') return 'tester-key func';
    return 'tester-key';
  }

  function renderKeyboard(container) {
    container.innerHTML = '';
    ROWS.forEach((row) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'tester-row';
      row.forEach((key) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = keyClass(key);
        btn.textContent = keyLabel(key);
        btn.addEventListener('click', () => handleKey(key, btn));
        rowEl.appendChild(btn);
      });
      container.appendChild(rowEl);
    });
  }

  function handleKey(key, btn) {
    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 120);

    if (navigator.vibrate) {
      navigator.vibrate(8);
    }

    if (!startTime && key !== 'shift' && key !== '123') {
      startTime = Date.now();
    }

    if (key === 'shift') {
      shiftOn = !shiftOn;
      renderKeyboard(document.getElementById('testerKeys'));
      return;
    }

    if (key === '123') {
      return;
    }

    if (key === 'back') {
      buffer = buffer.slice(0, -1);
    } else if (key === 'enter') {
      buffer += '\n';
    } else if (key === 'space') {
      buffer += ' ';
    } else {
      buffer += shiftOn ? key.toUpperCase() : key;
    }

    updateScreen();
    updateWpm();
  }

  function updateScreen() {
    if (!buffer) {
      screenEl.innerHTML = '<span class="placeholder">Try your keyboard&hellip;</span>';
    } else {
      screenEl.textContent = buffer;
    }
  }

  function updateWpm() {
    if (!startTime) return;
    const minutes = (Date.now() - startTime) / 60000;
    const words = buffer.trim().length ? buffer.trim().split(/\s+/).length : 0;
    const wpm = minutes > 0 ? Math.round(words / minutes) : 0;
    wpmEl.textContent = `${wpm} WPM`;
  }

  function clearScreen() {
    buffer = '';
    startTime = null;
    wpmEl.textContent = '0 WPM';
    updateScreen();
  }

  function initTester() {
    screenEl = document.getElementById('testerScreen');
    wpmEl = document.getElementById('testerWpm');
    const keysEl = document.getElementById('testerKeys');
    const clearBtn = document.getElementById('testerClear');

    if (!screenEl) return;

    renderKeyboard(keysEl);
    updateScreen();
    clearBtn.addEventListener('click', clearScreen);
  }

  document.addEventListener('DOMContentLoaded', initTester);
})();
