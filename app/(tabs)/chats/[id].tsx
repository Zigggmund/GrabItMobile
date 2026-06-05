import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

import { useChatWebSocket } from '@/hooks/chat/useChatWebSocket';
import { useGetMessages } from '@/hooks/chat/useGetMessages';
import { useMarkRead } from '@/hooks/chat/useMarkRead';
import { useSendMessage } from '@/hooks/chat/useSendMessage';
import { mapMessage } from '@/hooks/chat/mapChat';
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
import { ChatService } from '@/services/api/services/chatService';
import { ConversationEntity, MessageEntity } from '@/types/entities/ChatType';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useProfile();
  const { l } = useLanguage();
  const { colors } = useTheme();
  const listRef = useRef<FlatList>(null);
  const { isKeyboardOpen, keyboardHeight } = useKeyboard();
  const qc = useQueryClient();

  const [messages, setMessages] = useState<MessageEntity[]>([]);
  const [text, setText] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  // REST: initial message load
  const { data: initialData, isLoading, isError } = useGetMessages(id);

  useEffect(() => {
    if (initialData) {
      setMessages(initialData.items);
      setHasMore(initialData.hasMore);
    }
  }, [initialData]);

  // Mutations
  const { mutate: sendMsg } = useSendMessage(id);
  const { mutate: markRead } = useMarkRead(id);

  const appendMessage = useCallback((msg: MessageEntity) => {
    setMessages(prev => {
      if (prev.some(m => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
    if (msg.senderId !== user?.id) {
      markRead(msg.id);
    }
  }, [user?.id, markRead]);

  // WebSocket
  useChatWebSocket({
    conversationId: id,
    onMessage: appendMessage,
    onReconnect: async lastId => {
      if (!lastId) return;
      try {
        const res = await ChatService.getMessages(id, { after: lastId });
        const newMsgs = [...res.items].reverse().map(mapMessage);
        setMessages(prev => {
          const existing = new Set(prev.map(m => m.id));
          return [...prev, ...newMsgs.filter(m => !existing.has(m.id))];
        });
      } catch {
        // reconnect catch-up failed silently
      }
    },
  });

  // Auto-scroll on new messages
  useEffect(() => {
    if (messages.length === 0) return;
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages.length]);

  // Mark read on open when we have initial messages
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last && last.senderId !== user?.id) {
      markRead(last.id);
    }
  }, [initialData]);

  // Load older messages (scroll to top)
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore || messages.length === 0) return;
    setLoadingMore(true);
    try {
      const oldest = messages[0]?.id;
      const res = await ChatService.getMessages(id, { before: oldest });
      const older = [...res.items].reverse().map(mapMessage);
      setMessages(prev => {
        const existing = new Set(prev.map(m => m.id));
        return [...older.filter(m => !existing.has(m.id)), ...prev];
      });
      setHasMore(res.has_more);
    } catch {
      // silent
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSend = () => {
    const content = text.trim();
    if (!content) return;
    setText('');
    sendMsg(content);
  };

  // Conversation metadata from cache (set by myChats screen)
  const cachedConversations = qc.getQueryData<{
    items: ConversationEntity[];
  }>(['conversations', 1, 20]);
  const conversation = cachedConversations?.items.find(c => c.id === id);

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

  const messageWidth = 220;

  return (
    <ScreenContainer>
      <View className="px-4 flex-1 w-full">
        <View className="mb-3">
          <ChatHeader
            username={conversation?.otherUsername ?? ''}
            avatarUrl={conversation?.otherAvatarUrl ?? ''}
            listingTitle={conversation?.listingTitle ?? ''}
          />
        </View>

        {loadingMore && <ActivityIndicator size="small" />}

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          contentContainerStyle={{ paddingBottom: 12 }}
          onScrollBeginDrag={({ nativeEvent }) => {
            if (nativeEvent.contentOffset.y < 60) {
              handleLoadMore();
            }
          }}
          renderItem={({ item }) => (
            <Message width={messageWidth} message={item} />
          )}
          ListEmptyComponent={() => (
            <CustomText
              highlight
              className="text-22 text-center"
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
            onAddMedia={() => {}}
            onSend={handleSend}
            value={text}
            onChangeText={setText}
            placeholder={l.writeSomething}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}