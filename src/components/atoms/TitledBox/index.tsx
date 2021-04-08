import React from 'react';

import boxShadowProps from '@utils/boxShadowProps';

import { Container, Title } from './styles';

interface TitledBoxProps {
  title: string;
}

const TitledBox: React.FC<TitledBoxProps> = ({ title, children }) => {
  return (
    <Container style={boxShadowProps}>
      <Title>{title}</Title>
      {children}
    </Container>
  );
};

export default TitledBox;
