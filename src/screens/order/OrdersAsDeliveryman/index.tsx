import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
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

import TitleBar from '@components/atoms/TitleBar';
import LoadingScreen from '@components/atoms/LoadingScreen';
import OrderListItem from '@components/organisms/OrderListItem';

import { IOrderExtended } from '@screens/order/Orders';

import {
  Container,
  OrdersListContainer,
  OrdersList,
  EmptyOrdersListContainer,
  EmptyOrdersListText,
} from './styles';

const OrdersAsDeliveryman: React.FC = () => {
  const { location } = useLocation();

  const [ordersAsDeliveryman, setOrdersAsDeliveryman] = useState<
    IOrderExtended[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrdersAdDeliveryman() {
      const { latitude, longitude } = location;

      if (latitude && longitude) {
        try {
          const response = await api.get('/orders/deliveryman');

          setOrdersAsDeliveryman(
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
            renderItem={({ item: order }) => <OrderListItem order={order} />}
          />
        </OrdersListContainer>
      </Container>
    </>
  );
};

export default OrdersAsDeliveryman;
