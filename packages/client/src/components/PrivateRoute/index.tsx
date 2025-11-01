import { Navigate, useLocation } from 'react-router-dom';
import { RootState, useSelector } from '../../store';
import { ROUTES } from '@/constants';

type PrivateRoute = {
  children: React.ReactNode;
};

export const PrivateRoute = ({ children }: PrivateRoute) => {
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to={ROUTES.SIGNIN} state={{ from: location }} replace />;
  }
  return <>{children}</>;
};
