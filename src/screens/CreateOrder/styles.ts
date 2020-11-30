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

export const CityStateSelectContainer = styled.View`
  width: 100%;
  flex-direction: row;
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
