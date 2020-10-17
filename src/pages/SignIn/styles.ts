import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
  padding: 24px 24px;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  margin-top: 16px;
  margin-bottom: 32px;
  font-weight: bold;
  font-size: 24px;
  color: #ebebeb;
`;

export const SocialLoginContainer = styled.View`
  width: 100%;
  margin-top: 16px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

export const SocialLoginText = styled.Text`
  font-size: 16px;
  color: #ebebeb;
`;

export const SocialLoginOption = styled.TouchableOpacity`
  margin-left: 8px;
`;

export const SignUpButton = styled.TouchableOpacity`
  width: 100%;
  height: 56px;
  margin-top: 56px;
  border-radius: 8px;
  border-width: 2px;
  border-color: #f9c784;
  align-items: center;
  justify-content: center;
`;

export const SignUpButtonText = styled.Text`
  color: #ededed;
  font-size: 18px;
  font-weight: bold;
`;
