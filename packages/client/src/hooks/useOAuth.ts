import { useDispatch } from '@/store/store';
import {
  useGetUserMutation,
  useLazyGetOAuthServiceIdQuery,
  useOauthYandexMutation,
} from '@/api/authApi';
import { setUser } from '@/store/slices/userSlice';

const REDIRECT_URI = 'http://localhost:3000'; // TODO заменить при необходимости

export const useOAuth = () => {
  const dispatch = useDispatch();
  const [getUser] = useGetUserMutation();
  const [oauthYandex] = useOauthYandexMutation();
  const [getServiceId] = useLazyGetOAuthServiceIdQuery();

  const handleOAuthLogin = async () => {
    try {
      const data = await getServiceId({
        redirect_uri: REDIRECT_URI,
      }).unwrap();

      if (data?.service_id) {
        const authUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${data.service_id}&redirect_uri=${REDIRECT_URI}`;
        window.location.href = authUrl;
      }
    } catch (error) {
      console.error('OAuth error:', error);
    }
  };

  const handleOAuthCallback = async (code: string) => {
    try {
      await oauthYandex({
        code,
        redirect_uri: REDIRECT_URI,
      });

      const userData = await getUser().unwrap();
      dispatch(setUser(userData));
      window.history.replaceState({}, '', window.location.pathname);
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw error;
    }
  };

  return { handleOAuthCallback, handleOAuthLogin };
};
