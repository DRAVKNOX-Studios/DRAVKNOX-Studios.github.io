(function(){
  const pick = a => a[Math.floor(Math.random()*a.length)];

  const tauntEl = document.getElementById('taunt');
  const hintEl  = document.getElementById('hint');
  if(tauntEl) tauntEl.textContent = pick(FLOPPY_DATA.taunts);
  if(hintEl)  hintEl.textContent  = pick(FLOPPY_DATA.hints);

  // tapping the bird re-rolls the message, tiny easter-egg feel
  const bird = document.getElementById('bird');
  if(bird){
    bird.style.cursor = 'pointer';
    bird.addEventListener('click', () => {
      tauntEl.textContent = pick(FLOPPY_DATA.taunts);
      hintEl.textContent  = pick(FLOPPY_DATA.hints);
      bird.style.animation = 'none';
      void bird.offsetWidth;
      bird.style.animation = '';
    });
  }
})();
