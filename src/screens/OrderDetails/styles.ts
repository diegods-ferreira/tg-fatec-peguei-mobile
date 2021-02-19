import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';
import { TextInputMask } from 'react-native-masked-text';

interface OrderInfoWrapperProps {
  isFirst?: boolean;
}

interface OrderItemContainerProps {
  hasBorder: boolean;
}

interface OfferToPickupInputContainerProps {
  isFocused?: boolean;
  hasMarginTop?: boolean;
}

interface TextInputProps {
  textAlign?: 'left' | 'right' | 'center';
}

interface OfferToPickupModalTitleProps {
  fontWeight?: 'normal';
  fontSize?: number;
}

export const Container = styled.View`
  flex: 1;
`;

export const RequesterContainer = styled.View`
  padding: 0px ${parseWidthPercentage(24)}px;
  margin: ${parseHeightPercentage(24)}px 0px;
  max-height: ${parseHeightPercentage(80)}px;
  flex-direction: row;
  align-items: center;
`;

const requesterAvatarSize = parseHeightPercentage(80);

export const RequesterAvatar = styled.Image`
  width: ${requesterAvatarSize}px;
  height: ${requesterAvatarSize}px;
  border-radius: ${requesterAvatarSize / 2}px;
  margin-right: ${parseWidthPercentage(16)}px;
`;

export const RequesterInfo = styled.View`
  flex: 1;
`;

export const RequesterFullName = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(14)}px;
  font-weight: bold;
  margin-right: ${parseWidthPercentage(8)}px;
`;

export const RequesterUsername = styled.Text`
  color: #606060;
  font-size: ${parseWidthPercentage(10)}px;
  font-style: italic;
`;

export const OrderTextWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const OrderDeliveryInfo = styled.View`
  flex: 1;
  justify-content: space-between;
  margin-top: ${parseHeightPercentage(8)}px;
`;

export const OrderItensCounter = styled.Text`
  color: #ff8c42;
  font-size: ${parseWidthPercentage(10)}px;
  margin-right: ${parseWidthPercentage(4)}px;
  margin-left: ${parseWidthPercentage(4)}px;
`;

export const OrderCreatedAt = styled.Text`
  color: #adadad;
  font-size: ${parseWidthPercentage(10)}px;
`;

export const OrderDeliveryLocation = styled.Text`
  color: #adadad;
  font-size: ${parseWidthPercentage(10)}px;
  margin-right: ${parseWidthPercentage(4)}px;
`;

export const OrderDeliveryDistance = styled.Text`
  color: #ff8c42;
  font-size: ${parseWidthPercentage(11)}px;
`;

export const ChatButtonContainer = styled.View`
  justify-content: flex-end;
  height: 100%;
`;

const chatButtonSize = parseHeightPercentage(50);

export const ChatButton = styled.View`
  width: ${chatButtonSize}px;
  height: ${chatButtonSize}px;
  border-radius: ${chatButtonSize / 2}px;
  margin-left: ${parseWidthPercentage(16)}px;
  background: #6f7bae;
`;

export const ChatButtonPressable = styled(RectButton)`
  width: 100%;
  height: 100%;
  border-radius: ${chatButtonSize / 2}px;
  justify-content: center;
  align-items: center;
`;

export const OrderInfoContainer = styled.View`
  padding: 0px ${parseWidthPercentage(24)}px ${parseHeightPercentage(24)}px;
`;

export const OrderInfoWrapper = styled.View<OrderInfoWrapperProps>`
  width: 100%;
  flex-direction: row;
  align-items: center;

  ${props =>
    props.isFirst
      ? css`
          margin-top: ${parseHeightPercentage(8)}px;
        `
      : css`
          margin-top: ${parseHeightPercentage(16)}px;
        `}
`;

export const OrderInfoText = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(14)}px;
  margin-left: ${parseWidthPercentage(16)}px;
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
  width: 100%;
  height: 100%;
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

export const ViewInvoiceButton = styled.TouchableOpacity`
  width: 100%;
  height: ${parseHeightPercentage(56)}px;
  margin-top: ${parseHeightPercentage(8)}px;
  border-width: 2px;
  border-color: #6f7bae;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

export const ViewInvoiceButtonText = styled.Text`
  color: #6f7bae;
  font-size: ${parseWidthPercentage(18)}px;
  font-weight: bold;
`;

export const OfferToPickupIndicatorContainer = styled.TouchableOpacity`
  width: 100%;
  height: ${parseHeightPercentage(40)}px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  background-color: #6ab04c;
  justify-content: center;
  align-items: center;
`;

export const OfferToPickupIndicatorText = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(13)}px;
`;

export const OfferToPickupModalContainer = styled.View`
  width: 100%;
  padding: ${parseHeightPercentage(24)}px ${parseWidthPercentage(24)}px;
  background-color: #312e38;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

export const OfferToPickupModalTitle = styled.Text<
  OfferToPickupModalTitleProps
>`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(18)}px;
  text-align: center;
  font-weight: bold;

  ${props =>
    props.fontWeight &&
    css`
      font-weight: ${props.fontWeight};
    `}

  ${props =>
    props.fontSize &&
    css`
      font-size: ${parseWidthPercentage(props.fontSize)}px;
    `}
`;

export const OfferToPickupDateTime = styled.Text`
  color: #6f7bae;
  font-size: ${parseWidthPercentage(18)}px;
  font-weight: bold;
  text-align: center;
  margin-top: ${parseHeightPercentage(4)}px;
`;

export const OfferToPickupInputContainer = styled.View<
  OfferToPickupInputContainerProps
>`
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
    props.hasMarginTop &&
    css`
      margin-top: ${parseHeightPercentage(24)}px;
    `}
`;

export const OfferToPickupInputContainerLabel = styled.Text`
  color: #ff8c42;
  font-size: ${parseWidthPercentage(14)}px;
  margin-top: ${parseHeightPercentage(24)}px;
  margin-bottom: ${parseHeightPercentage(8)}px;
`;

export const TextInput = styled(TextInputMask)<TextInputProps>`
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

export const OfferToPickupButtons = styled.View`
  margin-top: ${parseHeightPercentage(24)}px;
  flex-direction: row;
  justify-content: space-between;
`;

export const OfferToPickupCancelDeleteButton = styled.TouchableOpacity`
  flex: 1;
  height: ${parseHeightPercentage(56)}px;
  border-radius: 8px;
  border-width: 2px;
  border-color: #eb4d4b;

  justify-content: center;
  align-items: center;
`;

export const OfferToPickupCancelDeleteButtonText = styled.Text`
  color: #eb4d4b;
  font-size: ${parseWidthPercentage(18)}px;
  font-weight: bold;
`;

export const OfferToPickupOkUpdateButton = styled(RectButton)`
  flex: 1;
  height: ${parseHeightPercentage(56)}px;
  margin-left: ${parseWidthPercentage(8)}px;
  border-radius: 8px;
  background-color: #6ab04c;

  justify-content: center;
  align-items: center;
`;

export const OfferToPickupOkUpdateButtonText = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(18)}px;
  font-weight: bold;
`;
