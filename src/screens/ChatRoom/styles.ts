import styled from 'styled-components/native';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

export const Container = styled.View`
  flex: 1;
`;

export const ComposerContainer = styled.View`
  flex: 1;
  min-height: ${parseHeightPercentage(48)}px;
  background-color: #232129;
`;

export const ChatEmptyContainer = styled.View`
  align-items: center;
  padding-bottom: ${parseHeightPercentage(80)}px;
`;

const chatEmptyUserImageSize = parseHeightPercentage(80);

export const ChatEmptyUserAvatar = styled.Image`
  width: ${chatEmptyUserImageSize}px;
  height: ${chatEmptyUserImageSize}px;
  border-radius: ${chatEmptyUserImageSize / 2}px;
  margin-bottom: ${parseHeightPercentage(8)}px;
`;

export const ChatEmptyUserName = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(16)}px;
  font-weight: bold;
  max-width: ${parseWidthPercentage(300)}px;
  margin-bottom: ${parseHeightPercentage(16)}px;
`;

export const ChatEmptyText = styled.Text`
  color: #606060;
  text-align: center;
  font-size: ${parseWidthPercentage(13)}px;
  max-width: ${parseWidthPercentage(200)}px;
`;
