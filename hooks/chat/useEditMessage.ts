import { useMutation } from '@tanstack/react-query';

import { mapMessage } from '@/hooks/chat/mapChat';
import { ChatService } from '@/services/api/services/chatService';
import { MessageEntity } from '@/types/entities/ChatType';

interface EditMessageVars {
  messageId: string;
  content: string;
}

export const useEditMessage = (conversationId: string) =>
  useMutation<MessageEntity, Error, EditMessageVars>({
    mutationFn: async ({ messageId, content }) => {
      const dto = await ChatService.editMessage(conversationId, messageId, {
        content,
      });
      return mapMessage(dto);
    },
    // The WS event will push the updated message to both participants;
    // optimistic update happens in the screen via onSuccess callback.
  });
