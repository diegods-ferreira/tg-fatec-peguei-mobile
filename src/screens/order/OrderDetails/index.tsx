import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Alert, Linking, Platform, ToastAndroid } from 'react-native';
import { format, parseISO } from 'date-fns';
import { convertDistance, getDistance } from 'geolib';
import { useNavigation } from '@react-navigation/native';
import { Modalize } from 'react-native-modalize';
import Clipboard from '@react-native-community/clipboard';
import { Rating } from 'react-native-elements';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import Feather from 'react-native-vector-icons/Feather';

import { useAuth } from '@hooks/auth';
import { useLocation } from '@hooks/location';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';
import boxShadowProps from '@utils/boxShadowProps';
import formatDistanceValue from '@utils/formatDistanceValue';
import formatCurrencyValue from '@utils/formatCurrencyValue';

import IOrder from '@models/Order';
import IRequestPickupOffer from '@models/RequestPickupOffer';
import IUser from '@models/User';
import IUserRate from '@models/UserRate';
import IChat from '@models/Chat';

import LoadingScreen from '@components/atoms/LoadingScreen';
import TitleBar from '@components/atoms/TitleBar';
import TitledBox from '@components/atoms/TitledBox';
import FilledButton from '@components/atoms/FilledButton';
import OutlinedButton from '@components/atoms/OutlinedButton';
import AvatarImage from '@components/atoms/AvatarImage';
import InputGroup from '@components/molecules/InputGroup';

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
  ModalContainer,
  OfferToPickupInputContainer,
  OfferToPickupInputContainerLabel,
  TextInput,
  ModalTitle,
  OfferToPickupDateTime,
  ModalButtons,
  DeliverymanContainer,
  DeliverymanMeta,
  DeliverymanTextWrapper,
  DeliverymanFullName,
  DeliverymanUsername,
  DeliverymanAvaluationStars,
  RatingStarsContainer,
} from './styles';

interface RouteParams {
  id: string;
}

interface IRequestPickupOfferExtended extends IRequestPickupOffer {
  formatted_created_at: string;
}

interface SendDeliverymanRateFormData {
  comment: string;
}

