import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

import { parseWidthPercentage } from '@utils/screenPercentage';

import IOrder from '@models/Order';

import ListItemCard from '@components/atoms/ListItemCard';

import noUserAvatarImg from '@assets/no-user-avatar.png';

import {
  OrderRequesterAvatar,
  OrderMeta,
  OrderTextWrapper,
  OrderRequesterFullName,
  OrderRequesterUsername,
  OrderDeliveryInfo,
  OrderItensCounter,
  OrderCreatedAt,
  OrderDeliveryLocation,
  OrderDeliveryDistance,
  OrderItemsCategoriesIconsContainer,
  OrderItemsCategoryIcon,
  OrderIdentifierContainer,
  OrderIdentifierText,
  OrderInfoContainer,
} from './styles';

interface IOrderExtended extends IOrder {
  formatted_created_at: string;
  distance: number;
}

interface OrderListItemProps {
  order: IOrderExtended;
}

const OrderListItem: React.FC<OrderListItemProps> = ({ order }) => {
  const navigation = useNavigation();

  const handleNavigateToOrderDetails = useCallback(
    (id: string) => {
      navigation.navigate('OrderDetails', { id });
    },
    [navigation],
  );

  return (
    <ListItemCard
      flexDirection="column"
      padding={0}
      height={120}
      onPress={() => handleNavigateToOrderDetails(order.id)}
    >
      <OrderInfoContainer>
        <OrderRequesterAvatar
          source={
            order.requester.avatar_url
              ? { uri: order.requester.avatar_url }
              : noUserAvatarImg
          }
        />

        <OrderMeta>
          <OrderTextWrapper>
            <OrderRequesterFullName>
              {order.requester.name}
            </OrderRequesterFullName>
            <OrderRequesterUsername>
              {`@${order.requester.username}`}
            </OrderRequesterUsername>
          </OrderTextWrapper>

          <OrderDeliveryInfo>
            <OrderTextWrapper>
              <Feather
                name="package"
                size={parseWidthPercentage(12)}
                color="#ff8c42"
              />
              <OrderItensCounter>
                {`${order.items.length} ${
                  order.items.length > 1 ? 'itens' : 'item'
                }`}
              </OrderItensCounter>
              <OrderCreatedAt>{`· ${order.formatted_created_at}`}</OrderCreatedAt>
            </OrderTextWrapper>

            <OrderTextWrapper>
              <OrderDeliveryLocation>
                {`${order.pickup_city}, ${order.pickup_state} ·`}
              </OrderDeliveryLocation>
              <OrderDeliveryDistance>
                {`${order.distance} km`}
              </OrderDeliveryDistance>
            </OrderTextWrapper>
          </OrderDeliveryInfo>
        </OrderMeta>

        <OrderItemsCategoriesIconsContainer>
          {order.items.slice(0, 4).map(item => (
            <OrderItemsCategoryIcon
              key={item.id}
              name={item.category.icon}
              size={parseWidthPercentage(12)}
              color="#606060"
            />
          ))}
        </OrderItemsCategoriesIconsContainer>
      </OrderInfoContainer>

      <OrderIdentifierContainer>
        <OrderIdentifierText>
          {`Nº do pedido: ${order.number}`}
        </OrderIdentifierText>
      </OrderIdentifierContainer>
    </ListItemCard>
  );
};

export default OrderListItem;
