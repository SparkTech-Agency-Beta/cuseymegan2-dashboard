import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/app/providers/toastContext';
import { apiClient } from '@/lib/apiClient';
import { queryKeys } from '@/lib/queryKeys';
import type { Plan, PlanId } from '@/types/domain';

export function usePlans() {
  return useQuery({
    queryKey: queryKeys.plans,
    queryFn: ({ signal }) => apiClient<Plan[]>('/plans', { signal }),
  });
}

export interface UpdatePlanInput {
  id: PlanId;
  contactLimit: number | null;
  monthlyPrice: number;
  yearlyPrice: number;
}

/** PATCH a plan with an optimistic update of the plan card; rolls back on error. */
export function useUpdatePlan() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, ...patch }: UpdatePlanInput) =>
      apiClient<Plan>(`/plans/${id}`, { method: 'PATCH', body: patch }),
    onMutate: async ({ id, ...patch }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.plans });
      const previous = queryClient.getQueryData<Plan[]>(queryKeys.plans);
      queryClient.setQueryData<Plan[]>(queryKeys.plans, (old) =>
        old?.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      );
      return { previous };
    },
    onError: (_error, _input, context) => {
      if (context?.previous) queryClient.setQueryData(queryKeys.plans, context.previous);
      toast("Couldn't save the plan. Your changes were reverted.", 'error');
    },
    onSuccess: () => toast('Plan updated'),
    onSettled: () => {
      // Plan limits/prices also show on Overview, Families and Subscriptions.
      void queryClient.invalidateQueries({ queryKey: queryKeys.plans });
      void queryClient.invalidateQueries({ queryKey: queryKeys.families.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.overview });
    },
  });
}
