import { useMutation } from '@tanstack/react-query';

import { MediaService } from '@/services/api/services/mediaService';

export const useUploadAvatar = () => {
  return useMutation({
    mutationFn: (fileUri: string) => MediaService.uploadAvatar(fileUri),
    // Ошибки обрабатываются локально в AvatarUploadModal
    meta: { suppressGlobalError: true },
  });
};
