import React from 'react';

import TextInput, { TextInputProps } from '@components/atoms/TextInput';
import Label from '@components/atoms/Label';

import { Container } from './styles';

interface InputGroupProps extends TextInputProps {
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
      <TextInput containerStyle={inputContainerStyle} {...rest} />
      {children}
    </Container>
  );
};

export default InputGroup;
