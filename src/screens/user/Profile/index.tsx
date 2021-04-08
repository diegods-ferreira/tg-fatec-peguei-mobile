import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';

import api from '@services/api';

import { useAuth, User } from '@hooks/auth';

import { parseWidthPercentage } from '@utils/screenPercentage';
import boxShadowProps from '@utils/boxShadowProps';

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
} from './styles';

interface RouteParams {
  user_id: string;
}

const Profile: React.FC = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const { user: authUser } = useAuth();

  const [user, setUser] = useState<User>({} as User);
  const [showEditProfileButton, setShowEditProfileButton] = useState(false);
  const [showGoBackButton, setShowGoBackButton] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleEditProfile = useCallback(() => {
    navigation.navigate('EditProfile');
  }, [navigation]);

  const handleNavigateBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    async function loadUserData() {
      if (!routeParams) {
        setUser(authUser);
        setShowEditProfileButton(true);
        setShowGoBackButton(false);
        setLoading(false);

        return;
      }

      try {
        const response = await api.get(`/profile/${routeParams.user_id}`);

        setUser(response.data);
        setShowEditProfileButton(false);
        setShowGoBackButton(true);
      } catch (err) {
        Alert.alert(
          'Erro',
          'Ocorreu um erro ao tentar recuperar os pedidos. Tente novamente mais tarde, por favor.',
        );

        console.log(String(err));
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [routeParams, authUser]);

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

            {showEditProfileButton && (
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

              <AvaluationsRate>
                <CounterNumber>8.8</CounterNumber>
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
          user.show_facebook ||
          user.show_instagram) && (
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

              {user.show_facebook && (
                <ContactForm rippleColor="#ebebeb10">
                  <Feather
                    name="facebook"
                    size={parseWidthPercentage(18)}
                    color="#ebebeb"
                  />
                  <ContactFormText>Facebook</ContactFormText>
                </ContactForm>
              )}

              {user.show_instagram && (
                <ContactForm rippleColor="#ebebeb10">
                  <Feather
                    name="instagram"
                    size={parseWidthPercentage(18)}
                    color="#ebebeb"
                  />
                  <ContactFormText>Instagram</ContactFormText>
                </ContactForm>
              )}
            </ContactFormsButtons>
          </Section>
        )}

        <Section>
          <SectionTitleContainer>
            <SectionTitle>Últimas avaliações</SectionTitle>
            <SectionTitleHelpText>(2)</SectionTitleHelpText>
          </SectionTitleContainer>

          <AvaluationCard
            ellipsizeText
            smallCard
            avaluation={{
              user: {
                avatar_url: 'no-avatar',
                name: 'Thiago Mattos',
                username: '@mattos_thiago123',
              },
              rating: 4,
              text:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula odio elit, vel volutpat nisi dapibus eget.',
            }}
          />

          <AvaluationCard
            ellipsizeText
            smallCard
            avaluation={{
              user: {
                avatar_url: 'no-avatar',
                name: 'Melissa Lopes da Silva',
                username: '@melissinha_lopes',
              },
              rating: 4.5,
              text:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula odio elit, vel volutpat nisi dapibus eget.',
            }}
          />
        </Section>
      </Container>
    </ScrollView>
  );
};

export default Profile;
