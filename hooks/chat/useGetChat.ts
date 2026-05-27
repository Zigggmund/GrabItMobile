import { ChatType } from '@/types/entities/ChatType';

import { useQuery } from '@tanstack/react-query';

import { ChatService } from '@/services/api/services/chatService';

// получение чата по id
export const useGetChat = (chatId: number | string) => {
  return useQuery<ChatType>({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      const res = await ChatService.getChat(chatId);
      return res.data;
    },
  });
};
