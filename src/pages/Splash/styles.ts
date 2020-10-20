import styled from 'styled-components/native';
import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '../../utils/screenPercentage';

export const Container = styled.View`
  flex: 1;
  padding: ${parseHeightPercentage(24)}px ${parseWidthPercentage(24)}px;
  align-items: center;
  justify-content: center;
`;

const logoImageSize = parseWidthPercentage(250);

export const LogoImage = styled.Image`
  width: ${logoImageSize}px;
  height: ${logoImageSize}px;
`;
