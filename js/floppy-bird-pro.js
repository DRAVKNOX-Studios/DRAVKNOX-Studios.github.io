(() => {
  const hint = document.querySelector('.hint');
  if (!hint) return;
  let up = true;
  setInterval(() => {
    hint.style.opacity = up ? '1' : '.72';
    up = !up;
  }, 900);
})();
