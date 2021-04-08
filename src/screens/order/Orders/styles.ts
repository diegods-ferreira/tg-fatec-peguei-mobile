import styled, { css } from 'styled-components/native';
import { FlatList } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

import { Distance, Order } from './index';

interface DistanceContainerProps {
  isSelected?: boolean;
}

interface DistanceTextProps {
  isSelected?: boolean;
}

export const Container = styled.View`
  flex: 1;
  background: #2b2831;
`;

export const DistancesListContainer = styled.View`
  width: 100%;
  height: ${parseHeightPercentage(80)}px;
  padding-top: ${parseHeightPercentage(24)}px;
  padding-bottom: ${parseHeightPercentage(24)}px;
`;

export const DistancesList = styled(FlatList as new () => FlatList<Distance>)`
  width: 100%;
  height: 100%;
`;

export const DistanceContainer = styled.View<DistanceContainerProps>`
  width: ${parseWidthPercentage(64)}px;
  height: 100%;
  background: #312e38;
  border-radius: 8px;
  border-width: 1px;

  ${props =>
    props.isSelected
      ? css`
          border-color: #6f7bae;
        `
      : css`
          border-color: #ebebeb10;
        `}
`;

export const DistanceChoosable = styled(RectButton)`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

export const DistanceText = styled.Text<DistanceTextProps>`
  font-size: ${parseWidthPercentage(11)}px;

  ${props =>
    props.isSelected
      ? css`
          color: #6f7bae;
          font-weight: bold;
        `
      : css`
          color: #ebebeb;
        `}
`;

export const OrdersListContainer = styled.View`
  flex: 1;
  width: 100%;
`;

export const OrdersList = styled(FlatList as new () => FlatList<Order>)`
  width: 100%;
  padding-left: ${parseWidthPercentage(24)}px;
  padding-right: ${parseWidthPercentage(24)}px;
`;

export const OrderContainer = styled.View`
  width: 100%;
  height: ${parseHeightPercentage(96)}px;
  background: #312e38;
  border-radius: 8px;
  border-color: #ebebeb10;
  border-width: 1px;
`;

export const OrderClickable = styled(RectButton)`
  width: 100%;
  height: 100%;
  padding: ${parseHeightPercentage(16)}px ${parseWidthPercentage(16)}px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
`;

const orderRequesterAvatarSize = parseWidthPercentage(40);

export const OrderRequesterAvatar = styled.Image`
  width: ${orderRequesterAvatarSize}px;
  height: ${orderRequesterAvatarSize}px;
  border-radius: ${orderRequesterAvatarSize / 2}px;
`;

export const OrderMeta = styled.View`
  flex: 1;
  margin-left: ${parseWidthPercentage(16)}px;
`;

export const OrderTextWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const OrderRequesterFullName = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(12)}px;
  font-weight: bold;
  margin-right: ${parseWidthPercentage(8)}px;
`;

export const OrderRequesterUsername = styled.Text`
  color: #606060;
  font-size: ${parseWidthPercentage(10)}px;
  font-style: italic;
`;

export const OrderDeliveryInfo = styled.View`
  flex: 1;
  justify-content: space-between;
  margin-top: ${parseHeightPercentage(4)}px;
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

export const OrderItemsCategoriesIconsContainer = styled.View`
  width: ${parseWidthPercentage(56)}px;
  height: 100%;
  flex-direction: row;
  flex-wrap: wrap-reverse;
  justify-content: flex-end;
  align-items: flex-end;
`;

export const OrderItemsCategoryIcon = styled(FontAwesome)`
  margin-right: ${parseWidthPercentage(4)}px;
  margin-bottom: ${parseHeightPercentage(4)}px;
`;

export const EmptyOrdersListContainer = styled.View`
  margin-top: ${parseHeightPercentage(80)}px;
  align-items: center;
  justify-content: center;
`;

export const EmptyOrdersListText = styled.Text`
  color: #606060;
  font-size: ${parseWidthPercentage(24)}px;
  font-weight: bold;
  text-align: center;
  margin-top: ${parseHeightPercentage(24)}px;
`;

export const RefreshOrdersListButton = styled(RectButton)`
  width: 100%;
  padding: ${parseHeightPercentage(16)}px 0px;
  margin: ${parseHeightPercentage(24)}px 0px;
  background: #ff8c42;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

export const RefreshOrdersListButtonText = styled.Text`
  color: #312e38;
  font-size: ${parseWidthPercentage(16)}px;
  font-weight: bold;
`;
