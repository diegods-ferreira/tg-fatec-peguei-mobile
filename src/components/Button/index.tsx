import React from 'react';
import { ActivityIndicator } from 'react-native';
import { RectButtonProperties } from 'react-native-gesture-handler';

import { Container, ButtonText } from './styles';

interface ButtonProps extends RectButtonProperties {
  showLoadingIndicator?: boolean;
  children: string;
}

const Button: React.FC<ButtonProps> = ({
  showLoadingIndicator,
  children,
  ...rest
}) => (
  <Container {...rest} rippleColor="#00000050">
    {showLoadingIndicator ? (
      <ActivityIndicator size="large" color="#312e38" />
    ) : (
      <ButtonText>{children}</ButtonText>
    )}
  </Container>
);

export default Button;
