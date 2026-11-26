import type { Invitation, Paginated } from '@/types/domain';

export type InvitationFilter = 'all' | 'pending' | 'accepted';
export const INVITATION_FILTERS: readonly InvitationFilter[] = ['all', 'pending', 'accepted'];

export type InvitationsResponse = Paginated<Invitation>;
