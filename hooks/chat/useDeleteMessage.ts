import { useMutation } from '@tanstack/react-query';

import { ChatService } from '@/services/api/services/chatService';

export const useDeleteMessage = (conversationId: string) =>
  useMutation<void, Error, string>({
    mutationFn: (messageId: string) =>
      ChatService.deleteMessage(conversationId, messageId),
    // WS event will push the soft-deleted message (is_deleted: true) to both participants.
  });
