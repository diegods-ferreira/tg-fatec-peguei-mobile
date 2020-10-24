import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';

import {
  parseWidthPercentage,
  parseHeightPercentage,
} from '@utils/screenPercentage';

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

          return (
            <Feather
              name={iconName}
              size={parseHeightPercentage(24)}
              color={iconColor}
            />
          );
        },
      })}
      tabBarOptions={{
        activeBackgroundColor: '#ff8c42',
        inactiveBackgroundColor: '#312e38',
        showLabel: false,
        style: {
          height: parseHeightPercentage(56),
          borderTopColor: '#312e38',
          elevation: 8,
          shadowOffset: { width: 5, height: 5 },
          shadowColor: '#000000',
          shadowOpacity: 0.25,
          shadowRadius: 8,
        },
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
