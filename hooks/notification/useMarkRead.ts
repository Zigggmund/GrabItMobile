import { useMutation, useQueryClient } from '@tanstack/react-query';

import { NotificationService } from '@/services/api/services/notificationService';

export const useMarkRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => NotificationService.markRead(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['notificationsUnread'] });
    },
  });
};