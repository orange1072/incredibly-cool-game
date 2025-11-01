import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/slices/userSlice';
import { Navigate } from 'react-router-dom';

export const withAuth = <P extends Record<string, never>>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithAuthComponent: React.FC<P> = (props) => {
    const user = useSelector(selectUser);

    if (!user) {
      return <Navigate to="/signin" replace />;
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithAuthComponent;
};
