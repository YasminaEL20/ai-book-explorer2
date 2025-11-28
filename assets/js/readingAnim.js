// assets/js/readingAnim.js
// Version finale : moderne, bleu/violet/marron, icônes flottantes en arrière-plan uniquement
(() => {
  // === 1. Fond qui respire doucement (bleu → violet → marron → bleu) ===
  const style = document.createElement('style');
  style.textContent = `
    @keyframes breath {
      0%   { background: linear-gradient(135deg, #0a0e19, #11151f); }
      33%  { background: linear-gradient(135deg, #1b0033, #2a0a4d); }
      66%  { background: linear-gradient(135deg, #2b1a15, #3d2a1f); }
      100% { background: linear-gradient(135deg, #0a0e19, #11151f); }
    }
    body {
      animation: breath 40s linear infinite;
    }

    /* Cartes et barre de recherche : glow doux mais discret pour rester lisibles */
    .search-inner, .card {
      position: relative;
      z-index: 10;
    }
    .card {
      background: rgba(22, 25, 31, 0.92);
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(79, 195, 247, 0.15);
      transition: all 0.4s ease;
    }
    .card:hover {
      box-shadow: 0 12px 45px rgba(138, 93, 255, 0.25);
      transform: translateY(-4px);
    }
  `;
  document.head.appendChild(style);

  // === 2. Canvas en arrière-plan (z-index négatif) ===
  const canvas = document.createElement('canvas');
  canvas.id = 'floatingBooks';
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    zIndex: -1,                    // bien en arrière-plan
    opacity: 0.6
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  window.addEventListener('resize', () => {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  });

  // === 3. Icônes de livres modernes (emojis propres et élégants) ===
  const icons = ['Open Book','Closed Book','Stack of Books','Scroll','Quill','Glasses','Coffee Mug','Reading Lamp','Bookmark','Candle'];

  const particles = Array.from({length: 28}, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    icon: icons[Math.floor(Math.random() * icons.length)],
    size: 32 + Math.random() * 28,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.25,
    hue: [210, 270, 30][Math.floor(Math.random() * 3)], // bleu, violet, marron
    alpha: 0.3 + Math.random() * 0.3,
    rotation: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.007
  }));

  let time = 0;
  function animate() {
    ctx.clearRect(0, 0, w, h);
    time += 0.008;

    particles.forEach(p => {
      // Mouvement doux + onde subtile
      p.x += p.vx + Math.sin(time + p.y * 0.003) * 0.4;
      p.y += p.vy + Math.cos(time + p.x * 0.003) * 0.3;
      p.rotation += p.vr;

      // Repousse doucement des zones centrales (barre de recherche + résultats)
      const centerY = h * 0.35;
      const resultY = h * 0.55;
      const distFromCenter = Math.abs(p.y - centerY);
      const distFromResults = Math.abs(p.y - resultY);

      if (distFromCenter < 180) p.y += (distFromCenter < 100 ? 1.2 : 0.6) * (p.y > centerY ? -1 : 1);
      if (distFromResults < 300) p.y += (distFromResults < 150 ? 1.5 : 0.8) * (p.y > resultY ? -1 : 1);

      // Wrap
      if (p.x < -100) p.x = w + 100;
      if (p.x > w + 100) p.x = -100;
      if (p.y < -100) p.y = h + 100;
      if (p.y > h + 100) p.y = -100;

      // Dessin
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      // Halo très doux
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 1.8);
      grad.addColorStop(0, `hsla(${p.hue}, 70%, 70%, 0.4)`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(-p.size * 1.5, -p.size * 1.5, p.size * 3, p.size * 3);

      // Icône
      ctx.font = `${p.size}px Georgia, serif`;
      ctx.fillStyle = `hsla(${p.hue}, 70%, 80%, ${p.alpha})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = `hsla(${p.hue}, 90%, 75%, 0.6)`;
      ctx.shadowBlur = 12;
      ctx.fillText(p.icon, 0, 0);

      ctx.restore();
    });

    requestAnimationFrame(animate);
  }
  animate();

})();