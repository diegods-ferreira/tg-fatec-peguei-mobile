import React from 'react';
import { Button, Text, View } from 'react-native';

import { useAuth } from '@hooks/auth';

// import { Container } from './styles';

const Trips: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Trips</Text>
      <Button title="Sign Out" onPress={() => signOut()} />
    </View>
  );
};

export default Trips;
