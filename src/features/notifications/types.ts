import type { AdminNotification } from '@/types/domain';

export type NotificationFilter = 'all' | 'unread';

export interface NotificationsResponse {
  items: AdminNotification[];
  unreadCount: number;
  total: number;
}
