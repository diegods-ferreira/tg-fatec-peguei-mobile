import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

interface ContainerProps {
  backgroundColor: string;
  widthPercentage?: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  flex?: number;
}

interface ButtonTextProps {
  textColor: string;
}

export const Container = styled(RectButton)<ContainerProps>`
  height: ${parseHeightPercentage(56)}px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;

  ${props =>
    props.flex &&
    css`
      flex: ${props.flex};
    `}

  ${props =>
    props.backgroundColor &&
    css`
      background: ${props.backgroundColor};
    `}

  ${props =>
    props.widthPercentage &&
    css`
      width: ${props.widthPercentage}%;
    `}

  ${props =>
    (props.marginLeft || props.marginTop || props.marginBottom) &&
    css`
      margin: ${parseHeightPercentage(props.marginTop)}px 0px
        ${parseHeightPercentage(props.marginBottom)}px
        ${parseWidthPercentage(props.marginLeft)}px;
    `}
`;

export const ButtonText = styled.Text<ButtonTextProps>`
  font-size: ${parseWidthPercentage(18)}px;
  font-weight: bold;

  ${props =>
    props.textColor &&
    css`
      color: ${props.textColor};
    `}
`;
