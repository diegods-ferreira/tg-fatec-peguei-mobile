import React from 'react';

import { Container, Title } from './styles';

interface InputsContainerProps {
  title: string;
}

const InputsContainer: React.FC<InputsContainerProps> = ({
  title,
  children,
}) => {
  return (
    <Container
      style={{
        elevation: 8,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: '#000000',
        shadowOpacity: 0.25,
        shadowRadius: 8,
      }}
    >
      <Title>{title}</Title>
      {children}
    </Container>
  );
};

export default InputsContainer;
