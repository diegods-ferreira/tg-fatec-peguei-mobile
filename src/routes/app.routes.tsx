import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';

import OrdersRoutes from './orders.routes';
import TripsRoutes from './trips.routes';
import ChatsRoutes from './chats.routes';
import ProfileRoutes from './profile.routes';

export const BottomTab = createBottomTabNavigator();

const AppRoutes: React.FC = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="Orders"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const iconColor = focused ? '#2f2f2f' : '#adadad';
          let iconName = 'slash';

          if (route.name === 'OrdersRoutes') {
            iconName = 'list';
          } else if (route.name === 'TripsRoutes') {
            iconName = 'map';
          } else if (route.name === 'ChatsRoutes') {
            iconName = 'message-circle';
          } else if (route.name === 'ProfileRoutes') {
            iconName = 'user';
          }

          return <Feather name={iconName} size={24} color={iconColor} />;
        },
      })}
      tabBarOptions={{
        activeBackgroundColor: '#ff8c42',
        inactiveBackgroundColor: '#312e38',
        showLabel: false,
        style: { height: 56 },
      }}
    >
      <BottomTab.Screen name="OrdersRoutes" component={OrdersRoutes} />
      <BottomTab.Screen name="TripsRoutes" component={TripsRoutes} />
      <BottomTab.Screen name="ChatsRoutes" component={ChatsRoutes} />
      <BottomTab.Screen name="ProfileRoutes" component={ProfileRoutes} />
    </BottomTab.Navigator>
  );
};

export default AppRoutes;
