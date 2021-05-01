import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';

import { parseHeightPercentage } from '@utils/screenPercentage';
import boxShadowProps from '@utils/boxShadowProps';

import Chats from '@screens/chat/Chats';
import Profile from '@screens/user/Profile';
import OrdersTabs from './ordersTopTabs.routes';
import TripsTabs from './tripsTopTabs.routes';

export const BottomTab = createBottomTabNavigator();

const HomeRoutes: React.FC = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="Orders"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const iconColor = focused ? '#2f2f2f' : '#adadad';
          let iconName = 'slash';

          if (route.name === 'OrdersTabs') {
            iconName = 'list';
          } else if (route.name === 'TripsTabs') {
            iconName = 'map';
          } else if (route.name === 'Chats') {
            iconName = 'message-circle';
          } else if (route.name === 'Profile') {
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
          ...boxShadowProps,
        },
      }}
    >
      <BottomTab.Screen name="OrdersTabs" component={OrdersTabs} />
      <BottomTab.Screen name="TripsTabs" component={TripsTabs} />
      <BottomTab.Screen name="Chats" component={Chats} />
      <BottomTab.Screen name="Profile" component={Profile} />
    </BottomTab.Navigator>
  );
};

export default HomeRoutes;
