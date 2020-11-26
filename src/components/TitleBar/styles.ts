import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

export const Container = styled.View`
  width: 100%;
  height: ${parseHeightPercentage(56)}px;
  background: #312e38;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const backButtonSize = parseHeightPercentage(56);

export const BackButton = styled(RectButton)`
  width: ${backButtonSize}px;
  height: ${backButtonSize}px;
  border-radius: ${backButtonSize / 2}px;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  flex: 1;
  color: #606060;
  font-size: ${parseWidthPercentage(14)}px;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
`;

const contextMenuButtonSize = parseHeightPercentage(56);

export const ContextMenuButton = styled(RectButton)`
  width: ${contextMenuButtonSize}px;
  height: ${contextMenuButtonSize}px;
  border-radius: ${contextMenuButtonSize / 2}px;
  align-items: center;
  justify-content: center;
`;
