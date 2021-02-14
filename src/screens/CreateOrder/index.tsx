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
import { Picker } from '@react-native-community/picker';
import { ButtonGroup } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import * as Yup from 'yup';

import api from '@services/api';
import { fetchAddressMapbox } from '@services/mapbox';

import { useAuth } from '@hooks/auth';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';
import getStatesCities, { IBGEStateCities } from '@utils/getStatesCities';
import getValidationErrors from '@utils/getValidationErrors';

import LoadingScreen from '@components/LoadingScreen';

import TitleBar from '@components/TitleBar';
import TitledBox from '@components/TitledBox';
import InputGroup from '@components/InputGroup';
import PickerSelectGroup from '@components/PickerSelectGroup';
import Button from '@components/Button';

import noOrderItemImg from '@assets/no-order-item-image.png';

import {
  Container,
  DateTimePickerWrapper,
  DateTimePickerLabel,
  DateTimePickerValueContainer,
  DateTimePickerPressable,
  DateTimePickerValueIcon,
  DateTimePickerValueText,
  CityStateSelectContainer,
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
} from './styles';

export interface OrderItem {
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
}

interface CreateOrderFormData {
  pickup_establishment: string;
  pickup_address: string;
  delivery_address: string;
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
  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as RouteParams | undefined;

  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickupDate, setPickupDate] = useState(new Date());
  const [statesCities, setStatesCities] = useState<IBGEStateCities[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [pickupCities, setPickupCities] = useState<string[]>([]);
  const [selectedPickupState, setSelectedPickupState] = useState('UF');
  const [selectedPickupCity, setSelectedPickupCity] = useState('Cidade');
  const [deliveryCities, setDeliveryCities] = useState<string[]>([]);
  const [selectedDeliveryState, setSelectedDeliveryState] = useState('UF');
  const [selectedDeliveryCity, setSelectedDeliveryCity] = useState('Cidade');
  const [useMyOrAnotherAddress, setUseMyOrAnotherAddress] = useState(
    user.address !== '' && user.state !== '' && user.city !== '' ? 0 : 1,
  );
  const [items, setItems] = useState<OrderItem[]>([]);
  const [purchaseInvoiceFile, setPurchaseInvoiceFile] = useState<
    DocumentPickerResponse
  >({} as DocumentPickerResponse);

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

  useEffect(() => {
    setStatesCities(getStatesCities());
  }, []);

  useEffect(() => {
    setStates(statesCities.map(({ initials }) => initials).sort());
  }, [statesCities]);

  useEffect(() => {
    const stateCities = statesCities.find(
      ({ initials }) => initials === selectedPickupState,
    );

    if (!stateCities) {
      return;
    }

    setPickupCities(stateCities.cities);
  }, [statesCities, selectedPickupState]);

  useEffect(() => {
    const stateCities = statesCities.find(
      ({ initials }) => initials === selectedDeliveryState,
    );

    if (!stateCities) {
      return;
    }

    setDeliveryCities(stateCities.cities);
  }, [statesCities, selectedDeliveryState]);

  useEffect(() => {
    setSelectedPickupCity('Cidade');
  }, [selectedPickupState]);

  useEffect(() => {
    setSelectedDeliveryCity('Cidade');
  }, [selectedDeliveryState]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

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

        const parsedItem = JSON.parse(storagedItem) as OrderItem;

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

  const handleSelectPickupState = useCallback((value: React.ReactText) => {
    setSelectedPickupState(value.toString());
  }, []);

  const handleSelectPickupCity = useCallback((value: React.ReactText) => {
    setSelectedPickupCity(value.toString());
  }, []);

  const handleSelectDeliveryState = useCallback((value: React.ReactText) => {
    setSelectedDeliveryState(value.toString());
  }, []);

  const handleSelectDeliveryCity = useCallback((value: React.ReactText) => {
    setSelectedDeliveryCity(value.toString());
  }, []);

  const handleUseMyOrAnotherAddressChangeIndex = useCallback(
    (index: number) => {
      if (
        index === 0 &&
        user.address === '' &&
        user.state === '' &&
        user.city === ''
      ) {
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

        console.log(String(err));
      }
    }
  }, []);

  const handleNavigateToAddItemToOrder = useCallback(() => {
    navigation.navigate('AddItemToOrder');
  }, [navigation]);

  const handleSaveOrder = useCallback(
    async (data: CreateOrderFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          pickup_establishment: Yup.string()
            .required('Esse campo é obrigatório')
            .min(4, 'Mínimo de 4 caracteres'),
          pickup_address: Yup.string()
            .required('Esse campo é obrigatório')
            .min(10, 'Mínimo de 10 caracteres'),
          ...(useMyOrAnotherAddress === 1 && {
            delivery_address: Yup.string()
              .required('Esse campo é obrigatório')
              .min(10, 'Mínimo de 10 caracteres'),
          }),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (selectedPickupState === 'UF' || selectedPickupCity === 'Cidade') {
          throw new Error(
            'Você deve selecionar uma combinação estado/cidade válida para o local de retirada.',
          );
        }

        if (
          useMyOrAnotherAddress === 1 &&
          (selectedDeliveryState === 'UF' || selectedDeliveryCity === 'Cidade')
        ) {
          throw new Error(
            'Você deve selecionar uma combinação estado/cidade válida para o local de entrega.',
          );
        }

        if (items.length === 0) {
          throw new Error('Você precisa incluir ao menos 1 item ao pedido.');
        }

        if (purchaseInvoiceFile.uri === '') {
          throw new Error('Você precisa anexar uma nota fiscal ao pedido.');
        }

        const {
          latitude: pickup_latitude,
          longitude: pickup_longitude,
        } = await fetchAddressMapbox(
          `${data.pickup_address}, ${selectedDeliveryCity}-${selectedDeliveryState}, Brazil`,
        );

        const {
          latitude: delivery_latitude,
          longitude: delivery_longitude,
        } = await fetchAddressMapbox(
          useMyOrAnotherAddress === 0
            ? `${user.address}, ${user.city}-${user.state}, Brazil`
            : `${data.delivery_address}, ${selectedDeliveryCity}-${selectedDeliveryState}, Brazil`,
        );

        const pickup_date = new Date(pickupDate);
        pickup_date.setHours(0);
        pickup_date.setMinutes(0);

        const orderToSave = {
          ...data,
          pickup_date,
          pickup_city: selectedPickupCity,
          pickup_state: selectedPickupState,
          pickup_latitude,
          pickup_longitude,
          delivery_address:
            useMyOrAnotherAddress === 0 ? user.address : data.pickup_address,
          delivery_city:
            useMyOrAnotherAddress === 0 ? user.city : selectedDeliveryCity,
          delivery_state:
            useMyOrAnotherAddress === 0 ? user.state : selectedDeliveryState,
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

        Alert.alert('Eba!', 'Seu pedido foi salvo com sucesso.');

        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        Alert.alert('Ops...', err.message);
      }
    },
    [
      pickupDate,
      selectedPickupState,
      selectedPickupCity,
      selectedDeliveryState,
      selectedDeliveryCity,
      items,
      purchaseInvoiceFile,
      useMyOrAnotherAddress,
      user.address,
      user.city,
      user.state,
      navigation,
    ],
  );

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

              <InputGroup
                label="Endereço"
                name="pickup_address"
                icon="map-pin"
                placeholder="Onde estão os produtos?"
                autoCapitalize="words"
                returnKeyType="done"
              />

              <CityStateSelectContainer>
                <PickerSelectGroup
                  containerStyle={{
                    width: parseWidthPercentage(112),
                    marginRight: parseWidthPercentage(8),
                  }}
                  label="Estado"
                  prompt="Selecione um estado"
                  defaultValue={selectedPickupState}
                  defaultValueLabel={selectedPickupState}
                  selectedValue={selectedPickupState}
                  onValueChange={handleSelectPickupState}
                >
                  {states.map(
                    state =>
                      state !== selectedPickupState && (
                        <Picker.Item
                          key={state}
                          label={state}
                          value={state}
                          color="#2f2f2f"
                        />
                      ),
                  )}
                </PickerSelectGroup>

                <PickerSelectGroup
                  containerStyle={{ flex: 1 }}
                  label="Cidade"
                  prompt="Selecione uma cidade"
                  defaultValue={selectedPickupCity}
                  defaultValueLabel={selectedPickupCity}
                  selectedValue={selectedPickupCity}
                  onValueChange={handleSelectPickupCity}
                >
                  {pickupCities.map(
                    city =>
                      city !== selectedPickupCity && (
                        <Picker.Item
                          key={city}
                          label={city}
                          value={city}
                          color="#2f2f2f"
                        />
                      ),
                  )}
                </PickerSelectGroup>
              </CityStateSelectContainer>
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

                  <CityStateSelectContainer>
                    <ItemInfoWrapper width={112} marginRight={8}>
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
                  </CityStateSelectContainer>
                </>
              ) : (
                <>
                  <InputGroup
                    label="Endereço"
                    name="delivery_address"
                    icon="map-pin"
                    placeholder="Onde devem ser entregues?"
                    autoCapitalize="words"
                    returnKeyType="done"
                  />

                  <CityStateSelectContainer>
                    <PickerSelectGroup
                      containerStyle={{
                        width: parseWidthPercentage(112),
                        marginRight: parseWidthPercentage(8),
                      }}
                      label="Estado"
                      prompt="Selecione um estado"
                      defaultValue={selectedDeliveryState}
                      defaultValueLabel={selectedDeliveryState}
                      selectedValue={selectedDeliveryState}
                      onValueChange={handleSelectDeliveryState}
                    >
                      {states.map(
                        state =>
                          state !== selectedDeliveryState && (
                            <Picker.Item
                              key={state}
                              label={state}
                              value={state}
                              color="#2f2f2f"
                            />
                          ),
                      )}
                    </PickerSelectGroup>

                    <PickerSelectGroup
                      containerStyle={{ flex: 1 }}
                      label="Cidade"
                      prompt="Selecione uma cidade"
                      defaultValue={selectedDeliveryCity}
                      defaultValueLabel={selectedDeliveryCity}
                      selectedValue={selectedDeliveryState}
                      onValueChange={handleSelectDeliveryCity}
                    >
                      {deliveryCities.map(
                        city =>
                          city !== selectedDeliveryCity && (
                            <Picker.Item
                              key={city}
                              label={city}
                              value={city}
                              color="#2f2f2f"
                            />
                          ),
                      )}
                    </PickerSelectGroup>
                  </CityStateSelectContainer>
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

            <Button onPress={() => formRef.current?.submitForm()}>
              Concluir pedido
            </Button>
          </Form>
        </Container>
      </ScrollView>
    </>
  );
};

export default CreateOrder;
