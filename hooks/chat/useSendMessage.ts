import { useMutation } from '@tanstack/react-query';

import { ChatService } from '@/services/api/services/chatService';

export const useSendMessage = (conversationId: string) =>
  useMutation({
    mutationFn: (content: string) =>
      ChatService.sendMessage(conversationId, { content }),
  });