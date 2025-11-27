const sampleItemsAuthors = [
  { volumeInfo:{ authors:["Alice","Bob"], title:"A" } },
  { volumeInfo:{ authors:["Alice"], title:"B" } },
  { volumeInfo:{ authors:["Clara"], title:"C" } },
  { volumeInfo:{ authors:["Bob","Alice"], title:"D" } },
  { volumeInfo:{ authors:["Denis"], title:"E" } },
  { volumeInfo:{ authors:["Alice"], title:"F" } }
];

window.addEventListener('load', () => {
  const btnAuth = document.getElementById('load-sample-authors');
  if (btnAuth) {
    btnAuth.addEventListener('click', () => {
      if (typeof window.updateTopAuthors === 'function') {
        window.updateTopAuthors(sampleItemsAuthors);
      } else {
        console.warn('updateTopAuthors non défini');
      }
    });
  } else {
    console.warn('bouton load-sample-authors introuvable');
  }

  // loader timeline sample si besoin
  const btn = document.getElementById('load-sample');
  if (btn) {
    btn.addEventListener('click', () => {
      if (typeof window.updateTimelineFromItems === 'function') {
        window.updateTimelineFromItems(sampleItemsAuthors); // ou sampleItems pour timeline
      } else {
        console.warn('updateTimelineFromItems non défini');
      }
    });
  }
});
// assets/js/ui.js
window.addEventListener('load', () => {
  const btn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    nav.style.display = expanded ? 'none' : 'flex';
  });
});
