// assets/js/charts.js
// buildYearCounts + create/update Chart.js timeline
// Expose window.updateTimelineFromItems(items)

function buildYearCounts(items) {
  if (!Array.isArray(items)) return { labels: [], values: [] };
  const counts = Object.create(null);

  items.forEach(it => {
    const pub = it && it.volumeInfo && it.volumeInfo.publishedDate;
    if (!pub) return;
    const year = String(pub).slice(0,4);
    if (!/^\d{4}$/.test(year)) return;
    counts[year] = (counts[year] || 0) + 1;
  });

  const years = Object.keys(counts).sort((a,b) => Number(a) - Number(b));
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

window.addEventListener('load', () => {
  const canvas = document.getElementById('timelineChart');
  if (canvas) createOrUpdateTimelineChart(canvas, [], [], 'line');

  const select = document.getElementById('chart-type');
  if (select) {
    select.addEventListener('change', () => {
      if (!timelineChart) return;
      const labels = timelineChart.data.labels || [];
      const values = timelineChart.data.datasets?.[0].data || [];
      createOrUpdateTimelineChart(canvas, labels, values, select.value);
    });
  }
});
