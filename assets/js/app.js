// app.js
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const statusEl = document.getElementById('status');
const resultsEl = document.getElementById('results');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

const detailModal = document.getElementById('detailModal');
const closeDetail = document.getElementById('closeDetail');
const detailContent = document.getElementById('detailContent');

let currentQuery = '';
let currentStartIndex = 0;
const MAX_RESULTS = 12;
let lastTotal = 0;

// event handlers
searchBtn.addEventListener('click', () => {
  const q = searchInput.value.trim();
  if(!q){ statusEl.textContent = "Veuillez entrer un mot-clé."; return; }
  searchBooks(q, 0);
});
searchInput.addEventListener('keydown', e => { if(e.key === 'Enter') searchBtn.click(); });

// pagination
prevBtn.addEventListener('click',()=> {
  if(currentStartIndex === 0) return;
  searchBooks(currentQuery, Math.max(0, currentStartIndex - MAX_RESULTS));
});
nextBtn.addEventListener('click',()=> {
  searchBooks(currentQuery, currentStartIndex + MAX_RESULTS);
});

// skeleton helper
function showSkeleton(n = 6){
  statusEl.textContent = "";
  resultsEl.innerHTML = Array.from({length: n}).map(()=>`
    <div class="skel-card skeleton">
      <div style="width:100px;height:140px;border-radius:8px"></div>
      <div style="flex:1">
        <div style="height:18px;width:50%;border-radius:8px;margin-bottom:10px"></div>
        <div style="height:12px;width:70%;border-radius:8px;margin-bottom:6px"></div>
        <div style="height:12px;width:45%;border-radius:8px"></div>
      </div>
    </div>`).join('');
}

// search + fetch
async function searchBooks(query, startIndex = 0){
  currentQuery = query;
  currentStartIndex = startIndex;
  showSkeleton(5);
  statusEl.textContent = "Chargement…";
  resultsEl.scrollIntoView({behavior: "smooth", block:"start"});
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${MAX_RESULTS}`;
  try {
    const res = await fetch(url);
    if(!res.ok) throw new Error('Erreur réseau');
    const data = await res.json();
    const items = data.items || [];
    lastTotal = data.totalItems || 0;
    if(items.length === 0){
      statusEl.textContent = "Aucun résultat.";
      resultsEl.innerHTML = "";
      updatePagination(0);
      return;
    }
    statusEl.textContent = "";
    renderResults(items);
    updatePagination(lastTotal);
  } catch (err){
    console.error(err);
    statusEl.textContent = "Erreur lors du chargement. Réessayez.";
    resultsEl.innerHTML = "";
  }
}

// render results and attach listeners
function renderResults(items){
  resultsEl.innerHTML = items.map(it => {
    const info = it.volumeInfo || {};
    const title = escapeHtml(info.title || 'Sans titre');
    const authors = escapeHtml((info.authors || ['Auteur inconnu']).join(', '));
    const date = escapeHtml(info.publishedDate || '');
    const thumb = info.imageLinks?.thumbnail || 'assets/img/placeholder.png';

    return `<article class="card">
      <div class="thumb"><img data-src="${thumb}" alt="${title}"></div>
      <div class="card-body">
        <h3>${title}</h3>
        <p class="meta">${authors} • ${date}</p>
        <p>${escapeHtml((info.description || '').slice(0,180))}</p>
        <div class="detail-wrap">
          <button class="btn primary detailBtn" data-id="${it.id}">Voir détails</button>
        </div>
      </div>
    </article>`;
  }).join('');

  // lazy load images and stagger reveal
  initLazyImages();
  revealCardsStagger();

  // attach detail listeners
  document.querySelectorAll('.detailBtn').forEach(btn=>{
    btn.addEventListener('click', ()=> showBookDetail(btn.dataset.id));
  });
}

// lazy images
function initLazyImages(){
  const images = document.querySelectorAll('img[data-src]');
  images.forEach(img => {
    const srcRaw = img.dataset.src || '';
    if (!srcRaw) {
      img.src = 'assets/img/placeholder.png';
      img.classList.add('loaded');
      return;
    }

    // Forcer https si nécessaire (évite mixed-content)
    let src = srcRaw.replace(/^http:\/\//i, 'https://');

    // Précharger dans un objet Image pour gérer erreurs / fallback
    const tmp = new Image();
    tmp.onload = () => {
      img.src = src;
      img.classList.add('loaded');
    };
    tmp.onerror = () => {
      // fallback local (assure-toi que le fichier existe)
      img.src = 'assets/img/placeholder.png';
      img.classList.add('loaded');
      console.warn('Image failed to load, using placeholder for:', src);
    };

    // petit délai pour laisser l'effet stagger si tu veux
    setTimeout(() => {
      tmp.src = src;
    }, 60);
  });
}

// stagger reveal
function revealCardsStagger(){
  const cards = document.querySelectorAll('.card');
  cards.forEach((c, i) => {
    setTimeout(()=> c.classList.add('show'), i * 80);
  });
}

// modal
async function showBookDetail(id){
  detailContent.innerHTML = '<p>Chargement…</p>';
  detailModal.classList.add('open'); detailModal.setAttribute('aria-hidden','false');
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
    const data = await res.json();
    const info = data.volumeInfo || {};
    detailContent.innerHTML = `
      <h2>${escapeHtml(info.title || 'Sans titre')}</h2>
      <p><strong>Auteurs:</strong> ${escapeHtml((info.authors||[]).join(', '))}</p>
      <p><strong>Editeur:</strong> ${escapeHtml(info.publisher||'')}</p>
      <p><strong>Date:</strong> ${escapeHtml(info.publishedDate||'')}</p>
      <p>${escapeHtml(info.description || 'Pas de description')}</p>
      <p><a href="${info.previewLink||'#'}" target="_blank" rel="noopener">Voir preview</a></p>
    `;
  } catch (e){
    detailContent.innerHTML = '<p>Impossible de charger les détails.</p>';
  }
}
function closeModal(){
  detailModal.classList.remove('open');
  detailModal.setAttribute('aria-hidden','true');
}
document.querySelector('[data-close]')?.addEventListener('click', closeModal);
closeDetail?.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

// pagination UI
function updatePagination(total){
  const currentPage = Math.floor(currentStartIndex / MAX_RESULTS) + 1;
  const totalPages = Math.ceil(total / MAX_RESULTS) || 1;
  pageInfo.textContent = `${currentPage} / ${totalPages}`;
  prevBtn.disabled = currentStartIndex === 0;
  nextBtn.disabled = (currentStartIndex + MAX_RESULTS) >= total;
}

// small util
function escapeHtml(s=''){ return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

// Optional: initial demo content (you can remove)
// showSkeleton(4);

// If user wants to pre-populate with a sample query on load, uncomment:
// searchBooks('robots', 0);