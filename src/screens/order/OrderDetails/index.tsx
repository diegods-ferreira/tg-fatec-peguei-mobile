import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Alert, Linking, Platform, ToastAndroid } from 'react-native';
import { format, parseISO } from 'date-fns';
import { convertDistance, getDistance } from 'geolib';
import { useNavigation } from '@react-navigation/native';
import { Modalize } from 'react-native-modalize';
import Clipboard from '@react-native-community/clipboard';
import { Rating } from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';

import { useAuth } from '@hooks/auth';
import { useLocation } from '@hooks/location';

import { parseWidthPercentage } from '@utils/screenPercentage';
import boxShadowProps from '@utils/boxShadowProps';
import formatDistanceValue from '@utils/formatDistanceValue';
import formatCurrencyValue from '@utils/formatCurrencyValue';

import IOrder from '@models/Order';
import IRequestPickupOffer from '@models/RequestPickupOffer';
import IUser from '@models/User';

import LoadingScreen from '@components/atoms/LoadingScreen';
import TitleBar from '@components/atoms/TitleBar';
import TitledBox from '@components/atoms/TitledBox';
import FilledButton from '@components/atoms/FilledButton';
import OutlinedButton from '@components/atoms/OutlinedButton';
import AvatarImage from '@components/atoms/AvatarImage';

import noOrderItemImg from '@assets/no-order-item-image.png';

import api from '@services/api';

import {
  Container,
  RequesterContainer,
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
  StatusIndicatorContainer,
  StatusIndicatorText,
  OfferToPickupModalContainer,
  OfferToPickupInputContainer,
  OfferToPickupInputContainerLabel,
  TextInput,
  OfferToPickupModalTitle,
  OfferToPickupDateTime,
  OfferToPickupButtons,
  DeliverymanContainer,
  DeliverymanMeta,
  DeliverymanTextWrapper,
  DeliverymanFullName,
  DeliverymanUsername,
  DeliverymanAvaluationStars,
} from './styles';

interface RouteParams {
  id: string;
}

interface IRequestPickupOfferExtended extends IRequestPickupOffer {
  formatted_created_at: string;
}

