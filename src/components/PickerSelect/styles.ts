import styled from 'styled-components/native';
import { Picker } from '@react-native-community/picker';
import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

export const Container = styled.View`
  width: 100%;
  min-height: ${parseHeightPercentage(56)}px;
  padding-left: ${parseWidthPercentage(16)}px;
  background: #232129;
  border-radius: 8px;
  margin-bottom: ${parseHeightPercentage(8)}px;
  border-width: 2px;
  border-color: #ebebeb10;
  flex-direction: row;
  align-items: center;
`;

export const StyledPickerSelect = styled(Picker)`
  flex: 1;
  color: #ebebeb;
  font-size: ${parseWidthPercentage(16)}px;
`;

export const ErrorContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: ${parseHeightPercentage(8)}px;
`;

export const ErrorLabel = styled.Text`
  color: #e74c3c;
  font-size: ${parseWidthPercentage(11)}px;
`;
