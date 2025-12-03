// assets/js/app.js
// Sample loader pour tester timeline sans la recherche

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

window.addEventListener('load', () => {
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
});
