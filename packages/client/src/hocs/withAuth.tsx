import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUser } from '@/store/slices/userSlice';
import { ROUTE_PATHS } from '@/routes';

export const withAuth = <P extends Record<string, never>>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithAuthComponent: React.FC<P> = (props) => {
    const user = useSelector(selectUser);

    if (!user) {
      return <Navigate to={ROUTE_PATHS.signin} replace />;
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithAuthComponent;
};
