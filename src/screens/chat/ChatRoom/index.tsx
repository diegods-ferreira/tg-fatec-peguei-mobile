import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert, StyleProp, View, ViewStyle } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { io as socketio, Socket } from 'socket.io-client';
import {
  Bubble,
  BubbleProps,
  Composer,
  ComposerProps,
  Day,
  DayProps,
  GiftedChat,
  IMessage,
  Send,
  SendProps,
} from 'react-native-gifted-chat';
import { Modalize } from 'react-native-modalize';
import { useNavigation } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

import { API_URL } from '@env';

import api from '@services/api';

import { useAuth } from '@hooks/auth';

import IChat from '@models/Chat';
import IUser from '@models/User';

import LoadingScreen from '@components/atoms/LoadingScreen';
import TitleBar from '@components/atoms/TitleBar';
import AvatarImage from '@components/atoms/AvatarImage';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

import {
  Container,
  ComposerContainer,
  ComposerContainerDisabled,
  ComposerContainerDisabledText,
  ChatEmptyContainer,
  ChatEmptyUserName,
  ChatEmptyText,
  ContextMenuModal,
  ContextMenuOption,
  ContextMenuOptionText,
} from './styles';

interface RouteParams {
  chat: IChat;
  recipient: IUser;
  order_id: string;
}

const ChatRoom: React.FC = () => {
  const modalizeRef = useRef<Modalize>(null);

  const navigation = useNavigation();

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
          `/chats/previous-messages/${routeParams.chat.id}`,
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
  }, [routeParams.chat.id]);

  useEffect(() => {
    const newSocket = socketio(API_URL, {
      query: { user_id: user.id },
    });

    setTimeout(() => {
      const { chat } = routeParams;

      newSocket.emit('join-room', chat.id);

      newSocket.on('receive-message', (receiveMessages: IMessage[]) => {
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, receiveMessages),
        );
      });

      setSocket(newSocket);
    }, 0);

    return () => {
      newSocket.disconnect();
    };
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

  const handleOpenContextMenuModal = useCallback(() => {
    modalizeRef.current?.open();
  }, []);

  const handleOpenOrderDetails = useCallback(
    () => navigation.navigate('OrderDetails', { id: routeParams.order_id }),
    [navigation, routeParams.order_id],
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

  const handleNavigateToUserProfile = useCallback(() => {
    navigation.navigate('UserProfile', { user_id: routeParams.recipient.id });
  }, [navigation, routeParams.recipient.id]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Container>
        <TitleBar
          title={routeParams.recipient.name}
          showContextMenuButton
          onContextMenuButtonPress={handleOpenContextMenuModal}
        />

        <GiftedChat
          messages={messages}
          onSend={sentMessages => handleSendMessage(sentMessages)}
          user={giftedChatUser}
          scrollToBottom
          onPressAvatar={handleNavigateToUserProfile}
          keyboardShouldPersistTaps="never"
          disableComposer={!routeParams.chat.active}
          infiniteScroll
          scrollToBottomStyle={{
            backgroundColor: '#6F7BAE',
          }}
          scrollToBottomComponent={() => (
            <Feather
              name="chevron-down"
              color="#ebebeb"
              size={parseHeightPercentage(24)}
            />
          )}
          renderDay={(props: DayProps<IMessage>) => (
            <Day {...props} dateFormat="DD/MM/YYYY" />
          )}
          renderComposer={(props: ComposerProps) => (
            <>
              {routeParams.chat.active && (
                <ComposerContainer>
                  <Composer
                    {...props}
                    placeholder="Escreva uma mensagem"
                    placeholderTextColor="#606060"
                    textInputStyle={{ color: '#EBEBEB' }}
                  />
                </ComposerContainer>
              )}

              {!routeParams.chat.active && (
                <ComposerContainer>
                  <ComposerContainerDisabled>
                    <ComposerContainerDisabledText>
                      Pedido finalizado
                    </ComposerContainerDisabledText>
                  </ComposerContainerDisabled>
                </ComposerContainer>
              )}
            </>
          )}
          renderSend={(props: SendProps<IMessage>) => (
            <Send {...props} containerStyle={sendContainerStyle}>
              <MaterialIcon
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
                left: { backgroundColor: '#6F7BAE' },
                right: { backgroundColor: '#606060' },
              }}
              textStyle={{
                left: { color: '#EBEBEB' },
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
              <AvatarImage
                user={routeParams.recipient}
                size={80}
                navigateToProfileOnPress
              />

              <ChatEmptyUserName>
                {routeParams.recipient.name}
              </ChatEmptyUserName>
              <ChatEmptyText>
                Vocês ainda não trocaram nenhuma mensagem.
              </ChatEmptyText>
            </ChatEmptyContainer>
          )}
          renderChatFooter={() => (
            <View style={{ height: parseHeightPercentage(8) }} />
          )}
        />
      </Container>

      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        overlayStyle={{ backgroundColor: '#00000090' }}
      >
        <ContextMenuModal>
          <ContextMenuOption
            rippleColor="#ebebeb10"
            onPress={handleOpenOrderDetails}
          >
            <Feather
              name="external-link"
              color="#606060"
              size={parseHeightPercentage(24)}
            />
            <ContextMenuOptionText>Ver pedido</ContextMenuOptionText>
          </ContextMenuOption>

          <ContextMenuOption
            rippleColor="#ebebeb10"
            onPress={handleNavigateToUserProfile}
          >
            <Feather
              name="user"
              color="#606060"
              size={parseHeightPercentage(24)}
            />
            <ContextMenuOptionText>{`Ver perfil de ${routeParams.recipient.name}`}</ContextMenuOptionText>
          </ContextMenuOption>
        </ContextMenuModal>
      </Modalize>
    </>
  );
};

export default ChatRoom;
