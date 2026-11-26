import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { queryKeys, type ListParams } from '@/lib/queryKeys';
import type { InvitationsResponse } from './types';

export function useInvitations(params: ListParams) {
  return useQuery({
    queryKey: queryKeys.invitations.list(params),
    queryFn: ({ signal }) =>
      apiClient<InvitationsResponse>('/invitations', {
        params: { ...params, status: params.status === 'all' ? undefined : params.status },
        signal,
      }),
    placeholderData: keepPreviousData,
  });
}
