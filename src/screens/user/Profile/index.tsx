import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useRoute } from '@react-navigation/native';

import api from '@services/api';

import { useAuth } from '@hooks/auth';

import { parseWidthPercentage } from '@utils/screenPercentage';
import boxShadowProps from '@utils/boxShadowProps';

import IUser from '@models/User';
import IUserRate from '@models/UserRate';

import AvaluationCard from '@components/atoms/AvaluationCard';
import LoadingScreen from '@components/atoms/LoadingScreen';

import noUserAvatarImg from '@assets/no-user-avatar.png';

import {
  Container,
  Header,
  LinearGradient,
  BackButton,
  ProfileContainer,
  AvatarImageContainer,
  AvatarImage,
  EditProfileButton,
  ProfileName,
  ProfileAddress,
  ProfileAddressText,
  ProfileStatistics,
  OrdersCounter,
  DeliveriesCounter,
  AvaluationsRate,
  CounterNumber,
  CounterLabel,
  PresentationText,
  Section,
  SectionTitleContainer,
  SectionTitle,
  SectionTitleHelpText,
  ContactFormsButtons,
  ContactForm,
  ContactFormText,
  NoRatingText,
  LogoutButton,
} from './styles';

interface RouteParams {
  user_id: string;
}

const Profile: React.FC = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const { user: authUser, signOut } = useAuth();

  const [user, setUser] = useState<IUser>({} as IUser);
  const [showAuthUserOptions, setShowAuthUserOptions] = useState(false);
  const [showGoBackButton, setShowGoBackButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState<IUserRate[]>([]);

  const handleEditProfile = useCallback(() => {
    navigation.navigate('EditProfile');
  }, [navigation]);

  const handleNavigateBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNavigateToUserRating = useCallback(() => {
    navigation.navigate('UserRating', { deliveryman_id: user.id });
  }, [navigation, user.id]);

  const fetchUserRatingFromTheApi = useCallback(async (user_id: string) => {
    try {
      const response = await api.get(`/rating/deliveryman/${user_id}`);

      if (response.data) {
        setUserRating(response.data);
      }
    } catch (err) {
      Alert.alert(
        'Erro',
        `Ocorreu um erro ao tentar recuperar as avaliações do usuário. Tente novamente mais tarde, por favor.\n\n${err.response.data.message}`,
      );
    }
  }, []);

  const handleUserLogout = useCallback(() => {
    Alert.alert(
      'Deseja mesmo sair?',
      'Você está fazendo o logout da aplicação. Clique em confirmar para continuar.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {},
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: () => signOut(),
        },
      ],
    );
  }, [signOut]);

  useEffect(() => {
    async function loadUserData() {
      if (!routeParams) {
        setUser(authUser);
        setShowAuthUserOptions(true);
        setShowGoBackButton(false);
        await fetchUserRatingFromTheApi(authUser.id);
        setLoading(false);

        return;
      }

      try {
        const response = await api.get(`/profile/${routeParams.user_id}`);

        setUser(response.data);
        setShowAuthUserOptions(false);
        setShowGoBackButton(true);
        await fetchUserRatingFromTheApi(routeParams.user_id);
      } catch (err) {
        Alert.alert(
          'Erro',
          `Ocorreu um erro ao tentar recuperar os pedidos. Tente novamente mais tarde, por favor.\n\n${err.response.data.message}`,
        );
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [routeParams, authUser, fetchUserRatingFromTheApi]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: '#2b2831' }}
    >
      <Container>
        <Header>
          <LinearGradient
            colors={['#6f7bae', '#ff8c42']}
            locations={[0.542, 0.9915]}
            useAngle
            angle={84.6}
          />

          {showGoBackButton && (
            <BackButton rippleColor="#EBEBEB10" onPress={handleNavigateBack}>
              <Feather
                name="arrow-left"
                size={parseWidthPercentage(24)}
                color="#EBEBEB"
              />
            </BackButton>
          )}

          <ProfileContainer style={boxShadowProps}>
            <AvatarImageContainer style={boxShadowProps}>
              <AvatarImage
                source={
                  user.avatar_url ? { uri: user.avatar_url } : noUserAvatarImg
                }
              />
            </AvatarImageContainer>

            {showAuthUserOptions && (
              <>
                <EditProfileButton
                  rippleColor="#ebebeb10"
                  onPress={handleEditProfile}
                >
                  <Feather
                    name="edit-3"
                    size={parseWidthPercentage(20)}
                    color="#ebebeb"
                  />
                </EditProfileButton>

                <LogoutButton
                  rippleColor="#ebebeb10"
                  onPress={handleUserLogout}
                >
                  <Feather
                    name="log-out"
                    size={parseWidthPercentage(20)}
                    color="#ebebeb"
                  />
                </LogoutButton>
              </>
            )}

            <ProfileName>{user.name}</ProfileName>

            {(user.city || user.state) && (
              <ProfileAddress>
                <Feather
                  name="map-pin"
                  size={parseWidthPercentage(10)}
                  color="#ebebeb"
                />

                <ProfileAddressText>
                  {user.city + (user.state && `, ${user.state}`)}
                </ProfileAddressText>
              </ProfileAddress>
            )}

            <ProfileStatistics>
              <OrdersCounter>
                <CounterNumber>10</CounterNumber>
                <CounterLabel>pedidos</CounterLabel>
              </OrdersCounter>

              <DeliveriesCounter>
                <CounterNumber>6</CounterNumber>
                <CounterLabel>entregas</CounterLabel>
              </DeliveriesCounter>

              <AvaluationsRate onPress={handleNavigateToUserRating}>
                <CounterNumber>
                  {Intl.NumberFormat('pt-BR', {
                    maximumFractionDigits: 1,
                  }).format(user.rating_average)}
                </CounterNumber>
                <CounterLabel>avaliação</CounterLabel>
              </AvaluationsRate>
            </ProfileStatistics>
          </ProfileContainer>
        </Header>

        {user.presentation && (
          <PresentationText>{user.presentation}</PresentationText>
        )}

        {(user.show_phone ||
          user.show_email ||
          user.show_whatsapp ||
          user.show_telegram) && (
          <Section>
            <SectionTitle>Formas de contato</SectionTitle>
            <ContactFormsButtons>
              {user.show_email && (
                <ContactForm rippleColor="#ebebeb10">
                  <Feather
                    name="mail"
                    size={parseWidthPercentage(18)}
                    color="#ebebeb"
                  />
                  <ContactFormText>E-mail</ContactFormText>
                </ContactForm>
              )}

              {user.show_phone && (
                <ContactForm rippleColor="#ebebeb10">
                  <Feather
                    name="phone"
                    size={parseWidthPercentage(18)}
                    color="#ebebeb"
                  />
                  <ContactFormText>Telefone</ContactFormText>
                </ContactForm>
              )}

              {user.show_whatsapp && (
                <ContactForm rippleColor="#ebebeb10">
                  <FontAwesome
                    name="whatsapp"
                    size={parseWidthPercentage(18)}
                    color="#ebebeb"
                  />
                  <ContactFormText>Whatsapp</ContactFormText>
                </ContactForm>
              )}

              {user.show_telegram && (
                <ContactForm rippleColor="#ebebeb10">
                  <FontAwesome
                    name="telegram-plane"
                    size={parseWidthPercentage(18)}
                    color="#ebebeb"
                  />
                  <ContactFormText>Telegram</ContactFormText>
                </ContactForm>
              )}
            </ContactFormsButtons>
          </Section>
        )}

        <Section>
          <SectionTitleContainer>
            <SectionTitle>Últimas avaliações</SectionTitle>
            <SectionTitleHelpText>{`(${userRating.length})`}</SectionTitleHelpText>
          </SectionTitleContainer>

          {userRating.slice(0, 5).map(rate => (
            <AvaluationCard
              key={rate.id}
              getUserInfoFrom="requester"
              ellipsizeText
              smallCard
              rate={rate}
              onPress={handleNavigateToUserRating}
            />
          ))}

          {!userRating.length && (
            <NoRatingText>
              {`${
                user.id === authUser.id ? 'Você' : user.name
              } não possui avaliações ainda`}
            </NoRatingText>
          )}
        </Section>
      </Container>
    </ScrollView>
  );
};

export default Profile;
