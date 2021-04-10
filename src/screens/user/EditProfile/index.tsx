import React, { useCallback, useMemo, useRef, useState } from 'react';
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
import brasilApi from '@services/brasil';

import { useAuth } from '@hooks/auth';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';
import boxShadowProps from '@utils/boxShadowProps';
import getValidationErrors from '@utils/getValidationErrors';

import noUserAvatarImg from '@assets/no-user-avatar.png';

import TitledBox from '@components/atoms/TitledBox';
import Label from '@components/atoms/Label';
import InputGroup from '@components/molecules/InputGroup';

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
  InputsWrapper,
  SocialNetworksContainer,
  AddressContainer,
  AddressTextContainer,
  AddressText,
  ChangeAddressButton,
  ChangeAddressButtonText,
} from './styles';

interface BrasilApiAddress {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
}

interface EditProfileFormData {
  name: string;
  username: string;
  email: string;
  presentation: string;
  address: string;
  address_number: string;
  address_complement: string;
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

interface CepFormData {
  cep: string;
}

const EditProfile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const cepFormRef = useRef<FormHandles>(null);

  const { user, updateUser } = useAuth();

  const [isSubmiting, setIsSubmiting] = useState<
    'ProfileSave' | 'CepSearch' | null
  >(null);

  const [address, setAddress] = useState<BrasilApiAddress>(
    {} as BrasilApiAddress,
  );

  const [changeAddress, setChangeAddress] = useState(false);
  const [showEmail, setShowEmail] = useState(user.show_email);
  const [showPhone, setShowPhone] = useState(user.show_phone);
  const [showFacebook, setShowFacebook] = useState(user.show_facebook);
  const [showInstagram, setShowInstagram] = useState(user.show_instagram);

  const navigation = useNavigation();

  const handleNavigateBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSearchCep = useCallback(async (data: CepFormData) => {
    setIsSubmiting('CepSearch');

    try {
      cepFormRef.current?.setErrors({});

      const schema = Yup.object().shape({
        cep: Yup.string()
          .required('Esse campo é obrigatório')
          .length(8, 'Um CEP deve ter 8 dígitos'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const response = await brasilApi.get(`/${data.cep}`);

      setAddress(response.data);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        cepFormRef.current?.setErrors(errors);
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

  const handleSaveProfile = useCallback(
    async (data: EditProfileFormData) => {
      setIsSubmiting('ProfileSave');

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
          ...(changeAddress
            ? { address_number: Yup.string().required('Obrigatório') }
            : {}),
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

        if (changeAddress && !address.cep) {
          throw new Error('Você deve preencher o CEP do seu endereço.');
        }

        const formData = {
          name: data.name,
          username: data.username,
          email: data.email,
          presentation: data.presentation,
          ...(!user.address || changeAddress
            ? {
                address: `${address.street}, ${address.neighborhood}, ${data.address_number}, ${data.address_complement} - CEP: ${address.cep}`,
                city: address.city,
                state: address.state,
              }
            : {
                address: data.address,
                city: user.city,
                state: user.state,
              }),
          phone: data.phone,
          facebook: data.facebook,
          instagram: data.instagram,
          show_email: showEmail,
          show_phone: showPhone,
          show_facebook: showFacebook,
          show_instagram: showInstagram,
          ...(data.old_password
            ? {
                old_password: data.old_password,
                password: data.password,
                password_confirmation: data.password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        Alert.alert('Sucesso', 'Seu perfil foi atualizado com sucesso!');

        setIsSubmiting(null);

        navigation.goBack();
      } catch (err) {
        setIsSubmiting(null);

        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        console.log(err);

        Alert.alert(
          'Erro',
          'Ocorreu um erro ao tentar salvar seu perfil, tente novamente mais tarde.',
        );
      }
    },
    [
      navigation,
      address,
      changeAddress,
      user.address,
      user.city,
      user.state,
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

              {user.address && (
                <>
                  <InputGroup
                    label="Endereço atual"
                    name="address"
                    icon="map-pin"
                    multiline
                    editable={false}
                  />

                  <InputsWrapper>
                    <InputGroup
                      label="Cidade"
                      name="city"
                      editable={false}
                      containerStyle={{ flex: 1 }}
                    />

                    <InputGroup
                      label="Estado"
                      name="state"
                      editable={false}
                      containerStyle={{
                        width: '25%',
                        marginLeft: parseWidthPercentage(8),
                      }}
                    />
                  </InputsWrapper>

                  <ChangeAddressButton
                    onPress={() => setChangeAddress(state => !state)}
                  >
                    <ChangeAddressButtonText active={changeAddress}>
                      {!changeAddress ? 'Alterar endereço' : 'Cancelar'}
                    </ChangeAddressButtonText>
                  </ChangeAddressButton>
                </>
              )}

              {(!user.address || changeAddress) && (
                <>
                  <Form ref={cepFormRef} onSubmit={handleSearchCep}>
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
                          cepFormRef.current?.submitForm();
                        }}
                      />

                      <FilledButton
                        widthPercentage={20}
                        marginLeft={parseWidthPercentage(8)}
                        marginBottom={parseHeightPercentage(8)}
                        backgroundColor="#6f7bae"
                        textColor="#ebebeb"
                        showLoadingIndicator={isSubmiting === 'CepSearch'}
                        onPress={() => cepFormRef.current?.submitForm()}
                      >
                        <Feather
                          name="search"
                          size={parseWidthPercentage(20)}
                          color="#ebebeb"
                        />
                      </FilledButton>
                    </InputsWrapper>
                  </Form>

                  {address.cep && (
                    <>
                      <AddressContainer>
                        <Label>Endereço</Label>
                        <AddressTextContainer>
                          <AddressText>
                            {address.cep &&
                              `${address.street}, ${address.neighborhood}, ${address.city}-${address.state} - CEP: ${address.cep}`}
                          </AddressText>
                        </AddressTextContainer>
                      </AddressContainer>

                      <InputsWrapper>
                        <InputGroup
                          label="Número"
                          name="address_number"
                          placeholder="N°"
                          keyboardType="number-pad"
                          returnKeyType="done"
                          containerStyle={{ flex: 1 }}
                        />

                        <InputGroup
                          label="Complemento"
                          name="address_complement"
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
              showLoadingIndicator={isSubmiting === 'ProfileSave'}
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
