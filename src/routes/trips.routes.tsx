import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Trips from '@screens/Trips';

export const Stack = createStackNavigator();

const TripsRoutes: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#2b2831' },
      }}
    >
      <Stack.Screen name="Trips" component={Trips} />
    </Stack.Navigator>
  );
};

export default TripsRoutes;
