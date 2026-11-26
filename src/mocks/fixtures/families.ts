import type {
  BillingCycle,
  Child,
  Contact,
  ContactStatus,
  Family,
  FamilyStatus,
  PlanId,
} from '@/types/domain';
import { plans } from './plans';
import { createRng, isoDate, isoDaysFrom } from './rng';

/**
 * ASSUMPTION: phone numbers, most dates and all generated rows are invented. Only the names,
 * plan prices, counts and dates listed in the spec are exact.
 * Totals: 1,248 families = 1,086 active + 98 expired + 64 limit reached.
 */
export const FAMILY_TOTAL = 1248;
const STATUS_TOTALS: Record<FamilyStatus, number> = { active: 1086, expired: 98, limit: 64 };

interface ContactSeed {
  name: string;
  phone?: string;
  status?: ContactStatus;
}
interface ChildSeed {
  name: string;
  contacts: ContactSeed[];
}
interface FamilySeed {
  parentName: string;
  phone: string;
  joined: string;
  passcode: boolean;
  plan: PlanId;
  billing: BillingCycle;
  status: FamilyStatus;
  renews: string | null;
  expired: string | null;
  children: ChildSeed[];
}

const planById = (id: PlanId) => plans.find((p) => p.id === id)!;

function buildFamily(id: string, seed: FamilySeed, rng: ReturnType<typeof createRng>): Family {
  const plan = planById(seed.plan);
  const children: Child[] = [];
  const contacts: Contact[] = [];
  seed.children.forEach((childSeed, ci) => {
    const childId = `${id}-c${ci + 1}`;
    children.push({
      id: childId,
      name: childSeed.name,
      approvedContacts: childSeed.contacts.length,
    });
    childSeed.contacts.forEach((c, i) => {
      contacts.push({
        id: `${childId}-k${i + 1}`,
        name: c.name,
        phone: c.phone ?? `(555) ${rng.int(200, 999)}-${rng.int(1000, 9999)}`,
        childId,
        childName: childSeed.name,
        status: c.status ?? 'connected',
        addedAt: isoDaysFrom(seed.joined, rng.int(0, 6)),
      });
    });
  });
  return {
    id,
    parentName: seed.parentName,
    phone: seed.phone,
    joinedAt: isoDate(seed.joined),
    hasPasscode: seed.passcode,
    children,
    contacts,
    subscription: {
      planId: seed.plan,
      billing: seed.billing,
      price: seed.billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice,
      contactsUsed: contacts.length,
      contactLimit: plan.contactLimit,
      renewsAt: seed.renews ? isoDate(seed.renews) : null,
      expiredAt: seed.expired ? isoDate(seed.expired) : null,
      status: seed.status,
    },
  };
}

// ASSUMPTION: which child owns which contact, and statuses/dates not stated in the spec.
const namedSeeds: FamilySeed[] = [
  {
    parentName: 'Sarah Miller',
    phone: '(555) 201-4417',
    joined: '2026-11-02',
    passcode: true,
    plan: 'immediate',
    billing: 'yearly',
    status: 'limit',
    renews: '2027-03-12',
    expired: null,
    children: [
      { name: 'Leo', contacts: [{ name: 'Grandma Rose' }] },
      { name: 'Mia', contacts: [{ name: 'Grandpa Joe' }] },
    ],
  },
  {
    parentName: 'James Carter',
    phone: '(555) 318-9052',
    joined: '2026-11-01',
    passcode: true,
    plan: 'extended',
    billing: 'yearly',
    status: 'active',
    renews: '2027-08-14',
    expired: null,
    children: [
      {
        name: 'Noah',
        contacts: [{ name: 'Aunt Sarah' }, { name: 'Uncle Raj', status: 'pending' }],
      },
    ],
  },
  {
    parentName: 'Priya Nair',
    phone: '(555) 442-7783',
    joined: '2026-10-28',
    passcode: true,
    plan: 'unlimited',
    billing: 'yearly',
    status: 'active',
    renews: '2027-10-28',
    expired: null,
    children: [
      {
        name: 'Mia',
        contacts: [
          { name: 'Grandma Rose' },
          { name: 'Grandpa Joe' },
          { name: 'Aunt Sarah' },
          { name: 'Dad' },
        ],
      },
      {
        name: 'Noah',
        contacts: [
          { name: 'Uncle Raj' },
          { name: 'Cousin Emma' },
          { name: 'Grandma Rose' },
          { name: 'Grandpa Joe' },
          { name: 'Dad', status: 'pending' },
        ],
      },
    ],
  },
  {
    parentName: 'Emily Chen',
    phone: '(555) 560-1288',
    joined: '2026-10-20',
    passcode: false,
    plan: 'extended',
    billing: 'monthly',
    status: 'active',
    renews: '2026-12-20',
    expired: null,
    children: [
      { name: 'Leo', contacts: [{ name: 'Grandma Rose' }, { name: 'Aunt Sarah' }] },
      {
        name: 'Mia',
        contacts: [{ name: 'Grandpa Joe' }, { name: 'Cousin Emma', status: 'pending' }],
      },
    ],
  },
  {
    parentName: 'Daniel Brooks',
    phone: '(555) 673-9104',
    joined: '2026-10-12',
    passcode: true,
    plan: 'immediate',
    billing: 'monthly',
    status: 'active',
    renews: '2026-12-12',
    expired: null,
    children: [{ name: 'Noah', contacts: [{ name: 'Dad' }] }],
  },
  {
    parentName: 'Omar Hassan',
    phone: '(555) 784-3321',
    joined: '2026-05-10',
    passcode: true,
    plan: 'immediate',
    billing: 'monthly',
    status: 'expired',
    renews: null,
    expired: '2026-10-28',
    children: [{ name: 'Leo', contacts: [{ name: 'Uncle Raj' }] }],
  },
  {
    parentName: 'Tom Walker',
    phone: '(555) 895-6620',
    joined: '2026-09-30',
    passcode: false,
    plan: 'immediate',
    billing: 'yearly',
    status: 'limit',
    renews: '2027-09-30',
    expired: null,
    children: [
      { name: 'Mia', contacts: [{ name: 'Grandma Rose' }] },
      { name: 'Noah', contacts: [{ name: 'Cousin Emma' }] },
    ],
  },
  {
    parentName: 'Maria Lopez',
    phone: '(555) 906-2275',
    joined: '2026-09-18',
    passcode: true,
    plan: 'extended',
    billing: 'yearly',
    status: 'active',
    renews: '2027-09-18',
    expired: null,
    children: [
      { name: 'Leo', contacts: [{ name: 'Grandpa Joe' }, { name: 'Aunt Sarah' }] },
      { name: 'Mia', contacts: [{ name: 'Dad' }] },
    ],
  },
];

