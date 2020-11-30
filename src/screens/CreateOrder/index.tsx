import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Platform, Text } from 'react-native';
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

import { useAuth } from '@hooks/auth';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';
import getStatesCities, { IBGEStateCities } from '@utils/getStatesCities';

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
  AddItemToOrderButtonContainer,
  AddItemToOrderButton,
  AddItemToOrderButtonText,
  AttachPurchaseInvoiceWrapper,
  AttachPurchaseInvoiceLabel,
  AttachPurchaseInvoiceValueContainer,
  AttachPurchaseInvoicePressable,
  AttachPurchaseInvoiceValueIcon,
  AttachPurchaseInvoiceValueText,
} from './styles';

const CreateOrder: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { user } = useAuth();

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
  const [useMyOrAnotherAddress, setUseMyOrAnotherAddress] = useState(0);
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
      setUseMyOrAnotherAddress(index);
    },
    [],
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

  return (
    <>
      <TitleBar title="Cadastrar Pedido" />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <Container>
          <Form ref={formRef} onSubmit={() => {}}>
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
              <OrderItemContainer key={1} hasBorder={false}>
                <OrderItemPressable rippleColor="#ebebeb10" onPress={() => {}}>
                  <OrderItemQuantity>
                    <OrderItemQuantityText>2</OrderItemQuantityText>
                  </OrderItemQuantity>

                  <OrderItemNameAndPacking>
                    <OrderItemName numberOfLines={1} ellipsizeMode="tail">
                      Engradado
                    </OrderItemName>
                    <OrderItemPacking numberOfLines={1} ellipsizeMode="tail">
                      Sem embalagem
                    </OrderItemPacking>
                  </OrderItemNameAndPacking>

                  <OrderItemImage
                    defaultSource={noOrderItemImg}
                    source={noOrderItemImg}
                  />
                </OrderItemPressable>
              </OrderItemContainer>

              <AddItemToOrderButtonContainer>
                <AddItemToOrderButton
                  onPress={() => {}}
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
                  selectedValue={selectedDeliveryCity}
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

            <Button onPress={() => {}}>Concluir pedido</Button>
          </Form>
        </Container>
      </ScrollView>
    </>
  );
};

export default CreateOrder;
