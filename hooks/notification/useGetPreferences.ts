import { NotificationPreferencesDto } from '@/services/api/services/dto/notification.dto';

import { useQuery } from '@tanstack/react-query';

import { NotificationService } from '@/services/api/services/notificationService';

export const useGetPreferences = () =>
  useQuery<NotificationPreferencesDto>({
    queryKey: ['notificationPreferences'],
    queryFn: () => NotificationService.getPreferences(),
    staleTime: Infinity,
  });
