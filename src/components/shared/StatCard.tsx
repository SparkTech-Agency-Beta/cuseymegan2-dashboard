import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatNumber } from '@/lib/format';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value?: number;
  caption?: string;
  isLoading?: boolean;
}

export function StatCard({ icon: Icon, label, value, caption, isLoading }: StatCardProps) {
  return (
    <Card className="flex h-[118px] items-center gap-4 px-6">
      <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-input bg-brand-soft text-brand">
        <Icon className="size-[26px]" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-[15px] text-ink-muted">{label}</p>
        {isLoading || value === undefined ? (
          <Skeleton className="mt-1 h-9 w-24" />
        ) : (
          <p className="text-[34px] font-bold leading-[41px] text-ink">{formatNumber(value)}</p>
        )}
        {caption && <p className="text-sm font-medium text-success">{caption}</p>}
      </div>
    </Card>
  );
}
