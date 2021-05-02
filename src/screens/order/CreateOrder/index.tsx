import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import { ButtonGroup } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { Rating } from 'react-native-elements';
import * as Yup from 'yup';
import Feather from 'react-native-vector-icons/Feather';

import api from '@services/api';
import brasilApi from '@services/brasil';
import { fetchAddressMapbox } from '@services/mapbox';

import { useAuth } from '@hooks/auth';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';
import getValidationErrors from '@utils/getValidationErrors';

import ITrip from '@models/Trip';

import LoadingScreen from '@components/atoms/LoadingScreen';

import TitleBar from '@components/atoms/TitleBar';
import TitledBox from '@components/atoms/TitledBox';
import Label from '@components/atoms/Label';
import InputGroup from '@components/molecules/InputGroup';
import FilledButton from '@components/atoms/FilledButton';
import AvatarImage from '@components/atoms/AvatarImage';

import noOrderItemImg from '@assets/no-order-item-image.png';

import {
  Container,
  DateTimePickerWrapper,
  DateTimePickerLabel,
  DateTimePickerValueContainer,
  DateTimePickerPressable,
  DateTimePickerValueIcon,
  DateTimePickerValueText,
  InputsWrapper,
  OrderItemContainer,
  OrderItemPressable,
  OrderItemQuantity,
  OrderItemQuantityText,
  OrderItemNameAndPacking,
  OrderItemName,
  OrderItemPacking,
  OrderItemImage,
  NoItemTextContainer,
  NoItemText,
  AddressContainer,
  AddressTextContainer,
  AddressText,
  AddItemToOrderButtonContainer,
  AddItemToOrderButton,
  AddItemToOrderButtonText,
  ItemInfoWrapper,
  ItemInfoLabel,
  ItemInfoValueContainer,
  ItemInfoValueIcon,
  ItemInfoValueText,
  AttachPurchaseInvoiceWrapper,
  AttachPurchaseInvoiceLabel,
  AttachPurchaseInvoiceValueContainer,
  AttachPurchaseInvoicePressable,
  AttachPurchaseInvoiceValueIcon,
  AttachPurchaseInvoiceValueText,
  DeliverymanContainer,
  DeliverymanMeta,
  DeliverymanTextWrapper,
  DeliverymanFullName,
  DeliverymanUsername,
  DeliverymanAvaluationStars,
} from './styles';

export interface OrderItemToSave {
  id: number;
  name: string;
  description: string;
  quantity: number;
  weight: number;
  width: number;
  height: number;
  depth: number;
  packing: string;
  category_id: number;
  weight_unit_id: number;
  dimension_unit_id: number;
  image_uri: string;
}

interface RouteParams {
  item_id: number;
  updated_at: number;
  trip: ITrip;
}

interface BrasilApiAddress {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
}

interface CreateOrderFormData {
  pickup_establishment: string;
  pickup_number: string;
  pickup_complement: string;
  delivery_number: string;
  delivery_complement: string;
}

interface CepFormData {
  cep: string;
}

interface CreateOrderItemResponse {
  id: string;
}

interface CreateOrderResponse {
  id: string;
  items: CreateOrderItemResponse[];
}

