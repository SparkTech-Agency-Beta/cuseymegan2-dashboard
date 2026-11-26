import { cn } from '@/lib/cn';

type Tone = 'brand' | 'danger' | 'immediate' | 'extended' | 'unlimited';

const FILL: Record<Tone, string> = {
  brand: 'bg-brand',
  danger: 'bg-danger',
  immediate: 'bg-plan-immediate',
  extended: 'bg-plan-extended',
  unlimited: 'bg-plan-unlimited',
};
const HEIGHT = { 8: 'h-2', 10: 'h-2.5', 12: 'h-3' } as const;

interface ProgressTrackProps {
  value: number;
  max: number;
  /** Track height in px: 8 (table), 10 (subscription card), 12 (plan distribution). */
  size?: keyof typeof HEIGHT;
  tone?: Tone;
  label?: string;
  className?: string;
}

export function ProgressTrack({
  value,
  max,
  size = 8,
  tone = 'brand',
  label,
  className,
}: ProgressTrackProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
      className={cn(
        'w-full overflow-hidden rounded-pill bg-surface-sunken',
        HEIGHT[size],
        className,
      )}
    >
      <div className={cn('h-full rounded-pill', FILL[tone])} style={{ width: `${percent}%` }} />
    </div>
  );
}
