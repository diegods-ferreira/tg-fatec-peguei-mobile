import React, { useRef } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Title,
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
        <ImageBackground source={backgroundImg} style={{ flex: 1 }}>
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Faça login</Title>
            </View>

            <Form ref={formRef} onSubmit={() => {}}>
              <Input
                name="email"
                icon="user"
                placeholder="Usuário ou e-mail"
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
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Entrar
              </Button>
            </Form>

            <SocialLoginContainer>
              <SocialLoginText>Fazer login com</SocialLoginText>
              <SocialLoginOption>
                <Image source={googleLogo} />
              </SocialLoginOption>
              <SocialLoginOption>
                <Image source={facebookLogo} />
              </SocialLoginOption>
            </SocialLoginContainer>

            <SignUpButton>
              <SignUpButtonText>Criar uma conta</SignUpButtonText>
            </SignUpButton>
          </Container>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
