import React from 'react';

import PickerSelect, { PickerSelectProps } from '@components/PickerSelect';

import { Container, Label } from './styles';

interface PickerSelectGroupProps extends PickerSelectProps {
  label: string;
  containerStyle?: {};
}

const PickerSelectGroup: React.FC<PickerSelectGroupProps> = ({
  label,
  containerStyle,
  children,
  ...rest
}) => {
  return (
    <Container style={containerStyle}>
      <Label>{label}</Label>
      <PickerSelect {...rest}>{children}</PickerSelect>
    </Container>
  );
};

export default PickerSelectGroup;
