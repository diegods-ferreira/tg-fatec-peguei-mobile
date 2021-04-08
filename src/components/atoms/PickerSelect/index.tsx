import React from 'react';
import { PickerProps } from '@react-native-community/picker/typings/Picker';

import { parseWidthPercentage } from '@utils/screenPercentage';

import { Container, StyledPickerSelect, Icon } from './styles';

export interface PickerSelectProps extends PickerProps {
  icon?: string;
  defaultValue: string | number;
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
          <Icon name={icon} size={parseWidthPercentage(20)} color="#606060" />
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
