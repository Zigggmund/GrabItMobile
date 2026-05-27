import { useMutation } from '@tanstack/react-query';

import { MediaDeleteDTO } from '@/services/api/services/dto/media.dto';
import { MediaService } from '@/services/api/services/mediaService';

export const useDeleteMedia = () => {
  return useMutation({
    mutationFn: async ({ id, mediaId }: MediaDeleteDTO) => {
      return await MediaService.deleteMedia(id, mediaId);
    },
  })
}