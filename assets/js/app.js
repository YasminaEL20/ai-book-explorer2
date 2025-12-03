// assets/js/app.js
// Sample loader pour tester timeline et top-authors sans la recherche

// sample items for timeline
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

// sample items for top authors
const sampleItemsAuthors = [
  { volumeInfo:{ authors:["Alice","Bob"], title:"A" } },
  { volumeInfo:{ authors:["Alice"], title:"B" } },
  { volumeInfo:{ authors:["Clara"], title:"C" } },
  { volumeInfo:{ authors:["Bob","Alice"], title:"D" } },
  { volumeInfo:{ authors:["Denis"], title:"E" } },
  { volumeInfo:{ authors:["Alice"], title:"F" } }
];

window.addEventListener('load', () => {
  // timeline button (from charts-timeline)
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

  // top-authors button (from charts-top-authors)
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
