import styled, { css } from 'styled-components/native';
import { FlatList } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

import { Distance, IOrderExtended } from './index';

interface DistanceContainerProps {
  isSelected?: boolean;
}

interface DistanceTextProps {
  isSelected?: boolean;
}

export const Container = styled.View`
  flex: 1;
  background: #2b2831;
`;

export const DistancesListContainer = styled.View`
  width: 100%;
  height: ${parseHeightPercentage(80)}px;
  padding-top: ${parseHeightPercentage(24)}px;
  padding-bottom: ${parseHeightPercentage(24)}px;
`;

export const DistancesList = styled(FlatList as new () => FlatList<Distance>)`
  width: 100%;
  height: 100%;
`;

export const DistanceContainer = styled.View<DistanceContainerProps>`
  width: ${parseWidthPercentage(64)}px;
  height: 100%;
  background: #312e38;
  border-radius: 8px;
  border-width: 1px;

  ${props =>
    props.isSelected
      ? css`
          border-color: #6f7bae;
        `
      : css`
          border-color: #ebebeb10;
        `}
`;

export const DistanceChoosable = styled(RectButton)`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

export const DistanceText = styled.Text<DistanceTextProps>`
  font-size: ${parseWidthPercentage(11)}px;

  ${props =>
    props.isSelected
      ? css`
          color: #6f7bae;
          font-weight: bold;
        `
      : css`
          color: #ebebeb;
        `}
`;

export const OrdersListContainer = styled.View`
  flex: 1;
  width: 100%;
`;

export const OrdersList = styled(
  FlatList as new () => FlatList<IOrderExtended>,
)`
  width: 100%;
  padding-left: ${parseWidthPercentage(24)}px;
  padding-right: ${parseWidthPercentage(24)}px;
`;

export const EmptyOrdersListContainer = styled.View`
  margin-top: ${parseHeightPercentage(80)}px;
  align-items: center;
  justify-content: center;
`;

export const EmptyOrdersListText = styled.Text`
  color: #606060;
  font-size: ${parseWidthPercentage(24)}px;
  font-weight: bold;
  text-align: center;
  margin-top: ${parseHeightPercentage(24)}px;
`;

export const RefreshOrdersListButton = styled(RectButton)`
  width: 100%;
  padding: ${parseHeightPercentage(16)}px 0px;
  margin: ${parseHeightPercentage(24)}px 0px;
  background: #ff8c42;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

export const RefreshOrdersListButtonText = styled.Text`
  color: #312e38;
  font-size: ${parseWidthPercentage(16)}px;
  font-weight: bold;
`;
