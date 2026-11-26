import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { queryKeys, type ListParams } from '@/lib/queryKeys';
import type { SubscriptionsResponse } from './types';

export function useSubscriptions(params: ListParams) {
  return useQuery({
    queryKey: queryKeys.subscriptions.list(params),
    queryFn: ({ signal }) =>
      apiClient<SubscriptionsResponse>('/subscriptions', {
        params: { ...params, status: params.status === 'all' ? undefined : params.status },
        signal,
      }),
    placeholderData: keepPreviousData,
  });
}
