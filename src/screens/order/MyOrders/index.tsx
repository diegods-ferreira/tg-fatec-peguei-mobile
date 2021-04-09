import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, RefreshControl, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';
import { getDistance, convertDistance } from 'geolib';
import AsyncStorage from '@react-native-community/async-storage';
import Feather from 'react-native-vector-icons/Feather';

import api from '@services/api';

import { useLocation } from '@hooks/location';

import formatDistanceValue from '@utils/formatDistanceValue';
import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

import LoadingScreen from '@components/atoms/LoadingScreen';
import Label from '@components/atoms/Label';

import noUserAvatarImg from '@assets/no-user-avatar.png';

import FloatingButton from '@components/atoms/FloatingButton';
import ListItemCard from '@components/atoms/ListItemCard';

import {
  Container,
  OrdersListContainer,
  OrdersList,
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

interface Item {
  id: string;
  category: {
    icon: string;
  };
}

export interface Order {
  id: string;
  pickup_city: string;
  pickup_state: string;
  pickup_latitude: number;
  pickup_longitude: number;
  delivery_value: number;
  status: number;
  items: Item[];
  requester: {
    name: string;
    username: string;
    avatar_url: string;
  };
  created_at: string;
  formatted_created_at: string;
  distance: number;
}

interface Section {
  title: string;
  data: Order[];
}

const MyOrders: React.FC = () => {
  const { location } = useLocation();

  const navigation = useNavigation();

  const [orders, setOrders] = useState<Order[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOrdersFromApi = useCallback(() => {
    setLoading(true);

    const { latitude, longitude } = location;

    if (latitude && longitude) {
      api
        .get('/orders/me')
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
        .catch(err => {
          Alert.alert(
            'Erro',
            'Ocorreu um erro ao tentar recuperar os pedidos. Tente novamente mais tarde, por favor.',
          );

          console.log(String(err));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [location]);

  const onRefreshOrdersList = useCallback(async () => {
    setRefreshing(true);
    fetchOrdersFromApi();
    setRefreshing(false);
  }, [fetchOrdersFromApi]);

  const handleNavigateToOrderDetails = useCallback(
    (id: string) => {
      navigation.navigate('OrderDetails', { id });
    },
    [navigation],
  );

  const handleNavigateToCreateOrder = useCallback(async () => {
    const asyncStorageKeys = await AsyncStorage.getAllKeys();

    const createOrderItemKeys = asyncStorageKeys.filter(key =>
      key.includes('@Peguei!:create-order-item-'),
    );

    await AsyncStorage.multiRemove(createOrderItemKeys);

    navigation.navigate('CreateOrder');
  }, [navigation]);

  useEffect(() => {
    const openOrders = orders.filter(order => order.status === 1);
    const inProgressOrders = orders.filter(order => order.status === 2);
    const deliveredOrders = orders.filter(order => order.status === 3);
    const canceledOrders = orders.filter(order => order.status === 4);

    const parsedSections: Section[] = [];

    if (openOrders.length > 0) {
      parsedSections.push({ title: 'Abertos', data: openOrders });
    }

    if (inProgressOrders.length > 0) {
      parsedSections.push({ title: 'Em andamento', data: inProgressOrders });
    }

    if (deliveredOrders.length > 0) {
      parsedSections.push({ title: 'Entregues', data: deliveredOrders });
    }

    if (canceledOrders.length > 0) {
      parsedSections.push({ title: 'Cancelados', data: canceledOrders });
    }

    setSections(parsedSections);
  }, [orders]);

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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Container>
        <OrdersListContainer>
          <OrdersList
            sections={sections}
            showsVerticalScrollIndicator
            refreshControl={refreshIndicator}
            renderSectionHeader={({ section: { title } }) => (
              <Label marginTop={24}>{title}</Label>
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
                  Você não fez nenhum pedido ainda!
                </EmptyOrdersListText>
              </EmptyOrdersListContainer>
            )}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({ item: order }) => (
              <ListItemCard
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
              </ListItemCard>
            )}
          />
        </OrdersListContainer>
      </Container>

      <FloatingButton iconName="plus" onPress={handleNavigateToCreateOrder} />
    </>
  );
};

export default MyOrders;
