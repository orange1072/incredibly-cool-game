const CACHE_NAME = 'my-site-cache-__VERSION__';

const URLS = [
  /* INJECT_URLS */
  '/',
  /* END_INJECT_URLS */
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] install');

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('[SW] Caching static assets');
      for (const url of URLS) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn(`[SW] Failed to cache ${url}:`, err);
        }
      }
      await self.skipWaiting();
    })()
  );
});

// Активация и очистка старых кешей
self.addEventListener('activate', (event) => {
  console.log('[SW] activate');
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((oldCache) => {
            console.log('[SW] Deleting old cache:', oldCache);
            return caches.delete(oldCache);
          })
      );
      await self.clients.claim();
    })()
  );
});

// Перехват сетевых запросов
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || !/^https?:$/.test(url.protocol)) return;

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  if (url.pathname === '/sw.js') {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          if (
            response &&
            response.status === 200 &&
            response.type === 'basic'
          ) {
            const clone = response.clone();
            event.waitUntil(
              caches
                .open(CACHE_NAME)
                .then((cache) => cache.put(request, clone))
                .catch((err) =>
                  console.warn('[SW] Failed to cache response:', err)
                )
            );
          }
          return response;
        })
        .catch(async (err) => {
          console.error('[SW] Fetch failed:', err);
          const cached = await caches.match(request);
          if (cached) return cached;

          if (request.mode === 'navigate') {
            const homePage = await caches.match('/');
            if (homePage) return homePage;
          }

          return new Response('Network error', { status: 500 });
        });
    })
  );
});
