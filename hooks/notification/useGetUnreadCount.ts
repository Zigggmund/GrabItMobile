import { useQuery } from '@tanstack/react-query';

import { NotificationService } from '@/services/api/services/notificationService';

export const useGetUnreadCount = () =>
  useQuery<number>({
    queryKey: ['notificationsUnread'],
    queryFn: () => NotificationService.getUnreadCount(),
    staleTime: 0,
    refetchInterval: 10000,
    refetchOnMount: true,
  });
