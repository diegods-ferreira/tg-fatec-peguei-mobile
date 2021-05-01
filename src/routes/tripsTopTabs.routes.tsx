import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Trips from '@screens/trip/Trips';
import MyTrips from '@screens/trip/MyTrips';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

const TopTabs = createMaterialTopTabNavigator();

const TripsTabs: React.FC = () => {
  return (
    <TopTabs.Navigator
      tabBarOptions={{
        labelStyle: { fontSize: parseWidthPercentage(12), fontWeight: 'bold' },
        style: {
          backgroundColor: '#312E38',
          height: parseHeightPercentage(56),
        },
        indicatorStyle: {
          backgroundColor: '#ff8c42',
          height: parseHeightPercentage(2),
        },
        activeTintColor: '#ff8c42',
        inactiveTintColor: '#606060',
      }}
    >
      <TopTabs.Screen
        name="Trips"
        component={Trips}
        options={{ title: 'Viagens' }}
      />
      <TopTabs.Screen
        name="MyTrips"
        component={MyTrips}
        options={{ title: 'Minhas Viagens' }}
      />
    </TopTabs.Navigator>
  );
};

export default TripsTabs;
