import { BellOff, Check, TriangleAlert } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { FilterTabs, type FilterOption } from '@/components/ui/FilterTabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { useListParams } from '@/lib/useListParams';
import type { AdminNotification } from '@/types/domain';
import { useMarkAllRead, useMarkRead, useNotifications } from './api';
import { NotificationItem } from './NotificationItem';
import type { NotificationFilter } from './types';

const FILTERS: readonly NotificationFilter[] = ['all', 'unread'];

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { status: filter, setStatus } = useListParams(FILTERS);
  const { data, isLoading, error, refetch } = useNotifications(filter);
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const q = searchParams.get('q')?.trim().toLowerCase() ?? '';
  const items = data?.items.filter(
    (n) => !q || n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q),
  );

  const options: FilterOption<NotificationFilter>[] = [
    { value: 'all', label: 'All', count: data?.total },
    { value: 'unread', label: 'Unread', count: data?.unreadCount },
  ];

  function select(n: AdminNotification) {
    if (!n.read) markRead.mutate(n.id);
    if (n.familyId) navigate(`/families/${n.familyId}`);
  }

  if (error) {
    return (
      <Card>
        <EmptyState
          icon={TriangleAlert}
          title="Couldn't load notifications"
          description={error.message}
          action={
            <Button size="md" onClick={() => void refetch()}>
              Try again
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <FilterTabs
        label="Filter notifications"
        options={options}
        value={filter}
        onChange={setStatus}
        trailing={
          <Button
            variant="ghost"
            size="md"
            disabled={!data || data.unreadCount === 0}
            loading={markAllRead.isPending}
            leftIcon={<Check className="size-5" aria-hidden />}
            onClick={() => markAllRead.mutate()}
          >
            Mark all as read
          </Button>
        }
      />
      {isLoading && (
        <div className="flex flex-col gap-3" aria-busy="true">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-[84px] rounded-card" />
          ))}
        </div>
      )}
      {items && items.length > 0 && (
        <ul className="flex flex-col gap-3">
          {items.map((n) => (
            <NotificationItem key={n.id} notification={n} onSelect={select} />
          ))}
        </ul>
      )}
      {items?.length === 0 && (
        <Card>
          <EmptyState
            icon={BellOff}
            title={filter === 'unread' ? "You're all caught up" : 'No notifications'}
            description={filter === 'unread' ? 'There are no unread notifications.' : undefined}
          />
        </Card>
      )}
    </div>
  );
}