const FIRST = [
  'Olivia',
  'Liam',
  'Sophia',
  'Ethan',
  'Isabella',
  'Lucas',
  'Amelia',
  'Mason',
  'Harper',
  'Elijah',
  'Grace',
  'Henry',
  'Aisha',
  'Wei',
  'Carlos',
  'Fatima',
  'Noor',
  'Ivan',
  'Chloe',
  'Jack',
  'Nina',
  'Samuel',
  'Yuki',
  'Diego',
  'Hannah',
];
const LAST = [
  'Johnson',
  'Smith',
  'Patel',
  'Nguyen',
  'Garcia',
  'Kim',
  'Williams',
  'Davis',
  'Singh',
  'Martinez',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Lee',
  'Perez',
  'Clark',
  'Lewis',
  'Young',
  'Hall',
  'Allen',
  'Wright',
  'Scott',
  'Green',
];
const CHILD_NAMES = ['Leo', 'Mia', 'Noah', 'Ava', 'Ben', 'Zoe', 'Lily', 'Max', 'Ella', 'Finn'];
export const CONTACT_NAMES = [
  'Grandma Rose',
  'Grandpa Joe',
  'Aunt Sarah',
  'Uncle Raj',
  'Cousin Emma',
  'Dad',
  'Aunt Lisa',
  'Uncle Ben',
  'Nana Jo',
  'Grandpa Tom',
];

function buildFamilies(): Family[] {
  const rng = createRng(20261124);
  const usedByNamed = namedSeeds.reduce<Record<FamilyStatus, number>>(
    (acc, s) => ({ ...acc, [s.status]: acc[s.status] + 1 }),
    { active: 0, expired: 0, limit: 0 },
  );
  const statuses: FamilyStatus[] = rng.shuffle(
    (Object.keys(STATUS_TOTALS) as FamilyStatus[]).flatMap((s) =>
      Array<FamilyStatus>(STATUS_TOTALS[s] - usedByNamed[s]).fill(s),
    ),
  );

  const families = namedSeeds.map((seed, i) => buildFamily(`fam-${i + 1}`, seed, rng));

  statuses.forEach((status, i) => {
    const index = namedSeeds.length + i + 1;
    const roll = rng.next();
    const planId: PlanId =
      status === 'limit' || roll < 0.6
        ? rng.next() < 0.6
          ? 'immediate'
          : 'extended'
        : roll < 0.85
          ? 'extended'
          : 'unlimited';
    const plan = planById(planId);
    const limit = plan.contactLimit ?? 8;
    const used =
      status === 'limit'
        ? limit
        : status === 'active'
          ? rng.int(0, Math.max(0, limit - (plan.contactLimit ? 1 : 0)))
          : rng.int(0, limit);
    const childCount = rng.int(1, 3);
    const childNames = rng.shuffle(CHILD_NAMES).slice(0, childCount);
    const children: ChildSeed[] = childNames.map((name) => ({ name, contacts: [] }));
    for (let k = 0; k < used; k++) {
      children[k % childCount].contacts.push({
        name: rng.pick(CONTACT_NAMES),
        status: rng.next() < 0.15 ? 'pending' : 'connected',
      });
    }
    const joined = isoDaysFrom('2026-09-17', -Math.floor(i * 0.85) - 1).slice(0, 10);
    const billing: BillingCycle = rng.next() < 0.6 ? 'yearly' : 'monthly';
    families.push(
      buildFamily(
        `fam-${index}`,
        {
          parentName: `${rng.pick(FIRST)} ${rng.pick(LAST)}`,
          phone: `(555) ${rng.int(200, 999)}-${rng.int(1000, 9999)}`,
          joined,
          passcode: rng.next() < 0.8,
          plan: planId,
          billing,
          status,
          renews:
            status === 'expired'
              ? null
              : isoDaysFrom('2026-11-24', rng.int(10, billing === 'yearly' ? 360 : 30)).slice(
                  0,
                  10,
                ),
          expired:
            status === 'expired' ? isoDaysFrom('2026-11-24', -rng.int(2, 120)).slice(0, 10) : null,
          children,
        },
        rng,
      ),
    );
  });
  return families;
}

export const families: Family[] = buildFamilies();
