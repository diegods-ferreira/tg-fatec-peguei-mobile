import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';
import { getDistance, convertDistance } from 'geolib';
import Feather from 'react-native-vector-icons/Feather';

import { useAuth } from '@hooks/auth';
import { useLocation } from '@hooks/location';

import api from '@services/api';

import LoadingScreen from '@components/LoadingScreen';
import FloatingButton from '@components/FloatingButton';

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
  RefreshOrdersListButton,
  RefreshOrdersListButtonText,
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
  const [selectedDistance, setSelectedDistance] = useState(10);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [page, setPage] = useState(1);
  const [endOfList, setEndOfList] = useState(false);
  const [refreshButtonVisible, setRefreshButtonVisible] = useState(false);

  const fetchNextPageOrdersFromApi = useCallback(async () => {
    if (!endOfList && !loadingOrders) {
      setPage(state => state + 1);
    }
  }, [endOfList, loadingOrders]);

  const handleRefreshOrdersList = useCallback(async () => {
    setPage(1);
    setEndOfList(false);
    setRefreshButtonVisible(false);
  }, []);

  const handleNavigateToOrderDetails = useCallback(
    (id: string) => navigation.navigate('OrderDetails', { id }),
    [navigation],
  );

  const handleNavigateToOrdersAsDeliveryman = useCallback(
    () => navigation.navigate('OrdersAsDeliveryman'),
    [navigation],
  );

  const handleSelectDistance = useCallback((distance: number) => {
    setSelectedDistance(distance);
    setPage(1);
    setEndOfList(false);
    setRefreshButtonVisible(false);
  }, []);

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
      { value: 10, label: '10 km' },
      { value: 20, label: '20 km' },
      { value: 30, label: '30 km' },
      { value: 40, label: '40 km' },
      { value: 50, label: '50 km' },
      { value: 75, label: '75 km' },
      { value: 100, label: '100 km' },
      { value: 150, label: '150 km' },
    ]);
  }, []);

  useEffect(() => {
    async function loadOrders() {
      setLoading(page === 1);
      setRefreshing(page === 1);
      setLoadingOrders(page > 1);

      const { latitude, longitude } = location;

      if (latitude && longitude) {
        try {
          const response = await api.get('/orders', {
            params: {
              user_latitude: latitude,
              user_longitude: longitude,
              distance: selectedDistance,
              page,
            },
          });

          const serializedOrders = response.data.map((order: Order) => ({
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
          }));

          if (serializedOrders) {
            setOrders(state =>
              page === 1 ? serializedOrders : [...state, ...serializedOrders],
            );

            if (serializedOrders.length === 0) {
              setEndOfList(true);
              setRefreshButtonVisible(true);
            }
          }
        } catch (err) {
          Alert.alert(
            'Erro',
            'Ocorreu um erro ao tentar recuperar os pedidos. Tente novamente mais tarde, por favor.',
          );

          console.log(String(err));
        } finally {
          setLoadingOrders(false);
          setRefreshing(false);
          setLoading(false);
        }
      }
    }

    loadOrders();
  }, [location, selectedDistance, page]);

  const refreshIndicator = useMemo(() => {
    return (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={handleRefreshOrdersList}
        progressBackgroundColor="#2b2831"
        colors={['#6f7bae', '#ff8c42']}
        tintColor="#6f7bae"
      />
    );
  }, [refreshing, handleRefreshOrdersList]);

  return (
    <>
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
              <DistanceContainer
                isSelected={selectedDistance === distance.value}
              >
                <DistanceChoosable
                  rippleColor="#ebebeb10"
                  onPress={() => handleSelectDistance(distance.value)}
                >
                  <DistanceText
                    isSelected={selectedDistance === distance.value}
                  >
                    {distance.label}
                  </DistanceText>
                </DistanceChoosable>
              </DistanceContainer>
            )}
          />
        </DistancesListContainer>

        {loading ? (
          <LoadingScreen />
        ) : (
          <OrdersListContainer>
            <OrdersList
              showsVerticalScrollIndicator
              refreshControl={refreshIndicator}
              ListFooterComponent={() => {
                if (loadingOrders) {
                  return (
                    <View
                      style={{
                        marginTop: parseHeightPercentage(8),
                        marginBottom: parseHeightPercentage(24),
                      }}
                    >
                      <ActivityIndicator size="small" color="#6f7bae" />
                    </View>
                  );
                }

                if (orders.length > 0 && refreshButtonVisible) {
                  return (
                    <RefreshOrdersListButton
                      onPress={handleRefreshOrdersList}
                      rippleColor="#00000050"
                    >
                      <RefreshOrdersListButtonText>
                        Hmm... Parece que acabou a lista.
                      </RefreshOrdersListButtonText>
                      <RefreshOrdersListButtonText>
                        Clique aqui para carregar novos pedidos!
                      </RefreshOrdersListButtonText>
                    </RefreshOrdersListButton>
                  );
                }

                return <View style={{ height: parseHeightPercentage(24) }} />;
              }}
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
              onEndReached={fetchNextPageOrdersFromApi}
              onEndReachedThreshold={0.1}
              data={orders}
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
        )}
      </Container>

      <FloatingButton
        iconName="truck"
        onPress={handleNavigateToOrdersAsDeliveryman}
      />
    </>
  );
};

export default Orders;
