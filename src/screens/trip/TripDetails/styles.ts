import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

interface StatusIndicatorContainerProps {
  backgroundColor: string;
}

interface ContextMenuOptionTextProps {
  color: string;
}

export const Container = styled.View`
  flex: 1;
`;

export const StatusIndicatorContainer = styled.TouchableOpacity<
  StatusIndicatorContainerProps
>`
  width: 100%;
  height: ${parseHeightPercentage(40)}px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  justify-content: center;
  align-items: center;

  ${props =>
    props.backgroundColor &&
    css`
      background-color: ${props.backgroundColor};
    `}
`;

export const StatusIndicatorText = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(13)}px;
`;

export const TravellerContainer = styled.View`
  width: 100%;
  padding: ${parseHeightPercentage(24)}px ${parseWidthPercentage(24)}px;
  justify-content: center;
  align-items: center;
`;

export const TravellerFullName = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(18)}px;
  font-weight: bold;
  margin-top: ${parseHeightPercentage(8)}px;
`;

export const TravellerUsername = styled.Text`
  color: #606060;
  font-size: ${parseWidthPercentage(14)}px;
  font-style: italic;
  margin-top: ${parseHeightPercentage(4)}px;
`;

export const TripInfoContainer = styled.View`
  padding: 0px ${parseWidthPercentage(24)}px ${parseHeightPercentage(24)}px;
`;

export const TripInfoWrapper = styled.View`
  width: 100%;
  margin-top: ${parseHeightPercentage(8)}px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

export const TripInfoText = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(14)}px;
  margin-left: ${parseWidthPercentage(16)}px;
`;

export const ContextMenuModal = styled.View`
  width: 100%;
  padding: ${parseHeightPercentage(16)}px 0px;
  background-color: #312e38;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

export const ContextMenuOption = styled(RectButton)`
  width: 100%;
  padding: ${parseHeightPercentage(16)}px ${parseWidthPercentage(24)}px;
  flex-direction: row;
  align-items: center;
`;

export const ContextMenuOptionText = styled.Text<ContextMenuOptionTextProps>`
  font-size: ${parseWidthPercentage(16)}px;
  margin-left: ${parseWidthPercentage(16)}px;

  ${props =>
    props.color &&
    css`
      color: ${props.color};
    `}
`;

export const ContextMenuOptionSubmiting = styled.View`
  width: 100%;
  padding: ${parseHeightPercentage(2)}px ${parseWidthPercentage(24)}px;
  justify-content: center;
  align-items: center;
`;
