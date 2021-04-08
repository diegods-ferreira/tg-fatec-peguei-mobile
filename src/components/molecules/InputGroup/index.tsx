import React from 'react';

import Input, { InputProps } from '@components/atoms/Input';

import { Container, Label } from './styles';

interface InputGroupProps extends InputProps {
  label: string;
  containerStyle?: {};
  inputContainerStyle?: {};
}

const InputGroup: React.FC<InputGroupProps> = ({
  label,
  containerStyle,
  inputContainerStyle,
  children,
  ...rest
}) => {
  return (
    <Container style={containerStyle}>
      <Label>{label}</Label>
      <Input containerStyle={inputContainerStyle} {...rest} />
      {children}
    </Container>
  );
};

export default InputGroup;
