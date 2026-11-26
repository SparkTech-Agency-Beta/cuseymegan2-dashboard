import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { queryKeys } from '@/lib/queryKeys';
import type { NotificationFilter, NotificationsResponse } from './types';

export function fetchNotifications(filter: NotificationFilter): Promise<NotificationsResponse> {
  return apiClient<NotificationsResponse>('/notifications', { params: { filter } });
}

export function useNotifications(filter: NotificationFilter = 'all') {
  return useQuery({
    queryKey: queryKeys.notifications.list(filter),
    queryFn: () => fetchNotifications(filter),
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient(`/notifications/${id}/read`, { method: 'PATCH' }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient('/notifications/read-all', { method: 'POST' }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  });
}

/** Live unread count for the sidebar badge and the top-bar bell dot. */
export function useUnreadCount(): number {
  const { data } = useNotifications('all');
  return data?.unreadCount ?? 0;
}
