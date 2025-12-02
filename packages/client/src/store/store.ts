import {
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase,
  TypedUseSelectorHook,
  useStore as useStoreBase,
} from 'react-redux';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import ssrReducer from './slices/ssrSlice';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';
import gameReducer from './slices/game';
import { authAPI } from '@/slices/authApi';
import { userApi } from '@/api';

export const reducer = combineReducers({
  ssr: ssrReducer,
  user: userReducer,
  auth: authReducer,
  userApi: userApi.reducer,
  [authAPI.reducerPath]: authAPI.reducer,
  game: gameReducer,
});

export type RootState = ReturnType<typeof reducer>;

// Глобально декларируем в window наш ключик
// и задаем ему тип такой же как у стейта в сторе
declare global {
  interface Window {
    APP_INITIAL_STATE: RootState;
  }
}

// Общий store creator, который работает и на сервере, и на клиенте
export const createStore = (preloadedState?: RootState) => {
  return configureStore({
    reducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => {
      // На сервере не используем middleware вообще - возвращаем пустой массив
      if (typeof window === 'undefined') {
        return [];
      }

      // На клиенте используем стандартный подход
      const defaults = getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      });

      // Добавляем RTK Query middleware только если они функции
      const allMiddlewares = Array.isArray(defaults) ? [...defaults] : [];

      if (typeof userApi.middleware === 'function') {
        allMiddlewares.push(userApi.middleware);
      }
      if (typeof authAPI.middleware === 'function') {
        allMiddlewares.push(authAPI.middleware);
      }

      // Фильтруем только функции перед возвратом для безопасности
      return allMiddlewares.filter((m) => typeof m === 'function');
    },
  });
};

// Клиентский store
export const store = createStore(
  typeof window === 'undefined' ? undefined : window.APP_INITIAL_STATE
);

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = useDispatchBase;
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorBase;
export const useStore: () => typeof store = useStoreBase;
