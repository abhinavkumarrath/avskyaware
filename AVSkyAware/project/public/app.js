// Mobile menu
const burger = document.getElementById('burger');
const links = document.querySelector('.links');
burger.addEventListener('click', ()=>{
  burger.classList.toggle('open');
  links.classList.toggle('open');
});

// Stars
const stars = document.getElementById('stars');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const STAR_COUNT = prefersReduced ? 90 : Math.min(240, Math.floor(window.innerWidth/4));
for (let i=0;i<STAR_COUNT;i++){
  const s = document.createElement('span');
  s.className = 'star';
  const size = Math.random()*2 + .6;
  s.style.width = size+'px';
  s.style.height = size+'px';
  s.style.left = (Math.random()*100)+'%';
  s.style.top = (Math.random()*100)+'%';
  s.style.animationDuration = (Math.random()*5 + 3) + 's';
  s.style.animationDelay = (Math.random()*6) + 's';
  stars.appendChild(s);
}

// Nebula parallax (2D canvas, GPU-friendly)
const nebula = document.getElementById('nebula');
const ctx = nebula.getContext('2d');
let w,h,cx,cy,t=0, dpr=1;

const blobs = [
  {x:.24,y:.30,r:240, c:'rgba(126,200,227,.35)', speed:.4},
  {x:.72,y:.22,r:300, c:'rgba(138,245,212,.30)', speed:.3},
  {x:.46,y:.78,r:260, c:'rgba(120,160,255,.25)', speed:.5},
];

function resize(){
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = nebula.width = Math.floor(innerWidth * dpr);
  h = nebula.height = Math.floor(innerHeight * dpr);
  nebula.style.width = innerWidth+'px';
  nebula.style.height = innerHeight+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  cx = innerWidth/2; cy = innerHeight/2;
}
resize(); addEventListener('resize', resize, {passive:true});

let mx=cx, my=cy;
function onMove(e){ const p = e.touches ? e.touches[0] : e; mx=p.clientX; my=p.clientY; }
addEventListener('mousemove', onMove, {passive:true});
addEventListener('touchmove', onMove, {passive:true});

function draw(){
  if (!prefersReduced) requestAnimationFrame(draw);
  else setTimeout(draw, 60);

  t += .006;

  const g = ctx.createRadialGradient(cx, cy*.6, 80, cx, cy, Math.max(cx,cy));
  g.addColorStop(0,'#060b1a'); g.addColorStop(1,'#050814');
  ctx.fillStyle=g; ctx.fillRect(0,0,innerWidth, innerHeight);

  blobs.forEach((b,i)=>{
    const px = b.x*innerWidth + (mx-cx)*0.02*(i+1);
    const py = b.y*innerHeight + (my-cy)*0.02*(i+1);
    const r  = b.r + Math.sin(t*b.speed + i)*8;
    const grad = ctx.createRadialGradient(px, py, 20, px, py, r);
    grad.addColorStop(0, b.c); grad.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(px,py,r,0,Math.PI*2); ctx.fill();
  });
}
draw();
