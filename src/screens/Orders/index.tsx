import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, RefreshControl, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';
import { getDistance, convertDistance } from 'geolib';
import Feather from 'react-native-vector-icons/Feather';

import { useAuth } from '@hooks/auth';
import { useLocation } from '@hooks/location';

import api from '@services/api';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';
import formatDistanceValue from '@utils/formatDistanceValue';

import noUserAvatarImg from '@assets/no-user-avatar.png';

import {
  Container,
  DistancesListContainer,
  DistancesList,
  DistanceContainer,
  DistanceChoosable,
  DistanceText,
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

export interface Order {
  id: string;
  pickup_city: string;
  pickup_state: string;
  pickup_latitude: number;
  pickup_longitude: number;
  delivery_value: number;
  items: any[];
  requester: {
    name: string;
    username: string;
    avatar_url: string;
  };
  created_at: string;
  formatted_created_at: string;
  distance: number;
}

export interface Distance {
  value: number;
  label: string;
}

const Orders: React.FC = () => {
  const { user } = useAuth();
  const { location } = useLocation();

  const navigation = useNavigation();

  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [distances, setDistances] = useState<Distance[]>([]);
  const [selectedDistance, setSelectedDistance] = useState(5);

  const fetchOrdersFromApi = useCallback(() => {
    const { latitude, longitude } = location;

    if (latitude && longitude) {
      api
        .get('/orders', {
          params: {
            user_latitude: latitude,
            user_longitude: longitude,
            distance: selectedDistance,
          },
        })
        .then(response => {
          setOrders(
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
        })
        .catch(err =>
          Alert.alert(
            'Erro',
            `Ocorreu um erro ao tentar recuperar os pedidos. Tente novamente mais tarde, por favor.\n\n${String(
              err,
            )}`,
          ),
        );
    }
  }, [location, selectedDistance]);

  const onRefreshOrdersList = useCallback(async () => {
    setRefreshing(true);
    fetchOrdersFromApi();
    setRefreshing(false);
  }, [fetchOrdersFromApi]);

  useEffect(() => {
    if (!user.address && !user.state && !user.city) {
      Alert.alert(
        'Aviso!',
        'Há informações do seu perfil pendentes de preenchimento.\n\nRecomendamos que você atualize o seu perfil o quanto antes.',
        [
          { text: 'Agora não', style: 'cancel' },
          {
            text: 'Vamos lá!',
            style: 'default',
            onPress: () => navigation.navigate('EditProfile'),
          },
        ],
      );
    }
  }, [user, navigation]);

  useEffect(() => {
    setDistances([
      { value: 5, label: '5 km' },
      { value: 10, label: '10 km' },
      { value: 15, label: '15 km' },
      { value: 20, label: '20 km' },
      { value: 25, label: '25 km' },
      { value: 30, label: '30 km' },
    ]);
  }, []);

  useEffect(() => {
    fetchOrdersFromApi();
  }, [fetchOrdersFromApi]);

  const refreshIndicator = useMemo(() => {
    return (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefreshOrdersList}
        progressBackgroundColor="#2b2831"
        colors={['#6f7bae', '#ff8c42']}
        tintColor="#6f7bae"
      />
    );
  }, [refreshing, onRefreshOrdersList]);

  return (
    <Container>
      <DistancesListContainer>
        <DistancesList
          horizontal
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View style={{ width: parseWidthPercentage(24) }} />
          )}
          ItemSeparatorComponent={() => (
            <View style={{ width: parseWidthPercentage(8) }} />
          )}
          ListFooterComponent={() => (
            <View style={{ width: parseWidthPercentage(24) }} />
          )}
          data={distances}
          keyExtractor={distance => distance.value.toString()}
          renderItem={({ item: distance }) => (
            <DistanceContainer isSelected={selectedDistance === distance.value}>
              <DistanceChoosable
                rippleColor="#ebebeb10"
                onPress={() => setSelectedDistance(distance.value)}
              >
                <DistanceText isSelected={selectedDistance === distance.value}>
                  {distance.label}
                </DistanceText>
              </DistanceChoosable>
            </DistanceContainer>
          )}
        />
      </DistancesListContainer>

      <OrdersListContainer>
        <OrdersList
          showsVerticalScrollIndicator
          refreshControl={refreshIndicator}
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
                Não há nenhum pedido aqui ainda!
              </EmptyOrdersListText>
            </EmptyOrdersListContainer>
          )}
          data={orders}
          keyExtractor={order => order.id}
          renderItem={({ item: order }) => (
            <OrderContainer>
              <OrderClickable rippleColor="#ebebeb10">
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
                  <OrderItemsCategoryIcon
                    name="star-o"
                    size={parseWidthPercentage(12)}
                    color="#606060"
                  />
                </OrderItemsCategoriesIconsContainer>
              </OrderClickable>
            </OrderContainer>
          )}
        />
      </OrdersListContainer>
    </Container>
  );
};

export default Orders;
