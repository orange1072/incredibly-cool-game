import { NavBar } from '@/components/Navbar';
import { MobileInputProvider } from '@/providers/MobileInputProvider/MobileInputProvider';
import { Outlet } from 'react-router-dom';

const RootRoute = () => {
  return (
    <MobileInputProvider>
      <NavBar />
      <Outlet />
    </MobileInputProvider>
  );
};

export default RootRoute;
