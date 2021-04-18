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

import IOrder from '@models/Order';

import LoadingScreen from '@components/atoms/LoadingScreen';
import Label from '@components/atoms/Label';

import FloatingButton from '@components/atoms/FloatingButton';
import OrderListItem from '@components/organisms/OrderListItem';

import {
  Container,
  OrdersListContainer,
  OrdersList,
  EmptyOrdersListContainer,
  EmptyOrdersListText,
} from './styles';

export interface IOrderExtended extends IOrder {
  formatted_created_at: string;
  distance: number;
}

interface Section {
  title: string;
  data: IOrderExtended[];
}

const MyOrders: React.FC = () => {
  const { location } = useLocation();

  const navigation = useNavigation();

  const [orders, setOrders] = useState<IOrderExtended[]>([]);
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
            response.data.map((order: IOrderExtended) => ({
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
            renderItem={({ item: order }) => <OrderListItem order={order} />}
          />
        </OrdersListContainer>
      </Container>

      <FloatingButton iconName="plus" onPress={handleNavigateToCreateOrder} />
    </>
  );
};

export default MyOrders;
