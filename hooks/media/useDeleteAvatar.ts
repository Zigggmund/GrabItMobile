import { useMutation } from '@tanstack/react-query';

import { MediaService } from '@/services/api/services/mediaService';

export const useDeleteAvatar = () => {
  return useMutation({
    mutationFn: async () => {
      return await MediaService.deleteAvatar();
    },
  });
};
