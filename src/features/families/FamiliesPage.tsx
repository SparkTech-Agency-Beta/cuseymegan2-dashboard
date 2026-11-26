import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable, type Column } from '@/components/data-table/DataTable';
import { ShowingRange, TablePagination } from '@/components/data-table/TablePagination';
import { PersonCell } from '@/components/shared/PersonCell';
import { UsageCell } from '@/components/shared/UsageCell';
import { FilterTabs, type FilterOption } from '@/components/ui/FilterTabs';
import { PlanTag } from '@/components/ui/PlanTag';
import { StatusPill } from '@/components/ui/StatusPill';
import { useListParams } from '@/lib/useListParams';
import type { Family } from '@/types/domain';
import { useFamilies } from './api';
import { FAMILY_FILTERS, type FamilyFilter } from './types';

const LABELS: Record<FamilyFilter, string> = {
  all: 'All',
  active: 'Active',
  expired: 'Expired',
  limit: 'Limit reached',
};

const columns: Column<Family>[] = [
  {
    key: 'parent',
    header: 'Parent',
    width: 416,
    cell: (f) => <PersonCell name={f.parentName} secondary={f.phone} avatarUrl={f.avatarUrl} />,
  },
  { key: 'children', header: 'Children', width: 100, cell: (f) => f.children.length },
  {
    key: 'contacts',
    header: 'Contacts used',
    width: 140,
    cell: (f) => (
      <UsageCell used={f.subscription.contactsUsed} limit={f.subscription.contactLimit} />
    ),
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
  {
    key: 'open',
    header: 'Open',
    srOnlyHeader: true,
    width: 24,
    cell: () => <ChevronRight className="size-5 text-ink-subtle" aria-hidden />,
  },
];

export default function FamiliesPage() {
  const navigate = useNavigate();
  const { status, q, page, setStatus, setPage } = useListParams(FAMILY_FILTERS);
  const { data, isLoading, error, refetch } = useFamilies({ status, q, page });

  const options: FilterOption<FamilyFilter>[] = FAMILY_FILTERS.map((value) => ({
    value,
    label: LABELS[value],
    count: data?.counts?.[value],
  }));

  return (
    <div className="flex flex-col gap-6">
      <FilterTabs
        label="Filter families by status"
        options={options}
        value={status}
        onChange={setStatus}
        trailing={
          data && <ShowingRange page={data.page} pageSize={data.pageSize} total={data.total} />
        }
      />
      <DataTable
        caption="Families"
        columns={columns}
        rows={data?.items}
        getRowId={(f) => f.id}
        onRowClick={(f) => navigate(`/families/${f.id}`)}
        isLoading={isLoading}
        error={error}
        onRetry={() => void refetch()}
        skeletonRows={9}
        emptyTitle="No families match your filters"
        emptyDescription="Try a different status or search term."
      />
      {data && data.total > 0 && (
        <TablePagination
          page={data.page}
          pageSize={data.pageSize}
          total={data.total}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
