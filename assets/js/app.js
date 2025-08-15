
/* Tiny Vanilla Tilt-ish for cards */
document.querySelectorAll('.card[data-tilt]').forEach((card)=>{
  let rect;
  function enter(){ rect = card.getBoundingClientRect(); card.style.transition='transform .08s ease' }
  function move(e){
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const rx = ((y/rect.height)-.5)*8;
    const ry = ((x/rect.width)-.5)*-8;
    card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  }
  function leave(){ card.style.transform='none' }
  card.addEventListener('mouseenter', enter);
  card.addEventListener('mousemove', move);
  card.addEventListener('mouseleave', leave);
});

/* Active link highlight */
(function(){
  const path = location.pathname.replace(/\/+$/,''); 
  document.querySelectorAll('.nav-links a').forEach(a=>{
    if(a.getAttribute('href')===path.split('/').pop() || (a.getAttribute('href')==='index.html' && path.endsWith('/') ) ){
      a.classList.add('active');
    }
  });
})();

/* Simple page transition for internal links */
document.querySelectorAll('a[href$=".html"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const url = a.getAttribute('href');
    if(url && !url.startsWith('http')){
      e.preventDefault();
      const root = document.querySelector('#page-root');
      root.classList.add('page-leave'); root.offsetWidth; // reflow
      root.classList.add('page-leave-active');
      setTimeout(()=>{ window.location.href = url; }, 200);
    }
  });
});

window.addEventListener('pageshow', ()=>{
  const root = document.querySelector('#page-root');
  root.classList.add('page-enter'); root.offsetWidth;
  root.classList.add('page-enter-active');
});
