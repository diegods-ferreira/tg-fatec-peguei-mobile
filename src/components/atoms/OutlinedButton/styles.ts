import styled, { css } from 'styled-components/native';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

interface ContainerProps {
  color: string;
  widthPercentage?: number;
  marginTop?: number;
  flex?: number;
}

interface OutlinedButtonTextProps {
  color: string;
}

export const Container = styled.TouchableOpacity<ContainerProps>`
  height: ${parseHeightPercentage(56)}px;
  border-width: 2px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;

  ${props =>
    props.color &&
    css`
      border-color: ${props.color};
    `}

  ${props =>
    props.widthPercentage &&
    css`
      width: ${props.widthPercentage}%;
    `}

  ${props =>
    props.marginTop &&
    css`
      margin-top: ${parseHeightPercentage(props.marginTop)}px;
    `}

  ${props =>
    props.flex &&
    css`
      flex: ${props.flex};
    `}
`;

export const OutlinedButtonText = styled.Text<OutlinedButtonTextProps>`
  font-size: ${parseWidthPercentage(18)}px;
  font-weight: bold;

  ${props =>
    props.color &&
    css`
      color: ${props.color};
    `}
`;
