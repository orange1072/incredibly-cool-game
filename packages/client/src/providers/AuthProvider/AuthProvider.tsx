import { PropsWithChildren, useEffect } from 'react';
import { useDispatch } from '@/store/store';
import { useGetUserMutation } from '@/api/authApi';
import { setUser } from '@/store/slices/userSlice';
import { useOAuth } from '@/hooks/useOAuth';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [getUser] = useGetUserMutation();
  const dispatch = useDispatch();
  const { handleOAuthCallback } = useOAuth();

  useEffect(() => {
    const initializeAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        try {
          await handleOAuthCallback(code);
        } catch (error) {
          console.error('OAuth callback failed:', error);
        }
        return;
      }

      try {
        const user = await getUser().unwrap();
        if (user) {
          dispatch(setUser(user));
        }
      } catch (error) {
        console.warn('Failed to fetch user:', error);
      }
    };

    initializeAuth();
  }, []);

  return <>{children}</>;
};
