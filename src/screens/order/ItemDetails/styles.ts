import styled, { css } from 'styled-components/native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

interface ItemInfoWrapperProps {
  width?: number;
  flex?: number;
  marginRight?: number;
}

interface ItemInfoValueTextProps {
  textAlign?: 'left' | 'right' | 'center';
}

export const Container = styled.View`
  flex: 1;
  padding: ${parseHeightPercentage(24)}px ${parseWidthPercentage(24)}px;
`;

export const ItemImage = styled.Image`
  width: 100%;
  height: ${parseHeightPercentage(160)}px;
  margin-bottom: ${parseHeightPercentage(16)}px;
  border-width: 1px;
  border-color: #ebebeb10;
  border-radius: 8px;
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

export const ItemInfoValueContainer = styled.View`
  width: 100%;
  min-height: ${parseHeightPercentage(56)}px;
  padding: 0px ${parseWidthPercentage(16)}px;
  background: transparent;
  border-radius: 8px;
  border-width: 1px;
  border-color: #ebebeb10;
  flex-direction: row;
  align-items: center;
`;

export const ItemInfoValueIcon = styled(Feather)`
  margin-right: ${parseWidthPercentage(16)}px;
`;

export const ItemInfoValueText = styled.Text<ItemInfoValueTextProps>`
  flex: 1;
  color: #ebebeb;
  font-size: ${parseWidthPercentage(16)}px;
  margin: ${parseHeightPercentage(16)}px 0px;

  ${props =>
    props.textAlign === 'right' &&
    css`
      text-align: right;
    `}

  ${props =>
    props.textAlign === 'center' &&
    css`
      text-align: center;
    `}
`;

export const ItemInfoDataType = styled.Text`
  color: #606060;
  font-size: ${parseWidthPercentage(16)}px;
  padding-right: ${parseWidthPercentage(16)}px;
  border-right-width: 1px;
  border-right-color: #ebebeb10;
`;

export const HorizontalLine = styled.View`
  width: 100%;
  height: 1px;
  border-bottom-width: 1px;
  border-bottom-color: #ebebeb10;
  margin-top: ${parseHeightPercentage(24)}px;
  margin-bottom: ${parseHeightPercentage(8)}px;
`;

export const ItemInfoCategoryIcon = styled(FontAwesome)`
  margin-right: ${parseWidthPercentage(16)}px;
`;
