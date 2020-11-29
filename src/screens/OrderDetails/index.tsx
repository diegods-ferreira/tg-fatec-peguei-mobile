import React, { useCallback, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Alert, Linking, Platform, ToastAndroid } from 'react-native';
import { format, parseISO } from 'date-fns';
import { convertDistance, getDistance } from 'geolib';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-community/clipboard';
import Feather from 'react-native-vector-icons/Feather';

import { useLocation } from '@hooks/location';

import { parseWidthPercentage } from '@utils/screenPercentage';
import boxShadowProps from '@utils/boxShadowProps';
import formatDistanceValue from '@utils/formatDistanceValue';

import LoadingScreen from '@components/LoadingScreen';
import TitleBar from '@components/TitleBar';
import TitledBox from '@components/TitledBox';
import Button from '@components/Button';

import noUserAvatarImg from '@assets/no-user-avatar.png';
import noOrderItemImg from '@assets/no-order-item-image.png';

import api from '@services/api';

import {
  Container,
  RequesterContainer,
  RequesterAvatar,
  RequesterInfo,
  RequesterFullName,
  RequesterUsername,
  OrderTextWrapper,
  OrderDeliveryInfo,
  OrderItensCounter,
  OrderCreatedAt,
  OrderDeliveryLocation,
  OrderDeliveryDistance,
  ChatButtonContainer,
  ChatButton,
  ChatButtonPressable,
  OrderInfoContainer,
  OrderInfoWrapper,
  OrderInfoText,
  OrderItemContainer,
  OrderItemPressable,
  OrderItemQuantity,
  OrderItemQuantityText,
  OrderItemNameAndPacking,
  OrderItemName,
  OrderItemPacking,
  OrderItemImage,
  ViewInvoiceButton,
  ViewInvoiceButtonText,
} from './styles';

interface Params {
  id: string;
}

interface Item {
  id: string;
  name: string;
  quantity: number;
  packing: string;
  image_url: string;
}

interface Order {
  id: string;
  pickup_address: string;
  pickup_city: string;
  pickup_state: string;
  pickup_latitude: number;
  pickup_longitude: number;
  pickup_establishment: string;
  pickup_date: string;
  delivery_address: string;
  purchase_invoice_url: string;
  items: Item[];
  requester: {
    name: string;
    username: string;
    avatar_url: string;
  };
  created_at: string;
}

