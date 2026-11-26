export type PlanId = 'immediate' | 'extended' | 'unlimited';
export type BillingCycle = 'monthly' | 'yearly';
export type FamilyStatus = 'active' | 'expired' | 'limit';
export type InvitationStatus = 'pending' | 'accepted';
export type ContactStatus = 'connected' | 'pending';

export interface Plan {
  id: PlanId;
  name: string;
  contactLimit: number | null; // null = unlimited
  monthlyPrice: number;
  yearlyPrice: number;
  isLive: boolean;
}
export interface Child {
  id: string;
  name: string;
  avatarUrl?: string;
  approvedContacts: number;
}
export interface Contact {
  id: string;
  name: string;
  phone: string;
  childId: string;
  childName: string;
  status: ContactStatus;
  addedAt: string;
}
export interface Family {
  id: string;
  parentName: string;
  phone: string;
  avatarUrl?: string;
  joinedAt: string;
  hasPasscode: boolean;
  children: Child[];
  contacts: Contact[];
  subscription: Subscription;
}
export interface Subscription {
  planId: PlanId;
  billing: BillingCycle;
  price: number;
  contactsUsed: number;
  contactLimit: number | null;
  renewsAt: string | null;
  expiredAt: string | null;
  status: FamilyStatus;
}
export interface Invitation {
  id: string;
  contactName: string;
  phone: string;
  childName: string;
  invitedBy: { familyId: string; name: string };
  sentAt: string;
  status: InvitationStatus;
}
export type NotificationType =
  'family_joined' | 'limit_reached' | 'subscription_expired' | 'plan_upgraded';
export interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  familyId?: string;
}
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  counts?: Record<string, number>;
}
