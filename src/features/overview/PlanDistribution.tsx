import { Card } from '@/components/ui/Card';
import { ProgressTrack } from '@/components/ui/ProgressTrack';
import { Skeleton } from '@/components/ui/Skeleton';
import { PLAN_LABELS } from '@/lib/labels';
import type { OverviewResponse } from './api';

export function PlanDistribution({ data }: { data?: OverviewResponse['planDistribution'] }) {
  return (
    <Card className="h-[304px] p-6">
      <h2 className="mb-6 text-[22px] font-bold leading-[27px] text-ink">Plan distribution</h2>
      <div className="flex flex-col gap-6">
        {!data
          ? Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-10 w-full" />)
          : data.map((row) => (
              <div key={row.planId}>
                <div className="mb-2 flex items-center justify-between text-base">
                  <span className="font-medium text-ink">{PLAN_LABELS[row.planId]}</span>
                  <span className="font-semibold text-ink">{row.percent}%</span>
                </div>
                <ProgressTrack
                  size={12}
                  value={row.percent}
                  max={100}
                  tone={row.planId}
                  label={`${PLAN_LABELS[row.planId]} ${row.percent}%`}
                />
              </div>
            ))}
      </div>
    </Card>
  );
}
