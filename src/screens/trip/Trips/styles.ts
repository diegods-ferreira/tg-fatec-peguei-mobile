import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

import { ITripExtended } from './index';

export const Container = styled.View`
  flex: 1;
  background: #2b2831;
`;

export const TripsListContainer = styled.View`
  flex: 1;
  width: 100%;
  padding-top: ${parseHeightPercentage(24)}px;
`;

export const TripsList = styled(FlatList as new () => FlatList<ITripExtended>)`
  width: 100%;
  padding-left: ${parseWidthPercentage(24)}px;
  padding-right: ${parseWidthPercentage(24)}px;
`;

export const EmptyTripsListContainer = styled.View`
  margin-top: ${parseHeightPercentage(160)}px;
  align-items: center;
  justify-content: center;
`;

export const EmptyTripsListText = styled.Text`
  color: #606060;
  font-size: ${parseWidthPercentage(24)}px;
  font-weight: bold;
  text-align: center;
  margin-top: ${parseHeightPercentage(24)}px;
`;

export const RefreshTripsListButton = styled(RectButton)`
  width: 100%;
  padding: ${parseHeightPercentage(16)}px 0px;
  margin: ${parseHeightPercentage(24)}px 0px;
  background: #ff8c42;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

export const RefreshTripsListButtonText = styled.Text`
  color: #312e38;
  font-size: ${parseWidthPercentage(16)}px;
  font-weight: bold;
`;
