import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';
import Feather from 'react-native-vector-icons/Feather';

import { parseWidthPercentage } from '../../utils/screenPercentage';

import {
  Container,
  TextInput,
  ToggleContentVisibilityButton,
  ErrorContainer,
  ErrorLabel,
} from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
  toggleContentVisibilityButton?: boolean;
  containerStyle?: {};
}

interface InputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  {
    name,
    icon,
    secureTextEntry,
    toggleContentVisibilityButton,
    containerStyle = {},
    ...rest
  },
  ref,
) => {
  const inputElementRef = useRef<any>(null);

  const { registerField, defaultValue = '', fieldName, error } = useField(name);
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(secureTextEntry);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!inputValueRef.current.value);
  }, []);

  const handleToggleContentVisibility = useCallback(() => {
    setIsContentVisible(!isContentVisible);
    setIsSecureTextEntry(!isSecureTextEntry);
  }, [isContentVisible, isSecureTextEntry]);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(_: any, value) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      },
    });
  }, [fieldName, registerField]);

  return (
    <>
      <Container
        style={containerStyle}
        isFocused={isFocused}
        isErrored={!!error}
      >
        <Feather
          name={icon}
          size={parseWidthPercentage(20)}
          color={isFocused || isFilled ? '#6f7bae' : '#606060'}
          style={{ marginRight: parseWidthPercentage(16) }}
        />

        <TextInput
          {...rest}
          ref={inputElementRef}
          keyboardAppearance="dark"
          placeholderTextColor="#666360"
          secureTextEntry={isSecureTextEntry}
          defaultValue={defaultValue}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onChangeText={value => {
            inputValueRef.current.value = value;
          }}
        />

        {toggleContentVisibilityButton && (
          <ToggleContentVisibilityButton>
            <Feather
              name={isContentVisible ? 'eye-off' : 'eye'}
              size={parseWidthPercentage(20)}
              color={isFocused || isFilled ? '#6f7bae' : '#606060'}
              onPress={handleToggleContentVisibility}
            />
          </ToggleContentVisibilityButton>
        )}
      </Container>

      {!!error && (
        <ErrorContainer>
          <ErrorLabel>{error}</ErrorLabel>
        </ErrorContainer>
      )}
    </>
  );
};

export default forwardRef(Input);
