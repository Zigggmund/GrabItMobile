import { useQuery } from '@tanstack/react-query';

import { mapMessage } from '@/hooks/chat/mapChat';
import { GetMessagesParams } from '@/services/api/services/dto/chat.dto';
import { ChatService } from '@/services/api/services/chatService';
import { MessageEntity } from '@/types/entities/ChatType';

export const useGetMessages = (
  conversationId: string,
  params?: GetMessagesParams,
) =>
  useQuery<{ items: MessageEntity[]; hasMore: boolean }>({
    queryKey: ['messages', conversationId, params],
    queryFn: async () => {
      const res = await ChatService.getMessages(conversationId, params);
      // API returns DESC (newest first) → reverse to chronological order
      return {
        items: [...res.items].reverse().map(mapMessage),
        hasMore: res.has_more,
      };
    },
    enabled: !!conversationId,
  });