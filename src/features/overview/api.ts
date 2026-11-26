import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { queryKeys } from '@/lib/queryKeys';
import type { PlanId } from '@/types/domain';

export interface OverviewResponse {
  stats: {
    families: number;
    newFamiliesThisMonth: number;
    activeSubscriptions: number;
    activePercent: number;
    pendingInvitations: number;
  };
  newFamiliesByMonth: Array<{ month: string; count: number }>;
  planDistribution: Array<{ planId: PlanId; percent: number }>;
}

export function useOverview() {
  return useQuery({
    queryKey: queryKeys.overview,
    queryFn: ({ signal }) => apiClient<OverviewResponse>('/stats/overview', { signal }),
  });
}
