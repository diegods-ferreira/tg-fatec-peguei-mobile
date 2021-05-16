import styled from 'styled-components/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

export const OrderInfoContainer = styled.View`
  flex: 1;
  padding: ${parseHeightPercentage(16)}px ${parseWidthPercentage(16)}px;
  flex-direction: row;
  align-items: center;
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

export const OrderIdentifierContainer = styled.View`
  width: 100%;
  height: ${parseHeightPercentage(24)}px;
  padding: 0px ${parseWidthPercentage(16)}px;
  background-color: #ebebeb05;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const OrderIdentifierText = styled.Text`
  color: #606060;
  font-size: ${parseWidthPercentage(10)}px;
  font-style: italic;
`;
