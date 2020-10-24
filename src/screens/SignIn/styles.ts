import styled from 'styled-components/native';
import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

export const Container = styled.View`
  flex: 1;
  padding: ${parseHeightPercentage(24)}px ${parseWidthPercentage(24)}px;
  align-items: center;
  justify-content: center;
`;

const logoImageSize = parseWidthPercentage(165);

export const LogoImage = styled.Image`
  width: ${logoImageSize}px;
  height: ${logoImageSize}px;
`;

export const LoginContainer = styled.View`
  width: 100%;
  margin-top: ${parseHeightPercentage(16)}px;
  margin-bottom: ${parseHeightPercentage(32)}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.Text`
  font-weight: bold;
  font-size: ${parseWidthPercentage(24)}px;
  color: #ebebeb;
`;

export const SocialLoginContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

export const SocialLoginText = styled.Text`
  font-size: ${parseWidthPercentage(16)}px;
  color: #ebebeb;
`;

export const SocialLoginOption = styled.TouchableOpacity`
  margin-left: ${parseWidthPercentage(8)}px;
  width: ${parseWidthPercentage(32)}px;
  height: ${parseHeightPercentage(32)}px;
`;

export const ResetPasswordButton = styled.TouchableOpacity`
  align-self: flex-end;
  margin-top: ${parseHeightPercentage(16)}px;
`;

export const ResetPasswordButtonText = styled.Text`
  color: #f9c784;
  font-size: ${parseWidthPercentage(16)}px;
`;

export const SignUpButton = styled.TouchableOpacity`
  width: 100%;
  height: ${parseHeightPercentage(56)}px;
  margin-top: ${parseHeightPercentage(56)}px;
  border-radius: 8px;
  border-width: 2px;
  border-color: #f9c784;
  align-items: center;
  justify-content: center;
`;

export const SignUpButtonText = styled.Text`
  color: #ededed;
  font-size: ${parseWidthPercentage(18)}px;
  font-weight: bold;
`;

export const ModalTitle = styled.Text`
  margin-bottom: ${parseHeightPercentage(24)}px;
  font-weight: bold;
  font-size: ${parseWidthPercentage(24)}px;
  color: #ebebeb;
`;

export const ModalSubtitle = styled.Text`
  margin-bottom: ${parseHeightPercentage(16)}px;
  font-size: ${parseWidthPercentage(16)}px;
  text-align: center;
  color: #ebebeb;
`;

export const ModalButtonsContainer = styled.View`
  width: 100%;
  margin-top: ${parseHeightPercentage(8)}px;
  display: flex;
  flex-direction: row;
`;

export const ModalCancelButton = styled.TouchableOpacity`
  flex: 1;
  height: ${parseHeightPercentage(56)}px;
  margin-right: ${parseWidthPercentage(16)}px;
  border-radius: 8px;
  border-color: #e74c3c;
  border-width: 2px;
  align-items: center;
  justify-content: center;
`;

export const ModalCancelButtonText = styled.Text`
  font-size: ${parseWidthPercentage(18)}px;
  font-weight: bold;
  color: #e74c3c;
`;

export const ModalSendButton = styled.TouchableOpacity`
  flex: 1;
  height: ${parseHeightPercentage(56)}px;
  border-radius: 8px;
  background: #6ab04c;
  align-items: center;
  justify-content: center;
`;

export const ModalButtonText = styled.Text`
  color: #ededed;
  font-size: ${parseWidthPercentage(18)}px;
  font-weight: bold;
`;