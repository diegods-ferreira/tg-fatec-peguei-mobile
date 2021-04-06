import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SignIn from '@screens/SignIn';
import SignUp from '@screens/SignUp';
import PasswordRecovery from '@screens/PasswordRecovery';

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
    <Stack.Screen name="PasswordRecovery" component={PasswordRecovery} />
  </Stack.Navigator>
);

export default AuthRoutes;
