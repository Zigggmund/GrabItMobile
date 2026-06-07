import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ChatService } from '@/services/api/services/chatService';

export const useBlockUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => ChatService.blockUser(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['conversations'] });
      qc.invalidateQueries({ queryKey: ['blockedUsers'] });
    },
  });
};
