import { NotificationPreferencesDto, UpdatePreferencesDto } from '@/services/api/services/dto/notification.dto';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { NotificationService } from '@/services/api/services/notificationService';

export const useUpdatePreferences = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdatePreferencesDto) => NotificationService.updatePreferences(dto),
    onSuccess: updated => {
      qc.setQueryData<NotificationPreferencesDto>(['notificationPreferences'], updated);
    },
  });
};
