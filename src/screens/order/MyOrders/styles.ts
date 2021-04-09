import styled from 'styled-components/native';
import { SectionList } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

import { Order } from './index';

export const Container = styled.View`
  flex: 1;
  background: #2b2831;
`;

export const OrdersListContainer = styled.View`
  flex: 1;
  width: 100%;
`;

export const OrdersList = styled(SectionList as new () => SectionList<Order>)`
  width: 100%;
  padding-left: ${parseWidthPercentage(24)}px;
  padding-right: ${parseWidthPercentage(24)}px;
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
  margin-top: ${parseHeightPercentage(160)}px;
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
