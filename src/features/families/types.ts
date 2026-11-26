import type { Family, Paginated } from '@/types/domain';

export type FamilyFilter = 'all' | 'active' | 'expired' | 'limit';
export const FAMILY_FILTERS: readonly FamilyFilter[] = ['all', 'active', 'expired', 'limit'];

export type FamiliesResponse = Paginated<Family>;
