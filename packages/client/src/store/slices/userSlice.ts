import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { UserProfile } from '@/api/authApi';
import { authAPI } from '@/api/authApi';
import { userApi } from '@/api';
import { getErrorMessage } from '../utils/rtkQueryErrorHandler';

type UserState = {
  data: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
};

const initialState: UserState = {
  data: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Установить данные пользователя
     */
    setUser: (state, action: PayloadAction<UserProfile | null>) => {
      state.data = action.payload;
      state.error = null;
      state.lastUpdated = action.payload ? Date.now() : null;
    },

    /**
     * Очистить данные пользователя
     */
    clearUser: (state) => {
      state.data = null;
      state.error = null;
      state.lastUpdated = null;
      state.isLoading = false;
    },

    /**
     * Обновить часть данных пользователя
     */
    updateUserData: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
        state.lastUpdated = Date.now();
      }
    },

    /**
     * Установить ошибку
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * Установить состояние загрузки
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Интеграция с authAPI.getUser (mutation)
      .addMatcher(authAPI.endpoints.getUser.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        authAPI.endpoints.getUser.matchFulfilled,
        (state, { payload }) => {
          state.data = payload;
          state.isLoading = false;
          state.error = null;
          state.lastUpdated = Date.now();
        }
      )
      .addMatcher(authAPI.endpoints.getUser.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action, 'Failed to fetch user');
      })

      // Интеграция с userApi.getUser (query)
      .addMatcher(userApi.endpoints.getUser.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        userApi.endpoints.getUser.matchFulfilled,
        (state, { payload }) => {
          // userApi.getUser возвращает только часть данных, обновляем только аватар
          if (payload && state.data) {
            state.data.avatar = payload.avatar || state.data.avatar;
          }
          state.isLoading = false;
          state.error = null;
          state.lastUpdated = Date.now();
        }
      )
      .addMatcher(userApi.endpoints.getUser.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action, 'Failed to fetch user');
      })

      // Интеграция с userApi.updateUserAvatar
      .addMatcher(userApi.endpoints.updateUserAvatar.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        userApi.endpoints.updateUserAvatar.matchFulfilled,
        (state, { payload }) => {
          if (state.data) {
            state.data.avatar = payload.avatar;
            state.lastUpdated = Date.now();
          }
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        userApi.endpoints.updateUserAvatar.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = getErrorMessage(action, 'Failed to update avatar');
        }
      )

      // Интеграция с authAPI.logout - очистить user при выходе
      .addMatcher(authAPI.endpoints.logout.matchFulfilled, (state) => {
        state.data = null;
        state.error = null;
        state.lastUpdated = null;
        state.isLoading = false;
      });
  },
});

export const { setUser, clearUser, updateUserData, setError, setLoading } =
  userSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.user.data;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;
export const selectLastUpdated = (state: RootState) => state.user.lastUpdated;

/**
 * Селектор для проверки, загружен ли пользователь
 */
export const selectIsUserLoaded = (state: RootState) =>
  state.user.data !== null;

/**
 * Селектор для получения полного имени пользователя
 */
export const selectUserDisplayName = (state: RootState) => {
  const user = state.user.data;
  if (!user) return null;
  return (
    user.display_name ||
    `${user.first_name} ${user.second_name}`.trim() ||
    user.login
  );
};

/**
 * Селектор для получения аватара пользователя
 */
export const selectUserAvatar = (state: RootState) =>
  state.user.data?.avatar || null;

export default userSlice.reducer;
