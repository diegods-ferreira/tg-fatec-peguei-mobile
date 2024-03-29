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

export const Title = styled.Text`
  font-weight: bold;
  font-size: ${parseWidthPercentage(24)}px;
  color: #ebebeb;
  margin-top: ${parseHeightPercentage(16)}px;
  margin-bottom: ${parseHeightPercentage(32)}px;
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
