import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserMutation } from '@/api/authApi';
import { ROUTE_PATHS } from '@/routes';

export const useRedirectIfAuthenticated = () => {
  const [getUser] = useGetUserMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getUser().unwrap();
        if (user) {
          navigate(ROUTE_PATHS.gameMenu);
        }
      } catch (error) {
        console.error('sign in error', error);
      }
    };

    checkUser();
  }, [getUser, navigate]);
};
