import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import { Picker } from '@react-native-community/picker';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

interface ItemInfoWrapperProps {
  width?: number;
  flex?: number;
  marginRight?: number;
}

interface ItemInfoValueContainerProps {
  paddingHorizontal?: number;
  isFocused?: boolean;
  paddingLeft?: number;
}

interface TextInputProps {
  textAlign?: 'left' | 'right' | 'center';
}

export const Container = styled.View`
  flex: 1;
  padding: ${parseHeightPercentage(24)}px ${parseWidthPercentage(24)}px;
`;

export const ItemImageWrapper = styled.View`
  width: 100%;
  height: ${parseHeightPercentage(160)}px;
  margin-bottom: ${parseHeightPercentage(16)}px;
  border-width: 1px;
  border-color: #ebebeb10;
  border-radius: 8px;
`;

export const ItemImagePicker = styled(RectButton)`
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;

export const ItemImage = styled.Image`
  flex: 1;
`;

export const PickItemImageIndicator = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const PickItemImageIndicatorText = styled.Text`
  color: #606060;
  font-size: ${parseWidthPercentage(14)}px;
`;

export const ItemInfoWrappersContainer = styled.View`
  width: 100%;
  flex-direction: row;
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
    props.paddingHorizontal &&
    css`
      padding: 0px ${parseWidthPercentage(props.paddingHorizontal)}px;
    `}

  ${props =>
    props.isFocused &&
    css`
      border-color: #6f7bae;
    `}

  ${props =>
    props.paddingLeft &&
    css`
      padding-left: ${parseWidthPercentage(props.paddingLeft)}px;
    `}
`;

export const TextInput = styled.TextInput<TextInputProps>`
  flex: 1;
  color: #ebebeb;
  font-size: ${parseWidthPercentage(16)}px;
  text-align: left;

  ${props =>
    props.textAlign &&
    css`
      text-align: ${props.textAlign};
    `}
`;

export const ItemAlterQuantityButton = styled.TouchableOpacity``;

export const StyledPickerSelect = styled(Picker)`
  width: ${parseWidthPercentage(88)}px;
  color: #999999;
  font-size: ${parseWidthPercentage(16)}px;
`;
