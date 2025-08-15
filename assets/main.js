
// Three.js 3D particle field background
import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';

let scene, camera, renderer, points, geometry, material;
const container = document.getElementById('three-root');

function initThree(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 1, 2000);
  camera.position.z = 400;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const count = Math.floor((innerWidth*innerHeight)/8000);
  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count*3);
  const sizes = new Float32Array(count);
  for(let i=0;i<count;i++){
    positions[i*3] = (Math.random()-0.5)*2000;
    positions[i*3+1] = (Math.random()-0.5)*1200;
    positions[i*3+2] = (Math.random()-0.5)*800;
    sizes[i] = Math.random()*6+2;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes,1));

  const vertex = `
    attribute float size;
    varying vec3 vColor;
    void main(){
      vColor = position;
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      gl_PointSize = size * ( 300.0 / -mvPosition.z );
      gl_Position = projectionMatrix * mvPosition;
    }
  `;
  const fragment = `
    varying vec3 vColor;
    void main(){
      float d = distance(gl_PointCoord, vec2(0.5));
      if(d>0.5) discard;
      gl_FragColor = vec4(0.2,0.8,0.7,0.9);
    }
  `;
  material = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, transparent: true });
  points = new THREE.Points(geometry, material);
  scene.add(points);

  window.addEventListener('resize', onWindowResize);
  animate();
}

function onWindowResize(){
  camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}

let t = 0;
function animate(){
  t += 0.005;
  const pos = geometry.attributes.position.array;
  for(let i=0;i<pos.length;i+=3){
    pos[i+1] += Math.sin(t + i)*0.2;
  }
  geometry.attributes.position.needsUpdate = true;
  points.rotation.y += 0.0008;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// fallback if module import blocked: simple canvas animation
function fallbackCanvas(){
  const c = document.createElement('canvas'); c.id='bg-fallback'; c.style.position='fixed'; c.style.inset='0'; c.style.zIndex='0'; document.body.appendChild(c);
  const ctx = c.getContext('2d');
  function resize(){ c.width = innerWidth; c.height = innerHeight; }
  addEventListener('resize', resize); resize();
  const pts = [];
  for(let i=0;i<120;i++) pts.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight, r:1+Math.random()*3, vx:(Math.random()-0.5)*0.4, vy:(Math.random()-0.5)*0.4});
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    const g = ctx.createLinearGradient(0,0,c.width,c.height);
    g.addColorStop(0,'rgba(51,227,166,0.06)'); g.addColorStop(1,'rgba(94,198,255,0.04)');
    ctx.fillStyle = g; ctx.fillRect(0,0,c.width,c.height);
    for(let p of pts){
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0) p.x=c.width; if(p.x>c.width) p.x=0; if(p.y<0) p.y=c.height; if(p.y>c.height) p.y=0;
      ctx.beginPath(); ctx.fillStyle='rgba(180,210,255,0.8)'; ctx.arc(p.x,p.y,p.r,0,6.28); ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// Try to init three, if module import blocked then fallback
try{ initThree(); }catch(e){ console.warn('three init failed',e); fallbackCanvas(); }

// Mini chat demo behavior
const miniLog = document.getElementById('mini-log');
const miniIn = document.getElementById('mini-in');
document.getElementById('mini-send').addEventListener('click', ()=>{
  const v = miniIn.value.trim(); if(!v) return; const d=document.createElement('div'); d.className='user'; d.textContent=v; miniLog.appendChild(d); miniIn.value='';
  setTimeout(()=>{ const reply = /earn|money|freelance|pais/i.test(v) ? 'Start ₹999 landing pages for local shops. Upsell logo + hosting.' : 'Nice! This is a demo UI — connect a real AI API later.'; const b=document.createElement('div'); b.className='bot'; b.textContent=reply; miniLog.appendChild(b); miniLog.scrollTop=miniLog.scrollHeight; },400);
});

// QR and compressor simplified (client-side simple patterns)
// QR: draw pattern on canvas based on text
const qrBtn = document.getElementById('qr-gen');
if(qrBtn){ qrBtn.addEventListener('click', ()=>{
  const text = document.getElementById('qr-text').value || 'krunal';
  const size = parseInt(document.getElementById('qr-size').value) || 240;
  const canvas = document.getElementById('qr-canvas'); canvas.width=size; canvas.height=size; const ctx = canvas.getContext('2d'); ctx.fillStyle='#fff'; ctx.fillRect(0,0,size,size); ctx.fillStyle='#001822';
  for(let y=0;y<33;y++){ for(let x=0;x<33;x++){ if((x*y + text.length + x*3 + y*7) % 7 < 3) ctx.fillRect(x*(size/33), y*(size/33), Math.ceil(size/33), Math.ceil(size/33)); } }
}});

// Image compressor (canvas) simplified
const imgIn = document.getElementById('img-file');
const imgCan = document.getElementById('img-canvas');
const imgCompress = document.getElementById('img-compress');
let loaded = new Image();
if(imgIn){ imgIn.addEventListener('change', e=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>{ loaded.onload=()=>{ const w=Math.min(900, loaded.width); const h=Math.round(loaded.height*(w/loaded.width)); imgCan.width=w; imgCan.height=h; const c=imgCan.getContext('2d'); c.drawImage(loaded,0,0,w,h); }; loaded.src = ev.target.result; }; r.readAsDataURL(f); }); }
if(imgCompress){ imgCompress.addEventListener('click', ()=>{ if(!loaded.src) return alert('Upload image first'); const q = parseFloat(document.getElementById('img-q').value||0.7); const url = imgCan.toDataURL('image/jpeg', q); const a=document.createElement('a'); a.href = url; a.download='compressed.jpg'; a.click(); }); }

// year
document.getElementById('year').textContent = new Date().getFullYear();
