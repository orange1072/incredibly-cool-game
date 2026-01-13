import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '@/api/authApi';
import { getErrorMessage } from '../utils/rtkQueryErrorHandler';
import type { RootState } from '../store';

type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;

      // Синхронизация с localStorage (можно вынести в middleware)
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('token', action.payload);
        } else {
          localStorage.removeItem('token');
        }
      }
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      if (!action.payload) {
        state.token = null;
      }
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      // Очистка localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Интеграция с authAPI.signIn
      .addMatcher(authAPI.endpoints.signIn.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authAPI.endpoints.signIn.matchFulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // Токен будет установлен через setAuthToken после успешного входа
      })
      .addMatcher(authAPI.endpoints.signIn.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action, 'Failed to sign in');
        state.isAuthenticated = false;
        state.token = null;
      })

      // Интеграция с authAPI.signUp
      .addMatcher(authAPI.endpoints.signUp.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authAPI.endpoints.signUp.matchFulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addMatcher(authAPI.endpoints.signUp.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action, 'Failed to sign up');
      })

      // Интеграция с authAPI.logout
      .addMatcher(authAPI.endpoints.logout.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(authAPI.endpoints.logout.matchFulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.isLoading = false;
        // Очистка localStorage будет через middleware
      })
      .addMatcher(authAPI.endpoints.logout.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action, 'Failed to logout');
      });
  },
});

export const {
  setAuthToken,
  setAuthenticated,
  setAuthLoading,
  setAuthError,
  logout,
} = authSlice.actions;

// Selectors
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
