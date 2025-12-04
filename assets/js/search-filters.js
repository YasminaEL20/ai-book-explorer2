// assets/js/search-filters.js
// Logique des filtres : lecture form, requête API, filtrage client, intégration pagination

(() => {
  let currentFilters = {};
  let currentStartIndex = 0;
  const MAX_RESULTS = 12; // Doit matcher app.js
  let totalItems = 0;

  // Debounce util
  const debounce = (fn, delay = 500) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  // Écouter apply
  document.addEventListener('filters:apply', (e) => {
    currentFilters = e.detail;
    currentStartIndex = 0;
    searchWithFilters();
    sessionStorage.setItem('currentFilters', JSON.stringify(currentFilters));
    document.dispatchEvent(new CustomEvent('filters:updated', { detail: currentFilters }));
  });

  // Écouter reset
  document.addEventListener('filters:reset', () => {
    currentFilters = {};
    currentStartIndex = 0;
    searchWithFilters();
    sessionStorage.removeItem('currentFilters');
    document.dispatchEvent(new CustomEvent('filters:updated', { detail: currentFilters }));
  });

  // Fonction principale de recherche avec filtres
  async function searchWithFilters() {
    const q = document.getElementById('searchInput').value.trim();
    if (!q) return;

    try {
      // Construire params API Google Books
      let params = `q=${encodeURIComponent(q)}&startIndex=${currentStartIndex}&maxResults=${MAX_RESULTS}`;
      if (currentFilters.author) params += `&inauthor=${encodeURIComponent(currentFilters.author)}`;
      if (currentFilters.category) params += `&subject=${encodeURIComponent(currentFilters.category)}`;
      if (currentFilters.type) params += `&printType=${currentFilters.type}`;
      if (currentFilters.rating) params += `&orderBy=relevance`; // Pas direct, filtrer client après

      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?${params}`);
      const data = await response.json();

      let items = data.items || [];

      // Filtrage client : année et rating (pas supporté natif par API)
      if (currentFilters.year) {
        const year = parseInt(currentFilters.year);
        items = items.filter(item => {
          const pubYear = item.volumeInfo.publishedDate ? parseInt(item.volumeInfo.publishedDate.slice(0, 4)) : null;
          return pubYear && pubYear >= year;
        });
      }
      if (currentFilters.rating) {
        const minRating = parseFloat(currentFilters.rating);
        items = items.filter(item => (item.volumeInfo.averageRating || 0) >= minRating);
      }

      totalItems = items.length ? data.totalItems : 0; // Approximation, car filtrage client
      updateResults(items);
      updatePagination(totalItems);

      document.dispatchEvent(new CustomEvent('filters:results', { detail: { total: totalItems } }));
    } catch (err) {
      document.dispatchEvent(new CustomEvent('filters:error', { detail: { message: 'Erreur de recherche' } }));
    }
  }

  // Intégrer avec pagination (remplace listeners de app.js)
  document.getElementById('prevBtn').addEventListener('click', () => {
    currentStartIndex = Math.max(0, currentStartIndex - MAX_RESULTS);
    searchWithFilters();
  });

  document.getElementById('nextBtn').addEventListener('click', () => {
    currentStartIndex += MAX_RESULTS;
    searchWithFilters();
  });

  // Mettre à jour résultats (adapter à ton rendu dans app.js)
  function updateResults(items) {
    const resultsEl = document.getElementById('results');
    resultsEl.innerHTML = ''; // Clear
    if (items.length === 0) {
      resultsEl.innerHTML = '<p>Aucun résultat trouvé.</p>';
      return;
    }
    items.forEach(item => {
      const vol = item.volumeInfo;
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <img src="${vol.imageLinks?.thumbnail || 'placeholder.jpg'}" alt="${vol.title}">
        <h3>${vol.title}</h3>
        <p>${(vol.authors || []).join(', ')}</p>
        <p>${vol.publishedDate}</p>
        <button onclick="showDetail('${item.id}')">Détails</button>
      `;
      resultsEl.appendChild(card);
    });
  }

  // Update pagination (comme dans app.js)
  function updatePagination(total) {
    const pageInfo = document.getElementById('pageInfo');
    const currentPage = Math.floor(currentStartIndex / MAX_RESULTS) + 1;
    const totalPages = Math.ceil(total / MAX_RESULTS);
    pageInfo.textContent = `${currentPage} / ${totalPages}`;
    document.getElementById('prevBtn').disabled = currentStartIndex === 0;
    document.getElementById('nextBtn').disabled = currentStartIndex + MAX_RESULTS >= total;
  }

  // Restauration depuis sessionStorage
  const savedFilters = JSON.parse(sessionStorage.getItem('currentFilters'));
  if (savedFilters) {
    currentFilters = savedFilters;
    Object.entries(savedFilters).forEach(([key, value]) => {
      const input = document.querySelector(`[name="${key}"]`);
      if (input) input.value = value;
    });
    document.dispatchEvent(new CustomEvent('filters:updated', { detail: currentFilters }));
  }

})();