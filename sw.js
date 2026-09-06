// Service Worker Automatik Mengesan Perubahan Fail
const CACHE_NAME = 'msroomstay-auto-v' + new Date().getTime(); // Dinamik mengikut waktu build/deploy

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Paksa service worker baharu aktif serta-merta
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          // Padam cache lama secara automatik
          return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET' && !event.request.url.includes('script.google.com')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});
