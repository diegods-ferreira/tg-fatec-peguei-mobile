import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import Axios from 'axios';

import { parseWidthPercentage } from '@utils/screenPercentage';
import boxShadowProps from '@utils/boxShadowProps';

import noUserAvatarImg from '@assets/no-user-avatar.png';

import InputsContainer from '@components/InputsContainer';
import InputGroup from '@components/InputGroup';
import PickerSelectGroup from '@components/PickerSelectGroup';

import { Picker } from '@react-native-community/picker';
import Button from '@components/Button';
import {
  Header,
  LinearGradient,
  BackButtonContainer,
  BackButton,
  AvatarContainer,
  AvatarImage,
  EditAvatarButton,
  UserFullNameContainer,
  UserFullName,
  Container,
  CityStateSelectContainer,
} from './styles';

/**
 * Type definition for the IBGE's API UFs object response.
 */
interface IBGEUFResponse {
  sigla: string;
}

/**
 * Type definition for the IBGE's API cities object response.
 */
interface IBGECityResponse {
  nome: string;
}

const EditProfile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState('uf');
  const [selectedCity, setSelectedCity] = useState('city');

  const navigation = useNavigation();

  useEffect(() => {
    Axios.get<IBGEUFResponse[]>(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
    ).then(response => {
      const ufInitials = response.data.map(uf => uf.sigla).sort();
      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    if (selectedState === '0') return;

    Axios.get<IBGECityResponse[]>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`,
    ).then(response => {
      const cityNames = response.data.map(city => city.nome).sort();
      setCities(cityNames);
    });
  }, [selectedState]);

  const handleSelectState = useCallback((value: React.ReactText) => {
    setSelectedState(value.toString());
  }, []);

  const handleSelectCity = useCallback((value: React.ReactText) => {
    setSelectedCity(value.toString());
  }, []);

  const handleNavigateBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <Header>
          <LinearGradient
            colors={['#6f7bae', '#ff8c42']}
            locations={[0.542, 0.9915]}
            useAngle
            angle={84.6}
          >
            <BackButtonContainer>
              <BackButton rippleColor="#ebebeb10" onPress={handleNavigateBack}>
                <Feather
                  name="arrow-left"
                  size={parseWidthPercentage(24)}
                  color="#ebebeb"
                />
              </BackButton>
            </BackButtonContainer>

            <AvatarContainer style={boxShadowProps}>
              <AvatarImage source={noUserAvatarImg} />
              <EditAvatarButton rippleColor="#00000050">
                <Feather
                  name="camera"
                  size={parseWidthPercentage(14)}
                  color="#2f2f2f"
                />
              </EditAvatarButton>
            </AvatarContainer>

            <UserFullNameContainer>
              <UserFullName>John Doe</UserFullName>
            </UserFullNameContainer>
          </LinearGradient>
        </Header>
        <Container>
          <Form ref={formRef} onSubmit={() => {}}>
            <InputsContainer title="Meu perfil">
              <InputGroup
                label="Nome"
                name="name"
                icon="user-check"
                placeholder="Digite seu nome"
                autoCapitalize="words"
                returnKeyType="done"
              />

              <InputGroup
                label="E-mail"
                name="email"
                icon="mail"
                placeholder="Digite seu e-mail"
                autoCorrect={false}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="done"
              />

              <InputGroup
                label="Nome de usuário"
                name="username"
                icon="user"
                placeholder="Digite seu nome de usuário"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="done"
              />

              <InputGroup
                label="Apresentação"
                name="presentation"
                icon="file-text"
                placeholder="Diga um pouco sobre você"
                multiline
                numberOfLines={5}
                autoCapitalize="words"
                returnKeyType="done"
              />

              <InputGroup
                label="Endereço"
                name="address"
                icon="map-pin"
                placeholder="Digite seu endereço"
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
                  name="state"
                  prompt="Selecione um estado"
                  defaultValue="uf"
                  defaultValueLabel="UF"
                  selectedValue={selectedState}
                  onValueChange={handleSelectState}
                >
                  {ufs.map(uf => (
                    <Picker.Item key={uf} label={uf} value={uf} />
                  ))}
                </PickerSelectGroup>

                <PickerSelectGroup
                  containerStyle={{ flex: 1 }}
                  label="Cidade"
                  name="city"
                  prompt="Selecione uma cidade"
                  defaultValue="city"
                  defaultValueLabel="Selecione"
                  selectedValue={selectedCity}
                  onValueChange={handleSelectCity}
                >
                  {cities.map(city => (
                    <Picker.Item key={city} label={city} value={city} />
                  ))}
                </PickerSelectGroup>
              </CityStateSelectContainer>

              <InputGroup
                label="Telefone"
                name="phone"
                icon="phone"
                placeholder="Digite seu telefone ou celular"
                keyboardType="phone-pad"
                returnKeyType="done"
              />
            </InputsContainer>

            <InputsContainer title="Sua senha">
              <InputGroup
                label="Senha antiga"
                name="old_password"
                icon="key"
                placeholder="Senha antiga"
                toggleContentVisibilityButton
                secureTextEntry
                autoCapitalize="none"
                returnKeyType="done"
              />

              <InputGroup
                label="Nova senha"
                name="password"
                icon="lock"
                placeholder="Nova senha"
                toggleContentVisibilityButton
                secureTextEntry
                autoCapitalize="none"
                returnKeyType="done"
              />

              <InputGroup
                label="Confirmação da senha"
                name="password_confirmation"
                icon="check-square"
                placeholder="De novo, por favor"
                toggleContentVisibilityButton
                secureTextEntry
                autoCapitalize="none"
                returnKeyType="done"
              />
            </InputsContainer>

            <Button>Salvar</Button>
          </Form>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;
