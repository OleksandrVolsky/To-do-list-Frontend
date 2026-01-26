self.addEventListener('install', (event) => {
  console.log('Service Worker встановлено');
});

self.addEventListener('fetch', (event) => {
  // Необов’язково кешувати
  console.log('Service Worker fetch:', event.request.url);
});
