import React from 'react';

import { Container, Clickable } from './styles';

interface ListItemCardProps {
  flexDirection?: 'row' | 'column';
  padding?: number;
  height?: number;
  onPress: () => void;
}

const ListItemCard: React.FC<ListItemCardProps> = ({
  flexDirection = 'row',
  padding = 16,
  height = 96,
  onPress,
  children,
}) => {
  return (
    <Container height={height}>
      <Clickable
        flexDirection={flexDirection}
        padding={padding}
        rippleColor="#ebebeb10"
        onPress={onPress}
      >
        {children}
      </Clickable>
    </Container>
  );
};

export default ListItemCard;
