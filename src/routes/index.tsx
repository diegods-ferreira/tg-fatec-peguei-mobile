import React from 'react';

import { useAuth } from '../hooks/auth';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

import Splash from '../pages/Splash';

const Routes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Splash />;
  }

  return user ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
