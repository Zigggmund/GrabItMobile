import { useMutation } from '@tanstack/react-query';

import { MediaUploadDTO } from '@/services/api/services/dto/media.dto';
import { MediaService } from '@/services/api/services/mediaService';

export const useUploadMedia = () => {
  return useMutation({
    mutationFn: async ({ id, file }: MediaUploadDTO) => {
      return await MediaService.uploadMedia(id, file);
    },
  });
};
