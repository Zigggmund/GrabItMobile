import { ChatType } from '@/types/entities/ChatType';

import { useQuery } from '@tanstack/react-query';

import { ChatService } from '@/services/api/services/chatService';

// получение чатов пользователя
export const useGetUserChats = (userId: number | string) => {
  return useQuery<ChatType[]>({
    queryKey: ['userChats', userId],
    queryFn: async () => {
      const res = await ChatService.getUserChats(userId);
      return res.data;
    },
  });
};
