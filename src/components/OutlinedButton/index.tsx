import React from 'react';
import { ActivityIndicator, TouchableOpacityProps } from 'react-native';

import { Container, OutlinedButtonText } from './styles';

interface OutlinedButtonProps extends TouchableOpacityProps {
  showLoadingIndicator?: boolean;
  color: string;
  widthPercentage?: number;
  marginTop?: number;
  flex?: number;
  children: string;
}

const OutlinedButton: React.FC<OutlinedButtonProps> = ({
  showLoadingIndicator,
  color,
  widthPercentage,
  marginTop,
  flex,
  children,
  ...rest
}) => (
  <Container
    color={color}
    widthPercentage={widthPercentage}
    marginTop={marginTop}
    flex={flex}
    {...rest}
  >
    {showLoadingIndicator ? (
      <ActivityIndicator size="large" color="#312e38" />
    ) : (
      <OutlinedButtonText color={color}>{children}</OutlinedButtonText>
    )}
  </Container>
);

export default OutlinedButton;
