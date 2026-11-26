import { Check, Clock, Lock, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export type Status = 'active' | 'expired' | 'limit' | 'pending' | 'accepted' | 'connected' | 'live';

const CONFIG: Record<Status, { icon: LucideIcon; label: string; tone: string }> = {
  active: { icon: Check, label: 'Active', tone: 'bg-success-soft text-success' },
  accepted: { icon: Check, label: 'Accepted', tone: 'bg-success-soft text-success' },
  connected: { icon: Check, label: 'Connected', tone: 'bg-success-soft text-success' },
  live: { icon: Check, label: 'Live', tone: 'bg-success-soft text-success' },
  pending: { icon: Clock, label: 'Pending', tone: 'bg-warning-soft text-warning' },
  expired: { icon: Clock, label: 'Expired', tone: 'bg-danger-soft text-danger' },
  limit: { icon: Lock, label: 'Limit reached', tone: 'bg-danger-soft text-danger' },
};

/** Always icon + text so colour is never the only signal. */
export function StatusPill({ status, className }: { status: Status; className?: string }) {
  const { icon: Icon, label, tone } = CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex h-[30px] items-center gap-1.5 whitespace-nowrap rounded-pill px-3 text-sm font-semibold',
        tone,
        className,
      )}
    >
      <Icon className="size-[14px]" aria-hidden />
      {label}
    </span>
  );
}