const OrderDetails: React.FC = () => {
  const modalizeRef = useRef<Modalize>(null);

  const { user } = useAuth();
  const { location } = useLocation();

  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const [order, setOrder] = useState<IOrder>({} as IOrder);
  const [loading, setLoading] = useState(true);
  const [offerToPickup, setOfferToPickup] = useState<
    IRequestPickupOfferExtended
  >({} as IRequestPickupOfferExtended);
  const [offerToPickupInputValue, setOfferToPickupInputValue] = useState('0');
  const [offerToPickupValue, setOfferToPickupValue] = useState(0);
  const [isSubmiting, setIsSubmiting] = useState(false);

  useEffect(() => {
    async function loadOrderData() {
      try {
        const response = await api.get(`/orders/${routeParams.id}`);
        setOrder(response.data);
      } catch (err) {
        Alert.alert(
          'Erro',
          `Ocorreu um erro ao tentar carregar esse pedido. Tente novamente mais tarde, por favor.\n\n${String(
            err,
          )}`,
        );
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    loadOrderData();
  }, [routeParams]);

  useEffect(() => {
    async function loadUserDeliverymanForThisOrder() {
      if (!order.id) {
        return;
      }

      try {
        const response = await api.get(
          `/orders/pickup-offers/${order.id}/deliveryman/${user.id}`,
        );

        if (response.data) {
          setOfferToPickup({
            ...response.data,
            formatted_created_at: format(
              parseISO(response.data.created_at),
              "dd/MM/yyyy 'às' HH:mm",
            ),
          });
        }
      } catch (err) {
        Alert.alert(
          'Erro',
          `Ocorreu um erro ao tentar carregar esse pedido. Tente novamente mais tarde, por favor.\n\n${String(
            err,
          )}`,
        );
      }
    }

    loadUserDeliverymanForThisOrder();
  }, [order.id, user.id]);

  const handleNavigateToItemDetails = useCallback(
    (id: string) => {
      navigation.navigate('ItemDetails', { id });
    },
    [navigation],
  );

  const handleNavigateToSelectDeliveryman = useCallback(() => {
    navigation.navigate('SelectDeliveryman', { order_id: order.id });
  }, [navigation, order.id]);

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

  const handleDeleteOrder = useCallback(() => {
    Alert.alert(
      'Tem certeza?',
      'Uma vez excluído o pedido, não será possível recuperá-lo. Você poderá criar um outro sem problemas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setIsSubmiting(true);

            try {
              await api.delete(`/orders/${order.id}`);

              setIsSubmiting(false);

              Alert.alert('Excluído!', 'Pedido excluído com sucesso.');

              navigation.goBack();
            } catch (err) {
              Alert.alert('Ops...', err.message);
              setIsSubmiting(false);
            }
          },
        },
      ],
    );
  }, [order.id, navigation]);

  const handleOpenOfferToPickupModal = useCallback(() => {
    modalizeRef.current?.open();

    if (offerToPickup.id) {
      setOfferToPickupInputValue(
        formatCurrencyValue(offerToPickup.delivery_value).replace('R$', ''),
      );
      setOfferToPickupValue(offerToPickup.delivery_value);
    } else {
      setOfferToPickupInputValue('0');
      setOfferToPickupValue(0);
    }
  }, [offerToPickup.id, offerToPickup.delivery_value]);

  const handleCloseOfferToPickupModal = useCallback(() => {
    modalizeRef.current?.close();
  }, []);

  const handleOfferToPickupValueInputChange = useCallback((value: string) => {
    setOfferToPickupInputValue(value);
    setOfferToPickupValue(Number(value.replace('.', '').replace(',', '.')));
  }, []);

  const handleOfferToPickup = useCallback(async () => {
    setIsSubmiting(true);

    try {
      if (!offerToPickupValue) {
        Alert.alert('Erro', 'O valor deve ser maior que zero.');
        return;
      }

      const response = await api.post(`/orders/pickup-offers/${order.id}`, {
        delivery_value: offerToPickupValue,
      });

      setOfferToPickup({
        ...response.data,
        formatted_created_at: format(
          parseISO(response.data.created_at),
          "dd/MM/yyyy 'às' HH:mm",
        ),
      });

      Alert.alert(
        'Opa!',
        'Você se ofereceu para realizar essa entrega.\n\nAgora é com o(a) solicitante!\n\nVocê receberá uma notificação caso ele(a) te escolha.',
      );
    } catch {
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao tentar se oferecer para buscar esses produtos. Tente novamente mais tarde.',
      );
    } finally {
      setIsSubmiting(false);
      modalizeRef.current?.close();
    }
  }, [offerToPickupValue, order.id]);

  const handleDeleteMyOfferToPickup = useCallback(async () => {
    setIsSubmiting(true);

    try {
      await api.delete(`/orders/pickup-offers/${offerToPickup.id}`);

      setOfferToPickup({} as IRequestPickupOfferExtended);

      Alert.alert('Excluído!', 'Sua oferta foi excluída com sucesso.');
    } catch {
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao tentar se oferecer para buscar esses produtos. Tente novamente mais tarde.',
      );
    } finally {
      setIsSubmiting(false);
      modalizeRef.current?.close();
    }
  }, [offerToPickup.id]);

  const handleUpdateMyOfferToPickup = useCallback(async () => {
    setIsSubmiting(true);

    try {
      await api.put(`/orders/pickup-offers/${offerToPickup.id}`, {
        delivery_value: offerToPickupValue,
      });

      setOfferToPickup(state => ({
        ...state,
        delivery_value: offerToPickupValue,
      }));

      Alert.alert(
        'Atualizado!',
        'O valor da sua oferta foi atualizado com sucesso.',
      );
    } catch {
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao tentar se oferecer para buscar esses produtos. Tente novamente mais tarde.',
      );
    } finally {
      setIsSubmiting(false);
      modalizeRef.current?.close();
    }
  }, [offerToPickup.id, offerToPickupValue]);

  const handleJoinChatRoom = useCallback(
    (chat_id: string, recipient: IUser, order_id: string) => {
      navigation.navigate('ChatRoom', { chat_id, recipient, order_id });
    },
    [navigation],
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <TitleBar title="Detalhes do Pedido" />

      {offerToPickup.id && order.status === 1 && (
        <StatusIndicatorContainer
          backgroundColor="#6ab04c"
          onPress={handleOpenOfferToPickupModal}
        >
          <StatusIndicatorText>
            Você já se ofereceu para fazer essa entrega
          </StatusIndicatorText>
        </StatusIndicatorContainer>
      )}

      {order.status === 2 && (
        <StatusIndicatorContainer backgroundColor="#ff8c42">
          <StatusIndicatorText>Pedido em andamento</StatusIndicatorText>
        </StatusIndicatorContainer>
      )}

      {order.status === 3 && (
        <StatusIndicatorContainer backgroundColor="#3498db">
          <StatusIndicatorText>Pedido entregue!</StatusIndicatorText>
        </StatusIndicatorContainer>
      )}

      {order.status === 4 && (
        <StatusIndicatorContainer backgroundColor="#EB4D4B">
          <StatusIndicatorText>Pedido cancelado</StatusIndicatorText>
        </StatusIndicatorContainer>
      )}

      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
        <Container>
          <RequesterContainer>
            <AvatarImage
              user={order.requester}
              size={80}
              navigateToProfileOnPress
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

            {order.deliveryman_id && order.chat && order.chat.id && (
              <ChatButtonContainer>
                <ChatButton style={boxShadowProps}>
                  <ChatButtonPressable
                    rippleColor="#00000050"
                    onPress={() => {
                      handleJoinChatRoom(
                        order.chat.id,
                        order.deliveryman,
                        order.id,
                      );
                    }}
                  >
                    <Feather
                      name="message-circle"
                      size={parseWidthPercentage(24)}
                      color="#EBEBEB"
                    />
                  </ChatButtonPressable>
                </ChatButton>
              </ChatButtonContainer>
            )}
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
              <OutlinedButton
                color="#6f7bae"
                widthPercentage={100}
                onPress={handleViewPurchaseInvoice}
              >
                Visualizar documento
              </OutlinedButton>
            </TitledBox>

            {(order.status === 2 || order.status === 3) &&
              order.deliveryman_id && (
                <TitledBox title="Entregador">
                  <DeliverymanContainer>
                    <AvatarImage
                      user={order.deliveryman}
                      size={56}
                      navigateToProfileOnPress
                    />

                    <DeliverymanMeta>
                      <DeliverymanTextWrapper>
                        <DeliverymanFullName>
                          {order.deliveryman.name}
                        </DeliverymanFullName>
                        <DeliverymanUsername
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {`@${order.deliveryman.username}`}
                        </DeliverymanUsername>
                      </DeliverymanTextWrapper>

                      <DeliverymanAvaluationStars>
                        <Rating
                          readonly
                          type="custom"
                          startingValue={3.5}
                          ratingBackgroundColor="#606060"
                          ratingColor="#feca57"
                          tintColor="#312e38"
                          imageSize={parseWidthPercentage(16)}
                        />
                      </DeliverymanAvaluationStars>
                    </DeliverymanMeta>
                  </DeliverymanContainer>
                </TitledBox>
              )}

            {user.id !== order.requester.id &&
              order.status === 1 &&
              !offerToPickup.id && (
                <FilledButton onPress={handleOpenOfferToPickupModal}>
                  Me ofereço para buscar
                </FilledButton>
              )}

            {user.id === order.requester.id && order.status === 1 && (
              <>
                <FilledButton onPress={handleNavigateToSelectDeliveryman}>
                  Escolher entregador
                </FilledButton>

                <OutlinedButton
                  showLoadingIndicator={isSubmiting}
                  color="#EB4D4B"
                  marginTop={16}
                  onPress={handleDeleteOrder}
                >
                  Excluir pedido
                </OutlinedButton>
              </>
            )}
          </OrderInfoContainer>
        </Container>
      </ScrollView>

      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        keyboardAvoidingBehavior="height"
        closeOnOverlayTap={!!offerToPickup.id}
        overlayStyle={{ backgroundColor: '#00000090' }}
      >
        <OfferToPickupModalContainer>
          <OfferToPickupModalTitle
            fontWeight={offerToPickup.id ? 'normal' : undefined}
            fontSize={offerToPickup.id ? 14 : undefined}
          >
            {offerToPickup.id ? 'Oferta feita em' : 'Quanto você quer cobrar?'}
          </OfferToPickupModalTitle>

          {offerToPickup.id && (
            <OfferToPickupDateTime>
              {offerToPickup.formatted_created_at}
            </OfferToPickupDateTime>
          )}

          {offerToPickup.id && (
            <OfferToPickupInputContainerLabel>
              Valor ofertado
            </OfferToPickupInputContainerLabel>
          )}

          <OfferToPickupInputContainer hasMarginTop={!offerToPickup.id}>
            <Feather
              name="dollar-sign"
              size={parseWidthPercentage(24)}
              color="#606060"
            />

            <TextInput
              type="money"
              options={{ unit: '' }}
              maxLength={10}
              value={offerToPickupInputValue}
              onChangeText={handleOfferToPickupValueInputChange}
              placeholder="0,00"
              placeholderTextColor="#606060"
              textAlign="right"
              returnKeyType="send"
              onSubmitEditing={handleOfferToPickup}
            />
          </OfferToPickupInputContainer>

          {!offerToPickup.id && (
            <OfferToPickupButtons>
              <OutlinedButton
                color="#EB4D4B"
                flex={1}
                onPress={handleCloseOfferToPickupModal}
              >
                Cancelar
              </OutlinedButton>

              <FilledButton
                showLoadingIndicator={isSubmiting}
                backgroundColor="#6ab04c"
                textColor="#ebebeb"
                marginTop={0}
                marginLeft={8}
                flex={1}
                onPress={handleOfferToPickup}
              >
                Ok
              </FilledButton>
            </OfferToPickupButtons>
          )}

          {offerToPickup.id && (
            <OfferToPickupButtons>
              <OutlinedButton
                showLoadingIndicator={isSubmiting}
                color="#EB4D4B"
                flex={1}
                onPress={handleDeleteMyOfferToPickup}
              >
                Excluir
              </OutlinedButton>

              {offerToPickupValue !== offerToPickup.delivery_value &&
                offerToPickupValue > 0 && (
                  <FilledButton
                    showLoadingIndicator={isSubmiting}
                    backgroundColor="#6ab04c"
                    textColor="#ebebeb"
                    marginTop={0}
                    marginLeft={8}
                    flex={1}
                    onPress={handleUpdateMyOfferToPickup}
                  >
                    Atualizar
                  </FilledButton>
                )}
            </OfferToPickupButtons>
          )}
        </OfferToPickupModalContainer>
      </Modalize>
    </>
  );
};

export default OrderDetails;
