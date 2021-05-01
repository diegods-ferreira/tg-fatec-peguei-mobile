import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import EditProfile from '@screens/user/EditProfile';
import OrderDetails from '@screens/order/OrderDetails';
import ItemDetails from '@screens/order/ItemDetails';
import CreateOrder from '@screens/order/CreateOrder';
import AddItemToOrder from '@screens/order/AddItemToOrder';
import OrdersAsDeliveryman from '@screens/order/OrdersAsDeliveryman';
import ChatRoom from '@screens/chat/ChatRoom';
import SelectDeliveryman from '@screens/order/SelectDeliveryman';
import Profile from '@screens/user/Profile';
import UserRating from '@screens/user/UserRating';
import TripDetails from '@screens/trip/TripDetails';
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

      <Stack.Screen name="UserProfile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="UserRating" component={UserRating} />

      <Stack.Screen name="OrderDetails" component={OrderDetails} />
      <Stack.Screen name="ItemDetails" component={ItemDetails} />
      <Stack.Screen name="CreateOrder" component={CreateOrder} />
      <Stack.Screen name="AddItemToOrder" component={AddItemToOrder} />
      <Stack.Screen
        name="OrdersAsDeliveryman"
        component={OrdersAsDeliveryman}
      />
      <Stack.Screen name="SelectDeliveryman" component={SelectDeliveryman} />

      <Stack.Screen name="ChatRoom" component={ChatRoom} />

      <Stack.Screen name="TripDetails" component={TripDetails} />
    </Stack.Navigator>
  );
};

export default AppRoutes;
