import React from 'react';

import PickerSelect, {
  PickerSelectProps,
} from '@components/atoms/PickerSelect';
import Label from '@components/atoms/Label';

import { Container } from './styles';

interface PickerSelectGroupProps extends PickerSelectProps {
  label?: string;
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
      {label && <Label>{label}</Label>}
      <PickerSelect {...rest}>{children}</PickerSelect>
    </Container>
  );
};

export default PickerSelectGroup;
