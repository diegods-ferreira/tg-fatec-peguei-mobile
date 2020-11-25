import React from 'react';
import { Text, View } from 'react-native';

// import { Container } from './styles';

const MyOrders: React.FC = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#2b2831',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#ffffff', fontSize: 24 }}>My Orders</Text>
    </View>
  );
};

export default MyOrders;
