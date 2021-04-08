import React from 'react';
import Feather from 'react-native-vector-icons/Feather';

import { parseWidthPercentage } from '@utils/screenPercentage';
import boxShadowProps from '@utils/boxShadowProps';

import { Container, Button } from './styles';

interface FloatingButton {
  iconName: string;
  onPress: () => void;
}

const FloatingButton: React.FC<FloatingButton> = ({ iconName, onPress }) => {
  return (
    <Container style={boxShadowProps}>
      <Button onPress={onPress} rippleColor="#00000050">
        <Feather
          name={iconName}
          size={parseWidthPercentage(24)}
          color="#ebebeb"
        />
      </Button>
    </Container>
  );
};

export default FloatingButton;
