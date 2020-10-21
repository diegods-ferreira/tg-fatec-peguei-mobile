import React, { useCallback, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
} from 'react-native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import getValidationErrors from '@utils/getValidationErrors';
import { useAuth } from '@hooks/auth';

import Input from '@components/Input';
import Button from '@components/Button';
import CustomModal from '@components/Modals/CustomModal';
import MessageModal, {
  MessageModalProps,
} from '@components/Modals/MessageModal';

import logoImg from '@assets/Logo.png';
import backgroundImg from '@assets/bg-image.png';
import googleLogo from '@assets/google.png';
import facebookLogo from '@assets/facebook.png';

import {
  Container,
  LogoImage,
  LoginContainer,
  Title,
  SocialLoginContainer,
  SocialLoginText,
  SocialLoginOption,
  ResetPasswordButton,
  ResetPasswordButtonText,
  SignUpButton,
  SignUpButtonText,
  ModalTitle,
  ModalSubtitle,
  ModalButtonsContainer,
  ModalCancelButton,
  ModalCancelButtonText,
  ModalSendButton,
  ModalButtonText,
} from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const resetPasswordFormRef = useRef<FormHandles>(null);

  const navigation = useNavigation();

  const { signIn } = useAuth();

  const [
    isResetPasswordModalVisible,
    setIsResetPasswordModalVisible,
  ] = useState(false);
  const [messageModalProps, setMessageModalProps] = useState<
    Omit<MessageModalProps, 'setIsVisible'>
  >({} as MessageModalProps);

  const toggleResetPasswordModal = useCallback(() => {
    setIsResetPasswordModalVisible(!isResetPasswordModalVisible);
  }, [isResetPasswordModalVisible]);

  const toggleMessageModal = useCallback(() => {
    setMessageModalProps({
      ...messageModalProps,
      isVisible: !messageModalProps.isVisible,
    });
  }, [messageModalProps]);

  const handleNavigateToSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        setMessageModalProps({
          title: 'Erro na autenticação',
          message: 'Ocorreu um erro ao fazer login, cheque as credenciais.',
          type: 'error',
          isVisible: true,
        });
      }
    },
    [signIn],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ImageBackground source={backgroundImg} style={{ flex: 1 }}>
          <Container>
            <LogoImage source={logoImg} />

            <LoginContainer>
              <View>
                <Title>Faça login</Title>
              </View>

              <SocialLoginContainer>
                <SocialLoginText>Usar</SocialLoginText>
                <SocialLoginOption>
                  <Image source={googleLogo} />
                </SocialLoginOption>
                <SocialLoginOption>
                  <Image source={facebookLogo} />
                </SocialLoginOption>
              </SocialLoginContainer>
            </LoginContainer>

            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                name="email"
                icon="mail"
                placeholder="E-mail"
                autoCorrect={false}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />

              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                toggleContentVisibilityButton
                secureTextEntry
                autoCapitalize="none"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Entrar
              </Button>
            </Form>

            <ResetPasswordButton onPress={toggleResetPasswordModal}>
              <ResetPasswordButtonText>
                Esqueci minha senha
              </ResetPasswordButtonText>
            </ResetPasswordButton>

            <SignUpButton onPress={handleNavigateToSignUp}>
              <SignUpButtonText>Criar uma conta</SignUpButtonText>
            </SignUpButton>
          </Container>
        </ImageBackground>
      </KeyboardAvoidingView>

      <CustomModal
        isVisible={isResetPasswordModalVisible}
        setIsVisible={toggleResetPasswordModal}
      >
        <ModalTitle>Recuperar senha</ModalTitle>

        <ModalSubtitle>
          Enviaremos um e-mail de recuperação de senha para você.
        </ModalSubtitle>

        <Form ref={resetPasswordFormRef} onSubmit={() => {}}>
          <Input
            name="email"
            icon="mail"
            placeholder="E-mail"
            autoCorrect={false}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current?.focus()}
          />

          <ModalButtonsContainer>
            <ModalCancelButton onPress={toggleResetPasswordModal}>
              <ModalCancelButtonText>Cancelar</ModalCancelButtonText>
            </ModalCancelButton>

            <ModalSendButton onPress={() => formRef.current?.submitForm()}>
              <ModalButtonText>Enviar</ModalButtonText>
            </ModalSendButton>
          </ModalButtonsContainer>
        </Form>
      </CustomModal>

      <MessageModal
        title={messageModalProps.title}
        subtitle={messageModalProps.subtitle}
        message={messageModalProps.message}
        type={messageModalProps.type}
        isVisible={messageModalProps.isVisible || false}
        setIsVisible={toggleMessageModal}
      />
    </>
  );
};

export default SignIn;
