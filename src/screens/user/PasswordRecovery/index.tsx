import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';
import Feather from 'react-native-vector-icons/Feather';

import api from '@services/api';

import getValidationErrors from '@utils/getValidationErrors';
import { parseWidthPercentage } from '@utils/screenPercentage';

import TextInput from '@components/atoms/TextInput';
import FilledButton from '@components/atoms/FilledButton';

import backgroundImg from '@assets/bg-image.png';

import {
  Container,
  Title,
  Subtitle,
  SignInButton,
  SignInButtonText,
} from './styles';

interface RecoveryPasswordFormData {
  email: string;
}

const PasswordRecovery: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const navigation = useNavigation();

  const [isSubmiting, setIsSubmiting] = useState(false);

  const handleNavigateBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleRecoveryPassword = useCallback(
    async (data: RecoveryPasswordFormData) => {
      setIsSubmiting(true);

      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail é obrigatório')
            .email('Entre com um e-mail válido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/forgot', data);

        setIsSubmiting(false);

        Alert.alert(
          'Fique atento!',
          `Você receberá uma mensagem no endereço de e-mail informado para seguir com a recuperação de sua senha.`,
        );

        navigation.goBack();
      } catch (err) {
        setIsSubmiting(false);

        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        console.log(err);

        Alert.alert(
          'Erro na recuperação de senha',
          'Ocorreu um erro ao fazer a recuperação de senha, tente novamente.',
        );
      }
    },
    [navigation],
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <ImageBackground source={backgroundImg} style={{ flex: 1 }}>
        <Container>
          <Title>Recuperar senha</Title>

          <Subtitle>
            Entre com seu endereço de e-mail abaixo e te enviaremos uma mensagem
            para que possa prosseguir com a recuperação de senha de sua conta.
          </Subtitle>

          <Form ref={formRef} onSubmit={handleRecoveryPassword}>
            <TextInput
              name="email"
              icon="mail"
              placeholder="Seu e-mail"
              autoCorrect={false}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="send"
              onSubmitEditing={() => formRef.current?.submitForm()}
            />

            <FilledButton
              onPress={() => formRef.current?.submitForm()}
              showLoadingIndicator={isSubmiting}
            >
              Enviar
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

export default PasswordRecovery;
