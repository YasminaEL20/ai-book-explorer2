// assets/js/readingAnim.js
// Poussière dorée/bleutée + petites étoiles scintillantes – version finale parfaite
(() => {
  const style = document.createElement('style');
  style.textContent = `
    body { background: #0a0d14 !important; }
    .card {
      background: rgba(20, 24, 32, 0.96) !important;
      backdrop-filter: blur(12px);
      border: 1px solid rgba(100, 120, 160, 0.12);
    }
  `;
  document.head.appendChild(style);

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '-1';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;

  window.addEventListener('resize', () => {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  });

  // === 1. Poussière dorée et bleutée (comme avant) ===
  const dust = Array.from({length: 160}, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: 0.8 + Math.random() * 1.6,
    speedY: 0.15 + Math.random() * 0.3,
    speedX: (Math.random() - 0.5) * 0.25,
    opacity: 0.18 + Math.random() * 0.3,
    color: Math.random() > 0.5 ? '#e8d4b0' : '#a0c4ff',
    swayPhase: Math.random() * Math.PI * 2
  }));

  // === 2. Petites étoiles scintillantes (nouveau !) ===
  const stars = Array.from({length: 60}, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: 0.8 + Math.random() * 1.2,
    twinkleSpeed: 0.02 + Math.random() * 0.04,
    phase: Math.random() * Math.PI * 2
  }));

  let time = 0;
  function animate() {
    ctx.clearRect(0, 0, w, h);
    time += 0.01;

    // --- Dessin de la poussière ---
    dust.forEach(p => {
      p.x += p.speedX + Math.sin(time + p.swayPhase) * 0.4;
      p.y += p.speedY;

      if (p.y > h + 20) {
        p.y = -20;
        p.x = Math.random() * w;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    });

    // --- Dessin des étoiles scintillantes ---
    stars.forEach(s => {
      const brightness = 0.3 + 0.7 * Math.sin(time * s.twinkleSpeed * 100 + s.phase);
      ctx.globalAlpha = brightness;
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ffffff';

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.shadowBlur = 0; // reset shadow
    requestAnimationFrame(animate);
  }

  animate();
})();