import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { CheckBox } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';

import api from '@services/api';

import { useAuth } from '@hooks/auth';

import { parseWidthPercentage } from '@utils/screenPercentage';
import boxShadowProps from '@utils/boxShadowProps';
import getValidationErrors from '@utils/getValidationErrors';
import getStatesCities, { IBGEStateCities } from '@utils/getStatesCities';

import noUserAvatarImg from '@assets/no-user-avatar.png';

import TitledBox from '@components/atoms/TitledBox';
import InputGroup from '@components/molecules/InputGroup';
import PickerSelectGroup from '@components/molecules/PickerSelectGroup';

import { Picker } from '@react-native-community/picker';
import FilledButton from '@components/atoms/FilledButton';

import {
  Header,
  LinearGradient,
  BackButtonContainer,
  BackButton,
  AvatarContainer,
  AvatarImage,
  EditAvatarButton,
  Container,
  CityStateSelectContainer,
  SocialNetworksContainer,
} from './styles';

interface EditProfileFormData {
  name: string;
  username: string;
  email: string;
  presentation: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  facebook: string;
  instagram: string;
  show_email: boolean;
  show_facebook: boolean;
  show_instagram: boolean;
  show_phone: boolean;
  old_password?: string;
  password?: string;
  password_confirmation?: string;
}

