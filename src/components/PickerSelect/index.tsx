import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { useField } from '@unform/core';
import { PickerProps } from '@react-native-community/picker/typings/Picker';
import Feather from 'react-native-vector-icons/Feather';

import { parseWidthPercentage } from '@utils/screenPercentage';

import {
  Container,
  StyledPickerSelect,
  ErrorContainer,
  ErrorLabel,
} from './styles';

export interface PickerSelectProps extends PickerProps {
  name: string;
  icon?: string;
  defaultValue: string;
  defaultValueLabel: string;
  containerStyle?: {};
  children: any;
}

interface PickerSelectValueReference {
  value: string;
}

interface PickerSelectRef {
  focus(): void;
}

const PickerSelect: React.RefForwardingComponent<
  PickerSelectRef,
  PickerSelectProps
> = (
  {
    name,
    icon,
    defaultValue,
    defaultValueLabel,
    containerStyle = {},
    children,
    ...rest
  },
  ref,
) => {
  const pickerSelectElementRef = useRef<any>(null);

  const { registerField, fieldName, error } = useField(name);
  const pickerSelectValueRef = useRef<PickerSelectValueReference>({
    value: defaultValue,
  });

  useImperativeHandle(ref, () => ({
    focus() {
      pickerSelectElementRef.current.focus();
    },
  }));

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: pickerSelectValueRef.current,
      path: 'selectedValue',
      setValue(_: any, value) {
        pickerSelectValueRef.current.value = value.toString();
        pickerSelectElementRef.current.setNativeProps({
          text: value.toString(),
        });
      },
      clearValue() {
        pickerSelectValueRef.current.value = '';
        pickerSelectElementRef.current.clear();
      },
    });
  }, [fieldName, registerField]);

  return (
    <>
      <Container style={containerStyle} isErrored={!!error}>
        {icon && (
          <Feather
            name={icon}
            size={parseWidthPercentage(20)}
            color="#999999"
            style={{ marginRight: parseWidthPercentage(16) }}
          />
        )}

        <StyledPickerSelect ref={pickerSelectElementRef} {...rest}>
          <StyledPickerSelect.Item
            key="default-value"
            label={defaultValueLabel}
            value={defaultValue}
            color="#ff8c42"
          />
          {children}
        </StyledPickerSelect>
      </Container>

      {!!error && (
        <ErrorContainer>
          <ErrorLabel>{error}</ErrorLabel>
        </ErrorContainer>
      )}
    </>
  );
};

export default forwardRef(PickerSelect);
