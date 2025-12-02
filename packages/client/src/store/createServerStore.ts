// Реэкспортируем createStore и action из общего store.ts
// чтобы использовать единый подход для сервера и клиента
import { createStore } from './store';
import { setPageHasBeenInitializedOnServer } from './slices/ssrSlice';

// Для SSR используем общий createStore без RTK Query middleware
// (он автоматически не добавляется на сервере из-за проверки typeof window)
export const createServerStore = () => {
  return createStore();
};

// Реэкспортируем action для удобства
export { setPageHasBeenInitializedOnServer };
