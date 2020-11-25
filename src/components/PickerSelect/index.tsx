import React from 'react';
import { PickerProps } from '@react-native-community/picker/typings/Picker';
import Feather from 'react-native-vector-icons/Feather';

import { parseWidthPercentage } from '@utils/screenPercentage';

import { Container, StyledPickerSelect } from './styles';

export interface PickerSelectProps extends PickerProps {
  icon?: string;
  defaultValue: string;
  defaultValueLabel: string;
  containerStyle?: {};
  children: any;
}

const PickerSelect: React.FC<PickerSelectProps> = ({
  icon,
  defaultValue,
  defaultValueLabel,
  containerStyle = {},
  children,
  ...rest
}) => {
  return (
    <>
      <Container style={containerStyle}>
        {icon && (
          <Feather
            name={icon}
            size={parseWidthPercentage(20)}
            color="#999999"
            style={{ marginRight: parseWidthPercentage(16) }}
          />
        )}

        <StyledPickerSelect {...rest}>
          <StyledPickerSelect.Item
            key="default-value"
            label={defaultValueLabel}
            value={defaultValue}
            color="#ff8c42"
          />
          {children}
        </StyledPickerSelect>
      </Container>
    </>
  );
};

export default PickerSelect;
