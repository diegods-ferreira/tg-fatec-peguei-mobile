import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar } from 'react-native';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Routes from './routes';
import AppProvider from './hooks';

const deepLinksConf = {
  initialRouteName: 'Home',
  screens: {
    Home: 'home',
    SelectDeliveryman: 'select-deliveryman/:order_id',
    TripOrders: 'trip-orders/:trip_id',
    OrderDetails: 'order-details/:id',
    Chats: 'chats/join-room/:chat_id',
    UserRating: 'user-rating/:deliveryman_id',
  },
};

const linking: LinkingOptions = {
  prefixes: ['peguei://', 'https://app.peguei.com'],
  config: deepLinksConf,
};

const App: React.FC = () => (
  <NavigationContainer linking={linking}>
    <StatusBar barStyle="light-content" backgroundColor="#2b2831" translucent />

    <AppProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#2b2831' }}>
        <Routes />
      </SafeAreaView>
    </AppProvider>
  </NavigationContainer>
);

export default App;