const EditProfile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { user, updateUser } = useAuth();

  const [isSubmiting, setIsSubmiting] = useState(false);
  const [statesCities, setStatesCities] = useState<IBGEStateCities[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedState, setSelectedState] = useState(
    user.state ? user.state : 'UF',
  );
  const [selectedCity, setSelectedCity] = useState(
    user.city ? user.city : 'Cidade',
  );
  const [showEmail, setShowEmail] = useState(user.show_email);
  const [showPhone, setShowPhone] = useState(user.show_phone);
  const [showFacebook, setShowFacebook] = useState(user.show_facebook);
  const [showInstagram, setShowInstagram] = useState(user.show_instagram);

  const navigation = useNavigation();

  useEffect(() => {
    setStatesCities(getStatesCities());
  }, []);

  useEffect(() => {
    setStates(statesCities.map(({ initials }) => initials).sort());
  }, [statesCities]);

  useEffect(() => {
    const stateCities = statesCities.find(
      ({ initials }) => initials === selectedState,
    );

    if (!stateCities) {
      return;
    }

    setCities(stateCities.cities);
  }, [statesCities, selectedState]);

  useEffect(() => {
    setSelectedCity('Cidade');
  }, [selectedState]);

  useEffect(() => {
    setSelectedCity(user.city ? user.city : 'Cidade');
  }, [user.city]);

  const handleSelectState = useCallback((value: React.ReactText) => {
    setSelectedState(value.toString());
  }, []);

  const handleSelectCity = useCallback((value: React.ReactText) => {
    setSelectedCity(value.toString());
  }, []);

  const handleNavigateBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSaveProfile = useCallback(
    async (data: EditProfileFormData) => {
      setIsSubmiting(true);

      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatório'),
          email: Yup.string()
            .required('E-mail é obrigatório')
            .email('Entre com um e-mail válido'),
          username: Yup.string()
            .min(5, 'Mínimo de 5 caracteres')
            .max(15, 'Máximo de 15 caracteres')
            .matches(
              /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/g,
              'Não utilize acentos ou caracteres especiais',
            ),
          presentation: Yup.string(),
          address: Yup.string().min(10, 'Mínimo de 10 caracteres'),
          phone: Yup.string().min(10, 'Mínimo de 10 caracteres'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().min(6, 'Mínimo de 6 caracteres'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().min(6, 'Mínimo de 6 caracteres'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'As senhas não coincidem'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (selectedState === 'UF' || selectedCity === 'Cidade') {
          throw new Error(
            'Você deve selecionar uma combinação estado/cidade válida.',
          );
        }

        const formData = {
          ...data,
          state: selectedState,
          city: selectedCity,
          presentation: data.presentation.length ? data.presentation : null,
          facebook: data.facebook.length ? data.facebook : null,
          instagram: data.instagram.length ? data.instagram : null,
          show_email: showEmail,
          show_phone: showPhone,
          show_facebook: showFacebook,
          show_instagram: showInstagram,
        };

        if (!formData.old_password) {
          delete formData.old_password;
          delete formData.password;
          delete formData.password_confirmation;
        }

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        Alert.alert('Sucesso', 'Seu perfil foi atualizado com sucesso!');

        setIsSubmiting(false);

        navigation.goBack();
      } catch (err) {
        setIsSubmiting(false);

        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        Alert.alert('Erro', err.message);
      }
    },
    [
      navigation,
      selectedState,
      selectedCity,
      showEmail,
      showPhone,
      showFacebook,
      showInstagram,
      updateUser,
    ],
  );

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecione um avatar',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Usar câmera',
        chooseFromLibraryButtonTitle: 'Escolher da galeria',
      },
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.error) {
          Alert.alert('Erro ao atualizar seu avatar.');
          return;
        }

        const data = new FormData();

        data.append('avatar', {
          type: 'image/jpeg',
          name: `${user.id}.jpg`,
          uri: response.uri,
        });

        api.patch('/users/avatar', data).then(apiResponse => {
          updateUser(apiResponse.data);
        });
      },
    );
  }, [updateUser, user.id]);

  const parsedUser = useMemo(() => {
    return {
      ...user,
      facebook: user.facebook || '',
      instagram: user.instagram || '',
      presentation: user.presentation || '',
    };
  }, [user]);

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
              <AvatarImage
                source={
                  user.avatar_url ? { uri: user.avatar_url } : noUserAvatarImg
                }
              />

              <EditAvatarButton
                rippleColor="#00000050"
                onPress={handleUpdateAvatar}
              >
                <Feather
                  name="camera"
                  size={parseWidthPercentage(14)}
                  color="#2f2f2f"
                />
              </EditAvatarButton>
            </AvatarContainer>
          </LinearGradient>
        </Header>
        <Container>
          <Form
            ref={formRef}
            initialData={parsedUser}
            onSubmit={handleSaveProfile}
          >
            <TitledBox title="Meu perfil">
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
              >
                <CheckBox
                  title="Exibir no perfil"
                  size={parseWidthPercentage(16)}
                  right
                  checked={showEmail}
                  checkedColor="#ff8c42"
                  uncheckedColor="#606060"
                  onPress={() => setShowEmail(!showEmail)}
                  containerStyle={{
                    padding: 0,
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                  }}
                  textStyle={{
                    color: '#ededed',
                    fontWeight: 'normal',
                    fontSize: parseWidthPercentage(13),
                    marginLeft: parseWidthPercentage(8),
                    marginRight: 0,
                  }}
                />
              </InputGroup>

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
                autoCapitalize="sentences"
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
                  prompt="Selecione um estado"
                  defaultValue={selectedState}
                  defaultValueLabel={selectedState}
                  selectedValue={selectedState}
                  onValueChange={handleSelectState}
                >
                  {states.map(
                    state =>
                      state !== selectedState && (
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
                  defaultValue={selectedCity}
                  defaultValueLabel={selectedCity}
                  selectedValue={selectedCity}
                  onValueChange={handleSelectCity}
                >
                  {cities.map(
                    city =>
                      city !== selectedCity && (
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

              <InputGroup
                label="Telefone"
                name="phone"
                icon="phone"
                placeholder="Digite seu telefone ou celular"
                keyboardType="phone-pad"
                returnKeyType="done"
              >
                <CheckBox
                  title="Exibir no perfil"
                  size={parseWidthPercentage(16)}
                  right
                  checked={showPhone}
                  checkedColor="#ff8c42"
                  uncheckedColor="#606060"
                  onPress={() => setShowPhone(!showPhone)}
                  containerStyle={{
                    padding: 0,
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                  }}
                  textStyle={{
                    color: '#ededed',
                    fontWeight: 'normal',
                    fontSize: parseWidthPercentage(13),
                    marginLeft: parseWidthPercentage(8),
                    marginRight: 0,
                  }}
                />
              </InputGroup>
            </TitledBox>

            <TitledBox title="Redes sociais">
              <SocialNetworksContainer>
                <InputGroup
                  label="Facebook"
                  name="facebook"
                  icon="facebook"
                  placeholder="Vincular"
                  autoCorrect={false}
                  autoCapitalize="none"
                  returnKeyType="done"
                  containerStyle={{
                    width: parseWidthPercentage(136),
                  }}
                >
                  <CheckBox
                    title="Exibir no perfil"
                    size={parseWidthPercentage(16)}
                    right
                    checked={showFacebook}
                    checkedColor="#ff8c42"
                    uncheckedColor="#606060"
                    onPress={() => setShowFacebook(!showFacebook)}
                    containerStyle={{
                      padding: 0,
                      backgroundColor: 'transparent',
                      borderWidth: 0,
                    }}
                    textStyle={{
                      color: '#ededed',
                      fontWeight: 'normal',
                      fontSize: parseWidthPercentage(13),
                      marginLeft: parseWidthPercentage(8),
                      marginRight: 0,
                    }}
                  />
                </InputGroup>

                <InputGroup
                  label="Instagram"
                  name="instagram"
                  icon="instagram"
                  placeholder="Vincular"
                  autoCorrect={false}
                  autoCapitalize="none"
                  returnKeyType="done"
                  containerStyle={{
                    width: parseWidthPercentage(136),
                  }}
                >
                  <CheckBox
                    title="Exibir no perfil"
                    size={parseWidthPercentage(16)}
                    right
                    checked={showInstagram}
                    checkedColor="#ff8c42"
                    uncheckedColor="#606060"
                    onPress={() => setShowInstagram(!showInstagram)}
                    containerStyle={{
                      padding: 0,
                      backgroundColor: 'transparent',
                      borderWidth: 0,
                    }}
                    textStyle={{
                      color: '#ededed',
                      fontWeight: 'normal',
                      fontSize: parseWidthPercentage(13),
                      marginLeft: parseWidthPercentage(8),
                      marginRight: 0,
                    }}
                  />
                </InputGroup>
              </SocialNetworksContainer>
            </TitledBox>

            <TitledBox title="Sua senha">
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
            </TitledBox>

            <FilledButton
              onPress={() => formRef.current?.submitForm()}
              showLoadingIndicator={isSubmiting}
            >
              Salvar
            </FilledButton>
          </Form>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;
