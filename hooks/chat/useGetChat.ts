import { ChatType } from '@/types/ChatType';

import { useQuery } from '@tanstack/react-query';

import { ChatService } from '@/services/api/services/chatService';

// получение чата по id
export const useGetChat = (chatId: number | string) => {
  return useQuery<ChatType>({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      const { data } = await ChatService.getChat(chatId);
      return data;
    },
  });
};
