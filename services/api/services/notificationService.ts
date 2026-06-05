import { ApiResponse } from '@/services/api/apiResponse';
import { unwrap } from '@/services/api/apiUtils';
import { api } from '@/services/api/instance';
import {
  GetNotificationsResponseDto,
  MarkAsReadDto,
  NotificationPreferencesDto,
  UnreadCountDto,
  UpdatePreferencesDto,
} from '@/services/api/services/dto/notification.dto';

export class NotificationService {
  static async getNotifications(params: {
    page?: number;
    page_size?: number;
    filter?: 'all' | 'unread';
  }): Promise<GetNotificationsResponseDto> {
    return unwrap(
      await api.get<ApiResponse<GetNotificationsResponseDto>>('/notifications', { params }),
    );
  }

  static async getUnreadCount(): Promise<number> {
    const res = await unwrap(
      await api.get<ApiResponse<UnreadCountDto>>('/notifications/unread-count'),
    );
    return res.count;
  }

  static async markAllRead(): Promise<void> {
    await api.post('/notifications/mark-all-read');
  }

  static async markRead(ids: string[]): Promise<void> {
    const body: MarkAsReadDto = { notification_ids: ids };
    await api.post('/notifications/mark-read', body);
  }

  static async getPreferences(): Promise<NotificationPreferencesDto> {
    return unwrap(
      await api.get<ApiResponse<NotificationPreferencesDto>>('/notifications/preferences'),
    );
  }

  static async updatePreferences(dto: UpdatePreferencesDto): Promise<NotificationPreferencesDto> {
    return unwrap(
      await api.put<ApiResponse<NotificationPreferencesDto>>('/notifications/preferences', dto),
    );
  }
}
