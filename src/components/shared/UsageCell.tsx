import { ProgressTrack } from '@/components/ui/ProgressTrack';

interface UsageCellProps {
  used: number;
  /** null = unlimited plan */
  limit: number | null;
  /** Families page prints "9 · unlimited", Subscriptions prints "9 · ∞". */
  unlimitedLabel?: string;
}

export function UsageCell({ used, limit, unlimitedLabel = 'unlimited' }: UsageCellProps) {
  if (limit === null) {
    return <span className="text-base font-medium text-ink">{`${used} · ${unlimitedLabel}`}</span>;
  }
  return (
    <div className="w-[90px]">
      <p className="mb-1.5 text-base font-medium text-ink">
        {used} / {limit}
      </p>
      <ProgressTrack
        value={used}
        max={limit}
        size={8}
        tone={used === limit ? 'danger' : 'brand'}
        label={`${used} of ${limit} contacts used`}
      />
    </div>
  );
}
