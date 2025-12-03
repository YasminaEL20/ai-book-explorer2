// assets/js/charts.js
// Charts utilities for timeline (books per year) and top authors
// Expose: window.updateTimelineFromItems(items), window.updateTopAuthors(items)

//
// helpers
//
function safeSliceYear(pub) {
  if (!pub) return null;
  const s = String(pub).slice(0, 4);
  return /^\d{4}$/.test(s) ? s : null;
}

//
// TIMELINE (books per year)
//
function buildYearCounts(items) {
  if (!Array.isArray(items)) return { labels: [], values: [] };
  const counts = Object.create(null);

  items.forEach(it => {
    const pub = it && it.volumeInfo && it.volumeInfo.publishedDate;
    const year = safeSliceYear(pub);
    if (!year) return;
    counts[year] = (counts[year] || 0) + 1;
  });

  const years = Object.keys(counts).sort((a, b) => Number(a) - Number(b));
  const values = years.map(y => counts[y]);
  return { labels: years, values };
}

let timelineChart = null;

function createOrUpdateTimelineChart(canvasEl, labels = [], values = [], type = 'line') {
  if (!canvasEl) return;
  if (timelineChart) {
    if (timelineChart.config.type !== type) {
      timelineChart.destroy();
      timelineChart = null;
    } else {
      timelineChart.data.labels = labels;
      timelineChart.data.datasets[0].data = values;
      timelineChart.update();
      return timelineChart;
    }
  }

  const ctx = canvasEl.getContext('2d');
  const cfg = {
    type: type,
    data: {
      labels: labels,
      datasets: [{
        label: 'Nombre de livres',
        data: values,
        fill: false,
        tension: 0.3,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: 'Année' } },
        y: { beginAtZero: true, title: { display: true, text: 'Nombre' }, ticks: { precision: 0 } }
      },
      plugins: { legend: { display: true } }
    }
  };
  timelineChart = new Chart(ctx, cfg);
  return timelineChart;
}

function updateTimelineFromItems(items, options = {}) {
  const { labels, values } = buildYearCounts(items);
  const canvas = document.getElementById('timelineChart');
  if (!canvas) {
    console.warn('timelineChart canvas introuvable');
    return;
  }
  const select = document.getElementById('chart-type');
  const type = options.type || (select ? select.value : 'line');
  createOrUpdateTimelineChart(canvas, labels, values, type);
}

window.updateTimelineFromItems = updateTimelineFromItems;

//
// TOP AUTHORS
//
function countTopAuthors(items) {
  if (!Array.isArray(items)) return { labels: [], values: [] };
  const map = Object.create(null);

  items.forEach(it => {
    const authors = it?.volumeInfo?.authors;
    if (!authors) return;
    authors.forEach(a => {
      const name = String(a).trim();
      if (!name) return;
      map[name] = (map[name] || 0) + 1;
    });
  });

  const sorted = Object.keys(map)
    .map(name => ({ name, count: map[name] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const labels = sorted.map(s => s.name);
  const values = sorted.map(s => s.count);
  return { labels, values };
}

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
        label: "Nombre d'occurrences",
        data: values,
        borderWidth: 1,
        backgroundColor: undefined // Chart.js will pick default colors
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: 'Auteur' } },
        y: { beginAtZero: true, title: { display: true, text: 'Occurrences' }, ticks: { precision: 0 } }
      },
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

window.updateTopAuthors = updateTopAuthors;

//
// initial UI hookups for selects & default empty charts
//
window.addEventListener('load', () => {
  // timeline init
  const tCanvas = document.getElementById('timelineChart');
  if (tCanvas) createOrUpdateTimelineChart(tCanvas, [], [], 'line');
  const tSelect = document.getElementById('chart-type');
  if (tSelect && tCanvas) {
    tSelect.addEventListener('change', () => {
      if (!timelineChart) return;
      const labels = timelineChart.data.labels || [];
      const values = timelineChart.data.datasets?.[0].data || [];
      createOrUpdateTimelineChart(tCanvas, labels, values, tSelect.value);
    });
  }

  // top authors init
  const aCanvas = document.getElementById('topAuthorsChart');
  if (aCanvas) createOrUpdateTopAuthorsChart(aCanvas, [], [], 'bar');
  const aSelect = document.getElementById('authors-chart-type');
  if (aSelect && aCanvas) {
    aSelect.addEventListener('change', () => {
      if (!topAuthorsChart) return;
      const labels = topAuthorsChart.data.labels || [];
      const values = topAuthorsChart.data.datasets?.[0].data || [];
      createOrUpdateTopAuthorsChart(aCanvas, labels, values, aSelect.value);
    });
  }
});
