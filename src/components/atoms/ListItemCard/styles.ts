import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

interface ContainerProps {
  height: number;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  background: #312e38;
  border-radius: 8px;
  border-color: #ebebeb10;
  border-width: 1px;

  ${props =>
    props.height &&
    css`
      height: ${parseHeightPercentage(props.height)}px;
    `}
`;

interface ClickableProps {
  flexDirection: 'row' | 'column';
  padding: number;
}

export const Clickable = styled(RectButton)<ClickableProps>`
  width: 100%;
  height: 100%;
  border-radius: 8px;

  ${props =>
    props.flexDirection === 'row' &&
    css`
      flex-direction: row;
      align-items: center;
    `}

  ${props =>
    props.flexDirection === 'column' &&
    css`
      flex-direction: column;
      justify-content: center;
    `}

  ${props =>
    props.padding &&
    css`
      padding: ${parseHeightPercentage(props.padding)}px
        ${parseWidthPercentage(props.padding)}px
        ${parseHeightPercentage(props.padding)}px
        ${parseWidthPercentage(props.padding)}px;
    `}
`;
