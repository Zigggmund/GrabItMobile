import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ChatService } from '@/services/api/services/chatService';

export const useUnmuteConversation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) =>
      ChatService.unmuteConversation(conversationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};
