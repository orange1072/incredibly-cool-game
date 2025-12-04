import { withAuth } from '@/hocs/withAuth';
import React from 'react';
import { Outlet } from 'react-router-dom';

const base = () => {
  return <Outlet />;
};

const ProtectedRoute = withAuth(base);

export default ProtectedRoute;
