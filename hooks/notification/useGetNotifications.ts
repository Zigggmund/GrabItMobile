import { NotificationType } from '@/types/entities/NotificationType';

import { useQuery } from '@tanstack/react-query';

import { PAGE_SIZE } from '@/constants/sizes';
import { NotificationService } from '@/services/api/services/notificationService';

export const useGetNotifications = (filter: 'all' | 'unread' = 'all', page = 1) =>
  useQuery<{ items: NotificationType[]; total: number }>({
    queryKey: ['notifications', filter, page],
    queryFn: async () => {
      const res = await NotificationService.getNotifications({ filter, page, page_size: PAGE_SIZE });
      return {
        items: res.items.map(dto => ({
          id: dto.id,
          eventType: dto.event_type,
          title: dto.title,
          body: dto.body,
          data: dto.data,
          isRead: dto.is_read,
          createdAt: dto.created_at,
        })),
        total: res.total,
      };
    },
    staleTime: 0,
    refetchInterval: 10000,
  });
