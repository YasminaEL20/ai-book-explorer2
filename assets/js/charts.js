// --- countTopAuthors(items) ---
// Retourne { labels: [...authors], values: [...counts] } (top 5)
function countTopAuthors(items) {
  if (!Array.isArray(items)) return { labels: [], values: [] };
  const map = Object.create(null);

  items.forEach(it => {
    const authors = it?.volumeInfo?.authors;
    if (!authors) return;
    // authors peut être un tableau ; on incrémente chaque nom
    authors.forEach(a => {
      const name = String(a).trim();
      if (!name) return;
      map[name] = (map[name] || 0) + 1;
    });
  });

  // transformer en array triée desc et prendre top 5
  const sorted = Object.keys(map)
    .map(name => ({ name, count: map[name] }))
    .sort((a,b) => b.count - a.count)
    .slice(0, 5);

  const labels = sorted.map(s => s.name);
  const values = sorted.map(s => s.count);
  return { labels, values };
}

// --- top authors chart management ---
let topAuthorsChart = null;

function createOrUpdateTopAuthorsChart(canvasEl, labels = [], values = [], type = 'bar') {
  if (!canvasEl) return;
  if (topAuthorsChart) {
    if (topAuthorsChart.config.type !== type) {
      topAuthorsChart.destroy();
      topAuthorsChart = null;
    } else {
      topAuthorsChart.data.labels = labels;
      topAuthorsChart.data.datasets[0].data = values;
      topAuthorsChart.update();
      return topAuthorsChart;
    }
  }

  const ctx = canvasEl.getContext('2d');
  const cfg = {
    type,
    data: {
      labels,
      datasets: [{
        label: 'Nombre d\'occurrences',
        data: values,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true } }
    }
  };

  topAuthorsChart = new Chart(ctx, cfg);
  return topAuthorsChart;
}

function updateTopAuthors(items, options = {}) {
  const { labels, values } = countTopAuthors(items);
  const canvas = document.getElementById('topAuthorsChart');
  if (!canvas) { console.warn('topAuthorsChart introuvable'); return; }
  const select = document.getElementById('authors-chart-type');
  const type = options.type || (select ? select.value : 'bar');
  createOrUpdateTopAuthorsChart(canvas, labels, values, type);
}

// exposer globalement pour que app.js / la recherche puissent appeler:
window.updateTopAuthors = updateTopAuthors;

// hook pour le contrôle (si la page charge ce script)
window.addEventListener('load', () => {
  const select = document.getElementById('authors-chart-type');
  const canvas = document.getElementById('topAuthorsChart');
  if (select && canvas) {
    select.addEventListener('change', () => {
      if (!topAuthorsChart) return;
      const labels = topAuthorsChart.data.labels || [];
      const values = topAuthorsChart.data.datasets?.[0].data || [];
      createOrUpdateTopAuthorsChart(canvas, labels, values, select.value);
    });
  }
});
