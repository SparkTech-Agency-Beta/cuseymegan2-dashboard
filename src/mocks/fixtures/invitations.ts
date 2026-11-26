import type { Invitation, InvitationStatus } from '@/types/domain';
import { CONTACT_NAMES, families } from './families';
import { createRng, isoDate, isoDaysFrom } from './rng';

/** Totals from the spec: 1,644 invitations = 214 pending + 1,430 accepted. */
export const INVITATION_TOTAL = 1644;
const PENDING_TOTAL = 214;

const byParent = (name: string) => families.find((f) => f.parentName === name)!;

// ASSUMPTION: only "Aunt Sarah" is named with a phone/child in the spec; the rest are invented
// from the listed contact names. Phones and dates are placeholders.
const named: Array<{
  contactName: string;
  phone: string;
  childName: string;
  parent: string;
  sent: string;
  status: InvitationStatus;
}> = [
  {
    contactName: 'Aunt Sarah',
    phone: '(555) 310-2284',
    childName: 'Noah',
    parent: 'James Carter',
    sent: '2026-11-20',
    status: 'pending',
  },
  {
    contactName: 'Uncle Raj',
    phone: '(555) 427-5519',
    childName: 'Noah',
    parent: 'James Carter',
    sent: '2026-11-18',
    status: 'pending',
  },
  {
    contactName: 'Cousin Emma',
    phone: '(555) 538-7746',
    childName: 'Mia',
    parent: 'Emily Chen',
    sent: '2026-11-15',
    status: 'pending',
  },
  {
    contactName: 'Grandma Rose',
    phone: '(555) 649-1032',
    childName: 'Leo',
    parent: 'Sarah Miller',
    sent: '2026-11-04',
    status: 'accepted',
  },
  {
    contactName: 'Grandpa Joe',
    phone: '(555) 751-8863',
    childName: 'Mia',
    parent: 'Sarah Miller',
    sent: '2026-11-03',
    status: 'accepted',
  },
  {
    contactName: 'Dad',
    phone: '(555) 862-3397',
    childName: 'Noah',
    parent: 'Daniel Brooks',
    sent: '2026-10-14',
    status: 'accepted',
  },
];

function build(): Invitation[] {
  const rng = createRng(1644);
  const items: Invitation[] = named.map((n, i) => {
    const family = byParent(n.parent);
    return {
      id: `inv-${i + 1}`,
      contactName: n.contactName,
      phone: n.phone,
      childName: n.childName,
      invitedBy: { familyId: family.id, name: family.parentName },
      sentAt: isoDate(n.sent),
      status: n.status,
    };
  });

  const namedPending = named.filter((n) => n.status === 'pending').length;
  const remaining = INVITATION_TOTAL - named.length;
  const statuses = rng.shuffle<InvitationStatus>([
    ...Array<InvitationStatus>(PENDING_TOTAL - namedPending).fill('pending'),
    ...Array<InvitationStatus>(remaining - (PENDING_TOTAL - namedPending)).fill('accepted'),
  ]);

  statuses.forEach((status, i) => {
    const family = rng.pick(families);
    items.push({
      id: `inv-${named.length + i + 1}`,
      contactName: rng.pick(CONTACT_NAMES),
      phone: `(555) ${rng.int(200, 999)}-${rng.int(1000, 9999)}`,
      childName: family.children[0]?.name ?? 'Leo',
      invitedBy: { familyId: family.id, name: family.parentName },
      sentAt: isoDaysFrom('2026-11-12', -Math.floor(i * 0.6) - 1),
      status,
    });
  });
  return items.sort((a, b) => b.sentAt.localeCompare(a.sentAt));
}

export const invitations: Invitation[] = build();
