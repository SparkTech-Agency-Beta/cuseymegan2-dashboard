import { Avatar } from '@/components/ui/Avatar';

interface PersonCellProps {
  name: string;
  secondary?: string;
  avatarUrl?: string;
}

export function PersonCell({ name, secondary, avatarUrl }: PersonCellProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={name} src={avatarUrl} size={42} />
      <div className="min-w-0">
        <p className="truncate text-base font-semibold text-ink">{name}</p>
        {secondary && <p className="truncate text-sm text-ink-muted">{secondary}</p>}
      </div>
    </div>
  );
}
