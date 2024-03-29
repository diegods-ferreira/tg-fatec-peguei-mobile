import styled, { css } from 'styled-components/native';
import { FlatList } from 'react-native';

import { IChatExtended } from '@screens/chat/Chats';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

interface ChatTextWrapperProps {
  marginTop?: number;
}

export const Container = styled.View`
  flex: 1;
  background: #2b2831;
`;

export const ChatsListContainer = styled.View`
  flex: 1;
  width: 100%;
`;

export const ChatsList = styled(FlatList as new () => FlatList<IChatExtended>)`
  width: 100%;
  padding-left: ${parseWidthPercentage(24)}px;
  padding-right: ${parseWidthPercentage(24)}px;
`;

export const ChatInfoContainer = styled.View`
  flex: 1;
  padding: ${parseHeightPercentage(16)}px ${parseWidthPercentage(16)}px;
  flex-direction: row;
  align-items: center;
`;

export const ChatMeta = styled.View`
  flex: 1;
  margin-left: ${parseWidthPercentage(16)}px;
`;

export const ChatTextWrapper = styled.View<ChatTextWrapperProps>`
  position: relative;

  ${props =>
    props.marginTop &&
    css`
      margin-top: ${parseHeightPercentage(props.marginTop)}px;
    `}
`;

export const ChatOtherUserFullName = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(14)}px;
  font-weight: bold;
`;

export const ChatOtherUserUsername = styled.Text`
  color: #606060;
  font-size: ${parseWidthPercentage(10)}px;
  font-style: italic;
`;

export const ChatOrderIdentifierContainer = styled.View`
  width: 100%;
  height: ${parseHeightPercentage(24)}px;
  padding: 0px ${parseWidthPercentage(16)}px;
  background-color: #ebebeb05;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  justify-content: center;
`;

export const ChatOrderIdentifierText = styled.Text`
  color: #606060;
  font-size: ${parseWidthPercentage(10)}px;
  font-style: italic;
`;

export const ChatLastMessageSentAt = styled.Text`
  color: #606060;
  font-size: ${parseWidthPercentage(10)}px;
  position: absolute;
  top: 0;
  right: 0;
`;

export const ChatLastMessageText = styled.Text`
  color: #ebebeb;
  font-size: ${parseWidthPercentage(11)}px;
`;

export const EmptyChatsListContainer = styled.View`
  margin-top: ${parseHeightPercentage(80)}px;
  align-items: center;
  justify-content: center;
`;

export const EmptyChatsListText = styled.Text`
  color: #606060;
  font-size: ${parseWidthPercentage(24)}px;
  font-weight: bold;
  text-align: center;
  margin-top: ${parseHeightPercentage(24)}px;
`;
