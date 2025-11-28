/* assets/js/anim.js
  Animations: parallax bg, tilt on cards, flip covers, reveal on scroll, search micro-interactions.
  Inclure <script src="assets/js/anim.js" defer></script> APRES app.js ou le mettre dedans.
*/

(() => {
  // helpers
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const debounce = (fn, wait=200) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(()=>fn(...args), wait); };
  };

  // 1) Reveal header hero (fade-in)
  const header = document.querySelector('.center-header');
  if(header){
    requestAnimationFrame(()=> header.classList.add('visible'));
  }

  // 2) BG Parallax: move bg-layer slightly on mouse
  const bgLayer = document.querySelector('.bg-layer');
  if(bgLayer){
    window.addEventListener('mousemove', (e) => {
      // normalized -1..1
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      const tx = nx * 10; // px
      const ty = ny * 8;
      bgLayer.style.transform = `translate(${tx}px, ${ty}px) rotate(${nx * 1.2}deg)`;
    });
  }

  // 3) IntersectionObserver: reveal cards on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if(ent.isIntersecting){
        ent.target.classList.add('show');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.card').forEach(c => observer.observe(c));

  // 4) Tilt effect on .book-card
  function attachTilt(card){
    const rect = () => card.getBoundingClientRect();
    const onMove = (e) => {
      const r = rect();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dx = (e.clientX - cx);
      const dy = (e.clientY - cy);
      const ry = clamp(dx / (r.width/2), -1, 1) * 6; // rotateY range
      const rx = clamp(-dy / (r.height/2), -1, 1) * 6; // rotateX range
      card.style.setProperty('--ry', ry + 'deg');
      card.style.setProperty('--rx', rx + 'deg');
      // reflect in transform (small)
      card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    };
    const reset = () => {
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--rx', '0deg');
      card.style.transform = '';
    };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', reset);
    card.addEventListener('blur', reset);
  }

  document.querySelectorAll('.book-card').forEach(attachTilt);

  // 5) Flip cover on click / Enter key
  function attachFlip(card) {
    const coverInner = card.querySelector('.cover-inner');
    if(!coverInner) return;
    const toggle = () => card.classList.toggle('is-flipped');
    card.addEventListener('click', (e) => {
      // avoid flipping when clicking open-detail buttons (they have their own action)
      if(e.target.closest('.open-detail') || e.target.closest('.read-sample')) return;
      toggle();
    });
    // keyboard accessible
    card.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  }
  document.querySelectorAll('.book-card').forEach(attachFlip);

  // 6) Search micro-interactions and "animate results" (simulate)
  const searchInput = $('#searchInput');
  const searchBtn = $('#searchBtn');
  const searchInner = document.querySelector('.search-inner');
  const resultsEl = $('#results');

  function showLoading(state=true){
    if(state) searchInner.classList.add('loading');
    else searchInner.classList.remove('loading');
  }

  function shakeSearch(){
    searchInner.classList.add('shake');
    setTimeout(()=> searchInner.classList.remove('shake'), 600);
  }

  function renderFakeResults(query){
    // simple fake animation: clear, show skeleton, then populate
    resultsEl.innerHTML = '';
    // create skeletons
    for(let i=0;i<3;i++){
      const sk = document.createElement('div');
      sk.className = 'skel-card skeleton';
      sk.style.height = '110px';
      resultsEl.appendChild(sk);
    }
    // simulate load
    setTimeout(()=> {
      resultsEl.innerHTML = '';
      // create 3 demo cards — adapt/data-binding to your API in real project
      for(let i=1;i<=3;i++){
        const el = document.createElement('article');
        el.className = 'card book-card';
        el.tabIndex = 0;
        el.innerHTML = `
          <div class="thumb book-cover">
            <div class="cover-inner">
              <div class="front"><img src="assets/img/sample-book-front.jpg" alt="Book ${i}"/></div>
              <div class="back"><div class="back-content"><h4>Résumé</h4><p>Courte description ${i}</p><button class="btn primary open-detail">Voir détails</button></div></div>
            </div>
          </div>
          <div class="card-body">
            <h3 class="book-title">${query} — Book ${i}</h3>
            <p class="book-meta">Auteur • 2024</p>
            <p class="book-desc">Extrait d'une ligne pour donner envie...</p>
            <div class="detail-wrap">
              <button class="btn ghost read-sample">Lire un extrait</button>
              <button class="btn primary open-detail">Voir détails</button>
            </div>
          </div>
        `;
        resultsEl.appendChild(el);
        // small delay to show reveal animation
        setTimeout(()=> el.classList.add('show'), 50 + i*80);
        // attach interactions
        attachTilt(el);
        attachFlip(el);
      }
    }, 650);
  }

  // Debounced handler for submit
  const doSearch = debounce((q) => {
    if(!q || q.trim().length < 1) {
      // shake when empty
      shakeSearch();
      showLoading(false);
      return;
    }
    showLoading(true);
    // simulate real search -> replace by your API call
    setTimeout(()=> {
      showLoading(false);
      renderFakeResults(q.trim());
    }, 350);
  }, 220);

  // UI events
  if(searchBtn){
    searchBtn.addEventListener('click', (e) => {
      const q = searchInput.value ?? '';
      doSearch(q);
    });
  }
  if(searchInput){
    searchInput.addEventListener('keydown', (e) => {
      if(e.key === 'Enter') {
        e.preventDefault();
        doSearch(searchInput.value);
      } else {
        // live suggestion animations can be added here (debounced)
      }
    });
  }

  // 7) open-detail button: open modal (if you have modal logic in app.js)
  document.addEventListener('click', (e) => {
    const det = e.target.closest('.open-detail');
    if(!det) return;
    const card = e.target.closest('.book-card') || e.target.closest('.card');
    if(!card) return;
    // reuse existing modal elements (detailModal, detailContent)
    const modal = document.getElementById('detailModal');
    const detailContent = document.getElementById('detailContent');
    if(modal && detailContent){
      const title = card.querySelector('.book-title')?.textContent || card.dataset.title || 'Détails';
      const meta = card.querySelector('.book-meta')?.textContent || '';
      const desc = card.querySelector('.book-desc')?.textContent || '';
      detailContent.innerHTML = `<h2>${title}</h2><p class="muted">${meta}</p><p>${desc}</p>`;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden','false');
      // focus trap simple
      modal.querySelector('.close')?.focus();
    }
  });

  // close modal logic (simple)
  document.addEventListener('click', e => {
    if(e.target.matches('.modal-backdrop') || e.target.matches('#closeDetail') || e.target.closest('#closeDetail')) {
      const modal = document.getElementById('detailModal');
      if(modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden','true');
      }
    }
  });

  // Accessibility: close modal on ESC
  window.addEventListener('keydown', e => {
    if(e.key === 'Escape') {
      const modal = document.getElementById('detailModal');
      if(modal && modal.classList.contains('open')) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden','true');
      }
    }
  });

})();
