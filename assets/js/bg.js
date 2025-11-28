// bg.js : particles + subtle parallax
(() => {
  const canvas = document.getElementById('bgParticles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = innerWidth, h = innerHeight;
  function resize(){ w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
  resize(); window.addEventListener('resize', resize);

  // create light particles
  const particles = Array.from({length: 30}, () => ({
    x: Math.random()*w, y: Math.random()*h,
    r: 0.6 + Math.random()*1.8,
    vx: (Math.random()-0.5)*0.05, vy: (Math.random()-0.5)*0.05,
    alpha: 0.03 + Math.random()*0.06
  }));

  function frame(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x < -10) p.x = w + 10;
      if(p.x > w + 10) p.x = -10;
      if(p.y < -10) p.y = h + 10;
      if(p.y > h + 10) p.y = -10;
      ctx.beginPath();
      ctx.fillStyle = `rgba(127,219,255,${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // subtle parallax by pointer
  const bg = document.querySelector('.bg-layer');
  if(bg){
    window.addEventListener('pointermove', e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * 4;
      bg.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }, {passive:true});
  }
})();
