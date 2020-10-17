import styled, { css } from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface ContainerProps {
  isFocused: boolean;
  isErrored: boolean;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: 56px;
  padding: 0 16px;
  background: #232129;
  border-radius: 8px;
  margin-bottom: 8px;
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
  font-size: 16px;
  font-family: sans-serif;
`;

export const Icon = styled(FeatherIcon)`
  margin-right: 16px;
`;
