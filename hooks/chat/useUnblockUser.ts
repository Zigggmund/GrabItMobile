import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ChatService } from '@/services/api/services/chatService';

export const useUnblockUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => ChatService.unblockUser(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['conversations'] });
      qc.invalidateQueries({ queryKey: ['blockedUsers'] });
    },
  });
};
