import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

const containerSize = parseWidthPercentage(50);

export const Container = styled.View`
  width: ${containerSize}px;
  height: ${containerSize}px;
  border-radius: ${containerSize / 2}px;

  position: absolute;
  right: ${parseWidthPercentage(24)}px;
  bottom: ${parseHeightPercentage(24)}px;
`;

export const Button = styled(RectButton)`
  width: 100%;
  height: 100%;
  border-radius: ${containerSize / 2}px;
  background: #6f7bae;
  align-items: center;
  justify-content: center;
`;
