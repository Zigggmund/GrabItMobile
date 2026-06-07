import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

import { useChatWebSocket } from '@/hooks/chat/useChatWebSocket';
import { useDeleteMessage } from '@/hooks/chat/useDeleteMessage';
import { useEditMessage } from '@/hooks/chat/useEditMessage';
import { useGetMessages } from '@/hooks/chat/useGetMessages';
import { useMarkRead } from '@/hooks/chat/useMarkRead';
import { useSendMessage } from '@/hooks/chat/useSendMessage';
import { useMuteConversation } from '@/hooks/chat/useMuteConversation';
import { useUnmuteConversation } from '@/hooks/chat/useUnmuteConversation';
import { useBlockUser } from '@/hooks/chat/useBlockUser';
import { useUnblockUser } from '@/hooks/chat/useUnblockUser';
import { mapMessage } from '@/hooks/chat/mapChat';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useLanguage } from '@/hooks/useLanguage';
import { useProfile } from '@/hooks/user/useProfile';
import { useTheme } from '@/hooks/useTheme';

import { CustomAlert } from '@/components/modals/CustomAlert';
import TypingBar from '@/components/common/bars/TypingBar';
import ErrorMessage from '@/components/common/ErrorMessage';
import ChatHeader from '@/components/header/onePage/ChatHeader';
import { Message } from '@/components/items/chats/Message';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomIcon } from '@/components/ui/icon/CustomIcon';
import { CustomText } from '@/components/ui/text/CustomText';

import { FOOTER_HEIGHT } from '@/constants/sizes';
import { icons } from '@/constants/icons';
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
  const [editingMessage, setEditingMessage] = useState<MessageEntity | null>(null);

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
  const { mutate: editMsg } = useEditMessage(id);
  const { mutate: deleteMsg } = useDeleteMessage(id);
  const { mutate: markRead } = useMarkRead(id);
  const { mutate: muteConv } = useMuteConversation();
  const { mutate: unmuteConv } = useUnmuteConversation();
  const { mutate: blockUser } = useBlockUser();
  const { mutate: unblockUser } = useUnblockUser();

  // Conversation metadata from cache
  const cachedConversations = qc.getQueryData<{ items: ConversationEntity[] }>(
    ['conversations', 1, 20],
  );
  const conversation = cachedConversations?.items.find(c => c.id === id);

  // Compute otherId for block/unblock calls
  const otherId = conversation
    ? conversation.ownerId === user?.id
      ? conversation.renterId
      : conversation.ownerId
    : '';

  const isMuted = conversation?.isMuted ?? false;
  const blockedByMe = conversation?.blockedByMe ?? false;
  const blockedByThem = conversation?.blockedByThem ?? false;
  const isBlocked = blockedByMe || blockedByThem;

  const handleMuteToggle = () => {
    if (isMuted) {
      unmuteConv(id);
    } else {
      muteConv(id);
    }
  };

  const handleBlockToggle = async () => {
    if (blockedByMe) {
      unblockUser(otherId);
    } else {
      const confirmed = await CustomAlert({
        message: l.warningBlockUser,
        confirmation: l.confirmation,
        btnCancel: l.btnCancel,
        btnConfirm: l.blockUser,
      });
      if (confirmed) {
        blockUser(otherId);
      }
    }
  };

  // Upsert: WS pushes both new messages and updates (edit/delete)
  const upsertMessage = useCallback(
    (msg: MessageEntity) => {
      setMessages(prev => {
        const idx = prev.findIndex(m => m.id === msg.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = msg;
          return updated;
        }
        return [...prev, msg];
      });
      if (msg.senderId !== user?.id && !msg.isDeleted) {
        markRead(msg.id);
      }
    },
    [user?.id, markRead],
  );

  // WebSocket
  useChatWebSocket({
    conversationId: id,
    onMessage: upsertMessage,
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
        // silent
      }
    },
  });

  // Auto-scroll on new message appended
  useEffect(() => {
    if (messages.length === 0) return;
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages.length]);

  // Mark read on open
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last && last.senderId !== user?.id) {
      markRead(last.id);
    }
  }, [initialData]);

  // Load older messages (scroll to top triggers this)
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore || messages.length === 0) return;
    setLoadingMore(true);
    try {
      const res = await ChatService.getMessages(id, { before: messages[0].id });
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

  // Send or confirm edit
  const handleSend = () => {
    const content = text.trim();
    if (!content) return;
    setText('');

    if (editingMessage) {
      editMsg(
        { messageId: editingMessage.id, content },
        {
          onSuccess: updated => {
            upsertMessage(updated);
          },
        },
      );
      setEditingMessage(null);
    } else {
      sendMsg(content);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setText('');
  };

  // Long-press action sheet
  const handleLongPress = (msg: MessageEntity) => {
    const isMine = msg.senderId === user?.id;
    if (msg.isDeleted || msg.isSystem) return;

    const actions: Array<{ text: string; onPress: () => void; style?: 'cancel' | 'destructive' }> = [];

    if (isMine) {
      actions.push({
        text: l.btnEdit,
        onPress: () => {
          setEditingMessage(msg);
          setText(msg.content);
        },
      });
      actions.push({
        text: l.btnDelete,
        style: 'destructive',
        onPress: async () => {
          const confirmed = await CustomAlert({
            message: l.warningDeleteMessage,
            confirmation: l.confirmation,
            btnCancel: l.btnCancel,
            btnConfirm: l.btnDelete,
          });
          if (confirmed) {
            deleteMsg(msg.id);
          }
        },
      });
    }

    actions.push({ text: l.btnCancel, style: 'cancel', onPress: () => {} });

    Alert.alert(l.messageActions, undefined, actions);
  };

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
            isMuted={isMuted}
            blockedByMe={blockedByMe}
            onMuteToggle={handleMuteToggle}
            onBlockToggle={handleBlockToggle}
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
            <Message
              width={messageWidth}
              message={item}
              onLongPress={() => handleLongPress(item)}
            />
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
          className="mt-2 gap-1"
        >
          {isBlocked && (
            <View
              className="rounded-xl px-4 py-2 items-center"
              style={{ backgroundColor: colors.base.grey.bright }}
            >
              <CustomText
                className="text-13 text-center"
                style={{ color: colors.theme.blue.bright }}
              >
                {blockedByMe ? l.blockedByMe : l.blockedByThem}
              </CustomText>
            </View>
          )}

          {editingMessage && !isBlocked && (
            <View
              className="flex-row items-center justify-between px-2 py-1 rounded-xl"
              style={{ backgroundColor: colors.base.orange.brightest }}
            >
              <View className="flex-1">
                <CustomText
                  className="text-12 font-bold"
                  style={{ color: colors.theme.blue.dark }}
                >
                  {l.editingMessage}
                </CustomText>
                <CustomText
                  className="text-12"
                  style={{ color: colors.theme.blue.bright }}
                  numberOfLines={1}
                >
                  {editingMessage.content}
                </CustomText>
              </View>
              <TouchableOpacity onPress={handleCancelEdit} className="ml-2 p-1">
                <CustomIcon
                  source={icons.cross}
                  size={16}
                  color={colors.theme.blue.dark}
                />
              </TouchableOpacity>
            </View>
          )}

          {!isBlocked && (
            <TypingBar
              onAddMedia={() => {}}
              onSend={handleSend}
              value={text}
              onChangeText={setText}
              placeholder={l.writeSomething}
            />
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}
