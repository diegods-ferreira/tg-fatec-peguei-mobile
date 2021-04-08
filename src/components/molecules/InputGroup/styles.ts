import styled from 'styled-components/native';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

export const Container = styled.View`
  width: 100%;
  margin-top: ${parseHeightPercentage(16)}px;
`;

export const Label = styled.Text`
  color: #ff8c42;
  font-size: ${parseWidthPercentage(14)}px;
  margin-bottom: ${parseHeightPercentage(8)}px;
`;
