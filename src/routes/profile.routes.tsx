import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Profile from '@screens/Profile';

export const Stack = createStackNavigator();

const ProfileRoutes: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#2b2831' },
      }}
    >
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

export default ProfileRoutes;
