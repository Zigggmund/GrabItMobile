import { ChatType } from '@/types/ChatType';

import { useQuery } from '@tanstack/react-query';

import { ChatService } from '@/services/api/services/chatService';

// получение чатов пользователя
export const useGetUserChats = (userId: number | string) => {
  return useQuery<ChatType[]>({
    queryKey: ['userChats', userId],
    queryFn: async () => {
      const { data } = await ChatService.getUserChats(userId);
      return data;
    },
  });
};
