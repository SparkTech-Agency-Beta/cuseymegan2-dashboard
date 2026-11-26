import { families } from './families';

/** Stats row on /subscriptions. Derived from the family fixtures so the numbers always agree. */
export const subscriptionStats = (() => {
  const total = families.length;
  const count = (status: 'active' | 'expired' | 'limit') =>
    families.filter((f) => f.subscription.status === status).length;
  const active = count('active');
  return {
    active,
    expired: count('expired'),
    limit: count('limit'),
    activePercent: Math.round((active / total) * 100), // 1,086 / 1,248 → 87%
  };
})();
