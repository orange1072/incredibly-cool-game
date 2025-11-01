import { RootState } from '@/store/store';

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
