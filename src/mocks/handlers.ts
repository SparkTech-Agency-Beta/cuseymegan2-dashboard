import { delay, http, HttpResponse } from 'msw';
import { API_URL } from '@/lib/apiClient';
import type { AdminNotification, Family, FamilyStatus, Paginated, Plan } from '@/types/domain';
import { families as familyFixtures } from './fixtures/families';
import { invitations } from './fixtures/invitations';
import { notifications as notificationFixtures } from './fixtures/notifications';
import { plans as planFixtures } from './fixtures/plans';
import { overviewStats } from './fixtures/stats';
import { subscriptionStats } from './fixtures/subscriptions';

// Mutable in-memory copies so PATCH/POST calls persist until a page reload.
const plans: Plan[] = planFixtures.map((p) => ({ ...p }));
const notifications: AdminNotification[] = notificationFixtures.map((n) => ({ ...n }));

const wait = () => delay(300 + Math.random() * 300); // 300–600ms latency
const url = (path: string) => `${API_URL}${path}`;
const error = (status: number, message: string) => HttpResponse.json({ message }, { status });

/** Families always reflect the current plan limits/prices (so Edit Plan shows up everywhere). */
function withLivePlan(family: Family): Family {
  const plan = plans.find((p) => p.id === family.subscription.planId);
  if (!plan) return family;
  return {
    ...family,
    subscription: {
      ...family.subscription,
      contactLimit: plan.contactLimit,
      price: family.subscription.billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice,
    },
  };
}

function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  return items.slice((page - 1) * pageSize, page * pageSize);
}

function filterFamilies(status: string | null, q: string | null): Family[] {
  const term = q?.trim().toLowerCase();
  return familyFixtures
    .filter((f) => !status || status === 'all' || f.subscription.status === status)
    .filter((f) => !term || f.parentName.toLowerCase().includes(term) || f.phone.includes(term))
    .sort((a, b) => b.joinedAt.localeCompare(a.joinedAt))
    .map(withLivePlan);
}

function familyCounts(): Record<'all' | FamilyStatus, number> {
  const count = (s: FamilyStatus) =>
    familyFixtures.filter((f) => f.subscription.status === s).length;
  return {
    all: familyFixtures.length,
    active: count('active'),
    expired: count('expired'),
    limit: count('limit'),
  };
}

const unreadCount = () => notifications.filter((n) => !n.read).length;

export const handlers = [
  // ASSUMPTION: demo credentials. Real backend replaces this.
  http.post(url('/auth/login'), async ({ request }) => {
    await wait();
    const { email, password } = (await request.json()) as { email: string; password: string };
    if (email.toLowerCase() === 'admin@littlehellos.app' && password === 'password123') {
      return HttpResponse.json({
        token: 'mock-token',
        admin: { name: 'Admin', email: 'admin@littlehellos.app' },
      });
    }
    return error(401, 'Invalid email or password.');
  }),

  http.get(url('/stats/overview'), async () => {
    await wait();
    return HttpResponse.json(overviewStats());
  }),

  http.get(url('/families'), async ({ request }) => {
    await wait();
    const p = new URL(request.url).searchParams;
    const page = Number(p.get('page') ?? 1);
    const pageSize = Number(p.get('pageSize') ?? 9);
    const all = filterFamilies(p.get('status'), p.get('q'));
    const body: Paginated<Family> = {
      items: paginate(all, page, pageSize),
      total: all.length,
      page,
      pageSize,
      counts: familyCounts(),
    };
    return HttpResponse.json(body);
  }),

  http.get(url('/families/:id'), async ({ params }) => {
    await wait();
    const family = familyFixtures.find((f) => f.id === params.id);
    return family ? HttpResponse.json(withLivePlan(family)) : error(404, 'Family not found.');
  }),

  http.get(url('/invitations'), async ({ request }) => {
    await wait();
    const p = new URL(request.url).searchParams;
    const page = Number(p.get('page') ?? 1);
    const pageSize = Number(p.get('pageSize') ?? 8);
    const status = p.get('status');
    const term = p.get('q')?.trim().toLowerCase();
    const all = invitations
      .filter((i) => !status || status === 'all' || i.status === status)
      .filter(
        (i) =>
          !term ||
          i.contactName.toLowerCase().includes(term) ||
          i.phone.includes(term) ||
          i.invitedBy.name.toLowerCase().includes(term),
      );
    const count = (s: string) => invitations.filter((i) => i.status === s).length;
    return HttpResponse.json({
      items: paginate(all, page, pageSize),
      total: all.length,
      page,
      pageSize,
      counts: { all: invitations.length, pending: count('pending'), accepted: count('accepted') },
    });
  }),

  http.get(url('/subscriptions'), async ({ request }) => {
    await wait();
    const p = new URL(request.url).searchParams;
    const page = Number(p.get('page') ?? 1);
    const pageSize = Number(p.get('pageSize') ?? 7);
    const all = filterFamilies(p.get('status'), p.get('q'));
    return HttpResponse.json({
      items: paginate(all, page, pageSize),
      total: all.length,
      page,
      pageSize,
      counts: familyCounts(),
      stats: subscriptionStats,
    });
  }),

  http.get(url('/plans'), async () => {
    await wait();
    return HttpResponse.json(plans);
  }),

  http.patch(url('/plans/:id'), async ({ params, request }) => {
    await wait();
    const plan = plans.find((p) => p.id === params.id);
    if (!plan) return error(404, 'Plan not found.');
    const patch = (await request.json()) as Pick<
      Plan,
      'contactLimit' | 'monthlyPrice' | 'yearlyPrice'
    >;
    Object.assign(plan, patch);
    return HttpResponse.json(plan);
  }),

  http.get(url('/notifications'), async ({ request }) => {
    await wait();
    const filter = new URL(request.url).searchParams.get('filter');
    const items = notifications
      .filter((n) => filter !== 'unread' || !n.read)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return HttpResponse.json({ items, unreadCount: unreadCount(), total: notifications.length });
  }),

  http.patch(url('/notifications/:id/read'), async ({ params }) => {
    await wait();
    const item = notifications.find((n) => n.id === params.id);
    if (!item) return error(404, 'Notification not found.');
    item.read = true;
    return HttpResponse.json(item);
  }),

  http.post(url('/notifications/read-all'), async () => {
    await wait();
    notifications.forEach((n) => {
      n.read = true;
    });
    return HttpResponse.json({ unreadCount: 0 });
  }),
];
