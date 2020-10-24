import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// import EditProfile from '@screens/Profile/EditProfile';
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

      {/* <Stack.Screen name="EditProfile" component={EditProfile} /> */}
    </Stack.Navigator>
  );
};

export default AppRoutes;
