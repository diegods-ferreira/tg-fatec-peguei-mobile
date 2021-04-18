import styled from 'styled-components/native';
import { FlatList } from 'react-native';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';
import { IOrderExtended } from '@screens/order/Orders';

export const Container = styled.View`
  flex: 1;
  background: #2b2831;
`;

export const OrdersListContainer = styled.View`
  flex: 1;
  width: 100%;
`;

export const OrdersList = styled(
  FlatList as new () => FlatList<IOrderExtended>,
)`
  width: 100%;
  padding-left: ${parseWidthPercentage(24)}px;
  padding-right: ${parseWidthPercentage(24)}px;
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
