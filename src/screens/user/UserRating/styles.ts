import styled from 'styled-components/native';
import { FlatList } from 'react-native';

import IUserRate from '@models/UserRate';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

export const Container = styled.View`
  flex: 1;
  background: #2b2831;
`;

export const RatingListContainer = styled.View`
  flex: 1;
  width: 100%;
`;

export const RatingList = styled(FlatList as new () => FlatList<IUserRate>)`
  width: 100%;
  padding-left: ${parseWidthPercentage(24)}px;
  padding-right: ${parseWidthPercentage(24)}px;
`;

export const EmptyRatingListContainer = styled.View`
  margin-top: ${parseHeightPercentage(80)}px;
  align-items: center;
  justify-content: center;
`;

export const EmptyRatingListText = styled.Text`
  color: #606060;
  font-size: ${parseWidthPercentage(24)}px;
  font-weight: bold;
  text-align: center;
  margin-top: ${parseHeightPercentage(24)}px;
`;
