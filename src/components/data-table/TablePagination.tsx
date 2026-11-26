import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatNumber } from '@/lib/format';

interface RangeProps {
  page: number;
  pageSize: number;
  total: number;
}

/** "Showing 1–9 of 1,248" — also used on the right of FilterTabs. */
export function ShowingRange({ page, pageSize, total }: RangeProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <p className="text-sm font-medium text-ink-muted">
      Showing {formatNumber(from)}–{formatNumber(to)} of {formatNumber(total)}
    </p>
  );
}

interface TablePaginationProps extends RangeProps {
  onPageChange: (page: number) => void;
}

export function TablePagination({ page, pageSize, total, onPageChange }: TablePaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-4">
      <ShowingRange page={page} pageSize={pageSize} total={total} />
      <div className="flex items-center gap-3">
        <span className="text-sm text-ink-muted">
          Page {formatNumber(page)} of {formatNumber(pageCount)}
        </span>
        <Button
          variant="secondary"
          size="md"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="size-5" aria-hidden />
        </Button>
        <Button
          variant="secondary"
          size="md"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="size-5" aria-hidden />
        </Button>
      </div>
    </nav>
  );
}
