import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '@hooks/auth';

import { parseWidthPercentage } from '@utils/screenPercentage';
import boxShadowProps from '@utils/boxShadowProps';

import noUserAvatarImg from '@assets/no-user-avatar.png';

import AvaluationCard from '@components/AvaluationCard';

import {
  Container,
  Header,
  LinearGradient,
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

const Profile: React.FC = () => {
  const navigation = useNavigation();

  const { user } = useAuth();

  const handleEditProfile = useCallback(() => {
    navigation.navigate('EditProfile');
  }, [navigation]);

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

          <ProfileContainer style={boxShadowProps}>
            <AvatarImageContainer style={boxShadowProps}>
              <AvatarImage
                source={
                  user.avatar_url ? { uri: user.avatar_url } : noUserAvatarImg
                }
              />
            </AvatarImageContainer>

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