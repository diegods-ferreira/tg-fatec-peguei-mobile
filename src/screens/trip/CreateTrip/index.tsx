import React, { useCallback, useRef, useState } from 'react';
import { Alert, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ButtonGroup } from 'react-native-elements';
import * as Yup from 'yup';

import api from '@services/api';

import { useAuth } from '@hooks/auth';

import getValidationErrors from '@utils/getValidationErrors';
import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

import TitleBar from '@components/atoms/TitleBar';
import TitledBox from '@components/atoms/TitledBox';
import InputGroup from '@components/molecules/InputGroup';

import FilledButton from '@components/atoms/FilledButton';
import {
  Container,
  DateTimePickerLabel,
  DateTimePickerPressable,
  DateTimePickerValueContainer,
  DateTimePickerValueIcon,
  DateTimePickerValueText,
  DateTimePickerWrapper,
  InputsWrapper,
  ItemInfoLabel,
  ItemInfoValueContainer,
  ItemInfoValueText,
  ItemInfoWrapper,
} from './styles';

interface TripFormData {
  return_state: string;
  return_city: string;
  destination_state: string;
  destination_city: string;
}

const CreateTrip: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { user } = useAuth();

  const navigation = useNavigation();

  const [showDepartureDatePicker, setShowDepartureDatePicker] = useState(false);
  const [departureDate, setDepartureDate] = useState(new Date());
  const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);
  const [returnDate, setReturnDate] = useState(new Date());
  const [isSubmiting, setIsSubmiting] = useState(false);

  const [useMyOrAnotherAddress, setUseMyOrAnotherAddress] = useState(
    !user.address && !user.state && !user.city ? 1 : 0,
  );

  const handleToggleDepartureDatePicker = useCallback(() => {
    setShowDepartureDatePicker(state => !state);
  }, []);

  const handleDepartureDateChanged = useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        setShowDepartureDatePicker(false);
      }

      if (date) {
        setDepartureDate(date);
      }
    },
    [],
  );

  const handleToggleReturnDatePicker = useCallback(() => {
    setShowReturnDatePicker(state => !state);
  }, []);

  const handleReturnDateChanged = useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        setShowReturnDatePicker(false);
      }

      if (date) {
        setReturnDate(date);
      }
    },
    [],
  );

  const handleUseMyOrAnotherAddressChangeIndex = useCallback(
    (index: number) => {
      if (index === 0 && !user.state && !user.city) {
        Alert.alert(
          'Ops...',
          'Você deve preencher seu endereço em seu perfil para utilizar essa opção.',
        );

        return;
      }

      setUseMyOrAnotherAddress(index);
    },
    [user.state, user.city],
  );

  const handleSaveTrip = useCallback(
    async (data: TripFormData) => {
      setIsSubmiting(true);

      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          ...(useMyOrAnotherAddress === 1 && {
            return_state: Yup.string().required().length(2, 'UF'),
            return_city: Yup.string().required('Obrigatório'),
          }),
          destination_state: Yup.string().required().length(2, 'UF'),
          destination_city: Yup.string().required('Obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const tripToSave = {
          departure_date: departureDate,
          return_city:
            useMyOrAnotherAddress === 0 ? user.city : data.return_city,
          return_state:
            useMyOrAnotherAddress === 0 ? user.state : data.return_state,
          destination_city: data.destination_city,
          destination_state: data.destination_state,
          return_date: returnDate,
        };

        await api.post('/trips', tripToSave);

        setIsSubmiting(false);

        Alert.alert('Sucesso!', 'Sua viagem foi salva com sucesso.');

        navigation.goBack();
      } catch (err) {
        setIsSubmiting(false);

        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        Alert.alert(
          'Ops...',
          `Ocorreu um erro ao tentar salvar o seu pedido, tente novamente mais tarde.\n\n${err.response.data.message}`,
        );
      }
    },
    [
      departureDate,
      navigation,
      returnDate,
      useMyOrAnotherAddress,
      user.city,
      user.state,
    ],
  );

  return (
    <>
      <TitleBar title="Cadastrar Viagem" />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <Container>
          <Form ref={formRef} onSubmit={handleSaveTrip}>
            <TitledBox title="Partida">
              <DateTimePickerWrapper>
                <DateTimePickerLabel>Data de partida</DateTimePickerLabel>
                <DateTimePickerValueContainer>
                  <DateTimePickerPressable
                    onPress={handleToggleDepartureDatePicker}
                    rippleColor="#ebebeb10"
                  >
                    <DateTimePickerValueIcon
                      name="file-text"
                      size={parseWidthPercentage(24)}
                      color="#606060"
                    />

                    <DateTimePickerValueText>
                      {format(departureDate, 'dd/MM/yyyy')}
                    </DateTimePickerValueText>
                  </DateTimePickerPressable>
                </DateTimePickerValueContainer>

                {showDepartureDatePicker && (
                  <DateTimePicker
                    mode="date"
                    display="calendar"
                    onChange={handleDepartureDateChanged}
                    value={departureDate}
                    minimumDate={new Date()}
                  />
                )}
              </DateTimePickerWrapper>

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
                  marginTop: parseHeightPercentage(32),
                  marginBottom: parseHeightPercentage(8),
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
              ) : (
                <InputsWrapper>
                  <InputGroup
                    label="Estado"
                    name="return_state"
                    placeholder="UF"
                    returnKeyType="done"
                    containerStyle={{ width: parseWidthPercentage(64) }}
                    inputContainerStyle={{ marginBottom: 0 }}
                  />

                  <InputGroup
                    label="Cidade"
                    name="return_city"
                    placeholder="Cidade"
                    autoCapitalize="words"
                    returnKeyType="done"
                    containerStyle={{
                      flex: 1,
                      marginLeft: parseWidthPercentage(8),
                    }}
                    inputContainerStyle={{ marginBottom: 0 }}
                  />
                </InputsWrapper>
              )}
            </TitledBox>

            <TitledBox title="Destino">
              <InputsWrapper>
                <InputGroup
                  label="Estado"
                  name="destination_state"
                  placeholder="UF"
                  returnKeyType="done"
                  containerStyle={{ width: parseWidthPercentage(64) }}
                  inputContainerStyle={{ marginBottom: 0 }}
                />

                <InputGroup
                  label="Cidade"
                  name="destination_city"
                  placeholder="Cidade"
                  autoCapitalize="words"
                  returnKeyType="done"
                  containerStyle={{
                    flex: 1,
                    marginLeft: parseWidthPercentage(8),
                  }}
                  inputContainerStyle={{ marginBottom: 0 }}
                />
              </InputsWrapper>
            </TitledBox>

            <TitledBox title="Retorno">
              <DateTimePickerWrapper>
                <DateTimePickerLabel>Data de retorno</DateTimePickerLabel>
                <DateTimePickerValueContainer>
                  <DateTimePickerPressable
                    onPress={handleToggleReturnDatePicker}
                    rippleColor="#ebebeb10"
                  >
                    <DateTimePickerValueIcon
                      name="file-text"
                      size={parseWidthPercentage(24)}
                      color="#606060"
                    />

                    <DateTimePickerValueText>
                      {format(returnDate, 'dd/MM/yyyy')}
                    </DateTimePickerValueText>
                  </DateTimePickerPressable>
                </DateTimePickerValueContainer>

                {showReturnDatePicker && (
                  <DateTimePicker
                    mode="date"
                    display="calendar"
                    onChange={handleReturnDateChanged}
                    value={returnDate}
                    minimumDate={departureDate}
                  />
                )}
              </DateTimePickerWrapper>
            </TitledBox>

            <FilledButton
              showLoadingIndicator={isSubmiting}
              onPress={() => formRef.current?.submitForm()}
            >
              Salvar
            </FilledButton>
          </Form>
        </Container>
      </ScrollView>
    </>
  );
};

export default CreateTrip;
