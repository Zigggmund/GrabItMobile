export interface NotificationItemDto {
  id: string;
  event_type: string;
  title: string;
  body: string;
  data: Record<string, string> | null;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

export interface GetNotificationsResponseDto {
  items: NotificationItemDto[];
  total: number;
}

export interface NotificationPreferencesDto {
  email_enabled: boolean;
  mobile_push_enabled: boolean;
  browser_push_enabled: boolean;
  inbox_enabled: boolean;
}

export interface UpdatePreferencesDto {
  email_enabled?: boolean;
  mobile_push_enabled?: boolean;
  browser_push_enabled?: boolean;
  inbox_enabled?: boolean;
}

export interface MarkAsReadDto {
  notification_ids: string[];
}

export interface UnreadCountDto {
  count: number;
}

export interface RegisterDeviceTokenDto {
  token: string;
  platform: 'android' | 'ios';
}