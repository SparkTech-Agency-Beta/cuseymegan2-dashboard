import { Card } from '@/components/ui/Card';
import { PlanTag } from '@/components/ui/PlanTag';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';
import { formatNumber } from '@/lib/format';
import type { OverviewResponse } from './api';

const CHART_HEIGHT = 200;

interface NewFamiliesChartProps {
  data?: OverviewResponse['newFamiliesByMonth'];
}

/** Pure-Tailwind bar chart (spec allows this instead of Recharts). Latest month is highlighted. */
export function NewFamiliesChart({ data }: NewFamiliesChartProps) {
  const max = data ? Math.max(...data.map((d) => d.count)) : 0;

  return (
    <Card className="h-[304px] p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-[22px] font-bold leading-[27px] text-ink">New families</h2>
          <p className="text-sm text-ink-muted">Last 12 months</p>
        </div>
        <PlanTag>Last 12 months</PlanTag>
      </div>
      {!data ? (
        <Skeleton className="h-[200px] w-full" />
      ) : (
        <ul className="flex items-end justify-between gap-2" style={{ height: CHART_HEIGHT + 28 }}>
          {data.map((d, i) => {
            const latest = i === data.length - 1;
            return (
              <li key={d.month} className="group relative flex flex-col items-center gap-2">
                <span
                  role="tooltip"
                  className="pointer-events-none absolute bottom-full mb-1 hidden whitespace-nowrap rounded-input bg-ink px-2 py-1 text-xs font-semibold text-surface group-focus-within:block group-hover:block"
                >
                  {formatNumber(d.count)}
                </span>
                <div
                  tabIndex={0}
                  role="img"
                  aria-label={`${d.month}: ${formatNumber(d.count)} new families`}
                  className={cn(
                    'w-[30px] rounded-input transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                    latest ? 'bg-brand' : 'bg-brand/30 group-hover:bg-brand/60',
                  )}
                  style={{ height: Math.max(8, (d.count / max) * CHART_HEIGHT) }}
                />
                <span
                  className={cn('text-xs', latest ? 'font-semibold text-ink' : 'text-ink-muted')}
                >
                  {d.month}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
