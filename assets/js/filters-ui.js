// assets/js/filters-ui.js
// Gestion UI du panneau de filtres : ouverture, chips, boutons, loaders

(() => {
  // Selecteurs
  const panel = document.querySelector('#filters-panel');
  const toggleBtn = document.querySelector('#filters-toggle');
  const closeBtn = document.querySelector('#filters-close');
  const form = document.querySelector('#filters-form');
  const applyBtn = document.querySelector('#btn-apply');
  const resetBtn = document.querySelector('#btn-reset');
  const chipsContainer = document.querySelector('#filters-chips');
  const statusEl = document.querySelector('#filters-status');
  const loader = document.querySelector('#filters-loader');

  if (!panel || !form) return; // Si pas de panneau, exit

  let isDirty = false; // Si changements non appliqués

  // Événements ouverture/fermeture
  toggleBtn?.addEventListener('click', () => panel.classList.add('open'));
  closeBtn?.addEventListener('click', () => panel.classList.remove('open'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) panel.classList.remove('open');
  });

  // Initialiser état boutons
  const updateButtons = () => {
    applyBtn.disabled = !isDirty;
    resetBtn.disabled = Object.values(getFormValues()).every(v => !v);
  };

  // Écouter changements form
  form.addEventListener('input', () => {
    isDirty = true;
    updateButtons();
  });

  // Appliquer filtres
  applyBtn.addEventListener('click', () => {
    if (!isDirty) return;
    const filters = getFormValues();
    loader.classList.add('active');
    statusEl.textContent = 'Application des filtres...';
    document.dispatchEvent(new CustomEvent('filters:apply', { detail: filters }));
  });

  // Reset filtres
  resetBtn.addEventListener('click', () => {
    form.reset();
    chipsContainer.innerHTML = '';
    isDirty = false;
    updateButtons();
    statusEl.textContent = '';
    document.dispatchEvent(new CustomEvent('filters:reset'));
  });

  // Chips pour filtres actifs
  function addChip(key, value) {
    const chip = document.createElement('div');
    chip.classList.add('chip');
    chip.innerHTML = `<span>${key}: ${value}</span><button class="chip-remove" aria-label="Retirer">✕</button>`;
    chip.querySelector('.chip-remove').addEventListener('click', () => {
      removeFilter(key);
      chip.remove();
      isDirty = true;
      updateButtons();
    });
    chipsContainer.appendChild(chip);
  }

  // Retirer un filtre spécifique
  function removeFilter(key) {
    const input = form.querySelector(`[name="${key}"]`);
    if (input) input.value = '';
  }

  // Récupérer valeurs form
  function getFormValues() {
    const data = new FormData(form);
    return Object.fromEntries(data.entries());
  }

  // Événements custom depuis search-filters.js
  document.addEventListener('filters:updated', (e) => {
    chipsContainer.innerHTML = '';
    Object.entries(e.detail).forEach(([key, value]) => {
      if (value) addChip(key, value);
    });
    isDirty = false;
    updateButtons();
  });

  document.addEventListener('filters:results', (e) => {
    loader.classList.remove('active');
    statusEl.textContent = e.detail.total > 0 ? `${e.detail.total} résultats trouvés` : 'Aucun résultat';
  });

  document.addEventListener('filters:error', (e) => {
    loader.classList.remove('active');
    statusEl.textContent = e.detail.message || 'Erreur lors de la recherche';
  });

  // Initialiser sur desktop (ouvert)
  if (window.innerWidth > 920) panel.classList.add('open');

})();