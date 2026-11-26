import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ApiError, apiClient } from '@/lib/apiClient';
import { queryKeys, type ListParams } from '@/lib/queryKeys';
import type { Family } from '@/types/domain';
import type { FamiliesResponse } from './types';

export function useFamilies(params: ListParams) {
  return useQuery({
    queryKey: queryKeys.families.list(params),
    queryFn: ({ signal }) =>
      apiClient<FamiliesResponse>('/families', {
        params: { ...params, status: params.status === 'all' ? undefined : params.status },
        signal,
      }),
    placeholderData: keepPreviousData,
  });
}

export function useFamily(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.families.detail(id ?? ''),
    queryFn: ({ signal }) => apiClient<Family>(`/families/${id}`, { signal }),
    enabled: !!id,
    retry: (count, error) => !(error instanceof ApiError && error.status === 404) && count < 1,
  });
}
