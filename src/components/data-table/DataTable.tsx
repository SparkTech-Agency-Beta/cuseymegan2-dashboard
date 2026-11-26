import type { KeyboardEvent, ReactNode } from 'react';
import { SearchX, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';

export interface Column<T> {
  key: string;
  header: string;
  /** Pixel width from Figma, used proportionally. */
  width: number;
  cell: (row: T) => ReactNode;
  /** Visually hide the header text (e.g. the chevron column). */
  srOnlyHeader?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[] | undefined;
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  skeletonRows?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  caption: string;
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  onRowClick,
  isLoading,
  error,
  onRetry,
  skeletonRows = 6,
  emptyTitle = 'Nothing to show',
  emptyDescription,
  caption,
}: DataTableProps<T>) {
  const minWidth = columns.reduce((sum, c) => sum + c.width, 0);

  if (error) {
    return (
      <Card>
        <EmptyState
          icon={TriangleAlert}
          title="Something went wrong"
          description={error.message}
          action={
            onRetry && (
              <Button size="md" onClick={onRetry}>
                Try again
              </Button>
            )
          }
        />
      </Card>
    );
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, row: T) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onRowClick?.(row);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-left" style={{ minWidth }}>
          <caption className="sr-only">{caption}</caption>
          <colgroup>
            {columns.map((c) => (
              <col key={c.key} style={{ width: `${(c.width / minWidth) * 100}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr className="h-11 bg-surface-muted">
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className="px-5 text-xs font-semibold uppercase tracking-wider text-ink-muted"
                >
                  <span className={cn(c.srOnlyHeader && 'sr-only')}>{c.header}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: skeletonRows }, (_, i) => (
                <tr key={i} className="h-[68px] border-t border-line">
                  {columns.map((c) => (
                    <td key={c.key} className="px-5">
                      <Skeleton className="h-5 w-3/4" />
                    </td>
                  ))}
                </tr>
              ))}
            {!isLoading &&
              rows?.map((row) => (
                <tr
                  key={getRowId(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={onRowClick ? (e) => onKeyDown(e, row) : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  className={cn(
                    'h-[68px] border-t border-line',
                    onRowClick &&
                      'cursor-pointer hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand',
                  )}
                >
                  {columns.map((c) => (
                    <td key={c.key} className={cn('px-5 text-base text-ink', c.className)}>
                      {c.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {!isLoading && rows?.length === 0 && (
        <EmptyState icon={SearchX} title={emptyTitle} description={emptyDescription} />
      )}
    </Card>
  );
}
