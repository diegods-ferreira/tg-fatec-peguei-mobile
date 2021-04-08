import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
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

import Input from '@components/atoms/Input';
import FilledButton from '@components/atoms/FilledButton';

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
} from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  const [isSubmiting, setIsSubmiting] = useState(false);

  const { signIn } = useAuth();

  const handleNavigateToSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const handleNavigateToPasswordRecovery = useCallback(() => {
    navigation.navigate('PasswordRecovery');
  }, [navigation]);

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      setIsSubmiting(true);

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

        setIsSubmiting(false);

        await signIn({
          email: data.email,
          password: data.password,
        });
      } catch (err) {
        setIsSubmiting(false);

        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        Alert.alert(
          'Erro',
          'Ocorreu um erro ao fazer login, cheque as credenciais.',
        );
      }
    },
    [signIn],
  );

  return (
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

            <FilledButton
              onPress={() => formRef.current?.submitForm()}
              showLoadingIndicator={isSubmiting}
            >
              Entrar
            </FilledButton>
          </Form>

          <ResetPasswordButton onPress={handleNavigateToPasswordRecovery}>
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
  );
};

export default SignIn;
