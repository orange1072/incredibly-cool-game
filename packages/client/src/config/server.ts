// Конфигурация сервера - вынесена в отдельный файл для избежания циклических зависимостей
// Безопасное получение SERVER_HOST с значениями по умолчанию

// Локальные объявления типов для глобальных переменных, определённых через Vite define
declare const __INTERNAL_SERVER_URL__: string | undefined;
declare const __EXTERNAL_SERVER_URL__: string | undefined;

export const SERVER_HOST = (() => {
  if (typeof window === 'undefined') {
    // Серверная сторона
    return typeof __INTERNAL_SERVER_URL__ !== 'undefined' &&
      __INTERNAL_SERVER_URL__
      ? __INTERNAL_SERVER_URL__
      : 'http://localhost:3001';
  } else {
    // Клиентская сторона
    return typeof __EXTERNAL_SERVER_URL__ !== 'undefined' &&
      __EXTERNAL_SERVER_URL__
      ? __EXTERNAL_SERVER_URL__
      : 'http://localhost:3001';
  }
})();
