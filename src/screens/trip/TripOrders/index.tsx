import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, RefreshControl, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';
import { getDistance, convertDistance } from 'geolib';
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
import TitleBar from '@components/atoms/TitleBar';
import Label from '@components/atoms/Label';
import OrderListItem from '@components/organisms/OrderListItem';

import {
  Container,
  EmptyOrdersListContainer,
  EmptyOrdersListText,
  OrdersList,
  OrdersListContainer,
} from './styles';

interface RouteParams {
  trip_id: string;
}

export interface IOrderExtended extends IOrder {
  formatted_created_at: string;
  distance: number;
}

interface Section {
  title: string;
  data: IOrderExtended[];
}

const TripOrders: React.FC = () => {
  const { location } = useLocation();

  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const [orders, setOrders] = useState<IOrderExtended[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTripOrdersFromTheApi = useCallback(() => {
    setLoading(true);

    const { latitude, longitude } = location;

    if (latitude && longitude) {
      api
        .get(`trips/${routeParams.trip_id}/orders`)
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
  }, [location, routeParams]);

  const onRefreshOrdersList = useCallback(async () => {
    setRefreshing(true);
    fetchTripOrdersFromTheApi();
    setRefreshing(false);
  }, [fetchTripOrdersFromTheApi]);

  useEffect(() => {
    const inProgressOrders = orders.filter(order => order.status === 2);
    const pendingOrders = orders.filter(order => order.status === 5);
    const aprovedOrders = orders.filter(order => order.status === 6);
    const refusedOrders = orders.filter(order => order.status === 7);

    const parsedSections: Section[] = [];

    if (inProgressOrders.length > 0) {
      parsedSections.push({ title: 'Em andamento', data: inProgressOrders });
    }

    if (pendingOrders.length > 0) {
      parsedSections.push({ title: 'Pendentes', data: pendingOrders });
    }

    if (aprovedOrders.length > 0) {
      parsedSections.push({ title: 'Aprovados', data: aprovedOrders });
    }

    if (refusedOrders.length > 0) {
      parsedSections.push({ title: 'Recusados', data: refusedOrders });
    }

    setSections(parsedSections);
  }, [orders]);

  useEffect(() => {
    fetchTripOrdersFromTheApi();
  }, [fetchTripOrdersFromTheApi]);

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
      <TitleBar title="Pedidos da Viagem" />

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
                  Ninguém fez um pedido para você ainda!
                </EmptyOrdersListText>
              </EmptyOrdersListContainer>
            )}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({ item: order }) => <OrderListItem order={order} />}
          />
        </OrdersListContainer>
      </Container>
    </>
  );
};

export default TripOrders;
