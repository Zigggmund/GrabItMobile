import { useMutation, useQueryClient } from '@tanstack/react-query';

import { mapConversation } from '@/hooks/chat/mapChat';
import { ChatService } from '@/services/api/services/chatService';
import { ConversationEntity } from '@/types/entities/ChatType';

export const useCreateConversation = () => {
  const qc = useQueryClient();
  return useMutation<ConversationEntity, Error, string>({
    mutationFn: async (listingId: string) => {
      const dto = await ChatService.createConversation({ listing_id: listingId });
      return mapConversation(dto);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};