import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Routes from './routes';

const App: React.FC = () => (
  <NavigationContainer>
    <StatusBar barStyle="light-content" backgroundColor="#2b2831" translucent />

    <SafeAreaView style={{ flex: 1, backgroundColor: '#2b2831' }}>
      <Routes />
    </SafeAreaView>
  </NavigationContainer>
);

export default App;
