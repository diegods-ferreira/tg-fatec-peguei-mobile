import styled, { css } from 'styled-components/native';
import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '../../utils/screenPercentage';

interface ContainerProps {
  isFocused: boolean;
  isErrored: boolean;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: ${parseHeightPercentage(56)}px;
  padding: 0 ${parseWidthPercentage(16)}px;
  background: #232129;
  border-radius: 8px;
  margin-bottom: ${parseHeightPercentage(8)}px;
  border-width: 2px;
  border-color: #ebebeb10;
  flex-direction: row;
  align-items: center;

  ${props =>
    props.isFocused &&
    css`
      border-color: #6f7bae;
    `}

  ${props =>
    props.isErrored &&
    css`
      border-color: #e74c3c;
      margin-bottom: ${parseHeightPercentage(2)}px;
    `}
`;

export const TextInput = styled.TextInput`
  flex: 1;
  color: #fff;
  font-size: ${parseWidthPercentage(16)}px;
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
  justify-content: flex-end;
  margin-bottom: ${parseHeightPercentage(8)}px;
`;

export const ErrorLabel = styled.Text`
  color: #e74c3c;
  font-size: ${parseWidthPercentage(11)}px;
`;
