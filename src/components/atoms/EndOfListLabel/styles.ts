import styled from 'styled-components/native';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

export const Container = styled.TouchableOpacity`
  width: 100%;
  margin: ${parseHeightPercentage(24)}px 0px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Dash = styled.View`
  flex: 1;
  height: 1px;
  background: #606060;
`;

export const LabelTextWrapper = styled.View`
  margin: 0px ${parseWidthPercentage(32)}px;
  align-items: center;
  justify-content: center;
`;

export const LabelText = styled.Text`
  color: #606060;
  font-size: ${parseWidthPercentage(11)}px;
`;
