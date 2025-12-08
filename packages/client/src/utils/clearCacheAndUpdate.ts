/**
 * Очищает все кеши и обновляет service worker
 */
export async function clearCacheAndUpdate(): Promise<void> {
  try {
    // Очищаем все кеши
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          console.log('[Cache] Удаление кеша:', cacheName);
          return caches.delete(cacheName);
        })
      );
      console.log('[Cache] Все кеши очищены');
    }

    // Отменяем регистрацию service worker
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map((registration) => {
          console.log('[SW] Отмена регистрации service worker');
          return registration.unregister();
        })
      );
      console.log('[SW] Все service workers отменены');
    }

    // Перезагружаем страницу
    window.location.reload();
  } catch (error) {
    console.error('[Cache] Ошибка при очистке кеша:', error);
    // В случае ошибки все равно перезагружаем страницу
    window.location.reload();
  }
}
