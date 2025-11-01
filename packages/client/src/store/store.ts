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
import gameReducer from './slices/game';
import { authAPI } from '@/slices/authApi';
import authReducer from '@/store/slices/authSlice';
import { userApi } from '@/api';

// Глобально декларируем в window наш ключик
// и задаем ему тип такой же как у стейта в сторе
declare global {
  interface Window {
    APP_INITIAL_STATE: RootState;
  }
}

export const reducer = combineReducers({
  ssr: ssrReducer,
  user: userReducer,
  userApi: userApi.reducer,
  [authAPI.reducerPath]: authAPI.reducer,
  game: gameReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(authAPI.middleware),
  preloadedState:
    typeof window === 'undefined' ? undefined : window.APP_INITIAL_STATE,
});

export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = useDispatchBase;
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorBase;
export const useStore: () => typeof store = useStoreBase;
