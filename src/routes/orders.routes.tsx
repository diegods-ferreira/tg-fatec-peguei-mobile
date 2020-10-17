import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Orders from '../pages/Orders';

export const Stack = createStackNavigator();

const OrdersRoutes: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#2b2831' },
      }}
    >
      <Stack.Screen name="Orders" component={Orders} />
    </Stack.Navigator>
  );
};

export default OrdersRoutes;
