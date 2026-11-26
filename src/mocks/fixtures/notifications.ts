import type { AdminNotification } from '@/types/domain';
import { families } from './families';

const fam = (name: string) => families.find((f) => f.parentName === name)!.id;
const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

/**
 * 12 notifications, 5 unread (spec: "All 12 · Unread 5").
 * ASSUMPTION: the spec truncates message text ("Sarah Miller created a family…"); the endings
 * below are invented and must be replaced with the exact Figma copy.
 */
export const notifications: AdminNotification[] = [
  {
    id: 'n1',
    type: 'family_joined',
    title: 'New family joined',
    message: 'Sarah Miller created a family and added 2 children.',
    createdAt: ago(2),
    read: false,
    familyId: fam('Sarah Miller'),
  },
  {
    id: 'n2',
    type: 'limit_reached',
    title: 'Contact limit reached',
    message: 'Tom Walker reached the 2-contact limit on the Immediate Family plan.',
    createdAt: ago(60),
    read: false,
    familyId: fam('Tom Walker'),
  },
  {
    id: 'n3',
    type: 'subscription_expired',
    title: 'Subscription expired',
    message: "Omar Hassan's Immediate Family plan expired on Oct 28.",
    createdAt: ago(3 * 60),
    read: false,
    familyId: fam('Omar Hassan'),
  },
  {
    id: 'n4',
    type: 'plan_upgraded',
    title: 'Plan upgraded',
    message: 'Priya Nair upgraded to Unlimited (yearly).',
    createdAt: ago(5 * 60),
    read: false,
    familyId: fam('Priya Nair'),
  },
  {
    id: 'n5',
    type: 'family_joined',
    title: 'New family joined',
    message: 'James Carter created a family and added 1 child.',
    createdAt: ago(8 * 60),
    read: false,
    familyId: fam('James Carter'),
  },
  {
    id: 'n6',
    type: 'family_joined',
    title: 'New family joined',
    message: 'Emily Chen created a family and added 2 children.',
    createdAt: ago(26 * 60),
    read: true,
    familyId: fam('Emily Chen'),
  },
  {
    id: 'n7',
    type: 'limit_reached',
    title: 'Contact limit reached',
    message: 'Sarah Miller reached the 2-contact limit on the Immediate Family plan.',
    createdAt: ago(30 * 60),
    read: true,
    familyId: fam('Sarah Miller'),
  },
  {
    id: 'n8',
    type: 'plan_upgraded',
    title: 'Plan upgraded',
    message: 'Maria Lopez upgraded to Extended Family (yearly).',
    createdAt: ago(2 * 24 * 60),
    read: true,
    familyId: fam('Maria Lopez'),
  },
  {
    id: 'n9',
    type: 'family_joined',
    title: 'New family joined',
    message: 'Daniel Brooks created a family and added 1 child.',
    createdAt: ago(3 * 24 * 60),
    read: true,
    familyId: fam('Daniel Brooks'),
  },
  {
    id: 'n10',
    type: 'subscription_expired',
    title: 'Subscription expired',
    message: "Omar Hassan's Immediate Family plan renewal failed.",
    createdAt: ago(4 * 24 * 60),
    read: true,
    familyId: fam('Omar Hassan'),
  },
  {
    id: 'n11',
    type: 'plan_upgraded',
    title: 'Plan upgraded',
    message: 'Emily Chen upgraded to Extended Family (monthly).',
    createdAt: ago(5 * 24 * 60),
    read: true,
    familyId: fam('Emily Chen'),
  },
  {
    id: 'n12',
    type: 'family_joined',
    title: 'New family joined',
    message: 'Tom Walker created a family and added 2 children.',
    createdAt: ago(6 * 24 * 60),
    read: true,
    familyId: fam('Tom Walker'),
  },
];
