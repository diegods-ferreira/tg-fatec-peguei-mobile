import styled, { css } from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
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
    props.isErrored &&
    css`
      border-color: #e74c3c;
    `}

  ${props =>
    props.isFocused &&
    css`
      border-color: #6f7bae;
    `}
`;

export const TextInput = styled.TextInput`
  flex: 1;
  color: #fff;
  font-size: ${parseWidthPercentage(16)}px;
  font-family: sans-serif;
`;

export const Icon = styled(FeatherIcon)`
  margin-right: ${parseWidthPercentage(16)}px;
`;
