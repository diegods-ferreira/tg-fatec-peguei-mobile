import React from 'react';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

const Routes: React.FC = () => {
  const userLogged = false;

  return userLogged ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
