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
  margin-top: ${parseHeightPercentage(16)}px;
  margin-bottom: ${parseHeightPercentage(32)}px;
  font-weight: bold;
  font-size: ${parseWidthPercentage(24)}px;
  color: #ebebeb;
`;

export const Subtitle = styled.Text`
  font-size: ${parseWidthPercentage(16)}px;
  margin-bottom: ${parseHeightPercentage(32)}px;
  text-align: center;
  color: #ebebeb;
`;

export const SignInButton = styled.TouchableOpacity`
  margin-top: ${parseHeightPercentage(32)}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const SignInButtonText = styled.Text`
  color: #f9c784;
  font-size: ${parseWidthPercentage(18)}px;
  margin-left: ${parseWidthPercentage(8)}px;
`;
