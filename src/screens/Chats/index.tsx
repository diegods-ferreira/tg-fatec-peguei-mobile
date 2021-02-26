import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, RefreshControl, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

import api from '@services/api';

import { useAuth } from '@hooks/auth';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

import TitleBar from '@components/TitleBar';
import LoadingScreen from '@components/LoadingScreen';

import noUserAvatarImg from '@assets/no-user-avatar.png';

import {
  Container,
  ChatsListContainer,
  ChatsList,
  ChatContainer,
  ChatClickable,
  ChatUserAvatar,
  ChatMeta,
  ChatTextWrapper,
  ChatOtherUserFullName,
  ChatOrderIdentifier,
  EmptyChatsListContainer,
  EmptyChatsListText,
} from './styles';

interface User {
  id: string;
  name: string;
  username: string;
  avatar_url: string;
}

export interface Chat {
  id: string;
  order_id: string;
  created_at: string;
  updated_at: string;
  requester: User;
  deliveryman: User;
  other_user: User;
}

const Chats: React.FC = () => {
  const { user } = useAuth();

  const navigation = useNavigation();

  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChatsListFromTheApi = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get('/chats');

      setChats(
        response.data.map((chat: Chat) => ({
          ...chat,
          other_user:
            user.id === chat.requester.id ? chat.deliveryman : chat.requester,
        })),
      );
    } catch (err) {
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao tentar recuperar os pedidos. Tente novamente mais tarde, por favor.',
      );

      console.log(String(err));
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  const onRefreshOrdersList = useCallback(async () => {
    setRefreshing(true);
    fetchChatsListFromTheApi();
    setRefreshing(false);
  }, [fetchChatsListFromTheApi]);

  useEffect(() => {
    fetchChatsListFromTheApi();
  }, [fetchChatsListFromTheApi]);

  const handleJoinChatRoom = useCallback(
    (chat_id: string, recipient_id: string) => {
      navigation.navigate('ChatRoom', { chat_id, recipient_id });
    },
    [navigation],
  );

  const refreshIndicator = useMemo(() => {
    return (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefreshOrdersList}
        progressBackgroundColor="#2b2831"
        colors={['#6f7bae', '#ff8c42']}
        tintColor="#6f7bae"
      />
    );
  }, [refreshing, onRefreshOrdersList]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <TitleBar title="Conversas" showBackButton={false} />
      <Container>
        <ChatsListContainer>
          <ChatsList
            showsVerticalScrollIndicator
            refreshControl={refreshIndicator}
            ListHeaderComponent={() => (
              <View style={{ height: parseHeightPercentage(24) }} />
            )}
            ListFooterComponent={() => (
              <View style={{ height: parseHeightPercentage(24) }} />
            )}
            ItemSeparatorComponent={() => (
              <View style={{ height: parseHeightPercentage(8) }} />
            )}
            ListEmptyComponent={() => (
              <EmptyChatsListContainer>
                <Feather
                  name="message-circle"
                  size={parseWidthPercentage(104)}
                  color="#606060"
                />
                <EmptyChatsListText>
                  Você ainda não tem nenhuma conversa.
                </EmptyChatsListText>
              </EmptyChatsListContainer>
            )}
            data={chats}
            keyExtractor={chat => chat.id}
            renderItem={({ item: chat }) => (
              <ChatContainer>
                <ChatClickable
                  rippleColor="#ebebeb10"
                  onPress={() =>
                    handleJoinChatRoom(chat.id, chat.other_user.id)
                  }
                >
                  <ChatUserAvatar
                    source={
                      chat.other_user.avatar_url
                        ? { uri: chat.other_user.avatar_url }
                        : noUserAvatarImg
                    }
                  />

                  <ChatMeta>
                    <ChatTextWrapper>
                      <ChatOtherUserFullName>
                        {chat.other_user.name}
                      </ChatOtherUserFullName>
                      <ChatOrderIdentifier>
                        Pedido: 123456789
                      </ChatOrderIdentifier>
                    </ChatTextWrapper>
                  </ChatMeta>
                </ChatClickable>
              </ChatContainer>
            )}
          />
        </ChatsListContainer>
      </Container>
    </>
  );
};

export default Chats;
