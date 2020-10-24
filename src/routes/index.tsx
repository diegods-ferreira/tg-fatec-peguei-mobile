import React from 'react';

import { useAuth } from '@hooks/auth';

import Splash from '@screens/Splash';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

const Routes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Splash />;
  }

  // return user ? <AppRoutes /> : <AuthRoutes />;
  return <AppRoutes />;
};

export default Routes;
