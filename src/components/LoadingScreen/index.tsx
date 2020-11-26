import React from 'react';
import { ActivityIndicator } from 'react-native';

import { Container } from './styles';

const LoadingScreen: React.FC = () => {
  return (
    <Container>
      <ActivityIndicator size="large" color="#6f7bae" />
    </Container>
  );
};

export default LoadingScreen;
