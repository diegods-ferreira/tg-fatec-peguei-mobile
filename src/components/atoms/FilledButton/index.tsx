import React from 'react';
import { ActivityIndicator } from 'react-native';
import { RectButtonProperties } from 'react-native-gesture-handler';

import { Container, ButtonText } from './styles';

interface FilledButtonProps extends RectButtonProperties {
  showLoadingIndicator?: boolean;
  backgroundColor?: string;
  textColor?: string;
  widthPercentage?: number;
  marginTop?: number;
  marginLeft?: number;
  flex?: number;
  children: string;
}

const FilledButton: React.FC<FilledButtonProps> = ({
  showLoadingIndicator,
  backgroundColor = '#ff8c42',
  textColor = '#312e38',
  widthPercentage,
  marginTop = 8,
  marginLeft = 0,
  flex,
  rippleColor = '#00000050',
  children,
  ...rest
}) => (
  <Container
    backgroundColor={backgroundColor}
    widthPercentage={widthPercentage}
    marginTop={marginTop}
    marginLeft={marginLeft}
    flex={flex}
    rippleColor={rippleColor}
    {...rest}
  >
    {showLoadingIndicator ? (
      <ActivityIndicator size="large" color={textColor} />
    ) : (
      <ButtonText textColor={textColor}>{children}</ButtonText>
    )}
  </Container>
);

export default FilledButton;
