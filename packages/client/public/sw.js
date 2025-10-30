//загрузка констант и хелперов в глобальную область
try {
  importScripts('sw-constants.js', 'sw-helpers.js');
} catch (err) {
  console.warn('[SW] Failed to import helper scripts:', err);
}

const CACHE_NAME = self.CACHE_NAME || 'my-site-cache-__VERSION__';

const URLS = [
  /* INJECT_URLS */
  '/',
  /* END_INJECT_URLS */
];

// Установка Service Worker
self.addEventListener(self.EVENTS && self.EVENTS.INSTALL, (event) => {
  event.waitUntil(
    (async () => {
      if (typeof self.safeCacheAddAll === 'function') {
        await self.safeCacheAddAll(CACHE_NAME, URLS);
      } else {
        const cache = await caches.open(CACHE_NAME);
        for (const url of URLS) {
          try {
            await cache.add(url);
          } catch (err) {
            console.warn(`[SW] Failed to cache ${url}:`, err);
          }
        }
      }
      await self.skipWaiting();
    })()
  );
});

// Активация и очистка старых кешей
self.addEventListener(self.EVENTS && self.EVENTS.ACTIVATE, (event) => {
  event.waitUntil(
    (async () => {
      try {
        if (typeof self.deleteOldCachesExcept === 'function') {
          await self.deleteOldCachesExcept(CACHE_NAME);
        } else {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames
              .filter((name) => name !== CACHE_NAME)
              .map((oldCache) => {
                console.log('[SW] Deleting old cache:', oldCache);
                return caches.delete(oldCache);
              })
          );
        }
      } catch (err) {
        console.error('[SW] Error during activate cleanup:', err);
      }

      try {
        if (typeof self.safeClientsClaim === 'function') {
          await self.safeClientsClaim();
        } else {
          await self.clients.claim();
        }
      } catch (err) {
        console.warn('[SW] clients claim failed:', err);
      }
    })().catch((err) => {
      console.error('[SW] activate handler failed:', err);
    })
  );
});

// Перехват сетевых запросов
self.addEventListener(self.EVENTS && self.EVENTS.FETCH, (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (
    request.method !== self.HTTP_GET ||
    !(self.isHttpOrHttps && self.isHttpOrHttps(url))
  )
    return;

  if (self.isApiRequest && self.isApiRequest(url)) {
    event.respondWith(fetch(request));
    return;
  }

  if (self.isServiceWorkerFile && self.isServiceWorkerFile(url)) {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(self.cacheFirstThenNetwork(request, CACHE_NAME, event));
});
