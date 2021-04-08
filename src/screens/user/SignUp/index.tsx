import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
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
import * as Yup from 'yup';

import api from '@services/api';
import { useAuth } from '@hooks/auth';
import getValidationErrors from '@utils/getValidationErrors';
import { parseWidthPercentage } from '@utils/screenPercentage';

import Input from '@components/atoms/Input';
import FilledButton from '@components/atoms/FilledButton';

import backgroundImg from '@assets/bg-image.png';

import { Container, Title, SignInButton, SignInButtonText } from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  username: string;
  password: string;
  password_confirmation: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const usernameInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmationInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  const { signIn } = useAuth();

  const [isSubmiting, setIsSubmiting] = useState(false);

  const handleNavigateBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
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
          password: Yup.string().min(6, 'Mínimo de 6 caracteres'),
          password_confirmation: Yup.string()
            .required('É necessário confirmar a senha')
            .oneOf([Yup.ref('password')], 'As senhas não coincidem'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

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
          'Erro no cadastro',
          'Ocorreu um erro ao fazer cadastro, tente novamente.',
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
          <View>
            <Title>Cadastrar uma conta</Title>
          </View>

          <Form ref={formRef} onSubmit={handleSignUp}>
            <Input
              name="name"
              icon="user-check"
              placeholder="Nome"
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => emailInputRef.current?.focus()}
            />

            <Input
              ref={emailInputRef}
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
              ref={usernameInputRef}
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
              secureTextEntry
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
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="send"
              onSubmitEditing={() => formRef.current?.submitForm()}
            />

            <FilledButton
              onPress={() => formRef.current?.submitForm()}
              showLoadingIndicator={isSubmiting}
            >
              Cadastrar
            </FilledButton>
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
