import { cn } from '@/lib/cn';

/** Round count badge (e.g. "5" on the Notifications nav item). Renders nothing for 0. */
export function Badge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null;
  return (
    <span
      aria-label={`${count} unread`}
      className={cn(
        'inline-flex size-6 items-center justify-center rounded-pill bg-brand text-xs font-semibold text-surface',
        className,
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
