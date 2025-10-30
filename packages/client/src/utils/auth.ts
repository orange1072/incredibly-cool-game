let cachedToken: string | null = null;

export const getAuthToken = (): string | null => {
  if (cachedToken !== null) {
    return cachedToken;
  }

  if (typeof window !== 'undefined') {
    cachedToken = localStorage.getItem('token');
  }

  return cachedToken;
};

export const setAuthToken = (token: string | null): void => {
  cachedToken = token;

  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }
};

export const clearAuthToken = (): void => {
  cachedToken = null;

  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};
