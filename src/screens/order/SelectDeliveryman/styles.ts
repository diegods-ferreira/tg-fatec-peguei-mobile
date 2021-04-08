import styled, { css } from 'styled-components/native';
import { FlatList } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';
import { PickupOffer } from '.';

interface PickupOfferContainerProps {
  isSelected: boolean;
}

interface PickupOfferSelectButtonProps {
  isSelected: boolean;
}

export const Container = styled.View`
  flex: 1;
  background: #2b2831;
`;

export const ListHeaderText = styled.Text`
  color: #ff8c42;
  font-size: ${parseWidthPercentage(14)}px;
  margin-bottom: ${parseHeightPercentage(8)}px;
  margin-top: ${parseHeightPercentage(24)}px;
`;

export const PickupOffersList = styled(
  FlatList as new () => FlatList<PickupOffer>,
)`
  width: 100%;
  padding-left: ${parseWidthPercentage(24)}px;
  padding-right: ${parseWidthPercentage(24)}px;
`;

export const PickupOfferContainer = styled.View<PickupOfferContainerProps>`
  width: 100%;
  height: ${parseHeightPercentage(96)}px;
  background: #312e38;
  border-radius: 8px;
  border-color: #ebebeb10;
  border-width: 1px;

  ${props =>
    props.isSelected &&
    css`
      border-color: #ff8c42;
    `}
`;

export const PickupOfferClickable = styled(RectButton)`
  width: 100%;
  height: 100%;
  padding: ${parseHeightPercentage(16)}px ${parseWidthPercentage(16)}px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
`;

const pickupOfferUserAvatarSize = parseWidthPercentage(40);

export const PickupOfferUserAvatar = styled.Image`
  width: ${pickupOfferUserAvatarSize}px;
  height: ${pickupOfferUserAvatarSize}px;
  border-radius: ${pickupOfferUserAvatarSize / 2}px;
`;

export const PickupOfferMeta = styled.View`
  flex: 1;
  margin-left: ${parseWidthPercentage(16)}px;
`;

export const PickupOfferTextWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const PickupOfferUserFullName = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(12)}px;
  font-weight: bold;
  margin-right: ${parseWidthPercentage(8)}px;
`;

export const PickupOfferUserUsername = styled.Text`
  color: #606060;
  font-size: ${parseWidthPercentage(10)}px;
  font-style: italic;
`;

export const PickupOfferInfo = styled.View`
  flex: 1;
  justify-content: space-between;
  margin-top: ${parseHeightPercentage(4)}px;
`;

export const PickupOfferValue = styled.Text`
  color: #ff8c42;
  font-size: ${parseWidthPercentage(10)}px;
  margin-right: ${parseWidthPercentage(4)}px;
  margin-left: ${parseWidthPercentage(4)}px;
`;

export const PickupOfferUserAvaluationStars = styled.View`
  align-self: flex-start;
  margin-top: ${parseHeightPercentage(4)}px;
`;

const pickupOfferSelectButtonSize = parseWidthPercentage(16);

export const PickupOfferSelectButton = styled.View<
  PickupOfferSelectButtonProps
>`
  width: ${pickupOfferSelectButtonSize}px;
  height: ${pickupOfferSelectButtonSize}px;
  border-radius: ${pickupOfferSelectButtonSize / 2}px;
  background: transparent;
  border-width: 1px;
  border-color: #606060;
  justify-content: center;
  align-items: center;

  ${props =>
    props.isSelected &&
    css`
      border-color: #ff8c42;
    `}
`;

const pickupOfferSelectButtonSelectedSize = parseWidthPercentage(10);

export const PickupOfferSelectButtonSelected = styled.View`
  width: ${pickupOfferSelectButtonSelectedSize}px;
  height: ${pickupOfferSelectButtonSelectedSize}px;
  border-radius: ${pickupOfferSelectButtonSelectedSize / 2}px;
  background: #ff8c42;
`;

export const EmptyPickupOffersListContainer = styled.View`
  margin-top: ${parseHeightPercentage(80)}px;
  align-items: center;
  justify-content: center;
`;

export const EmptyPickupOffersListText = styled.Text`
  color: #606060;
  font-size: ${parseWidthPercentage(24)}px;
  font-weight: bold;
  text-align: center;
  margin-top: ${parseHeightPercentage(24)}px;
`;
