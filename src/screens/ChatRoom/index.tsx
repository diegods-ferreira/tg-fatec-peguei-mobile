import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { io as socketio } from 'socket.io-client';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

import { useAuth } from '@hooks/auth';

import { Container } from './styles';

interface RouteParams {
  chat_id: string;
  recipient_id: string;
}

interface Message extends IMessage {
  id: string;
  from: string;
  to: string;
  text: string;
  created_at: string;
}

const ChatRoom: React.FC = () => {
  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);

  const socket = useMemo(() => {
    return socketio('http://192.168.1.158:3333', {
      query: { user_id: user.id },
    });
  }, [user.id]);

  useEffect(() => {
    const { chat_id } = routeParams;
    socket.emit('join-room', chat_id);
  }, [socket, routeParams]);

  useEffect(() => {
    socket.on('previous-messages', chat_messages => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, chat_messages),
      );
    });

    socket.on('receive-message', chat_message => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [chat_message]),
      );
    });
  }, [socket]);

  const handleSendMessage = useCallback(
    (messages = []) => {
      const [message] = messages;

      socket.emit('send-message', {
        from: user.id,
        to: routeParams.recipient_id,
        text: message.text,
      });

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      );
    },
    [routeParams.recipient_id, user.id, socket],
  );

  return (
    <Container>
      <GiftedChat
        messages={messages}
        onSend={messages => handleSendMessage(messages)}
        user={{
          _id: 1,
        }}
      />
    </Container>
  );
};

export default ChatRoom;
