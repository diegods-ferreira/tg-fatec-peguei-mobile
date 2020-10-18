import React, { useCallback, useRef } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
} from 'react-native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

import { parseWidthPercentage } from '../../utils/screenPercentage';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Title, SignInButton, SignInButtonText } from './styles';

import backgroundImg from '../../assets/bg-image.png';

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const usernameInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmationInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  const handleNavigateBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <ImageBackground source={backgroundImg} style={{ flex: 1 }}>
        <Container>
          <View>
            <Title>Cadastrar uma conta</Title>
          </View>

          <Form ref={formRef} onSubmit={() => {}}>
            <Input
              name="name"
              icon="user-check"
              placeholder="Nome"
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => emailInputRef.current?.focus()}
            />

            <Input
              name="email"
              icon="mail"
              placeholder="E-mail"
              autoCorrect={false}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => usernameInputRef.current?.focus()}
            />

            <Input
              name="username"
              icon="user"
              placeholder="Usuário"
              autoCorrect={false}
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
              onSubmitEditing={() => {
                passwordConfirmationInputRef.current?.focus();
              }}
            />

            <Input
              ref={passwordConfirmationInputRef}
              name="password_confirmation"
              icon="key"
              placeholder="Confirmar senha"
              toggleContentVisibilityButton
              autoCapitalize="none"
              returnKeyType="send"
              onSubmitEditing={() => formRef.current?.submitForm()}
            />

            <Button onPress={() => formRef.current?.submitForm()}>
              Cadastrar
            </Button>
          </Form>

          <SignInButton onPress={handleNavigateBack}>
            <Feather
              name="arrow-left"
              size={parseWidthPercentage(20)}
              color="#f9c784"
            />
            <SignInButtonText>Voltar para login</SignInButtonText>
          </SignInButton>
        </Container>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
