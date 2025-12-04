// assets/js/app.js
// Merged: search app logic + sample loaders for charts

/* -------------------------
   Sample data (charts demos)
   ------------------------- */
const sampleItems = [
  { volumeInfo: { title: "Livre A", publishedDate: "2017-03-10" } },
  { volumeInfo: { title: "Livre B", publishedDate: "2018" } },
  { volumeInfo: { title: "Livre C", publishedDate: "2018-11-02" } },
  { volumeInfo: { title: "Livre D", publishedDate: "2019-01-01" } },
  { volumeInfo: { title: "Livre E", publishedDate: "2019-05-15" } },
  { volumeInfo: { title: "Livre F", publishedDate: "2020-07-07" } },
  { volumeInfo: { title: "Livre G", publishedDate: "2020-12-12" } },
  { volumeInfo: { title: "Livre H", publishedDate: "2021" } }
];

const sampleItemsAuthors = [
  { volumeInfo:{ authors:["Alice","Bob"], title:"A" } },
  { volumeInfo:{ authors:["Alice"], title:"B" } },
  { volumeInfo:{ authors:["Clara"], title:"C" } },
  { volumeInfo:{ authors:["Bob","Alice"], title:"D" } },
  { volumeInfo:{ authors:["Denis"], title:"E" } },
  { volumeInfo:{ authors:["Alice"], title:"F" } }
];

/* -------------------------
   Main search app variables
   ------------------------- */
const MAX_RESULTS = 12;
let currentQuery = '';
let currentStartIndex = 0;
let lastTotal = 0;

/* Element refs (may be null if page doesn't include them) */
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

/* -------------------------
   Utils
   ------------------------- */
function escapeHtml(s=''){ return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

/* -------------------------
   Skeleton / UI helpers
   ------------------------- */
function showSkeleton(n = 6){
  if(!resultsEl) return;
  statusEl && (statusEl.textContent = "");
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

/* -------------------------
   Search + fetch
   ------------------------- */
async function searchBooks(query, startIndex = 0){
  currentQuery = query;
  currentStartIndex = startIndex;
  if(!resultsEl) return;
  showSkeleton(5);
  statusEl && (statusEl.textContent = "Chargement…");
  try {
    resultsEl.scrollIntoView({behavior: "smooth", block:"start"});
  } catch(e){ /* ignore if not scrollable */ }

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${MAX_RESULTS}`;
  try {
    const res = await fetch(url);
    if(!res.ok) throw new Error('Erreur réseau');
    const data = await res.json();
    const items = data.items || [];
    lastTotal = data.totalItems || 0;
    if(items.length === 0){
      statusEl && (statusEl.textContent = "Aucun résultat.");
      resultsEl.innerHTML = "";
      updatePagination(0);
      return;
    }
    statusEl && (statusEl.textContent = "");
    renderResults(items);
    updatePagination(lastTotal);
  } catch (err){
    console.error(err);
    statusEl && (statusEl.textContent = "Erreur lors du chargement. Réessayez.");
    if(resultsEl) resultsEl.innerHTML = "";
  }
}

/* -------------------------
   Render results and helpers
   ------------------------- */
function renderResults(items){
  if(!resultsEl) return;
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

function initLazyImages(){
  const images = document.querySelectorAll('img[data-src]');
  images.forEach(img => {
    const srcRaw = img.dataset.src || '';
    if (!srcRaw) {
      img.src = 'assets/img/placeholder.png';
      img.classList.add('loaded');
      return;
    }
    let src = srcRaw.replace(/^http:\/\//i, 'https://');
    const tmp = new Image();
    tmp.onload = () => {
      img.src = src;
      img.classList.add('loaded');
    };
    tmp.onerror = () => {
      img.src = 'assets/img/placeholder.png';
      img.classList.add('loaded');
      console.warn('Image failed to load, using placeholder for:', src);
    };
    setTimeout(() => { tmp.src = src; }, 60);
  });
}

function revealCardsStagger(){
  const cards = document.querySelectorAll('.card');
  cards.forEach((c, i) => {
    setTimeout(()=> c.classList.add('show'), i * 80);
  });
}

/* -------------------------
   Modal / detail
   ------------------------- */
async function showBookDetail(id){
  if(!detailContent || !detailModal) return;
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
  if(!detailModal) return;
  detailModal.classList.remove('open');
  detailModal.setAttribute('aria-hidden','true');
}

/* -------------------------
   Pagination UI
   ------------------------- */
function updatePagination(total){
  if(!pageInfo || !prevBtn || !nextBtn) return;
  const currentPage = Math.floor(currentStartIndex / MAX_RESULTS) + 1;
  const totalPages = Math.ceil(total / MAX_RESULTS) || 1;
  pageInfo.textContent = `${currentPage} / ${totalPages}`;
  prevBtn.disabled = currentStartIndex === 0;
  nextBtn.disabled = (currentStartIndex + MAX_RESULTS) >= total;
}

/* -------------------------
   Boot / Event wiring on DOM ready
   ------------------------- */
window.addEventListener('load', () => {
  // wire search controls if present
  if(searchBtn && searchInput){
    searchBtn.addEventListener('click', () => {
      const q = searchInput.value.trim();
      if(!q){ statusEl && (statusEl.textContent = "Veuillez entrer un mot-clé."); return; }
      searchBooks(q, 0);
    });
    searchInput.addEventListener('keydown', e => { if(e.key === 'Enter') searchBtn.click(); });
  }

  // pagination buttons
  if(prevBtn){
    prevBtn.addEventListener('click', ()=> {
      if(currentStartIndex === 0) return;
      searchBooks(currentQuery, Math.max(0, currentStartIndex - MAX_RESULTS));
    });
  }
  if(nextBtn){
    nextBtn.addEventListener('click', ()=> {
      searchBooks(currentQuery, currentStartIndex + MAX_RESULTS);
    });
  }

  // modal close wiring (if elements exist)
  document.querySelector('[data-close]')?.addEventListener('click', closeModal);
  closeDetail?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

  // sample buttons for charts (if present)
  const btn = document.getElementById('load-sample');
  if (btn) {
    btn.addEventListener('click', () => {
      if (typeof window.updateTimelineFromItems === 'function') {
        window.updateTimelineFromItems(sampleItems);
      } else {
        console.warn('updateTimelineFromItems non défini');
      }
    });
  }

  const btnAuth = document.getElementById('load-sample-authors');
  if (btnAuth) {
    btnAuth.addEventListener('click', () => {
      if (typeof window.updateTopAuthors === 'function') {
        window.updateTopAuthors(sampleItemsAuthors);
      } else {
        console.warn('updateTopAuthors non défini');
      }
    });
  }
});
