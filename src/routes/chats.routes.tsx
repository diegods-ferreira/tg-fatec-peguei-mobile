import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Chats from '../pages/Chats';

export const Stack = createStackNavigator();

const ChatsRoutes: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#2b2831' },
      }}
    >
      <Stack.Screen name="Chats" component={Chats} />
    </Stack.Navigator>
  );
};

export default ChatsRoutes;
