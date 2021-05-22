import React from 'react';

import { AuthProvider } from './auth';
import { LocationProvider } from './location';
import { NotificationProvider } from './notification';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <LocationProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </LocationProvider>
  </AuthProvider>
);

export default AppProvider;
