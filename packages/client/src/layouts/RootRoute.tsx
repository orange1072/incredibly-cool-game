import { ErrorBoundary } from '@/components/ErrorBoundary';
import { NavBar } from '@/components/Navbar';
import { useGetUserMutation } from '@/slices/authApi';
import { setUser } from '@/store/slices/userSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

const RootRoute = () => {
  const [getUser] = useGetUserMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchUser() {
      const user = await getUser().unwrap();
      if (user) {
        dispatch(setUser(user));
      }
    }

    fetchUser();
  }, []);

  return (
    <>
      <NavBar />
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </>
  );
};

export default RootRoute;
