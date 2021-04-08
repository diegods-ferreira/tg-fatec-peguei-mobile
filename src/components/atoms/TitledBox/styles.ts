import styled from 'styled-components/native';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

export const Container = styled.View`
  width: 100%;
  padding: ${parseHeightPercentage(24)}px ${parseWidthPercentage(16)}px;
  margin-bottom: ${parseHeightPercentage(16)}px;
  align-items: center;
  background: #312e38;
  border-radius: 8px;
`;

export const Title = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(18)}px;
  font-weight: bold;
  margin-bottom: ${parseHeightPercentage(16)}px;
`;
