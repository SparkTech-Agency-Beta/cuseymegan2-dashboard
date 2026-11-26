import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { PLAN_LABELS } from '@/lib/labels';
import type { PlanId } from '@/types/domain';

const TONES: Record<PlanId, string> = {
  immediate: 'bg-plan-immediate-soft text-plan-immediate',
  extended: 'bg-plan-extended-soft text-plan-extended',
  unlimited: 'bg-plan-unlimited-soft text-plan-unlimited',
};

type PlanTagProps =
  | { plan: PlanId; children?: never; className?: string }
  | { plan?: undefined; children: ReactNode; className?: string };

/** Plan pill. Without `plan` it renders a neutral pill (Yearly / Monthly / "Last 12 months"). */
export function PlanTag({ plan, children, className }: PlanTagProps) {
  return (
    <span
      className={cn(
        'inline-flex h-[30px] items-center whitespace-nowrap rounded-pill px-3 text-sm font-semibold',
        plan ? TONES[plan] : 'bg-surface-sunken text-ink-muted',
        className,
      )}
    >
      {plan ? PLAN_LABELS[plan] : children}
    </span>
  );
}
