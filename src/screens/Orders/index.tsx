import React, { useCallback, useEffect } from 'react';
import { View, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '@hooks/auth';

// import { Container } from './styles';

const Orders: React.FC = () => {
  const { user, signOut } = useAuth();

  const navigation = useNavigation();

  const handleNavigateToEditProfile = useCallback(() => {
    navigation.navigate('EditProfile');
  }, [navigation]);

  useEffect(() => {
    if (!user.address && !user.state && !user.city) {
      Alert.alert(
        'Aviso!',
        'Há informações do seu perfil pendentes de preenchimento.\n\nRecomendamos que você atualize o seu perfil o quanto antes.',
        [
          { text: 'Agora não', style: 'cancel' },
          {
            text: 'Vamos lá!',
            style: 'default',
            onPress: handleNavigateToEditProfile,
          },
        ],
      );
    }
  }, [user, handleNavigateToEditProfile]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Sign Out" onPress={() => signOut()} />
    </View>
  );
};

export default Orders;
