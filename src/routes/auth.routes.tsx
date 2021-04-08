import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SignIn from '@screens/user/SignIn';
import SignUp from '@screens/user/SignUp';
import PasswordRecovery from '@screens/user/PasswordRecovery';

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
