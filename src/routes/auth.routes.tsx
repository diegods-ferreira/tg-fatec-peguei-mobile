import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SignIn from '@screens/SignIn';
import SignUp from '@screens/SignUp';

const Stack = createStackNavigator();

const AuthRoutes: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#2b2831' },
    }}
  >
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="SignUp" component={SignUp} />
  </Stack.Navigator>
);

export default AuthRoutes;
