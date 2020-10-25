import React from 'react';

import Input, { InputProps } from '@components/Input';

import { Container, Label } from './styles';

interface InputGroupProps extends InputProps {
  label: string;
  containerStyle?: {};
}

const InputGroup: React.FC<InputGroupProps> = ({
  label,
  containerStyle,
  children,
  ...rest
}) => {
  return (
    <Container style={containerStyle}>
      <Label>{label}</Label>
      <Input {...rest} />
      {children}
    </Container>
  );
};

export default InputGroup;
