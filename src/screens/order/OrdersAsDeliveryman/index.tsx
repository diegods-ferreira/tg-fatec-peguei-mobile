import React, { useCallback, useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { format, parseISO } from 'date-fns';
import { getDistance, convertDistance } from 'geolib';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

import api from '@services/api';

import { useLocation } from '@hooks/location';

import formatDistanceValue from '@utils/formatDistanceValue';
import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

import TitleBar from '@components/atoms/TitleBar';
import LoadingScreen from '@components/atoms/LoadingScreen';

import { Order } from '@screens/order/Orders';

import noUserAvatarImg from '@assets/no-user-avatar.png';

import {
  Container,
  OrdersListContainer,
  OrdersList,
  OrderContainer,
  OrderClickable,
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
  EmptyOrdersListContainer,
  EmptyOrdersListText,
} from './styles';

const OrdersAsDeliveryman: React.FC = () => {
  const { location } = useLocation();

  const navigation = useNavigation();

  const [ordersAsDeliveryman, setOrdersAsDeliveryman] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrdersAdDeliveryman() {
      const { latitude, longitude } = location;

      if (latitude && longitude) {
        try {
          const response = await api.get('/orders/deliveryman');

          setOrdersAsDeliveryman(
            response.data.map((order: Order) => ({
              ...order,
              formatted_created_at: format(
                parseISO(order.created_at),
                'dd/MM/yyyy',
              ),
              distance: formatDistanceValue(
                convertDistance(
                  getDistance(
                    {
                      latitude: order.pickup_latitude,
                      longitude: order.pickup_longitude,
                    },
                    location,
                  ),
                  'km',
                ),
              ),
            })),
          );
        } catch (err) {
          Alert.alert(
            'Erro',
            'Ocorreu um erro ao tentar recuperar os pedidos. Tente novamente mais tarde, por favor.',
          );

          console.log(String(err));
        } finally {
          setLoading(false);
        }
      }
    }

    setLoading(true);
    loadOrdersAdDeliveryman();
  }, [location]);

  const handleNavigateToOrderDetails = useCallback(
    (id: string) => {
      navigation.navigate('OrderDetails', { id });
    },
    [navigation],
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <TitleBar title="Pedidos como Entregador" />
      <Container>
        <OrdersListContainer>
          <OrdersList
            showsVerticalScrollIndicator
            ListHeaderComponent={() => (
              <View style={{ height: parseHeightPercentage(24) }} />
            )}
            ListFooterComponent={() => (
              <View style={{ height: parseHeightPercentage(24) }} />
            )}
            ItemSeparatorComponent={() => (
              <View style={{ height: parseHeightPercentage(8) }} />
            )}
            ListEmptyComponent={() => (
              <EmptyOrdersListContainer>
                <Feather
                  name="package"
                  size={parseWidthPercentage(104)}
                  color="#606060"
                />
                <EmptyOrdersListText>
                  Você ainda não é o entregador de nenhum pedido!
                </EmptyOrdersListText>
              </EmptyOrdersListContainer>
            )}
            data={ordersAsDeliveryman}
            keyExtractor={order => order.id}
            renderItem={({ item: order }) => (
              <OrderContainer>
                <OrderClickable
                  rippleColor="#ebebeb10"
                  onPress={() => handleNavigateToOrderDetails(order.id)}
                >
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
                </OrderClickable>
              </OrderContainer>
            )}
          />
        </OrdersListContainer>
      </Container>
    </>
  );
};

export default OrdersAsDeliveryman;
