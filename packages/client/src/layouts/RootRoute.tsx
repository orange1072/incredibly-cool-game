import { NavBar } from '@/components/Navbar';
import { Outlet } from 'react-router-dom';

const RootRoute = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default RootRoute;
