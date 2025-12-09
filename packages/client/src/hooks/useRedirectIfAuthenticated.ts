import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserMutation } from '@/slices/authApi';

export const useRedirectIfAuthenticated = () => {
  const [getUser] = useGetUserMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getUser().unwrap();
        if (user) {
          navigate('/game-menu');
        }
      } catch (error) {
        console.log('sign in error', error);
      }
    };

    checkUser();
  }, [getUser, navigate]);
};
