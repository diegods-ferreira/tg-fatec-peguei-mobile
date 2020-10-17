import React, { useCallback, useRef } from 'react';
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

import {
  Container,
  LogoImage,
  Title,
  MiddleContainer,
  ResetPasswordButton,
  ResetPasswordButtonText,
  SocialLoginContainer,
  SocialLoginText,
  SocialLoginOption,
  SignUpButton,
  SignUpButtonText,
} from './styles';

import logoImg from '../../assets/Logo.png';
import backgroundImg from '../../assets/bg-image.png';
import googleLogo from '../../assets/google.png';
import facebookLogo from '../../assets/facebook.png';

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  const handleNavigateToSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <ImageBackground source={backgroundImg} style={{ flex: 1 }}>
        <Container>
          <LogoImage source={logoImg} />

          <View>
            <Title>Faça login</Title>
          </View>

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
              secureTextEntry
              returnKeyType="send"
              onSubmitEditing={() => formRef.current?.submitForm()}
            />

            <Button onPress={() => formRef.current?.submitForm()}>
              Entrar
            </Button>
          </Form>

          <MiddleContainer>
            <ResetPasswordButton>
              <ResetPasswordButtonText>
                Esqueci minha senha
              </ResetPasswordButtonText>
            </ResetPasswordButton>

            <SocialLoginContainer>
              <SocialLoginText>Logar com</SocialLoginText>
              <SocialLoginOption>
                <Image source={googleLogo} />
              </SocialLoginOption>
              <SocialLoginOption>
                <Image source={facebookLogo} />
              </SocialLoginOption>
            </SocialLoginContainer>
          </MiddleContainer>

          <SignUpButton onPress={handleNavigateToSignUp}>
            <SignUpButtonText>Criar uma conta</SignUpButtonText>
          </SignUpButton>
        </Container>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
