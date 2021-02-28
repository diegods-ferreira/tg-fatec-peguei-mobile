import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StyleProp, ViewStyle } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { io as socketio, Socket } from 'socket.io-client';
import {
  Bubble,
  BubbleProps,
  Composer,
  ComposerProps,
  GiftedChat,
  IMessage,
  Send,
  SendProps,
} from 'react-native-gifted-chat';
import Feather from 'react-native-vector-icons/Feather';

import api from '@services/api';

import { useAuth } from '@hooks/auth';

import { User } from '@screens/Chats';

import LoadingScreen from '@components/LoadingScreen';
import TitleBar from '@components/TitleBar';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

import noUserAvatarImg from '@assets/no-user-avatar.png';

import {
  Container,
  ComposerContainer,
  ChatEmptyContainer,
  ChatEmptyUserAvatar,
  ChatEmptyUserName,
  ChatEmptyText,
} from './styles';

interface RouteParams {
  chat_id: string;
  recipient: User;
}

// interface Message extends IMessage {
//   id: string;
//   from: string;
//   to: string;
//   text: string;
//   created_at: string;
// }

const ChatRoom: React.FC = () => {
  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const { user } = useAuth();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [socket, setSocket] = useState<Socket>({} as Socket);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPreviousMessages() {
      setLoading(true);

      try {
        const response = await api.get(
          `/chats/previous-messages/${routeParams.chat_id}`,
        );

        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, response.data),
        );
      } catch (err) {
        Alert.alert(
          'Erro',
          'Ocorreu um erro ao tentar recuperar as mensagens anteriores.',
        );

        console.log(String(err));
      } finally {
        setLoading(false);
      }
    }

    loadPreviousMessages();
  }, [routeParams.chat_id]);

  useEffect(() => {
    const newSocket = socketio('http://192.168.1.158:3333', {
      query: { user_id: user.id },
    });

    setTimeout(() => {
      const { chat_id } = routeParams;

      newSocket.emit('join-room', chat_id);

      newSocket.on('receive-message', (receiveMessages: IMessage[]) => {
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, receiveMessages),
        );
      });

      setSocket(newSocket);
    }, 0);
  }, [routeParams, user.id]);

  const handleSendMessage = useCallback(
    (sentMessages = []) => {
      const [message] = sentMessages;

      socket.emit('send-message', {
        from: user.id,
        to: routeParams.recipient.id,
        text: message.text,
      });

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, sentMessages),
      );
    },
    [routeParams.recipient.id, user.id, socket],
  );

  const giftedChatUser = useMemo(
    () => ({
      _id: user.id,
      name: user.name,
      avatar: user.avatar_url,
    }),
    [user],
  );

  const sendContainerStyle = useMemo(() => {
    const sendButtonSize = parseHeightPercentage(48);

    return {
      width: sendButtonSize,
      height: '100%',
      backgroundColor: '#232129',
      justifyContent: 'center',
      alignItems: 'center',
    } as StyleProp<ViewStyle>;
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Container>
      <TitleBar title={routeParams.recipient.name} />

      <GiftedChat
        messages={messages}
        onSend={sentMessages => handleSendMessage(sentMessages)}
        user={giftedChatUser}
        scrollToBottom
        onPressAvatar={() => Alert.alert('onPressAvatar', 'Abrir perfil')}
        keyboardShouldPersistTaps="never"
        infiniteScroll
        renderComposer={(props: ComposerProps) => (
          <ComposerContainer>
            <Composer
              {...props}
              placeholder="Escreva uma mensagem"
              placeholderTextColor="#606060"
              textInputStyle={{ color: '#EBEBEB' }}
            />
          </ComposerContainer>
        )}
        renderSend={(props: SendProps<IMessage>) => (
          <Send {...props} containerStyle={sendContainerStyle}>
            <Feather
              name="send"
              color="#ff8c42"
              size={parseWidthPercentage(24)}
            />
          </Send>
        )}
        renderBubble={(props: BubbleProps<IMessage>) => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: { backgroundColor: '#FF8C42' },
              right: { backgroundColor: '#6F7BAE' },
            }}
            textStyle={{
              left: { color: '#232129' },
              right: { color: '#EBEBEB' },
            }}
          />
        )}
        renderChatEmpty={() => (
          <ChatEmptyContainer
            style={{
              transform: [{ rotateY: '180deg' }, { rotateZ: '180deg' }],
            }}
          >
            <ChatEmptyUserAvatar
              source={
                routeParams.recipient.avatar_url
                  ? { uri: routeParams.recipient.avatar_url }
                  : noUserAvatarImg
              }
            />
            <ChatEmptyUserName>{routeParams.recipient.name}</ChatEmptyUserName>
            <ChatEmptyText>
              Vocês ainda não trocaram nenhuma mensagem.
            </ChatEmptyText>
          </ChatEmptyContainer>
        )}
      />
    </Container>
  );
};

export default ChatRoom;
