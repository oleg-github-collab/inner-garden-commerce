const CACHE_NAME = 'inner-garden-static-v3';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/simple-i18n.js',
  '/js/cursor.js',
  '/js/harmony-map.js',
  '/js/main.js',
  '/assets/images/collection/placeholder-main.jpg',
  '/assets/images/collection/placeholder-room.jpg',
  '/assets/images/artworks/inner-peace.jpg',
  '/assets/images/artworks/harmony-flow.jpg',
  '/assets/images/artworks/sun-energy.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other unsupported schemes
  const url = new URL(request.url);
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              // Only cache http/https
              if (url.protocol.startsWith('http')) {
                cache.put(request, responseClone).catch((err) => {
                  console.warn('Cache put failed:', err.message);
                });
              }
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse || Response.error());
    })
  );
});
