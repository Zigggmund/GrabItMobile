import { useQuery } from '@tanstack/react-query';

import { mapConversation } from '@/hooks/chat/mapChat';
import { ChatService } from '@/services/api/services/chatService';
import { ConversationEntity } from '@/types/entities/ChatType';

export const useGetConversations = (page = 1, pageSize = 20) =>
  useQuery<{ items: ConversationEntity[]; hasMore: boolean }>({
    queryKey: ['conversations', page, pageSize],
    queryFn: async () => {
      const res = await ChatService.getConversations({
        page,
        page_size: pageSize,
      });
      return {
        items: res.items.map(mapConversation),
        hasMore: res.has_more,
      };
    },
    staleTime: 0,
  });
