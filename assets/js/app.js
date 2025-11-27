// sample items with authors pour tester top authors
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
  }
});
