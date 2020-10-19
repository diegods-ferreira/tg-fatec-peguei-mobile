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

import Input from '../../components/Input';
import Button from '../../components/Button';
import CustomModal from '../../components/Modals/CustomModal';

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

import logoImg from '../../assets/Logo.png';
import backgroundImg from '../../assets/bg-image.png';
import googleLogo from '../../assets/google.png';
import facebookLogo from '../../assets/facebook.png';

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const resetPasswordFormRef = useRef<FormHandles>(null);

  const navigation = useNavigation();

  const [
    isResetPasswordModalVisible,
    setIsResetPasswordModalVisible,
  ] = useState(false);

  const toggleResetPasswordModal = useCallback(() => {
    setIsResetPasswordModalVisible(!isResetPasswordModalVisible);
  }, [isResetPasswordModalVisible]);

  const handleNavigateToSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

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

            <Form ref={formRef} onSubmit={() => {}}>
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
    </>
  );
};

export default SignIn;
