self.isHttpOrHttps = function isHttpOrHttps(url) {
  return /^https?:$/.test(url.protocol);
};

self.isApiRequest = function isApiRequest(url) {
  return (
    typeof self.API_PREFIX === 'string' &&
    url.pathname.startsWith(self.API_PREFIX)
  );
};

self.isServiceWorkerFile = function isServiceWorkerFile(url) {
  return typeof self.SW_PATH === 'string' && url.pathname === self.SW_PATH;
};

self.isCacheableResponse = function isCacheableResponse(response) {
  return (
    response &&
    response.status === self.OK_STATUS &&
    response.type === self.RESPONSE_TYPE_BASIC
  );
};

self.openCache = async function openCache(cacheName) {
  return caches.open(cacheName);
};

self.safeCacheAddAll = async function safeCacheAddAll(cacheName, urls) {
  const cache = await self.openCache(cacheName);
  for (const url of urls) {
    try {
      await cache.add(url);
    } catch (err) {
      console.warn(`[SW] Failed to cache ${url}:`, err);
    }
  }
};

self.deleteOldCachesExcept = async function deleteOldCachesExcept(
  activeCacheName
) {
  const cacheNames = await caches.keys();
  const deletions = cacheNames
    .filter((name) => name !== activeCacheName)
    .map((oldCache) => {
      console.log('[SW] Deleting old cache:', oldCache);
      return caches.delete(oldCache);
    });
  await Promise.all(deletions);
};

self.putInCache = async function putInCache(cacheName, request, response) {
  try {
    const cache = await self.openCache(cacheName);
    await cache.put(request, response);
  } catch (err) {
    console.warn('[SW] Failed to cache response:', err);
  }
};

self.safeMatch = async function safeMatch(requestOrUrl) {
  try {
    return await caches.match(requestOrUrl);
  } catch (err) {
    console.warn('[SW] caches.match failed:', err);
    return undefined;
  }
};

self.safeClientsClaim = async function safeClientsClaim() {
  try {
    await self.clients.claim();
  } catch (err) {
    console.warn('[SW] clients.claim failed:', err);
  }
};

self.cacheFirstThenNetwork = async function cacheFirstThenNetwork(
  request,
  cacheName,
  event
) {
  try {
    const cached = self.safeMatch
      ? await self.safeMatch(request)
      : await caches.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (self.isCacheableResponse && self.isCacheableResponse(response)) {
      const clone = response.clone();
      const putTask = self.putInCache
        ? self.putInCache(cacheName || self.CACHE_NAME, request, clone)
        : caches
            .open(cacheName || self.CACHE_NAME)
            .then((cache) => cache.put(request, clone))
            .catch((err) =>
              console.warn('[SW] Failed to cache response:', err)
            );
      if (event && typeof event.waitUntil === 'function') {
        event.waitUntil(putTask);
      } else {
        putTask.catch(() => {});
      }
    }
    return response;
  } catch (err) {
    console.error('[SW] Fetch failed:', err);
    const cachedFallback = self.safeMatch
      ? await self.safeMatch(request)
      : await caches.match(request);
    if (cachedFallback) return cachedFallback;

    if (request.mode === self.NAVIGATE_MODE) {
      const homePage = await caches.match(self.HOME_PATH);
      if (homePage) return homePage;
    }

    return new Response(
      self.ERRORS && self.ERRORS.NETWORK_FAILED
        ? self.ERRORS.NETWORK_FAILED
        : 'Network error',
      {
        status: self.DEFAULT_ERROR_STATUS || 500,
      }
    );
  }
};
