import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Orders from '@screens/Orders';
import MyOrders from '@screens/MyOrders';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

const TopTabs = createMaterialTopTabNavigator();

const OrdersTabs: React.FC = () => {
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
        name="Orders"
        component={Orders}
        options={{ title: 'Pedidos' }}
      />
      <TopTabs.Screen
        name="MyOrders"
        component={MyOrders}
        options={{ title: 'Meus Pedidos' }}
      />
    </TopTabs.Navigator>
  );
};

export default OrdersTabs;
