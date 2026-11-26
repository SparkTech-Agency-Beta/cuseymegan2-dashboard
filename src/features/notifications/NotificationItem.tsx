import { CreditCard, Clock, Lock, Users, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { timeAgo } from '@/lib/format';
import type { AdminNotification, NotificationType } from '@/types/domain';

const ICONS: Record<NotificationType, LucideIcon> = {
  family_joined: Users,
  limit_reached: Lock,
  subscription_expired: Clock,
  plan_upgraded: CreditCard,
};

interface NotificationItemProps {
  notification: AdminNotification;
  onSelect: (notification: AdminNotification) => void;
}

export function NotificationItem({ notification: n, onSelect }: NotificationItemProps) {
  const Icon = ICONS[n.type];
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(n)}
        className={cn(
          'flex h-[84px] w-full items-center gap-4 rounded-card border border-line bg-surface px-5 text-left shadow-card transition-colors',
          'hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        )}
      >
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-input bg-brand-soft text-brand">
          <Icon className="size-6" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-base font-bold text-ink">{n.title}</span>
          <span className="block truncate text-sm text-ink-muted">{n.message}</span>
        </span>
        <span className="flex shrink-0 items-center gap-3">
          <span className="text-sm text-ink-muted">{timeAgo(n.createdAt)}</span>
          {!n.read ? (
            <span className="size-2.5 rounded-pill bg-brand">
              <span className="sr-only">Unread</span>
            </span>
          ) : (
            <span className="size-2.5" aria-hidden />
          )}
        </span>
      </button>
    </li>
  );
}
