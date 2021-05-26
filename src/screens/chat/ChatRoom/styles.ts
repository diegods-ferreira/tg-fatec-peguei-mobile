import styled from 'styled-components/native';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
  flex: 1;
`;

export const ComposerContainer = styled.View`
  flex: 1;
  min-height: ${parseHeightPercentage(48)}px;
  background-color: #232129;
`;

export const ComposerContainerDisabled = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export const ComposerContainerDisabledText = styled.Text`
  color: #606060;
  font-size: ${parseWidthPercentage(16)}px;
  font-weight: bold;
`;

export const ChatEmptyContainer = styled.View`
  align-items: center;
  padding-bottom: ${parseHeightPercentage(80)}px;
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

export const ContextMenuOptionText = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(16)}px;
  margin-left: ${parseWidthPercentage(16)}px;
`;
