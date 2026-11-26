import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { StatusPill } from '@/components/ui/StatusPill';
import { formatDate } from '@/lib/format';
import type { Family } from '@/types/domain';

export function ParentCard({ family }: { family: Family }) {
  const rows: Array<[string, string]> = [
    ['Children', String(family.children.length)],
    ['Joined', formatDate(family.joinedAt)],
    ['Parent passcode', family.hasPasscode ? 'Set' : 'Not set'],
  ];
  return (
    <Card className="flex flex-col items-center p-6">
      <Avatar name={family.parentName} src={family.avatarUrl} size={96} />
      <h2 className="mt-4 text-[24px] font-bold leading-[30px] text-ink">{family.parentName}</h2>
      <p className="mb-3 text-base text-ink-muted">{family.phone}</p>
      <StatusPill status={family.subscription.status} />
      <dl className="mt-6 w-full">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex h-[46px] items-center justify-between border-t border-line"
          >
            <dt className="text-base text-ink-muted">{label}</dt>
            <dd className="text-base font-semibold text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
