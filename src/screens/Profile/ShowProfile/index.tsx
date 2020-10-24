import React from 'react';
import { ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import { parseWidthPercentage } from '@utils/screenPercentage';

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
  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <Container>
        <Header>
          <LinearGradient
            colors={['#6f7bae', '#ff8c42']}
            locations={[0.542, 0.9915]}
            useAngle
            angle={84.6}
          />

          <ProfileContainer
            style={{
              elevation: 8,
              shadowOffset: { width: 5, height: 5 },
              shadowColor: '#000000',
              shadowOpacity: 0.25,
              shadowRadius: 8,
            }}
          >
            <AvatarImageContainer
              style={{
                elevation: 8,
                shadowOffset: { width: 5, height: 5 },
                shadowColor: '#000000',
                shadowOpacity: 0.25,
                shadowRadius: 8,
              }}
            >
              <AvatarImage source={noUserAvatarImg} />
            </AvatarImageContainer>

            <EditProfileButton rippleColor="#ebebeb10">
              <Feather
                name="edit-3"
                size={parseWidthPercentage(20)}
                color="#ebebeb"
              />
            </EditProfileButton>

            <ProfileName>John Doe</ProfileName>

            <ProfileAddress>
              <Feather
                name="map-pin"
                size={parseWidthPercentage(10)}
                color="#ebebeb"
              />
              <ProfileAddressText>São Paulo, SP</ProfileAddressText>
            </ProfileAddress>

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

        <PresentationText>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          vehicula odio elit, vel volutpat nisi dapibus eget. Quisque metus
          purus, cursus et ipsum eget, dapibus placerat metus. Vestibulum
          tincidunt ipsum vel lorem rhoncus, eget bibendum risus placerat.
        </PresentationText>

        <Section>
          <SectionTitle>Formas de contato</SectionTitle>
          <ContactFormsButtons>
            <ContactForm rippleColor="#ebebeb10">
              <Feather
                name="mail"
                size={parseWidthPercentage(18)}
                color="#ebebeb"
              />
              <ContactFormText>E-mail</ContactFormText>
            </ContactForm>

            <ContactForm rippleColor="#ebebeb10">
              <Feather
                name="phone"
                size={parseWidthPercentage(18)}
                color="#ebebeb"
              />
              <ContactFormText>Telefone</ContactFormText>
            </ContactForm>

            <ContactForm rippleColor="#ebebeb10">
              <Feather
                name="facebook"
                size={parseWidthPercentage(18)}
                color="#ebebeb"
              />
              <ContactFormText>Facebook</ContactFormText>
            </ContactForm>

            <ContactForm rippleColor="#ebebeb10">
              <Feather
                name="instagram"
                size={parseWidthPercentage(18)}
                color="#ebebeb"
              />
              <ContactFormText>Instagram</ContactFormText>
            </ContactForm>
          </ContactFormsButtons>
        </Section>

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