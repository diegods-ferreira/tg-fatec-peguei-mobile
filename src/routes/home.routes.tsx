import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';

import { parseHeightPercentage } from '@utils/screenPercentage';

import Orders from '@screens/Orders';
import Trips from '@screens/Trips';
import Chats from '@screens/Chats';
import ShowProfile from '@screens/Profile/ShowProfile';

export const BottomTab = createBottomTabNavigator();

const HomeRoutes: React.FC = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="Orders"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const iconColor = focused ? '#2f2f2f' : '#adadad';
          let iconName = 'slash';

          if (route.name === 'Orders') {
            iconName = 'list';
          } else if (route.name === 'Trips') {
            iconName = 'map';
          } else if (route.name === 'Chats') {
            iconName = 'message-circle';
          } else if (route.name === 'ShowProfile') {
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
      <BottomTab.Screen name="Orders" component={Orders} />
      <BottomTab.Screen name="Trips" component={Trips} />
      <BottomTab.Screen name="Chats" component={Chats} />
      <BottomTab.Screen name="ShowProfile" component={ShowProfile} />
    </BottomTab.Navigator>
  );
};

export default HomeRoutes;
