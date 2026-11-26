import { TriangleAlert } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { usePlans } from './api';
import { EditPlanModal } from './EditPlanModal';
import { PlanCard } from './PlanCard';

export default function PlansPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: plans, isLoading, error, refetch } = usePlans();

  const q = searchParams.get('q')?.trim().toLowerCase() ?? '';
  const editing = plans?.find((p) => p.id === searchParams.get('edit'));
  const visible = plans?.filter((p) => !q || p.name.toLowerCase().includes(q));

  function setEdit(id: string | null) {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (id) params.set('edit', id);
      else params.delete('edit');
      return params;
    });
  }

  if (error) {
    return (
      <Card>
        <EmptyState
          icon={TriangleAlert}
          title="Couldn't load plans"
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

  return (
    <>
      <div className="grid gap-5 md:grid-cols-3">
        {isLoading &&
          Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-[453px] rounded-card" />
          ))}
        {visible?.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onEdit={(p) => setEdit(p.id)} />
        ))}
      </div>
      {visible?.length === 0 && (
        <Card>
          <EmptyState title="No plans match your search" />
        </Card>
      )}
      {editing && <EditPlanModal key={editing.id} plan={editing} onClose={() => setEdit(null)} />}
    </>
  );
}
