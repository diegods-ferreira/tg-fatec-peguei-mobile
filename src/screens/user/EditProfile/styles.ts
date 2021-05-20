import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import RNLinearGradient from 'react-native-linear-gradient';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

interface ChangeAddressButtonTextProps {
  active: boolean;
}

export const Header = styled.View`
  width: 100%;
`;

export const LinearGradient = styled(RNLinearGradient)`
  width: 100%;
  height: ${parseHeightPercentage(320)}px;
  align-items: center;
`;

export const BackButtonContainer = styled.View`
  width: 100%;
`;

const backButtonSize = parseWidthPercentage(56);

export const BackButton = styled(RectButton)`
  width: ${backButtonSize}px;
  height: ${backButtonSize}px;
  border-radius: ${backButtonSize / 2}px;
  align-items: center;
  justify-content: center;
`;

const avatarContainerSize = parseHeightPercentage(112);

export const AvatarContainer = styled.View`
  width: ${avatarContainerSize}px;
  height: ${avatarContainerSize}px;
  border-radius: ${avatarContainerSize / 2}px;
  margin-bottom: ${parseHeightPercentage(16)}px;
`;

export const AvatarImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: ${avatarContainerSize / 2}px;
`;

const editAvatarButtonSize = parseWidthPercentage(24);

export const EditAvatarButton = styled(RectButton)`
  width: ${editAvatarButtonSize}px;
  height: ${editAvatarButtonSize}px;
  border-radius: ${editAvatarButtonSize / 2}px;
  background: #ebebeb;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0px;
  bottom: 0px;
`;

export const UserFullNameContainer = styled.View`
  width: 100%;
  padding-left: ${parseWidthPercentage(24)}px;
  padding-right: ${parseWidthPercentage(24)}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const UserFullName = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(24)}px;
  font-weight: bold;
`;

export const Container = styled.View`
  width: 100%;
  padding-left: ${parseWidthPercentage(24)}px;
  padding-right: ${parseWidthPercentage(24)}px;
  padding-bottom: ${parseHeightPercentage(24)}px;
  margin-top: -${parseHeightPercentage(56)}px;
`;

export const InputsWrapper = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: flex-end;
`;

export const AddressContainer = styled.View`
  width: 100%;
  margin-top: ${parseHeightPercentage(16)}px;
`;

export const AddressTextContainer = styled.View`
  width: 100%;
  min-height: ${parseHeightPercentage(56)}px;
  padding: ${parseHeightPercentage(16)}px ${parseWidthPercentage(16)}px;
  background: #232129;
  border-radius: 8px;
  margin-bottom: ${parseHeightPercentage(8)}px;
  border-width: 2px;
  border-color: #ebebeb10;
`;

export const AddressText = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(16)}px;
`;

export const ChangeAddressButton = styled.TouchableOpacity`
  width: 100%;
  align-items: flex-end;
`;

export const ChangeAddressButtonText = styled.Text<
  ChangeAddressButtonTextProps
>`
  color: #6f7bae;
  font-size: ${parseWidthPercentage(13)}px;

  ${props =>
    props.active &&
    css`
      color: #e74c3c;
    `}
`;
