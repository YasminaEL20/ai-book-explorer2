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

function getThemePalette() {
  const root = getComputedStyle(document.documentElement);
  const accent = root.getPropertyValue('--accent').trim() || '#4fc3f7';
  const accent2 = root.getPropertyValue('--accent-2').trim() || '#7bdcf6';
  const text = root.getPropertyValue('--text').trim() || '#e6eef6';
  const muted = root.getPropertyValue('--muted').trim() || '#9aa4ad';

  const palette = [
    accent,
    accent2,
    '#82e0ff',
    '#6fc0e8',
    '#5aaed8',
    '#9fdfff',
    '#cfefff'
  ].map(c => c.trim());

  return { accent, accent2, text, muted, palette };
}

//
// TIMELINE (books per year)
//
function buildYearCounts(items) {
  if (!Array.isArray(items)) return { labels: [], values: [] };
  const counts = Object.create(null);

  items.forEach(it => {
    const pub = it?.volumeInfo?.publishedDate;
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
  const theme = getThemePalette();

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

  const dataset = {
    label: 'Nombre de livres',
    data: values,
    tension: 0.3,
    fill: type === 'bar' ? true : false,
    borderWidth: 2,
    borderColor: theme.accent,
    backgroundColor: type === 'bar' ? theme.accent + "33" : theme.accent2 + "33",
    pointBackgroundColor: theme.accent2,
    pointBorderColor: "#fff"
  };

  const cfg = {
    type,
    data: { labels, datasets: [dataset] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: theme.text },
          grid: { color: "rgba(255,255,255,0.05)" },
          title: { display: true, text: 'Année', color: theme.muted }
        },
        y: {
          beginAtZero: true,
          ticks: { precision: 0, color: theme.text },
          grid: { color: "rgba(255,255,255,0.05)" },
          title: { display: true, text: 'Nombre', color: theme.muted }
        }
      },
      plugins: {
        legend: { labels: { color: theme.text } },
        tooltip: {
          titleColor: theme.text,
          bodyColor: theme.text,
          backgroundColor: "rgba(0,0,0,0.7)"
        }
      }
    }
  };

  timelineChart = new Chart(ctx, cfg);
  return timelineChart;
}

function updateTimelineFromItems(items, options = {}) {
  const { labels, values } = buildYearCounts(items);
  const canvas = document.getElementById('timelineChart');
  if (!canvas) return;
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
    authors.forEach(name => {
      name = String(name).trim();
      if (!name) return;
      map[name] = (map[name] || 0) + 1;
    });
  });

  const sorted = Object.keys(map)
    .map(name => ({ name, count: map[name] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    labels: sorted.map(s => s.name),
    values: sorted.map(s => s.count)
  };
}

let topAuthorsChart = null;

function createOrUpdateTopAuthorsChart(canvasEl, labels = [], values = [], type = 'bar') {
  if (!canvasEl) return;
  const theme = getThemePalette();

  const colors = labels.map((_, i) => {
    const c = theme.palette[i % theme.palette.length];
    return type === "pie" ? c : c + "99";
  });

  if (topAuthorsChart) {
    if (topAuthorsChart.config.type !== type) {
      topAuthorsChart.destroy();
      topAuthorsChart = null;
    } else {
      topAuthorsChart.data.labels = labels;
      topAuthorsChart.data.datasets[0].data = values;
      topAuthorsChart.data.datasets[0].backgroundColor = colors;
      topAuthorsChart.update();
      return topAuthorsChart;
    }
  }

  const ctx = canvasEl.getContext('2d');

  const dataset = {
    label: "Nombre d'occurrences",
    data: values,
    borderWidth: 1,
    backgroundColor: colors,
    borderColor: colors.map(c => c.replace(/99$/, "")) // remove alpha for border
  };

  const cfg = {
    type,
    data: { labels, datasets: [dataset] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: type === 'bar'
        ? {
            x: {
              ticks: { color: theme.text },
              grid: { color: "rgba(255,255,255,0.05)" },
              title: { display: true, text: 'Auteur', color: theme.muted }
            },
            y: {
              beginAtZero: true,
              ticks: { precision: 0, color: theme.text },
              grid: { color: "rgba(255,255,255,0.05)" },
              title: { display: true, text: 'Occurrences', color: theme.muted }
            }
          }
        : {},
      plugins: {
        legend: { labels: { color: theme.text } },
        tooltip: {
          titleColor: theme.text,
          bodyColor: theme.text,
          backgroundColor: "rgba(0,0,0,0.7)"
        }
      }
    }
  };

  topAuthorsChart = new Chart(ctx, cfg);
  return topAuthorsChart;
}

function updateTopAuthors(items, options = {}) {
  const { labels, values } = countTopAuthors(items);
  const canvas = document.getElementById('topAuthorsChart');
  if (!canvas) return;
  const select = document.getElementById('authors-chart-type');
  const type = options.type || (select ? select.value : 'bar');
  createOrUpdateTopAuthorsChart(canvas, labels, values, type);
}

window.updateTopAuthors = updateTopAuthors;

//
// initial UI hookups for selects & default empty charts
//
window.addEventListener('load', () => {
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
