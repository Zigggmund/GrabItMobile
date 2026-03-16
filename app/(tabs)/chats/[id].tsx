import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useGetChat } from '@/hooks/chat/useGetChat';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useLanguage } from '@/hooks/useLanguage';
import { useProfile } from '@/hooks/user/useProfile';
import { useTheme } from '@/hooks/useTheme';

import TypingBar from '@/components/common/bars/TypingBar';
import ErrorMessage from '@/components/common/ErrorMessage';
import ChatHeader from '@/components/header/onePage/ChatHeader';
import { Message } from '@/components/items/chats/Message';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomText } from '@/components/ui/text/CustomText';

import { FOOTER_HEIGHT } from '@/constants/sizes';

export default function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useProfile();
  const { l } = useLanguage();
  const { colors } = useTheme();
  const listRef = useRef<FlatList>(null);
  const { isKeyboardOpen, keyboardHeight } = useKeyboard();
  const messageWidth = 220;
  const { data: chat, isLoading: isLoading, isError: isError } = useGetChat(id);

  // для мгновенной отрисовки без getЗапроса. После успешного post isReceive становится true
  const [messages, setMessages] = useState(chat?.messages);
  const [message, setMessage] = useState('');

  // отправка сообщения
  const handleSendMessage = () => {
    if (!message.trim() || !user) return;

    const newMessage = {
      id:
        messages && messages.length > 0
          ? messages[messages.length - 1].id + 1
          : 1,
      userId: user.id,
      text: message,
      date: new Date().toISOString(),
      isRead: false,
      isReceive: false,
    };

    setMessages(prev => {
      return prev ? [...prev, newMessage] : [newMessage];
    });

    console.log('Message was sent:', newMessage);
    setMessage('');
  };

  // добавление медиа
  const handleAddMedia = () => {
    console.log('Media was added');
  };

  // изменение сообщений при переходе в другой чат
  useEffect(() => {
    setMessages(chat?.messages);
  }, [chat]);

  // автоскролл вниз при отправке
  useEffect(() => {
    if (!messages || messages.length == 0) return;
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages?.length]);

  if (isLoading)
    return (
      <ScreenContainer>
        <ActivityIndicator />
      </ScreenContainer>
    );

  if (isError)
    return (
      <ScreenContainer>
        <ErrorMessage text={l.errorAPI} />
      </ScreenContainer>
    );

  if (!chat) {
    return (
      <ScreenContainer>
        <ErrorMessage text={l.chatChatNotFound} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View className={'px-4 flex-1 w-full'}>
        <View className={'mb-10'}>
          {/* isOnline изменить */}
          <ChatHeader isOnline={false} userCard={chat.talker} />
        </View>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
          renderItem={({ item }) => (
            <Message width={messageWidth} message={item} />
          )}
          contentContainerStyle={{
            paddingBottom: 12,
          }}
          ListEmptyComponent={() => (
            <CustomText
              highlight
              className={'text-22 text-center'}
              style={{ color: colors.theme.blue.primary }}
            >
              {l.emptyMessageList}
            </CustomText>
          )}
        />
        <View
          style={{
            paddingBottom: isKeyboardOpen ? keyboardHeight - FOOTER_HEIGHT : 12,
          }}
          className="mt-2"
        >
          <TypingBar
            onAddMedia={handleAddMedia}
            onSend={handleSendMessage}
            value={message}
            onChangeText={setMessage}
            placeholder={l.writeSomething}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
