import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { formatNumber } from '@/lib/format';

export interface FilterOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface FilterTabsProps<T extends string> {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  /** Right-hand slot, e.g. "Showing 1–9 of 1,248". */
  trailing?: ReactNode;
  className?: string;
}

export function FilterTabs<T extends string>({
  options,
  value,
  onChange,
  label,
  trailing,
  className,
}: FilterTabsProps<T>) {
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-3', className)}>
      <div role="group" aria-label={label} className="flex flex-wrap gap-3">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                'inline-flex h-11 items-center gap-2 rounded-pill border px-5 text-base font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
                selected
                  ? 'border-brand bg-brand text-surface'
                  : 'border-line bg-surface text-ink-muted hover:bg-surface-muted',
              )}
            >
              {option.label}
              {option.count !== undefined && (
                <span className={cn('font-semibold', selected ? 'text-surface' : 'text-ink')}>
                  {formatNumber(option.count)}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {trailing}
    </div>
  );
}
