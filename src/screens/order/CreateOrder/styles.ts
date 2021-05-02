import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

interface OrderItemContainerProps {
  hasBorder: boolean;
}

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

export const OrderItemContainer = styled.View<OrderItemContainerProps>`
  width: 100%;
  height: ${parseHeightPercentage(56)}px;

  ${props =>
    props.hasBorder &&
    css`
      border-bottom-width: 1px;
      border-bottom-color: #ebebeb10;
    `}
`;

export const OrderItemPressable = styled(RectButton)`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const orderItemQuantitySize = parseHeightPercentage(24);

export const OrderItemQuantity = styled.View`
  width: ${orderItemQuantitySize}px;
  height: ${orderItemQuantitySize}px;
  border-radius: 8px;
  margin-right: ${parseWidthPercentage(16)}px;
  background: #6f7bae;
  align-items: center;
  justify-content: center;
`;

export const OrderItemQuantityText = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(12)}px;
`;

export const OrderItemNameAndPacking = styled.View`
  flex: 1;
`;

export const OrderItemName = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(14)}px;
`;

export const OrderItemPacking = styled.Text`
  color: #ff8c42;
  font-size: ${parseWidthPercentage(12)}px;
  font-weight: bold;
`;

const orderItemImageSize = parseHeightPercentage(40);

export const OrderItemImage = styled.Image`
  width: ${orderItemImageSize}px;
  height: ${orderItemImageSize}px;
  border-radius: 8px;
  margin-left: ${parseWidthPercentage(16)}px;
`;

export const AddressContainer = styled.View`
  width: 100%;
  margin-top: ${parseHeightPercentage(16)}px;
`;

export const AddressTextContainer = styled.View`
  width: 100%;
  min-height: ${parseHeightPercentage(56)}px;
  padding: ${parseHeightPercentage(16)}px ${parseWidthPercentage(16)}px;
  background: #232129;
  border-radius: 8px;
  margin-bottom: ${parseHeightPercentage(8)}px;
  border-width: 2px;
  border-color: #ebebeb10;
`;

export const AddressText = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(16)}px;
`;

export const NoItemTextContainer = styled.View`
  width: 100%;
  height: ${parseHeightPercentage(56)}px;
  justify-content: center;
  align-items: center;
`;

export const NoItemText = styled.Text`
  color: #606060;
  font-size: ${parseWidthPercentage(14)}px;
  font-weight: bold;
`;

export const AddItemToOrderButtonContainer = styled.View`
  width: 100%;
  height: ${parseHeightPercentage(40)}px;
  border-bottom-color: #ebebeb10;
  border-bottom-width: 1px;
  border-top-color: #ebebeb10;
  border-top-width: 1px;
`;

export const AddItemToOrderButton = styled(RectButton)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const AddItemToOrderButtonText = styled.Text`
  color: #fcaf58;
  font-size: ${parseWidthPercentage(12)}px;
  font-weight: bold;
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
  min-height: ${parseHeightPercentage(64)}px;
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

export const ItemInfoValueIcon = styled(Feather)`
  margin-right: ${parseWidthPercentage(16)}px;
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

export const AttachPurchaseInvoiceWrapper = styled.View`
  width: 100%;
  margin-top: ${parseHeightPercentage(16)}px;
`;

export const AttachPurchaseInvoiceLabel = styled.Text`
  color: #ff8c42;
  font-size: ${parseWidthPercentage(14)}px;
  margin-bottom: ${parseHeightPercentage(8)}px;
`;

export const AttachPurchaseInvoiceValueContainer = styled.View`
  width: 100%;
  height: ${parseHeightPercentage(64)}px;
  background: #232129;
  border-radius: 8px;
  border-width: 2px;
  border-color: #ebebeb10;
`;

export const AttachPurchaseInvoicePressable = styled(RectButton)`
  width: 100%;
  height: 100%;
  padding: 0px ${parseWidthPercentage(16)}px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
`;

export const AttachPurchaseInvoiceValueIcon = styled(Feather)`
  margin-right: ${parseWidthPercentage(16)}px;
`;

export const AttachPurchaseInvoiceValueText = styled.Text`
  flex: 1;
  color: #ebebeb;
  font-size: ${parseWidthPercentage(16)}px;
  margin: ${parseHeightPercentage(16)}px 0px;
`;

export const DeliverymanContainer = styled.View`
  width: 100%;
  height: ${parseHeightPercentage(96)}px;
  padding: ${parseHeightPercentage(16)}px ${parseWidthPercentage(16)}px;
  background: #312e38;
  border-radius: 8px;
  border-width: 1px;
  border-color: #6f7bae;
  flex-direction: row;
  align-items: center;
`;

export const DeliverymanMeta = styled.View`
  flex: 1;
  margin-left: ${parseWidthPercentage(16)}px;
`;

export const DeliverymanTextWrapper = styled.View`
  flex-direction: column;
  justify-content: center;
`;

export const DeliverymanFullName = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(12)}px;
  font-weight: bold;
  margin-right: ${parseWidthPercentage(8)}px;
`;

export const DeliverymanUsername = styled.Text`
  color: #606060;
  font-size: ${parseWidthPercentage(10)}px;
  font-style: italic;
`;

export const DeliverymanAvaluationStars = styled.View`
  flex: 1;
  margin-top: ${parseHeightPercentage(4)}px;
  align-self: flex-start;
  justify-content: flex-end;
`;

export const RatingStarsContainer = styled.View`
  width: 100%;
  height: ${parseHeightPercentage(40)}px;
  margin-top: ${parseHeightPercentage(24)}px;
  align-self: center;
  justify-content: center;
`;
