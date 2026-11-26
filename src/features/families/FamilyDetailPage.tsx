import { ChevronLeft, UserX, TriangleAlert } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ApiError } from '@/lib/apiClient';
import { useFamily } from './api';
import { ChildrenSection } from './components/ChildrenSection';
import { ContactsSection } from './components/ContactsSection';
import { ParentCard } from './components/ParentCard';
import { SubscriptionCard } from './components/SubscriptionCard';

function BackLink() {
  return (
    <Link
      to="/families"
      className="mb-5 inline-flex items-center gap-1 rounded-input text-sm font-semibold text-brand hover:text-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <ChevronLeft className="size-4" aria-hidden />
      Families
    </Link>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]" aria-busy="true">
      <div className="flex flex-col gap-5">
        <Skeleton className="h-[423px] rounded-card" />
        <Skeleton className="h-[215px] rounded-card" />
      </div>
      <div className="flex flex-col gap-8">
        <Skeleton className="h-32 rounded-card" />
        <Skeleton className="h-72 rounded-card" />
      </div>
    </div>
  );
}

export default function FamilyDetailPage() {
  const { familyId } = useParams();
  const { data: family, isLoading, error, refetch } = useFamily(familyId);

  if (isLoading) {
    return (
      <>
        <BackLink />
        <DetailSkeleton />
      </>
    );
  }

  if (error || !family) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <>
        <BackLink />
        <EmptyState
          icon={notFound ? UserX : TriangleAlert}
          title={notFound ? 'Family not found' : 'Something went wrong'}
          description={
            notFound ? "This family doesn't exist or was removed." : (error?.message ?? undefined)
          }
          action={
            notFound ? (
              <Link to="/families" className="font-semibold text-brand hover:text-brand-strong">
                Back to families
              </Link>
            ) : (
              <Button size="md" onClick={() => void refetch()}>
                Try again
              </Button>
            )
          }
        />
      </>
    );
  }

  return (
    <>
      <BackLink />
      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <div className="flex flex-col gap-5">
          <ParentCard family={family} />
          <SubscriptionCard subscription={family.subscription} />
        </div>
        <div className="flex min-w-0 flex-col gap-8">
          <ChildrenSection items={family.children} />
          <ContactsSection contacts={family.contacts} />
        </div>
      </div>
    </>
  );
}
