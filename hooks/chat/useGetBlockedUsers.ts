import { useQuery } from '@tanstack/react-query';

import { ChatService } from '@/services/api/services/chatService';

export const useGetBlockedUsers = () =>
  useQuery({
    queryKey: ['blockedUsers'],
    queryFn: () => ChatService.getBlockedUsers(),
  });
