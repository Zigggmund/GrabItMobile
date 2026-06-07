import { useQuery } from '@tanstack/react-query';

import { ChatService } from '@/services/api/services/chatService';

export const useGetChatUnreadCount = () =>
  useQuery<number>({
    queryKey: ['chatUnreadCount'],
    queryFn: () => ChatService.getUnreadCount(),
    staleTime: 0,
    refetchInterval: 30_000,
    refetchOnMount: true,
  });