import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '../../utils/screenPercentage';

export const Container = styled(RectButton)`
  height: ${parseHeightPercentage(56)}px;
  background: #ff8c42;
  border-radius: 8px;
  margin-top: ${parseHeightPercentage(8)}px;
  justify-content: center;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: #312e38;
  font-size: ${parseWidthPercentage(18)}px;
  font-weight: bold;
`;
