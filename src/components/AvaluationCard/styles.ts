import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

interface ContainerProps {
  smallCard: boolean;
}

interface TextProps {
  smallCard: boolean;
}

export const Container = styled(RectButton)<ContainerProps>`
  width: 100%;
  min-height: ${parseHeightPercentage(80)}px;
  margin-top: ${parseHeightPercentage(8)}px;
  background: #312e38;
  border-radius: 8px;
  justify-content: space-between;

  ${props =>
    props.smallCard
      ? css`
          padding: ${parseHeightPercentage(8)}px ${parseWidthPercentage(8)}px;
        `
      : css`
          padding: ${parseHeightPercentage(24)}px ${parseWidthPercentage(16)}px;
        `}
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
`;

const userAvatarSize = parseHeightPercentage(40);

export const UserAvatar = styled.Image`
  width: ${userAvatarSize}px;
  height: ${userAvatarSize}px;
  border-radius: ${userAvatarSize / 2}px;
  margin-right: ${parseWidthPercentage(8)}px;
`;

export const UserInfo = styled.View`
  flex: 1;
`;

export const UserFullName = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(12)}px;
  font-weight: bold;
`;

export const Username = styled.Text`
  color: #adadad;
  font-size: ${parseWidthPercentage(8)}px;
  font-style: italic;
`;

export const Stars = styled.View`
  align-self: flex-start;
  margin-top: ${parseHeightPercentage(4)}px;
`;

export const Text = styled.Text<TextProps>`
  color: #ebebeb;

  ${props =>
    props.smallCard
      ? css`
          font-size: ${parseWidthPercentage(10)}px;
        `
      : css`
          font-size: ${parseWidthPercentage(11)}px;
          margin-top: ${parseHeightPercentage(8)}px;
        `}
`;
