import styled, { css } from 'styled-components/native';
import Feather from 'react-native-vector-icons/Feather';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

interface ContainerProps {
  isFocused: boolean;
  isErrored: boolean;
}

interface RNTextInputProps {
  textAlign?: 'left' | 'right' | 'center';
}

interface IconProps {
  marginRight?: number;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  min-height: ${parseHeightPercentage(56)}px;
  padding: 0 ${parseWidthPercentage(16)}px;
  background: #232129;
  border-radius: 8px;
  margin-bottom: ${parseHeightPercentage(8)}px;
  border-width: 2px;
  border-color: #ebebeb10;
  flex-direction: row;
  align-items: center;
  position: relative;

  ${props =>
    props.isFocused &&
    css`
      border-color: #6f7bae;
    `}

  ${props =>
    props.isErrored &&
    css`
      border-color: #e74c3c;
    `}
`;

export const RNTextInput = styled.TextInput<RNTextInputProps>`
  flex: 1;
  color: #ebebeb;
  font-size: ${parseWidthPercentage(16)}px;
  padding-left: 0px;
  padding-right: 0px;

  ${props =>
    props.textAlign &&
    css`
      text-align: ${props.textAlign};
    `}
`;

export const Icon = styled(Feather)<IconProps>`
  ${props =>
    props.marginRight &&
    css`
      margin-right: ${parseWidthPercentage(16)}px;
    `}
`;

const toggleContentVisibilityButtonSize = parseWidthPercentage(20);

export const ToggleContentVisibilityButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: ${toggleContentVisibilityButtonSize}px;
  height: ${toggleContentVisibilityButtonSize}px;
  border-radius: ${toggleContentVisibilityButtonSize / 2}px;
  margin-left: ${parseWidthPercentage(16)}px;
`;

export const ErrorContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  position: absolute;
  bottom: ${parseHeightPercentage(-16)}px;
  left: 0;
`;

export const ErrorLabel = styled.Text`
  color: #e74c3c;
  font-size: ${parseWidthPercentage(11)}px;
`;
