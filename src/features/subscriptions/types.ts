import type { Family, Paginated } from '@/types/domain';

export type SubscriptionFilter = 'all' | 'active' | 'expired' | 'limit';
export const SUBSCRIPTION_FILTERS: readonly SubscriptionFilter[] = [
  'all',
  'active',
  'expired',
  'limit',
];

export interface SubscriptionStats {
  active: number;
  expired: number;
  limit: number;
  activePercent: number;
}

export type SubscriptionsResponse = Paginated<Family> & { stats: SubscriptionStats };
