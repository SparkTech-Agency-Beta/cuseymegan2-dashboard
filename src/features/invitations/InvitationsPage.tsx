import { Link } from 'react-router-dom';
import { DataTable, type Column } from '@/components/data-table/DataTable';
import { ShowingRange, TablePagination } from '@/components/data-table/TablePagination';
import { PersonCell } from '@/components/shared/PersonCell';
import { FilterTabs, type FilterOption } from '@/components/ui/FilterTabs';
import { StatusPill } from '@/components/ui/StatusPill';
import { formatDate } from '@/lib/format';
import { useListParams } from '@/lib/useListParams';
import type { Invitation } from '@/types/domain';
import { useInvitations } from './api';
import { INVITATION_FILTERS, type InvitationFilter } from './types';

const LABELS: Record<InvitationFilter, string> = {
  all: 'All',
  pending: 'Pending',
  accepted: 'Accepted',
};

const columns: Column<Invitation>[] = [
  {
    key: 'contact',
    header: 'Invited contact',
    width: 426,
    cell: (i) => <PersonCell name={i.contactName} secondary={i.phone} />,
  },
  { key: 'child', header: 'For child', width: 120, cell: (i) => i.childName },
  {
    key: 'by',
    header: 'Invited by',
    width: 180,
    cell: (i) => (
      <Link
        to={`/families/${i.invitedBy.familyId}`}
        className="font-medium text-brand hover:text-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {i.invitedBy.name}
      </Link>
    ),
  },
  { key: 'sent', header: 'Sent', width: 140, cell: (i) => formatDate(i.sentAt) },
  { key: 'status', header: 'Status', width: 150, cell: (i) => <StatusPill status={i.status} /> },
];

export default function InvitationsPage() {
  const { status, q, page, setStatus, setPage } = useListParams(INVITATION_FILTERS);
  const { data, isLoading, error, refetch } = useInvitations({ status, q, page });

  const options: FilterOption<InvitationFilter>[] = INVITATION_FILTERS.map((value) => ({
    value,
    label: LABELS[value],
    count: data?.counts?.[value],
  }));

  return (
    <div className="flex flex-col gap-6">
      <FilterTabs
        label="Filter invitations by status"
        options={options}
        value={status}
        onChange={setStatus}
        trailing={
          data && <ShowingRange page={data.page} pageSize={data.pageSize} total={data.total} />
        }
      />
      <DataTable
        caption="Invitations"
        columns={columns}
        rows={data?.items}
        getRowId={(i) => i.id}
        isLoading={isLoading}
        error={error}
        onRetry={() => void refetch()}
        skeletonRows={8}
        emptyTitle="No invitations match your filters"
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
