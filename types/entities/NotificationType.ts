export interface NotificationType {
  id: string;
  eventType: string;
  title: string;
  body: string;
  data: Record<string, string> | null;
  isRead: boolean;
  createdAt: string;
}
