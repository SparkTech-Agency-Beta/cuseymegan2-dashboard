import { Check, Clock, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable, type Column } from '@/components/data-table/DataTable';
import { ShowingRange, TablePagination } from '@/components/data-table/TablePagination';
import { PersonCell } from '@/components/shared/PersonCell';
import { StatCard } from '@/components/shared/StatCard';
import { UsageCell } from '@/components/shared/UsageCell';
import { FilterTabs, type FilterOption } from '@/components/ui/FilterTabs';
import { PlanTag } from '@/components/ui/PlanTag';
import { StatusPill } from '@/components/ui/StatusPill';
import { formatCurrency, formatDate, formatShortDate } from '@/lib/format';
import { useListParams } from '@/lib/useListParams';
import type { Family } from '@/types/domain';
import { useSubscriptions } from './api';
import { SUBSCRIPTION_FILTERS, type SubscriptionFilter } from './types';

const LABELS: Record<SubscriptionFilter, string> = {
  all: 'All',
  active: 'Active',
  expired: 'Expired',
  limit: 'Limit reached',
};

function renewsLabel(f: Family): string {
  const { expiredAt, renewsAt } = f.subscription;
  if (expiredAt) return `Expired ${formatShortDate(expiredAt)}`;
  return renewsAt ? formatDate(renewsAt) : '—';
}

const columns: Column<Family>[] = [
  {
    key: 'family',
    header: 'Family',
    width: 224,
    cell: (f) => <PersonCell name={f.parentName} secondary="Parent" avatarUrl={f.avatarUrl} />,
  },
  {
    key: 'plan',
    header: 'Plan',
    width: 170,
    cell: (f) => <PlanTag plan={f.subscription.planId} />,
  },
  {
    key: 'billing',
    header: 'Billing',
    width: 100,
    cell: (f) => <PlanTag>{f.subscription.billing === 'yearly' ? 'Yearly' : 'Monthly'}</PlanTag>,
  },
  { key: 'price', header: 'Price', width: 90, cell: (f) => formatCurrency(f.subscription.price) },
  {
    key: 'contacts',
    header: 'Contacts',
    width: 120,
    cell: (f) => (
      <UsageCell
        used={f.subscription.contactsUsed}
        limit={f.subscription.contactLimit}
        unlimitedLabel="∞"
      />
    ),
  },
  { key: 'renews', header: 'Renews', width: 130, cell: renewsLabel },
  {
    key: 'status',
    header: 'Status',
    width: 150,
    cell: (f) => <StatusPill status={f.subscription.status} />,
  },
];

export default function SubscriptionsPage() {
  const navigate = useNavigate();
  const { status, q, page, setStatus, setPage } = useListParams(SUBSCRIPTION_FILTERS);
  const { data, isLoading, error, refetch } = useSubscriptions({ status, q, page });
  const stats = data?.stats;

  // Spec: filter tabs on this screen have no counts.
  const options: FilterOption<SubscriptionFilter>[] = SUBSCRIPTION_FILTERS.map((value) => ({
    value,
    label: LABELS[value],
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard
          icon={Check}
          label="Active"
          value={stats?.active}
          caption={stats && `${stats.activePercent}% of families`}
          isLoading={isLoading}
        />
        <StatCard icon={Clock} label="Expired" value={stats?.expired} isLoading={isLoading} />
        <StatCard icon={Lock} label="At contact limit" value={stats?.limit} isLoading={isLoading} />
      </div>
      <FilterTabs
        label="Filter subscriptions by status"
        options={options}
        value={status}
        onChange={setStatus}
        trailing={
          data && <ShowingRange page={data.page} pageSize={data.pageSize} total={data.total} />
        }
      />
      <DataTable
        caption="Subscriptions"
        columns={columns}
        rows={data?.items}
        getRowId={(f) => f.id}
        onRowClick={(f) => navigate(`/families/${f.id}`)}
        isLoading={isLoading}
        error={error}
        onRetry={() => void refetch()}
        skeletonRows={7}
        emptyTitle="No subscriptions match your filters"
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
