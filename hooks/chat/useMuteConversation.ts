import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ChatService } from '@/services/api/services/chatService';

export const useMuteConversation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) =>
      ChatService.muteConversation(conversationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};
