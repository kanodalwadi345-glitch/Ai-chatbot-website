
// Loader
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('hide');
});

// Navbar shrink + active link
(function() {
  const nav = document.querySelector('.nav');
  function onScroll(){
    if(window.scrollY > 6) nav.classList.add('shrink'); else nav.classList.remove('shrink');
  }
  window.addEventListener('scroll', onScroll); onScroll();

  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href.endsWith(path)) a.classList.add('active');
  });
})();

// 3D tilt for cards
document.querySelectorAll('.card[data-tilt]').forEach(card => {
  let rect;
  function enter(){ rect = card.getBoundingClientRect(); card.style.transition = 'transform .08s ease'; }
  function move(e){
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const rx = ((y/rect.height)-.5)*8;
    const ry = ((x/rect.width)-.5)*-8;
    card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  }
  function leave(){ card.style.transform = 'none'; }
  card.addEventListener('mouseenter', enter);
  card.addEventListener('mousemove', move);
  card.addEventListener('mouseleave', leave);
});

// Reveal on scroll
(function(){
  const els = [...document.querySelectorAll('.reveal')];
  if(!('IntersectionObserver' in window)) { els.forEach(el=>el.classList.add('show')); return; }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('show'); io.unobserve(en.target); } });
  }, {threshold: .1});
  els.forEach(el=>io.observe(el));
})();

// Page transitions
document.querySelectorAll('a[href$=".html"]').forEach(a => {
  a.addEventListener('click', e => {
    const url = a.getAttribute('href');
    if(url && !url.startsWith('http')){
      e.preventDefault();
      const root = document.querySelector('#page-root');
      root.classList.add('page-leave'); root.offsetWidth;
      root.classList.add('page-leave-active');
      setTimeout(()=>{ window.location.href = url; }, 180);
    }
  });
});
window.addEventListener('pageshow', ()=>{
  const root = document.querySelector('#page-root');
  root.classList.add('page-enter'); root.offsetWidth;
  root.classList.add('page-enter-active');
});

// Lightbox for gallery
(function(){
  const lb = document.querySelector('.lightbox');
  if(!lb) return;
  const img = lb.querySelector('img');
  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', () => {
      img.src = el.getAttribute('data-lightbox');
      lb.classList.add('show');
    });
  });
  lb.addEventListener('click', () => lb.classList.remove('show'));
})();

// Tiny typing effect
(function(){
  const el = document.querySelector('[data-typing]');
  if(!el) return;
  const words = (el.getAttribute('data-typing') || '').split('|').filter(Boolean);
  let w = 0, i = 0, dir = 1;
  function tick(){
    const word = words[w] || '';
    i += dir;
    if(i<0){ dir=1; w=(w+1)%words.length; i=0; }
    el.textContent = word.slice(0, i);
    if(i===word.length){ dir=-1; setTimeout(tick, 800); }
    else setTimeout(tick, 60);
  }
  tick();
})();
