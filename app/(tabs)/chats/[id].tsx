import { useEffect, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useKeyboard } from '@/hooks/useKeyboard';
import { useLanguage } from '@/hooks/useLanguage';
import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/hooks/useTheme';

import TypingBar from '@/components/common/bars/TypingBar';
import ChatHeader from '@/components/header/onePage/ChatHeader';
import { Message } from '@/components/items/chats/Message';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomText } from '@/components/ui/text/CustomText';

import { mockChats } from '@/constants/mocks/mockChats';
import { FOOTER_HEIGHT } from '@/constants/ui';

export default function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useProfile();
  const { l } = useLanguage();
  const { colors } = useTheme();
  const listRef = useRef<FlatList>(null);
  const { isKeyboardOpen, keyboardHeight } = useKeyboard();
  const messageWidth = 220;

  // const {
  //   data: chat,
  //   isLoading,
  //   isError,
  // } = useGetChat(userId);
  const isError = false;
  const chat = mockChats.find(chat => chat.id.toString() === id);
  // для мгновенной отрисовки без getЗапроса. После успешного post isReceive становится true
  const [messages, setMessages] = useState(chat?.messages);
  const [message, setMessage] = useState('');

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

  const handleAddMedia = () => {
    console.log('Media was added');
  };

  useEffect(() => {
    setMessages(chat?.messages);
  }, [id]);

  useEffect(() => {
    if (!messages || messages.length == 0) return;
    // автоскролл вниз при отправке
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages?.length])

  if (!chat || isError) {
    return (
      <ScreenContainer>
        <CustomText
          style={{ color: colors.base.red.bright }}
          highlight
          className={'text-60'}
        >
          {l.chatUserNotFound}
        </CustomText>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View className={'px-4 flex-1 w-full'}>
        <View className={'mb-10'}>
          <ChatHeader isOnline={false} userCard={chat.talker} />
        </View>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
          renderItem={({ item }) => <Message width={messageWidth} message={item} />}
          contentContainerStyle={{
            paddingBottom: 12,
          }}
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
