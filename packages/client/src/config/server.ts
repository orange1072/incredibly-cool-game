// Конфигурация сервера - вынесена в отдельный файл для избежания циклических зависимостей
//
// В production `server` не обязан быть доступен из браузера по `:3001` (в docker-compose он может быть только в internal network).
// Поэтому на клиенте используем относительные URL (same-origin), а на SSR/Node используем INTERNAL_SERVER_URL.

// Эти переменные определяются через Vite `define` в `vite.config.ts` (см. `src/client.d.ts`).
declare const __INTERNAL_SERVER_URL__: string;
declare const __EXTERNAL_SERVER_URL__: string;

export const SERVER_HOST = (() => {
  if (typeof window === 'undefined') {
    // Серверная сторона (SSR/Node)
    return __INTERNAL_SERVER_URL__ || 'http://localhost:3001';
  }

  // Клиентская сторона (браузер) — same-origin
  // Это позволяет ходить в `/api` и `/ya-api` через прокси в `packages/client/server/index.ts`.
  return '';
})();
