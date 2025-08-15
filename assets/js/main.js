// Smooth scroll + basic nav
document.querySelectorAll('[data-goto]').forEach(btn=>{
  btn.addEventListener('click', e=>{
    const id = btn.getAttribute('data-goto');
    document.querySelector(id)?.scrollIntoView({behavior:'smooth'});
  });
});

// Stats counters
const animateNum=(el,to,dur=800)=>{
  const start=0, t0=performance.now();
  const step=t=>{ const p=Math.min((t-t0)/dur,1); el.textContent = Math.round(start + (to-start)*p); if(p<1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
};
animateNum(document.getElementById('stat-years'), 2);
animateNum(document.getElementById('stat-tools'), 9);
animateNum(document.getElementById('stat-speed'), 95);

// Modals
const openModal=id=>document.getElementById(id).classList.add('show');
const closeModals=()=>document.querySelectorAll('.modal').forEach(m=>m.classList.remove('show'));
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openModal(b.getAttribute('data-open'))));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',closeModals));
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModals(); });

// Calculator
const screen=document.getElementById('calc-screen');
const keys=document.getElementById('calc-keys');
if(keys){
  const labels=['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+','C'];
  labels.forEach(l=>{
    const b=document.createElement('button'); b.textContent=l; keys.appendChild(b);
    b.addEventListener('click',()=>{
      if(l==='C'){ screen.value=''; return; }
      if(l==='='){ try{ screen.value = eval(screen.value||'0'); }catch(_){ screen.value='Err'; } return; }
      screen.value += l;
    });
  });
}

// QR demo
const qrCanvas=document.getElementById('qr-canvas');
const qrText=document.getElementById('qr-text');
const qrDownload=document.getElementById('qr-download');
if(qrCanvas&&qrText){
  const ctx=qrCanvas.getContext('2d');
  const render=()=>{ window.QRDemo(ctx, qrCanvas.width, qrText.value||'Krunal'); };
  qrText.addEventListener('input',render); render();
  qrDownload?.addEventListener('click',()=>{
    const a=document.createElement('a'); a.download='qr.png'; a.href=qrCanvas.toDataURL('image/png'); a.click();
  });
}

// Image compressor
const fileInput=document.getElementById('img-input');
const quality=document.getElementById('img-quality');
const imgCanvas=document.getElementById('img-canvas');
const imgDl=document.getElementById('img-download');
if(fileInput){
  const ctx=imgCanvas.getContext('2d');
  let img=new Image();
  fileInput.addEventListener('change',()=>{
    const f=fileInput.files[0]; if(!f) return;
    const reader=new FileReader();
    reader.onload=e=>{ img.onload=()=>{ 
      const w=Math.min(1000,img.width), h=img.height*(Math.min(1000,img.width)/img.width);
      imgCanvas.width=w; imgCanvas.height=h; ctx.drawImage(img,0,0,w,h); }; img.src=e.target.result; };
    reader.readAsDataURL(f);
  });
  imgDl?.addEventListener('click',()=>{
    const q=parseFloat(quality.value||'0.7');
    const url=imgCanvas.toDataURL('image/jpeg', q);
    const a=document.createElement('a'); a.href=url; a.download='compressed.jpg'; a.click();
  });
}

// Text tools
const txt=document.getElementById('txt'), out=document.getElementById('txt-out');
const toUpper=document.getElementById('toUpper'), toLower=document.getElementById('toLower'), slug=document.getElementById('slug'), count=document.getElementById('count');
toUpper?.addEventListener('click',()=>txt.value=txt.value.toUpperCase());
toLower?.addEventListener('click',()=>txt.value=txt.value.toLowerCase());
slug?.addEventListener('click',()=>{ txt.value = txt.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); });
count?.addEventListener('click',()=>{ const w=txt.value.trim()?txt.value.trim().split(/\s+/).length:0; out.textContent = w+' words, '+txt.value.length+' chars'; });

// Playground
document.getElementById('year').textContent = new Date().getFullYear();
let timer=null, sec=25*60;
const fmt=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
const view=document.getElementById('timer'); view&&(view.textContent=fmt(sec));
document.getElementById('start')?.addEventListener('click',()=>{ if(timer) return; timer=setInterval(()=>{ sec--; view.textContent=fmt(sec); if(sec<=0){ clearInterval(timer); timer=null; alert('Time!'); sec=25*60; view.textContent=fmt(sec);} },1000); });
document.getElementById('reset')?.addEventListener('click',()=>{ clearInterval(timer); timer=null; sec=25*60; view.textContent=fmt(sec); });
document.getElementById('saveNotes')?.addEventListener('click',()=>{ localStorage.setItem('kr-notes', document.getElementById('notes').value); alert('Saved!'); });
document.getElementById('notes').value = localStorage.getItem('kr-notes')||'';

// TTS
document.getElementById('speak')?.addEventListener('click',()=>{
  const s=new SpeechSynthesisUtterance(document.getElementById('tts').value||'Hello from Krunal'); speechSynthesis.speak(s);
});

// Chat demo (client-only canned replies)
const chatLog=document.getElementById('chat-log'); const chatForm=document.getElementById('chat-form'); const chatInput=document.getElementById('chat-input');
function pushMsg(role, text){ const b=document.createElement('div'); b.className='msg '+role; b.textContent=text; chatLog.appendChild(b); chatLog.scrollTop=chatLog.scrollHeight; }
chatForm?.addEventListener('submit',e=>{ e.preventDefault(); const q=chatInput.value.trim(); if(!q) return; pushMsg('user', q); chatInput.value=''; setTimeout(()=>{ const a = 'Thanks! This demo shows chat UI/UX. For a real AI backend, connect an API.'; pushMsg('bot', a); }, 400); });
