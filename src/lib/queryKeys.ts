export interface ListParams {
  status?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export const queryKeys = {
  overview: ['overview'] as const,
  families: {
    all: ['families'] as const,
    list: (params: ListParams) => ['families', 'list', params] as const,
    detail: (id: string) => ['families', 'detail', id] as const,
  },
  invitations: {
    all: ['invitations'] as const,
    list: (params: ListParams) => ['invitations', 'list', params] as const,
  },
  subscriptions: {
    all: ['subscriptions'] as const,
    list: (params: ListParams) => ['subscriptions', 'list', params] as const,
  },
  plans: ['plans'] as const,
  notifications: {
    all: ['notifications'] as const,
    list: (filter: string) => ['notifications', 'list', filter] as const,
  },
};