const CreateOrder: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const pickupCepFormRef = useRef<FormHandles>(null);
  const deliveryCepFormRef = useRef<FormHandles>(null);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as RouteParams | undefined;

  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isSubmiting, setIsSubmiting] = useState<
    'OrderCreation' | 'PickupCepSearch' | 'DeliveryCepSearch' | null
  >(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickupDate, setPickupDate] = useState(new Date());

  const [pickupAddress, setPickupAddress] = useState<BrasilApiAddress>(
    {} as BrasilApiAddress,
  );
  const [deliveryAddress, setDeliveryAddress] = useState<BrasilApiAddress>(
    {} as BrasilApiAddress,
  );

  const [useMyOrAnotherAddress, setUseMyOrAnotherAddress] = useState(
    !user.address && !user.state && !user.city ? 1 : 0,
  );
  const [items, setItems] = useState<OrderItemToSave[]>([]);
  const [purchaseInvoiceFile, setPurchaseInvoiceFile] = useState<
    DocumentPickerResponse
  >({} as DocumentPickerResponse);

  const [isAttachedToATrip, setIsAttachedToATrip] = useState(false);
  const [trip, setTrip] = useState<ITrip>({} as ITrip);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(state => !state);
  }, []);

  const handleDateChanged = useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }

      if (date) {
        setPickupDate(date);
      }
    },
    [],
  );

  const handleSearchPickupCep = useCallback(
    async (data: CepFormData) => {
      setIsSubmiting('PickupCepSearch');

      try {
        pickupCepFormRef.current?.setErrors({});

        const schema = Yup.object().shape({
          cep: Yup.string()
            .required('Esse campo é obrigatório')
            .length(8, 'Um CEP deve ter 8 dígitos'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await brasilApi.get(`/${data.cep}`);

        if (
          isAttachedToATrip &&
          response.data.city !== trip.destination_city &&
          response.data.state !== trip.destination_state
        ) {
          Alert.alert(
            'Atenção',
            'O CEP informado não pertence à cidade e ao estado de destino da viagem desse usuário. Revise, por favor.',
          );
          return;
        }

        setPickupAddress(response.data);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          pickupCepFormRef.current?.setErrors(errors);
          return;
        }

        console.log(String(err));

        Alert.alert(
          'Erro',
          'Houve um erro ao consultar o CEP informado. Verifique-o e tente novamente mais tarde.',
        );
      } finally {
        setIsSubmiting(null);
      }
    },
    [isAttachedToATrip, trip],
  );

  const handleSearchDeliveryCep = useCallback(async (data: CepFormData) => {
    setIsSubmiting('DeliveryCepSearch');

    try {
      deliveryCepFormRef.current?.setErrors({});

      const schema = Yup.object().shape({
        cep: Yup.string()
          .required('Esse campo é obrigatório')
          .length(8, 'Um CEP deve ter 8 dígitos'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const response = await brasilApi.get(`/${data.cep}`);

      setDeliveryAddress(response.data);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        deliveryCepFormRef.current?.setErrors(errors);
        return;
      }

      console.log(String(err));

      Alert.alert(
        'Erro',
        'Houve um erro ao consultar o CEP informado. Verifique-o e tente novamente mais tarde.',
      );
    } finally {
      setIsSubmiting(null);
    }
  }, []);

  const handleUseMyOrAnotherAddressChangeIndex = useCallback(
    (index: number) => {
      if (index === 0 && !user.address && !user.state && !user.city) {
        Alert.alert(
          'Ops...',
          'Você deve preencher seu endereço em seu perfil para utilizar essa opção.',
        );

        return;
      }

      setUseMyOrAnotherAddress(index);
    },
    [user.address, user.state, user.city],
  );

  const handlePickPurchaseInvoiceFile = useCallback(async () => {
    try {
      const file = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      });

      setPurchaseInvoiceFile(file);
    } catch (err) {
      setPurchaseInvoiceFile({} as DocumentPickerResponse);

      if (DocumentPicker.isCancel(err)) {
        Alert.alert(
          'Aviso!',
          'É preciso anexar uma nota fiscal ao pedido ou ele não será salvo.',
        );
      } else {
        Alert.alert(
          'Erro!',
          'Ocorreu um erro ao tentar realizar essa operação. Tente novamente mais tarde.',
        );
      }
    }
  }, []);

  const handleNavigateToAddItemToOrder = useCallback(() => {
    navigation.navigate('AddItemToOrder');
  }, [navigation]);

  const handleSaveOrder = useCallback(
    async (data: CreateOrderFormData) => {
      setIsSubmiting('OrderCreation');

      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          pickup_establishment: Yup.string()
            .required('Esse campo é obrigatório')
            .min(4, 'Mínimo de 4 caracteres'),
          pickup_number: Yup.string().required('Esse campo é obrigatório'),
          ...(useMyOrAnotherAddress === 1 && {
            delivery_number: Yup.string().required('Esse campo é obrigatório'),
          }),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (!pickupAddress.cep) {
          throw new Error('Você deve preencher o CEP do endereço de retirada.');
        }

        if (useMyOrAnotherAddress === 1 && !deliveryAddress.cep) {
          throw new Error('Você deve preencher o CEP do endereço de entrega.');
        }

        if (items.length === 0) {
          throw new Error('Você precisa incluir ao menos 1 item ao pedido.');
        }

        if (!purchaseInvoiceFile.uri) {
          throw new Error('Você precisa anexar uma nota fiscal ao pedido.');
        }

        const {
          latitude: pickup_latitude,
          longitude: pickup_longitude,
        } = await fetchAddressMapbox(
          `${pickupAddress.street} ${pickupAddress.city} - ${
            pickupAddress.state
          }, ${pickupAddress.cep.substr(0, 5)}, Brazil`,
        );

        const {
          latitude: delivery_latitude,
          longitude: delivery_longitude,
        } = await fetchAddressMapbox(
          useMyOrAnotherAddress === 0
            ? `${user.address}, ${user.city}-${user.state}, Brazil`
            : `${deliveryAddress.street} ${deliveryAddress.city} - ${
                deliveryAddress.state
              }, ${deliveryAddress.cep.substr(0, 5)}, Brazil`,
        );

        const pickup_date = new Date(pickupDate);
        pickup_date.setHours(0);
        pickup_date.setMinutes(0);

        const pickup_address = `${pickupAddress.street}, ${data.pickup_number}, ${data.pickup_complement}, ${pickupAddress.neighborhood} - CEP: ${pickupAddress.cep}`;
        const delivery_address = `${deliveryAddress.street}, ${data.delivery_number}, ${data.delivery_complement}, ${deliveryAddress.neighborhood} - CEP: ${deliveryAddress.cep}`;

        const orderToSave = {
          pickup_date,
          pickup_establishment: data.pickup_establishment,
          pickup_address,
          pickup_city: isAttachedToATrip
            ? trip.destination_city
            : pickupAddress.city,
          pickup_state: isAttachedToATrip
            ? trip.destination_state
            : pickupAddress.state,
          pickup_latitude,
          pickup_longitude,
          delivery_address:
            useMyOrAnotherAddress === 0 ? user.address : delivery_address,
          delivery_city:
            useMyOrAnotherAddress === 0 ? user.city : deliveryAddress.city,
          delivery_state:
            useMyOrAnotherAddress === 0 ? user.state : deliveryAddress.state,
          delivery_latitude,
          delivery_longitude,
          items: items.map(item => ({
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            weight: item.weight,
            width: item.width,
            height: item.height,
            depth: item.depth,
            packing: item.packing,
            category_id: item.category_id,
            weight_unit_id: item.weight_unit_id,
            dimension_unit_id: item.dimension_unit_id,
          })),
          ...(isAttachedToATrip
            ? {
                deliveryman_id: trip.user_id,
                trip_id: trip.id,
                status: 5,
              }
            : {}),
        };

        const createOrderResponse = await api.post<CreateOrderResponse>(
          '/orders',
          orderToSave,
        );

        const uploadPurchaseInvoice = new FormData();

        uploadPurchaseInvoice.append('order_id', createOrderResponse.data.id);
        uploadPurchaseInvoice.append('purchase_invoice', {
          type: purchaseInvoiceFile.type,
          name: `${createOrderResponse.data.id}.${
            purchaseInvoiceFile.type === 'application/pdf' ? 'pdf' : 'jpg'
          }`,
          uri: purchaseInvoiceFile.uri,
        });

        await api.patch('/orders/purchase_invoice', uploadPurchaseInvoice);

        items.forEach(async (item, index) => {
          const uploadItemImage = new FormData();

          uploadItemImage.append(
            'item_id',
            createOrderResponse.data.items[index].id,
          );

          uploadItemImage.append('image', {
            type: 'image/jpeg',
            name: `${createOrderResponse.data.items[index].id}.jpg`,
            uri: item.image_uri,
          });

          await api.patch('/items/image', uploadItemImage);
        });

        setIsSubmiting(null);

        Alert.alert('Eba!', 'Seu pedido foi salvo com sucesso.');

        navigation.goBack();
      } catch (err) {
        setIsSubmiting(null);

        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        console.log(err.toString());

        Alert.alert(
          'Ops...',
          `Ocorreu um erro ao tentar salvar o seu pedido, tente novamente mais tarde.\n\n${err.toString()}`,
        );
      }
    },
    [
      pickupDate,
      pickupAddress,
      deliveryAddress,
      items,
      purchaseInvoiceFile,
      useMyOrAnotherAddress,
      user.address,
      user.city,
      user.state,
      navigation,
      isAttachedToATrip,
      trip,
    ],
  );

  useEffect(() => {
    async function loadData() {
      if (routeParams && routeParams.item_id && routeParams.updated_at) {
        const { item_id } = routeParams;

        const storagedItem = await AsyncStorage.getItem(
          `@Peguei!:create-order-item-${item_id}`,
        );

        if (!storagedItem) {
          Alert.alert(
            'Erro',
            'Ocorreu um erro ao tentar recuperar o item que acabou de salvar.',
          );
          return;
        }

        const parsedItem = JSON.parse(storagedItem) as OrderItemToSave;

        setItems(state => {
          const itemIndex = state.findIndex(
            findItem => findItem.id === item_id,
          );

          if (itemIndex > -1) {
            return state.map(item => {
              if (item.id === item_id) {
                return parsedItem;
              }

              return item;
            });
          }

          return [...state, parsedItem];
        });
      }

      setLoading(false);
    }

    loadData();
  }, [routeParams]);

  useEffect(() => {
    if (routeParams?.trip) {
      setIsAttachedToATrip(true);
      setTrip(routeParams.trip);
    }
  }, [routeParams]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <TitleBar title="Cadastrar Pedido" />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <Container>
          <Form ref={formRef} onSubmit={handleSaveOrder}>
            <TitledBox title="Retirada">
              <DateTimePickerWrapper>
                <DateTimePickerLabel>Data de retirada</DateTimePickerLabel>
                <DateTimePickerValueContainer>
                  <DateTimePickerPressable
                    onPress={handleToggleDatePicker}
                    rippleColor="#ebebeb10"
                  >
                    <DateTimePickerValueIcon
                      name="file-text"
                      size={parseWidthPercentage(24)}
                      color="#606060"
                    />

                    <DateTimePickerValueText>
                      {format(pickupDate, 'dd/MM/yyyy')}
                    </DateTimePickerValueText>
                  </DateTimePickerPressable>
                </DateTimePickerValueContainer>

                {showDatePicker && (
                  <DateTimePicker
                    mode="date"
                    display="calendar"
                    onChange={handleDateChanged}
                    value={pickupDate}
                    minimumDate={new Date()}
                  />
                )}
              </DateTimePickerWrapper>

              <InputGroup
                label="Estabelecimento"
                name="pickup_establishment"
                icon="home"
                placeholder="Nome do Estabelecimento"
                autoCapitalize="words"
                returnKeyType="done"
              />

              <Form ref={pickupCepFormRef} onSubmit={handleSearchPickupCep}>
                <InputsWrapper>
                  <InputGroup
                    label="CEP"
                    name="cep"
                    icon="map-pin"
                    placeholder="Somente números"
                    keyboardType="number-pad"
                    returnKeyType="done"
                    maxLength={8}
                    containerStyle={{ flex: 1 }}
                    onSubmitEditing={() => {
                      pickupCepFormRef.current?.submitForm();
                    }}
                  />

                  <FilledButton
                    widthPercentage={20}
                    marginLeft={parseWidthPercentage(8)}
                    marginBottom={parseHeightPercentage(8)}
                    backgroundColor="#6f7bae"
                    textColor="#ebebeb"
                    showLoadingIndicator={isSubmiting === 'PickupCepSearch'}
                    onPress={() => pickupCepFormRef.current?.submitForm()}
                  >
                    <Feather
                      name="search"
                      size={parseWidthPercentage(20)}
                      color="#ebebeb"
                    />
                  </FilledButton>
                </InputsWrapper>
              </Form>

              {pickupAddress.cep && (
                <>
                  <AddressContainer>
                    <Label>Endereço</Label>
                    <AddressTextContainer>
                      <AddressText>
                        {pickupAddress.cep &&
                          `${pickupAddress.street}, ${
                            pickupAddress.neighborhood
                          }${
                            !isAttachedToATrip &&
                            `, ${pickupAddress.city}-${pickupAddress.state}`
                          } - CEP: ${pickupAddress.cep}`}
                      </AddressText>
                    </AddressTextContainer>
                  </AddressContainer>

                  <InputsWrapper>
                    <InputGroup
                      label="Número"
                      name="pickup_number"
                      placeholder="N°"
                      keyboardType="number-pad"
                      returnKeyType="done"
                      containerStyle={{ flex: 1 }}
                    />

                    <InputGroup
                      label="Complemento"
                      name="pickup_complement"
                      placeholder="Ex: Apto 2"
                      autoCapitalize="words"
                      returnKeyType="done"
                      containerStyle={{
                        width: '65%',
                        marginLeft: parseWidthPercentage(8),
                      }}
                    />
                  </InputsWrapper>
                </>
              )}

              {isAttachedToATrip && (
                <InputsWrapper>
                  <ItemInfoWrapper width={64} marginRight={8}>
                    <ItemInfoLabel>Estado</ItemInfoLabel>
                    <ItemInfoValueContainer borderColor="#6F7BAE">
                      <ItemInfoValueText
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        color="#6F7BAE"
                      >
                        {trip.destination_state}
                      </ItemInfoValueText>
                    </ItemInfoValueContainer>
                  </ItemInfoWrapper>

                  <ItemInfoWrapper flex={1}>
                    <ItemInfoLabel>Cidade</ItemInfoLabel>
                    <ItemInfoValueContainer borderColor="#6F7BAE">
                      <ItemInfoValueText
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        color="#6F7BAE"
                      >
                        {trip.destination_city}
                      </ItemInfoValueText>
                    </ItemInfoValueContainer>
                  </ItemInfoWrapper>
                </InputsWrapper>
              )}
            </TitledBox>

            <TitledBox title="Itens do Pedido">
              {items.length === 0 && (
                <NoItemTextContainer>
                  <NoItemText>Nenhum item ainda</NoItemText>
                </NoItemTextContainer>
              )}

              {items.map((item, index) => (
                <OrderItemContainer
                  key={item.id}
                  hasBorder={index !== items.length - 1}
                >
                  <OrderItemPressable
                    rippleColor="#ebebeb10"
                    onPress={() => {
                      navigation.navigate('AddItemToOrder', {
                        item_id: item.id,
                      });
                    }}
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
                        item.image_uri
                          ? { uri: item.image_uri }
                          : noOrderItemImg
                      }
                    />
                  </OrderItemPressable>
                </OrderItemContainer>
              ))}

              <AddItemToOrderButtonContainer>
                <AddItemToOrderButton
                  onPress={handleNavigateToAddItemToOrder}
                  rippleColor="#ebebeb10"
                >
                  <AddItemToOrderButtonText>
                    Adicionar item
                  </AddItemToOrderButtonText>
                </AddItemToOrderButton>
              </AddItemToOrderButtonContainer>
            </TitledBox>

            <TitledBox title="Local de Entrega">
              <ButtonGroup
                onPress={handleUseMyOrAnotherAddressChangeIndex}
                selectedIndex={useMyOrAnotherAddress}
                buttons={['Usar meu endereço', 'Outro']}
                containerStyle={{
                  height: parseHeightPercentage(56),
                  width: '100%',
                  borderColor: '#ebebeb10',
                  borderWidth: 2,
                  borderRadius: 8,
                  backgroundColor: '#232129',
                  marginTop: parseHeightPercentage(24),
                  marginBottom: parseHeightPercentage(24),
                }}
                buttonContainerStyle={{
                  backgroundColor: '#232129',
                }}
                innerBorderStyle={{ color: '#ebebeb10' }}
                selectedButtonStyle={{ backgroundColor: '#6F7BAE' }}
                textStyle={{
                  fontSize: parseWidthPercentage(13),
                  color: '#606060',
                }}
                selectedTextStyle={{
                  fontSize: parseWidthPercentage(13),
                  fontWeight: 'bold',
                  color: '#ebebeb',
                }}
              />

              {useMyOrAnotherAddress === 0 ? (
                <>
                  <ItemInfoWrapper marginBottom={8}>
                    <ItemInfoLabel>Endereço</ItemInfoLabel>
                    <ItemInfoValueContainer borderColor="#6F7BAE">
                      <ItemInfoValueIcon
                        name="map-pin"
                        size={parseWidthPercentage(20)}
                        color="#6f7bae"
                      />
                      <ItemInfoValueText
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        color="#6F7BAE"
                      >
                        {user.address}
                      </ItemInfoValueText>
                    </ItemInfoValueContainer>
                  </ItemInfoWrapper>

                  <InputsWrapper>
                    <ItemInfoWrapper width={64} marginRight={8}>
                      <ItemInfoLabel>Estado</ItemInfoLabel>
                      <ItemInfoValueContainer borderColor="#6F7BAE">
                        <ItemInfoValueText
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          color="#6F7BAE"
                        >
                          {user.state}
                        </ItemInfoValueText>
                      </ItemInfoValueContainer>
                    </ItemInfoWrapper>

                    <ItemInfoWrapper flex={1}>
                      <ItemInfoLabel>Cidade</ItemInfoLabel>
                      <ItemInfoValueContainer borderColor="#6F7BAE">
                        <ItemInfoValueText
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          color="#6F7BAE"
                        >
                          {user.city}
                        </ItemInfoValueText>
                      </ItemInfoValueContainer>
                    </ItemInfoWrapper>
                  </InputsWrapper>
                </>
              ) : (
                <>
                  <Form
                    ref={deliveryCepFormRef}
                    onSubmit={handleSearchDeliveryCep}
                  >
                    <InputsWrapper>
                      <InputGroup
                        label="CEP"
                        name="cep"
                        icon="map-pin"
                        placeholder="Somente números"
                        keyboardType="number-pad"
                        returnKeyType="done"
                        maxLength={8}
                        containerStyle={{ flex: 1 }}
                        onSubmitEditing={() => {
                          deliveryCepFormRef.current?.submitForm();
                        }}
                      />

                      <FilledButton
                        widthPercentage={20}
                        marginLeft={parseWidthPercentage(8)}
                        marginBottom={parseHeightPercentage(8)}
                        backgroundColor="#6f7bae"
                        textColor="#ebebeb"
                        showLoadingIndicator={
                          isSubmiting === 'DeliveryCepSearch'
                        }
                        onPress={() => deliveryCepFormRef.current?.submitForm()}
                      >
                        <Feather
                          name="search"
                          size={parseWidthPercentage(20)}
                          color="#ebebeb"
                        />
                      </FilledButton>
                    </InputsWrapper>
                  </Form>

                  {deliveryAddress.cep && (
                    <>
                      <AddressContainer>
                        <Label>Endereço</Label>
                        <AddressTextContainer>
                          <AddressText>
                            {deliveryAddress.cep &&
                              `${deliveryAddress.street}, ${deliveryAddress.neighborhood}, ${deliveryAddress.city}-${deliveryAddress.state} - CEP: ${deliveryAddress.cep}`}
                          </AddressText>
                        </AddressTextContainer>
                      </AddressContainer>

                      <InputsWrapper>
                        <InputGroup
                          label="Número"
                          name="delivery_number"
                          placeholder="N°"
                          keyboardType="number-pad"
                          returnKeyType="done"
                          containerStyle={{ flex: 1 }}
                        />

                        <InputGroup
                          label="Complemento"
                          name="delivery_complement"
                          placeholder="Ex: Apto 2"
                          autoCapitalize="words"
                          returnKeyType="done"
                          containerStyle={{
                            width: '65%',
                            marginLeft: parseWidthPercentage(8),
                          }}
                        />
                      </InputsWrapper>
                    </>
                  )}
                </>
              )}
            </TitledBox>

            <TitledBox title="Nota Fiscal">
              <AttachPurchaseInvoiceWrapper>
                <AttachPurchaseInvoiceLabel>
                  Anexar arquivo
                </AttachPurchaseInvoiceLabel>
                <AttachPurchaseInvoiceValueContainer>
                  <AttachPurchaseInvoicePressable
                    onPress={handlePickPurchaseInvoiceFile}
                    rippleColor="#ebebeb10"
                  >
                    <AttachPurchaseInvoiceValueIcon
                      name="paperclip"
                      size={parseWidthPercentage(24)}
                      color="#606060"
                    />

                    <AttachPurchaseInvoiceValueText
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {purchaseInvoiceFile.uri
                        ? purchaseInvoiceFile.name
                        : 'Carregue um arquivo'}
                    </AttachPurchaseInvoiceValueText>
                  </AttachPurchaseInvoicePressable>
                </AttachPurchaseInvoiceValueContainer>
              </AttachPurchaseInvoiceWrapper>
            </TitledBox>

            {isAttachedToATrip && (
              <TitledBox title="Entregador">
                <DeliverymanContainer>
                  <AvatarImage
                    user={trip.user}
                    size={56}
                    navigateToProfileOnPress
                  />

                  <DeliverymanMeta>
                    <DeliverymanTextWrapper>
                      <DeliverymanFullName>
                        {trip.user.name}
                      </DeliverymanFullName>
                      <DeliverymanUsername
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {`@${trip.user.username}`}
                      </DeliverymanUsername>
                    </DeliverymanTextWrapper>

                    <DeliverymanAvaluationStars>
                      <Rating
                        readonly
                        type="custom"
                        startingValue={trip.user.rating_average / 2}
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

            <FilledButton
              showLoadingIndicator={isSubmiting === 'OrderCreation'}
              onPress={() => formRef.current?.submitForm()}
            >
              Concluir pedido
            </FilledButton>
          </Form>
        </Container>
      </ScrollView>
    </>
  );
};

export default CreateOrder;
