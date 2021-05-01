import styled, { css } from 'styled-components/native';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

interface TripFromToTextProps {
  color: string;
  textBold?: boolean;
  marginRight?: number;
}

interface TripDateTimeProps {
  marginRight?: number;
}

export const TripInfoContainer = styled.View`
  flex: 1;
  padding: ${parseHeightPercentage(16)}px ${parseWidthPercentage(16)}px;
  flex-direction: row;
  align-items: center;
`;

const tripRequesterAvatarSize = parseWidthPercentage(40);

export const TripRequesterAvatar = styled.Image`
  width: ${tripRequesterAvatarSize}px;
  height: ${tripRequesterAvatarSize}px;
  border-radius: ${tripRequesterAvatarSize / 2}px;
`;

export const TripMeta = styled.View`
  flex: 1;
  margin-left: ${parseWidthPercentage(16)}px;
`;

export const TripTextWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const TripTravellerFullName = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(12)}px;
  font-weight: bold;
  margin-right: ${parseWidthPercentage(8)}px;
`;

export const TripTravellerUsername = styled.Text`
  color: #606060;
  font-size: ${parseWidthPercentage(10)}px;
  font-style: italic;
`;

export const TripDeliveryInfo = styled.View`
  flex: 1;
  justify-content: space-between;
  margin-top: ${parseHeightPercentage(4)}px;
`;

export const TripFromToText = styled.Text<TripFromToTextProps>`
  font-size: ${parseWidthPercentage(10)}px;
  margin-left: ${parseWidthPercentage(4)}px;

  ${props =>
    props.color &&
    css`
      color: ${props.color};
    `}

  ${props =>
    props.textBold &&
    css`
      font-weight: bold;
    `}

  ${props =>
    props.marginRight &&
    css`
      margin-right: ${parseWidthPercentage(props.marginRight)}px;
    `}
`;

export const TripDateTime = styled.Text<TripDateTimeProps>`
  color: #adadad;
  font-size: ${parseWidthPercentage(10)}px;

  ${props =>
    props.marginRight &&
    css`
      margin-right: ${parseWidthPercentage(props.marginRight)}px;
    `}
`;
