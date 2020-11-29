import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import EditProfile from '@screens/EditProfile';
import OrderDetails from '@screens/OrderDetails';
import ItemDetails from '@screens/ItemDetails';
import HomeRoutes from './home.routes';

export const Stack = createStackNavigator();

const AppRoutes: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#2b2831' },
      }}
    >
      <Stack.Screen name="Home" component={HomeRoutes} />

      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
      <Stack.Screen name="ItemDetails" component={ItemDetails} />
    </Stack.Navigator>
  );
};

export default AppRoutes;
