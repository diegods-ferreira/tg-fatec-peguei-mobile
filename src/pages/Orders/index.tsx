import React from 'react';
import { View, Button } from 'react-native';
import { useAuth } from '../../hooks/auth';

// import { Container } from './styles';

const Orders: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Sign Out" onPress={() => signOut()} />
    </View>
  );
};

export default Orders;
