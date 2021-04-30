import styled from 'styled-components/native';
import RNLinearGradient from 'react-native-linear-gradient';
import { RectButton } from 'react-native-gesture-handler';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

export const Container = styled.View`
  flex: 1;
  padding-bottom: ${parseHeightPercentage(24)}px;
  align-items: center;
  justify-content: center;
`;

export const Header = styled.View`
  width: 100%;
  align-items: center;
`;

export const LinearGradient = styled(RNLinearGradient)`
  width: 100%;
  height: ${parseHeightPercentage(160)}px;
`;

const backButtonSize = parseHeightPercentage(56);

export const BackButton = styled(RectButton)`
  width: ${backButtonSize}px;
  height: ${backButtonSize}px;
  border-radius: ${backButtonSize / 2}px;
  align-items: center;
  justify-content: center;

  position: absolute;
  top: 0;
  left: 0;
`;

export const ProfileContainer = styled.View`
  width: ${parseWidthPercentage(312)}px;
  height: ${parseHeightPercentage(160)}px;
  margin-top: -${parseHeightPercentage(80)}px;
  margin-bottom: ${parseHeightPercentage(16)}px;
  background: #312e38;
  border-radius: 8px;
  justify-content: flex-end;
  align-items: center;
`;

const avatarImageContainerSize = parseHeightPercentage(112);

export const AvatarImageContainer = styled.View`
  width: ${avatarImageContainerSize}px;
  height: ${avatarImageContainerSize}px;
  border-radius: ${avatarImageContainerSize / 2}px;
  margin-bottom: ${parseHeightPercentage(4)}px;
`;

export const AvatarImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: ${avatarImageContainerSize / 2}px;
`;

const editProfileButtonSize = parseWidthPercentage(52);

export const EditProfileButton = styled(RectButton)`
  width: ${editProfileButtonSize}px;
  height: ${editProfileButtonSize}px;
  border-radius: ${editProfileButtonSize / 2}px;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
`;

export const ProfileName = styled.Text`
  width: 100%;
  color: #ff8c42;
  font-size: ${parseWidthPercentage(18)}px;
  font-weight: bold;
  text-align: center;
`;

export const ProfileAddress = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const ProfileAddressText = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(10)}px;
  margin-left: ${parseWidthPercentage(4)}px;
`;

export const ProfileStatistics = styled.View`
  flex-direction: row;
  margin-top: ${parseHeightPercentage(8)}px;
`;

export const OrdersCounter = styled.TouchableOpacity`
  width: ${parseWidthPercentage(104)}px;
  height: ${parseHeightPercentage(60)}px;
  border-top-color: #ededed10;
  border-top-width: 1px;
  align-items: center;
  justify-content: center;
`;

export const DeliveriesCounter = styled.TouchableOpacity`
  width: ${parseWidthPercentage(104)}px;
  height: ${parseHeightPercentage(60)}px;
  border-top-color: #ededed10;
  border-top-width: 1px;
  border-left-color: #ededed10;
  border-left-width: 1px;
  border-right-color: #ededed10;
  border-right-width: 1px;
  align-items: center;
  justify-content: center;
`;

export const AvaluationsRate = styled.TouchableOpacity`
  width: ${parseWidthPercentage(104)}px;
  height: ${parseHeightPercentage(60)}px;
  border-top-color: #ededed10;
  border-top-width: 1px;
  align-items: center;
  justify-content: center;
`;

export const CounterNumber = styled.Text`
  color: #ff8c42;
  font-size: ${parseWidthPercentage(24)}px;
  font-weight: bold;
  line-height: ${parseWidthPercentage(24)}px;
  text-align: center;
`;

export const CounterLabel = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(8)}px;
  text-align: center;
`;

export const PresentationText = styled.Text`
  padding-left: ${parseWidthPercentage(24)}px;
  padding-right: ${parseWidthPercentage(24)}px;
  color: #ebebeb;
  font-size: ${parseWidthPercentage(12)}px;
  align-items: center;
  justify-content: center;
`;

export const Section = styled.View`
  width: 100%;
  padding-left: ${parseWidthPercentage(24)}px;
  padding-right: ${parseWidthPercentage(24)}px;
  margin-top: ${parseHeightPercentage(24)}px;
`;

export const SectionTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const SectionTitle = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(18)}px;
  font-weight: bold;
`;

export const SectionTitleHelpText = styled.Text`
  color: #ababab;
  font-size: ${parseWidthPercentage(12)}px;
  margin-left: ${parseWidthPercentage(4)}px;
`;

export const ContactFormsButtons = styled.View`
  flex-direction: row;
  margin-top: ${parseHeightPercentage(8)}px;
`;

const contactFormSize = parseWidthPercentage(72);

export const ContactForm = styled(RectButton)`
  width: ${contactFormSize}px;
  height: ${contactFormSize}px;
  padding: ${parseWidthPercentage(8)}px;
  margin-right: ${parseWidthPercentage(8)}px;
  background: #312e38;
  border-radius: 8px;
  justify-content: space-between;
`;

export const ContactFormText = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(10)}px;
`;

export const NoRatingText = styled.Text`
  color: #ababab;
  font-size: ${parseWidthPercentage(12)}px;
  margin-top: ${parseHeightPercentage(4)}px;
`;
