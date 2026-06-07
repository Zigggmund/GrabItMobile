import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ChatService } from '@/services/api/services/chatService';

export const useMarkRead = (conversationId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (lastMessageId: string) =>
      ChatService.markRead(conversationId, { last_message_id: lastMessageId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['conversations'] });
      qc.invalidateQueries({ queryKey: ['chatUnreadCount'] });
    },
  });
};