import { CreditCard, Mail, TriangleAlert, Users } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { useOverview } from './api';
import { NewFamiliesChart } from './NewFamiliesChart';
import { PlanDistribution } from './PlanDistribution';
import { RecentFamilies } from './RecentFamilies';

export default function OverviewPage() {
  const { data, isLoading, error, refetch } = useOverview();

  if (error) {
    return (
      <Card>
        <EmptyState
          icon={TriangleAlert}
          title="Couldn't load the overview"
          description={error.message}
          action={
            <Button size="md" onClick={() => void refetch()}>
              Try again
            </Button>
          }
        />
      </Card>
    );
  }

  const stats = data?.stats;
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard
          icon={Users}
          label="Families"
          value={stats?.families}
          caption={stats && `+${stats.newFamiliesThisMonth} this month`}
          isLoading={isLoading}
        />
        <StatCard
          icon={CreditCard}
          label="Active subscriptions"
          value={stats?.activeSubscriptions}
          caption={stats && `${stats.activePercent}% of families`}
          isLoading={isLoading}
        />
        <StatCard
          icon={Mail}
          label="Pending invitations"
          value={stats?.pendingInvitations}
          isLoading={isLoading}
        />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <NewFamiliesChart data={data?.newFamiliesByMonth} />
        <PlanDistribution data={data?.planDistribution} />
      </div>
      <RecentFamilies />
    </div>
  );
}
