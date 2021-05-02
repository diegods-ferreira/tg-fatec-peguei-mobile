import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

interface ItemInfoWrapperProps {
  width?: number;
  flex?: number;
  marginRight?: number;
  marginBottom?: number;
}

interface ItemInfoValueContainerProps {
  isFocused?: boolean;
  borderColor?: string;
}

interface ItemInfoValueText {
  color?: string;
}

export const Container = styled.View`
  flex: 1;
  padding: ${parseHeightPercentage(24)}px ${parseWidthPercentage(24)}px;
`;

export const DateTimePickerWrapper = styled.View`
  width: 100%;
  margin-top: ${parseHeightPercentage(16)}px;
`;

export const DateTimePickerLabel = styled.Text`
  color: #ff8c42;
  font-size: ${parseWidthPercentage(14)}px;
  margin-bottom: ${parseHeightPercentage(8)}px;
`;

export const DateTimePickerValueContainer = styled.View`
  width: 100%;
  height: ${parseHeightPercentage(64)}px;
  background: #232129;
  border-radius: 8px;
  border-width: 2px;
  border-color: #ebebeb10;
`;

export const DateTimePickerPressable = styled(RectButton)`
  width: 100%;
  height: 100%;
  padding: 0px ${parseWidthPercentage(16)}px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
`;

export const DateTimePickerValueIcon = styled(Feather)`
  margin-right: ${parseWidthPercentage(16)}px;
`;

export const DateTimePickerValueText = styled.Text`
  flex: 1;
  color: #ebebeb;
  font-size: ${parseWidthPercentage(16)}px;
  margin: ${parseHeightPercentage(16)}px 0px;
`;

export const InputsWrapper = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: flex-end;
`;

export const ItemInfoWrapper = styled.View<ItemInfoWrapperProps>`
  width: 100%;
  margin-top: ${parseHeightPercentage(16)}px;

  ${props =>
    props.width &&
    css`
      width: ${parseWidthPercentage(props.width)}px;
    `}

  ${props =>
    props.flex &&
    css`
      flex: ${props.flex};
    `}

    ${props =>
    props.marginRight &&
    css`
      margin-right: ${parseWidthPercentage(props.marginRight)}px;
    `}

    ${props =>
    props.marginBottom &&
    css`
      margin-bottom: ${parseWidthPercentage(props.marginBottom)}px;
    `}
`;

export const ItemInfoLabel = styled.Text`
  color: #ff8c42;
  font-size: ${parseWidthPercentage(14)}px;
  margin-bottom: ${parseHeightPercentage(8)}px;
`;

export const ItemInfoValueContainer = styled.View<ItemInfoValueContainerProps>`
  width: 100%;
  min-height: ${parseHeightPercentage(56)}px;
  padding: 0px ${parseWidthPercentage(16)}px;
  background: #232129;
  border-radius: 8px;
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
    props.borderColor &&
    css`
      border-color: ${props.borderColor};
    `}
`;

export const ItemInfoValueText = styled.Text<ItemInfoValueText>`
  flex: 1;
  color: #ebebeb;
  font-size: ${parseWidthPercentage(16)}px;

  ${props =>
    props.color &&
    css`
      color: ${props.color};
    `}
`;
