import { ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DataTable, type Column } from '@/components/data-table/DataTable';
import { PersonCell } from '@/components/shared/PersonCell';
import { PlanTag } from '@/components/ui/PlanTag';
import { StatusPill } from '@/components/ui/StatusPill';
import { useFamilies } from '@/features/families/api';
import { formatDate } from '@/lib/format';
import type { Family } from '@/types/domain';

const columns: Column<Family>[] = [
  {
    key: 'parent',
    header: 'Parent',
    width: 550,
    cell: (f) => <PersonCell name={f.parentName} secondary={f.phone} avatarUrl={f.avatarUrl} />,
  },
  {
    key: 'plan',
    header: 'Plan',
    width: 170,
    cell: (f) => <PlanTag plan={f.subscription.planId} />,
  },
  {
    key: 'status',
    header: 'Status',
    width: 150,
    cell: (f) => <StatusPill status={f.subscription.status} />,
  },
  { key: 'joined', header: 'Joined', width: 130, cell: (f) => formatDate(f.joinedAt) },
];

const PARAMS = { page: 1, pageSize: 4 };

export function RecentFamilies() {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useFamilies(PARAMS);

  return (
    <section aria-labelledby="recent-title">
      <div className="mb-4 flex items-center justify-between">
        <h2 id="recent-title" className="text-[24px] font-bold leading-[30px] text-ink">
          Recent families
        </h2>
        <Link
          to="/families"
          className="inline-flex items-center gap-1 rounded-input text-base font-semibold text-brand hover:text-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          View all
          <ChevronRight className="size-5" aria-hidden />
        </Link>
      </div>
      <DataTable
        caption="Recent families"
        columns={columns}
        rows={data?.items}
        getRowId={(f) => f.id}
        onRowClick={(f) => navigate(`/families/${f.id}`)}
        isLoading={isLoading}
        error={error}
        onRetry={() => void refetch()}
        skeletonRows={4}
        emptyTitle="No families yet"
      />
    </section>
  );
}