const OrderDetails: React.FC = () => {
  const modalizeRef = useRef<Modalize>(null);
  const setOrderAsDeliveredModalRef = useRef<Modalize>(null);
  const setOrderAsDeliveredFormRef = useRef<FormHandles>(null);

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
  const [isSubmiting, setIsSubmiting] = useState<
    | 'DeleteOrder'
    | 'MakeOfferToPickup'
    | 'DeleteMyOfferToPickup'
    | 'UpdateMyOfferToPickup'
    | 'DeleteOrder'
    | 'SetOrderAsDelivered'
    | 'SendDeliverymanRate'
    | 'RefuseOrder'
    | null
  >(null);
  const [deliverymanRateValue, setDeliverymanRateValue] = useState(5);
  const [deliverymanRate, setDeliverymanRate] = useState<IUserRate>(
    {} as IUserRate,
  );

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
          `Ocorreu um erro ao tentar carregar esse pedido. Tente novamente mais tarde, por favor.\n\n${err.response.data.message}`,
        );
      }
    }

    loadUserDeliverymanForThisOrder();
  }, [order.id, user.id]);

  useEffect(() => {
    async function loadDeliverymanRate() {
      if (order.id) {
        try {
          const response = await api.get(`/rating/order/${order.id}`);

          if (response.data) {
            setDeliverymanRate(response.data);
          }
        } catch (err) {
          Alert.alert(
            'Erro',
            `Ocorreu um erro ao tentar carregar a avaliação do entregador. Tente novamente mais tarde, por favor.\n\n${err.response.data.message}`,
          );
        }
      }
    }

    loadDeliverymanRate();
  }, [order.id]);

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
        {},
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setIsSubmiting('DeleteOrder');

            try {
              await api.delete(`/orders/${order.id}`);

              setIsSubmiting(null);

              Alert.alert('Excluído!', 'Pedido excluído com sucesso.');

              navigation.goBack();
            } catch (err) {
              Alert.alert('Ops...', err.message);
              setIsSubmiting(null);
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
    setIsSubmiting('MakeOfferToPickup');

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
      setIsSubmiting(null);
      modalizeRef.current?.close();
    }
  }, [offerToPickupValue, order.id]);

  const handleDeleteMyOfferToPickup = useCallback(async () => {
    setIsSubmiting('DeleteMyOfferToPickup');

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
      setIsSubmiting(null);
      modalizeRef.current?.close();
    }
  }, [offerToPickup.id]);

  const handleUpdateMyOfferToPickup = useCallback(async () => {
    setIsSubmiting('UpdateMyOfferToPickup');

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
      setIsSubmiting(null);
      modalizeRef.current?.close();
    }
  }, [offerToPickup.id, offerToPickupValue]);

  const handleJoinChatRoom = useCallback(
    (chat: IChat, recipient: IUser, order_id: string) => {
      navigation.navigate('ChatRoom', { chat, recipient, order_id });
    },
    [navigation],
  );

  const handleSetOrderAsDelivered = useCallback(() => {
    Alert.alert(
      'Tem certeza?',
      'Uma vez confirmado o recebimento dos produtos, o pedido será fechado e marcado como entregue.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {},
        {
          text: 'Recebi',
          onPress: async () => {
            setIsSubmiting('SetOrderAsDelivered');

            try {
              const orderToSave = {
                deliveryman_id: order.deliveryman_id,
                requester_id: order.requester_id,
                pickup_date: order.pickup_date,
                pickup_establishment: order.pickup_establishment,
                pickup_address: order.pickup_address,
                pickup_city: order.pickup_city,
                pickup_state: order.pickup_state,
                pickup_latitude: order.pickup_latitude,
                pickup_longitude: order.pickup_longitude,
                delivery_address: order.delivery_address,
                delivery_city: order.delivery_city,
                delivery_state: order.delivery_state,
                delivery_value: order.delivery_value,
                trip_id: order.trip_id,
                status: 3,
              };

              const response = await api.put(
                `/orders/${order.id}`,
                orderToSave,
              );

              setOrder(response.data);

              setIsSubmiting(null);

              Alert.alert(
                'Oba!',
                'Que bom que seu pedido foi entregue! Já atualizamos a situação dele.\n\nNão se esqueça de avaliar o seu entregador, hein!',
              );

              setOrderAsDeliveredModalRef.current?.open();
            } catch (err) {
              Alert.alert(
                'Erro',
                `Ocorreu um erro ao tentar alterar o status do pedido. Tente novamente mais tarde, por favor.\n\n${err.response.data.message}`,
              );
              setIsSubmiting(null);

              console.log(err.response.data);
            }
          },
        },
      ],
    );
  }, [order]);

  const handleSendDeliverymanRate = useCallback(
    async (data: SendDeliverymanRateFormData) => {
      setIsSubmiting('SendDeliverymanRate');

      try {
        await api.post('/rating', {
          order_id: order.id,
          deliveryman_id: order.deliveryman.id,
          rate: deliverymanRateValue,
          comment: data.comment,
        });

        setIsSubmiting(null);

        Alert.alert(
          'Valeu!',
          'Obrigado por avaliar seu entregador, isso conta demais!',
        );

        navigation.goBack();
      } catch (err) {
        Alert.alert(
          'Erro',
          `Ocorreu um erro ao tentar enviar a avaliação do entregador. Tente novamente mais tarde, por favor.\n\n${err.response.data.message}`,
        );
        setIsSubmiting(null);

        console.log(err.response.data);
      }
    },
    [order, deliverymanRateValue, navigation],
  );

  const handleDoNotRateDeliveryman = useCallback(() => {
    Alert.alert(
      'Aaaah vai...',
      'Leva menos de um minuto... Avaliar o seu entregador é muito importante para que ele consiga mais serviços na nossa plataforma.',
      [
        {
          text: 'Não avaliar',
          style: 'cancel',
          onPress: () => navigation.goBack(),
        },
        {},
        { text: 'Vou avaliar!' },
      ],
    );
  }, [navigation]);

  const handleRefuseOrder = useCallback(() => {
    Alert.alert(
      'Tem certeza?',
      'Uma vez recusado o pedido, você não poderá voltar atrás.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {},
        {
          text: 'Recusar',
          onPress: async () => {
            setIsSubmiting('RefuseOrder');

            try {
              const orderToSave = {
                deliveryman_id: order.deliveryman_id,
                requester_id: order.requester_id,
                pickup_date: order.pickup_date,
                pickup_establishment: order.pickup_establishment,
                pickup_address: order.pickup_address,
                pickup_city: order.pickup_city,
                pickup_state: order.pickup_state,
                pickup_latitude: order.pickup_latitude,
                pickup_longitude: order.pickup_longitude,
                delivery_address: order.delivery_address,
                delivery_city: order.delivery_city,
                delivery_state: order.delivery_state,
                delivery_value: order.delivery_value,
                trip_id: order.trip_id,
                status: 7,
              };

              const response = await api.put(
                `/orders/${order.id}`,
                orderToSave,
              );

              setOrder(response.data);

              setIsSubmiting(null);

              Alert.alert('Conluído!', 'O pedido foi recusado com sucesso!');

              navigation.goBack();
            } catch (err) {
              Alert.alert(
                'Erro',
                `Ocorreu um erro ao tentar alterar o status do pedido. Tente novamente mais tarde, por favor.\n\n${err.response.data.message}`,
              );
              setIsSubmiting(null);

              console.log(err.response.data);
            }
          },
        },
      ],
    );
  }, [order, navigation]);

  const orderItemsCount = useMemo(() => {
    if (order.id) {
      return order.items.reduce(
        (accumulator, currentValue) => accumulator + currentValue.quantity,
        0,
      );
    }

    return 0;
  }, [order]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <TitleBar title="Detalhes do Pedido" />

      {offerToPickup.id && (order.status === 1 || order.status === 5) && (
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

      {order.status === 6 && (
        <StatusIndicatorContainer backgroundColor="#6ab04c">
          <StatusIndicatorText>Pedido aceito!</StatusIndicatorText>
        </StatusIndicatorContainer>
      )}

      {order.status === 7 && (
        <StatusIndicatorContainer backgroundColor="#EB4D4B">
          <StatusIndicatorText>Pedido recusado</StatusIndicatorText>
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
                    {`${orderItemsCount} ${
                      orderItemsCount > 1 ? 'itens' : 'item'
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
                        order.chat,
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

            {order.purchase_invoice && (
              <TitledBox title="Nota Fiscal">
                <OutlinedButton
                  color="#6f7bae"
                  widthPercentage={100}
                  onPress={handleViewPurchaseInvoice}
                >
                  Visualizar documento
                </OutlinedButton>
              </TitledBox>
            )}

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
                          startingValue={order.deliveryman.rating_average / 2}
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

            {user.id === order.requester.id &&
              (order.status === 1 || order.status === 5) && (
                <>
                  <FilledButton onPress={handleNavigateToSelectDeliveryman}>
                    Escolher entregador
                  </FilledButton>

                  <OutlinedButton
                    showLoadingIndicator={isSubmiting === 'DeleteOrder'}
                    color="#EB4D4B"
                    marginTop={16}
                    onPress={handleDeleteOrder}
                  >
                    Excluir pedido
                  </OutlinedButton>
                </>
              )}

            {user.id === order.requester.id && order.status === 2 && (
              <FilledButton
                backgroundColor="#3498db"
                textColor="#EBEBEB"
                showLoadingIndicator={isSubmiting === 'SetOrderAsDelivered'}
                onPress={handleSetOrderAsDelivered}
              >
                {orderItemsCount > 1
                  ? 'Recebi os produtos'
                  : 'Recebi o produto'}
              </FilledButton>
            )}

            {user.id === order.requester.id &&
              order.status === 3 &&
              !deliverymanRate.rate && (
                <OutlinedButton
                  color="#ff8c42"
                  onPress={() => setOrderAsDeliveredModalRef.current?.open()}
                >
                  Avaliar entregador
                </OutlinedButton>
              )}

            {order.trip_id &&
              order.requester.id !== user.id &&
              !offerToPickup.id && (
                <>
                  <FilledButton onPress={handleOpenOfferToPickupModal}>
                    Aceitar
                  </FilledButton>

                  <OutlinedButton
                    showLoadingIndicator={isSubmiting === 'RefuseOrder'}
                    color="#EB4D4B"
                    marginTop={16}
                    onPress={handleRefuseOrder}
                  >
                    Recusar
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
        <ModalContainer>
          <ModalTitle
            fontWeight={offerToPickup.id ? 'normal' : undefined}
            fontSize={offerToPickup.id ? 14 : undefined}
          >
            {offerToPickup.id ? 'Oferta feita em' : 'Quanto você quer cobrar?'}
          </ModalTitle>

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
            <ModalButtons>
              <OutlinedButton
                color="#EB4D4B"
                flex={1}
                onPress={handleCloseOfferToPickupModal}
              >
                Cancelar
              </OutlinedButton>

              <FilledButton
                showLoadingIndicator={isSubmiting === 'MakeOfferToPickup'}
                backgroundColor="#6ab04c"
                textColor="#ebebeb"
                marginTop={0}
                marginLeft={8}
                flex={1}
                onPress={handleOfferToPickup}
              >
                Ok
              </FilledButton>
            </ModalButtons>
          )}

          {offerToPickup.id && (
            <ModalButtons>
              <OutlinedButton
                showLoadingIndicator={isSubmiting === 'DeleteMyOfferToPickup'}
                color="#EB4D4B"
                flex={1}
                onPress={handleDeleteMyOfferToPickup}
              >
                Excluir
              </OutlinedButton>

              {offerToPickupValue !== offerToPickup.delivery_value &&
                offerToPickupValue > 0 && (
                  <FilledButton
                    showLoadingIndicator={
                      isSubmiting === 'UpdateMyOfferToPickup'
                    }
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
            </ModalButtons>
          )}
        </ModalContainer>
      </Modalize>

      <Modalize
        ref={setOrderAsDeliveredModalRef}
        adjustToContentHeight
        keyboardAvoidingBehavior="height"
        closeOnOverlayTap={false}
        overlayStyle={{ backgroundColor: '#00000090' }}
        onClose={handleDoNotRateDeliveryman}
      >
        <ModalContainer>
          <ModalTitle>Avaliar entregador</ModalTitle>

          <Form
            ref={setOrderAsDeliveredFormRef}
            onSubmit={handleSendDeliverymanRate}
          >
            <RatingStarsContainer>
              <Rating
                type="custom"
                startingValue={2.5}
                minValue={1}
                fractions={1}
                ratingBackgroundColor="#606060"
                ratingColor="#feca57"
                tintColor="#312e38"
                imageSize={parseWidthPercentage(32)}
                onFinishRating={rating => setDeliverymanRateValue(rating * 2)}
              />
            </RatingStarsContainer>

            <InputGroup
              label="Escreva um comentário"
              name="comment"
              placeholder="Diga o que achou da entrega"
              multiline
              numberOfLines={5}
              autoCapitalize="sentences"
              returnKeyType="done"
              containerStyle={{
                marginTop: parseHeightPercentage(24),
                marginBottom: 0,
              }}
              onSubmitEditing={() => {
                setOrderAsDeliveredFormRef.current?.submitForm();
              }}
            />

            <ModalButtons>
              <OutlinedButton
                color="#EB4D4B"
                flex={1}
                onPress={handleDoNotRateDeliveryman}
              >
                Cancelar
              </OutlinedButton>

              <FilledButton
                showLoadingIndicator={isSubmiting === 'SendDeliverymanRate'}
                backgroundColor="#6ab04c"
                textColor="#ebebeb"
                marginTop={0}
                marginLeft={8}
                flex={1}
                onPress={() => setOrderAsDeliveredFormRef.current?.submitForm()}
              >
                Enviar
              </FilledButton>
            </ModalButtons>
          </Form>
        </ModalContainer>
      </Modalize>
    </>
  );
};

export default OrderDetails;
