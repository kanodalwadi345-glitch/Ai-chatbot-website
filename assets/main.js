// Background canvas particles + subtle 3D parallax
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let w=canvas.width=innerWidth, h=canvas.height=innerHeight;
const particles = [];
const PCOUNT = Math.floor(Math.min(160, (w*h)/7000));
for(let i=0;i<PCOUNT;i++){particles.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-0.5)*0.25,vy:(Math.random()-0.5)*0.25,r:1+Math.random()*2,op:0.18+Math.random()*0.6});}
function resize(){w=canvas.width=innerWidth;h=canvas.height=innerHeight;}
addEventListener('resize',resize);
function render(){
  ctx.clearRect(0,0,w,h);
  // gradient background
  const g = ctx.createLinearGradient(0,0,w,h);
  g.addColorStop(0,'rgba(5,12,34,1)'); g.addColorStop(1,'rgba(6,10,24,1)');
  ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
  // moving soft blobs for 3D feeling
  const t = performance.now()*0.0006;
  ctx.globalCompositeOperation='lighter';
  for(let i=0;i<3;i++){
    ctx.beginPath();
    const gx = w*0.2 + (0.6*w)*(i/2) + Math.cos(t*(1+i))*200;
    const gy = h*0.2 + Math.sin(t*(1.2+i))*120;
    const rad = Math.max(w,h)*0.4;
    const rg = ctx.createRadialGradient(gx,gy,0,gx,gy,rad);
    rg.addColorStop(0, i===0 ? 'rgba(54,227,167,0.12)' : i===1 ? 'rgba(94,198,255,0.10)' : 'rgba(255,126,95,0.07)');
    rg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=rg; ctx.fillRect(0,0,w,h);
  }
  // particles
  particles.forEach(p=>{
    p.x += p.vx + Math.cos(t*0.5+p.x*0.0003)*0.35;
    p.y += p.vy + Math.sin(t*0.45+p.y*0.0004)*0.35;
    if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0;
    ctx.beginPath(); ctx.fillStyle = 'rgba(180,210,255,'+p.op+')'; ctx.arc(p.x,p.y,p.r,0,6.28); ctx.fill();
  });
  // connecting lines
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const a=particles[i], b=particles[j];
      const dx=a.x-b.x, dy=a.y-b.y, d=dx*dx+dy*dy;
      if(d<11000){
        ctx.beginPath(); ctx.strokeStyle='rgba(94,198,255,'+(0.14 - d/14000)+')'; ctx.lineWidth=0.6; ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    }
  }
  ctx.globalCompositeOperation='source-over';
  requestAnimationFrame(render);
}
render();

// Mini chat demo (client-side canned replies)
const miniLog = document.getElementById('mini-log');
const miniInput = document.getElementById('mini-input');
const miniSend = document.getElementById('mini-send');
function pushMini(who,text){
  const d=document.createElement('div'); d.className=who; d.textContent=text; miniLog.appendChild(d); miniLog.scrollTop = miniLog.scrollHeight;
}
miniSend.addEventListener('click',()=>{
  const v = miniInput.value.trim(); if(!v) return; pushMini('user', v); miniInput.value='';
  setTimeout(()=>{
    const lower = v.toLowerCase();
    if(/resume|cv/.test(lower)) pushMini('bot','Make 1-page resume: Skills, 2 projects, Education. Add links.');
    else if(/earn|money|freelance|pais/.test(lower)) pushMini('bot','Start ₹999 landing pages for local shops. Upsell logo + maintenance.');
    else if(/study|learn/.test(lower)) pushMini('bot','30 day plan: HTML → CSS → JS → 3 mini projects.');
    else pushMini('bot','Nice question — this is a demo UI. For real AI, connect an API (OpenAI).');
  },350);
});
miniInput.addEventListener('keydown',e=>{ if(e.key==='Enter') miniSend.click(); });

// QR generator (canvas simple pattern) - demo only
const qrCanvas = document.getElementById('qr-canvas');
const qrBtn = document.getElementById('qr-gen');
qrBtn.addEventListener('click', ()=>{
  const text = document.getElementById('qr-text').value || 'krunal';
  const size = parseInt(document.getElementById('qr-size').value) || 240;
  qrCanvas.width = size; qrCanvas.height = size;
  const ctx2 = qrCanvas.getContext('2d'); ctx2.fillStyle='#fff'; ctx2.fillRect(0,0,size,size);
  ctx2.fillStyle='#001933';
  for(let y=0;y<33;y++){ for(let x=0;x<33;x++){ const v = (x*y + text.length + x*3 + y*7) % 7; if(v<3) ctx2.fillRect(x*(size/33), y*(size/33), Math.ceil(size/33), Math.ceil(size/33)); } }
});

// Image compressor demo (client side)
const imgInput = document.getElementById('img-file'); const imgQ = document.getElementById('img-q'); const imgCanvas = document.getElementById('img-canvas'); const imgCompress = document.getElementById('img-compress');
let loadedImg = new Image();
imgInput?.addEventListener('change', e=>{
  const f = e.target.files[0]; if(!f) return;
  const reader = new FileReader(); reader.onload = ev=>{ loadedImg.onload = ()=>{ const w = Math.min(900, loadedImg.width); const h = Math.round(loadedImg.height*(w/loadedImg.width)); imgCanvas.width = w; imgCanvas.height = h; const c = imgCanvas.getContext('2d'); c.drawImage(loadedImg,0,0,w,h); }; loadedImg.src = ev.target.result; }; reader.readAsDataURL(f);
});
imgCompress?.addEventListener('click', ()=>{
  if(!loadedImg.src) return alert('Upload an image first');
  const q = parseFloat(imgQ.value)||0.7; const url = imgCanvas.toDataURL('image/jpeg', q);
  const a = document.createElement('a'); a.href = url; a.download = 'compressed.jpg'; a.click();
});

// small utilities
document.getElementById('year').textContent = new Date().getFullYear();