const OrderDetails: React.FC = () => {
  const { location } = useLocation();

  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as Params;

  const [order, setOrder] = useState<Order>({} as Order);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    api
      .get(`/orders/${routeParams.id}`)
      .then(response => {
        setOrder(response.data);
      })
      .catch(err => {
        Alert.alert(
          'Erro',
          `Ocorreu um erro ao tentar carregar esse pedido. Tente novamente mais tarde, por favor.\n\n${String(
            err,
          )}`,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [routeParams]);

  const handleNavigateToItemDetails = useCallback(
    (id: string) => {
      navigation.navigate('ItemDetails', { id });
    },
    [navigation],
  );

  const handleViewPurchaseInvoice = useCallback(() => {
    Linking.canOpenURL(order.purchase_invoice_url).then(supported => {
      if (supported) {
        Linking.openURL(order.purchase_invoice_url);
      } else {
        Clipboard.setString(order.purchase_invoice_url);

        if (Platform.OS === 'ios') {
          Alert.alert(
            'Copiado!',
            'O link foi copiado para sua área de transferência.',
          );
        } else {
          ToastAndroid.show('Link copiado', ToastAndroid.LONG);
        }
      }
    });
  }, [order.purchase_invoice_url]);

  const getDistanceFromRequestPickupPlaceToCurrentLocation = useCallback(
    (latitude: number, longitude: number) => {
      return formatDistanceValue(
        convertDistance(getDistance({ latitude, longitude }, location), 'km'),
      );
    },
    [location],
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <TitleBar title="Detalhes do Pedido" />

      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
        <Container>
          <RequesterContainer>
            <RequesterAvatar
              defaultSource={noUserAvatarImg}
              source={
                order.requester.avatar_url
                  ? { uri: order.requester.avatar_url }
                  : noUserAvatarImg
              }
            />

            <RequesterInfo>
              <RequesterFullName>{order.requester.name}</RequesterFullName>
              <RequesterUsername>{`@${order.requester.username}`}</RequesterUsername>

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
                  <OrderCreatedAt>
                    {format(parseISO(order.created_at), 'dd/MM/yyyy')}
                  </OrderCreatedAt>
                </OrderTextWrapper>

                <OrderTextWrapper>
                  <OrderDeliveryLocation>
                    {`${order.pickup_city}, ${order.pickup_state} ·`}
                  </OrderDeliveryLocation>
                  <OrderDeliveryDistance>
                    {`${getDistanceFromRequestPickupPlaceToCurrentLocation(
                      order.pickup_latitude,
                      order.pickup_longitude,
                    )} km`}
                  </OrderDeliveryDistance>
                </OrderTextWrapper>
              </OrderDeliveryInfo>
            </RequesterInfo>

            <ChatButtonContainer>
              <ChatButton style={boxShadowProps}>
                <ChatButtonPressable rippleColor="#00000050">
                  <Feather
                    name="message-circle"
                    size={parseWidthPercentage(24)}
                    color="#EBEBEB"
                  />
                </ChatButtonPressable>
              </ChatButton>
            </ChatButtonContainer>
          </RequesterContainer>

          <OrderInfoContainer>
            <TitledBox title="Retirada">
              <OrderInfoWrapper isFirst>
                <Feather
                  name="map-pin"
                  size={parseWidthPercentage(24)}
                  color="#6f7bae"
                />
                <OrderInfoText>{order.pickup_address}</OrderInfoText>
              </OrderInfoWrapper>

              <OrderInfoWrapper>
                <Feather
                  name="home"
                  size={parseWidthPercentage(24)}
                  color="#6f7bae"
                />
                <OrderInfoText>{order.pickup_establishment}</OrderInfoText>
              </OrderInfoWrapper>

              <OrderInfoWrapper>
                <Feather
                  name="calendar"
                  size={parseWidthPercentage(24)}
                  color="#6f7bae"
                />
                <OrderInfoText>
                  {format(parseISO(order.pickup_date), 'dd/MM/yyyy')}
                </OrderInfoText>
              </OrderInfoWrapper>
            </TitledBox>

            <TitledBox title="Local de Entrega">
              <OrderInfoWrapper isFirst>
                <Feather
                  name="map-pin"
                  size={parseWidthPercentage(24)}
                  color="#ff8c42"
                />
                <OrderInfoText>{order.delivery_address}</OrderInfoText>
              </OrderInfoWrapper>
            </TitledBox>

            <TitledBox title="Itens do Pedido">
              {order.items.map((item, index) => (
                <OrderItemContainer
                  key={item.id}
                  hasBorder={index !== order.items.length - 1}
                >
                  <OrderItemPressable
                    rippleColor="#ebebeb10"
                    onPress={() => handleNavigateToItemDetails(item.id)}
                  >
                    <OrderItemQuantity>
                      <OrderItemQuantityText>
                        {item.quantity}
                      </OrderItemQuantityText>
                    </OrderItemQuantity>

                    <OrderItemNameAndPacking>
                      <OrderItemName numberOfLines={1} ellipsizeMode="tail">
                        {item.name}
                      </OrderItemName>
                      <OrderItemPacking numberOfLines={1} ellipsizeMode="tail">
                        {item.packing}
                      </OrderItemPacking>
                    </OrderItemNameAndPacking>

                    <OrderItemImage
                      defaultSource={noOrderItemImg}
                      source={
                        item.image_url
                          ? { uri: item.image_url }
                          : noOrderItemImg
                      }
                    />
                  </OrderItemPressable>
                </OrderItemContainer>
              ))}
            </TitledBox>

            <TitledBox title="Nota Fiscal">
              <ViewInvoiceButton onPress={handleViewPurchaseInvoice}>
                <ViewInvoiceButtonText>
                  Visualizar documento
                </ViewInvoiceButtonText>
              </ViewInvoiceButton>
            </TitledBox>

            <Button>Me ofereço para buscar</Button>
          </OrderInfoContainer>
        </Container>
      </ScrollView>
    </>
  );
};

export default OrderDetails;
