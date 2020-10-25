import React from 'react';

import boxShadowProps from '@utils/boxShadowProps';

import { Container, Title } from './styles';

interface InputsContainerProps {
  title: string;
}

const InputsContainer: React.FC<InputsContainerProps> = ({
  title,
  children,
}) => {
  return (
    <Container style={boxShadowProps}>
      <Title>{title}</Title>
      {children}
    </Container>
  );
};

export default InputsContainer;
