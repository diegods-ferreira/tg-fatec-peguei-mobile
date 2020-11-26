import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

import boxShadowProps from '@utils/boxShadowProps';
import { parseWidthPercentage } from '@utils/screenPercentage';

import { Container, BackButton, Title, ContextMenuButton } from './styles';

interface TitleBarProps {
  title: string;
  showContextMenuButton?: boolean;
}

const TitleBar: React.FC<TitleBarProps> = ({
  title,
  showContextMenuButton = false,
}) => {
  const navigation = useNavigation();

  const handleNavigateBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <Container style={boxShadowProps}>
      <BackButton rippleColor="#EBEBEB10" onPress={handleNavigateBack}>
        <Feather
          name="arrow-left"
          size={parseWidthPercentage(24)}
          color="#EBEBEB"
        />
      </BackButton>

      <Title>{title}</Title>

      <ContextMenuButton
        rippleColor="#EBEBEB10"
        enabled={showContextMenuButton}
      >
        {showContextMenuButton && (
          <Feather
            name="more-vertical"
            size={parseWidthPercentage(24)}
            color="#EBEBEB"
          />
        )}
      </ContextMenuButton>
    </Container>
  );
};

export default TitleBar;
