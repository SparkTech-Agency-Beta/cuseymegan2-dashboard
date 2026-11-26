import { families } from './families';
import { invitations } from './invitations';

/** ASSUMPTION: monthly values are invented; spec only fixes "increasing trend", Nov = +42. */
const MONTHS = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
const COUNTS = [18, 21, 24, 26, 29, 31, 33, 35, 37, 39, 40, 42];

export const overviewStats = () => ({
  stats: {
    families: families.length, // 1,248
    newFamiliesThisMonth: 42,
    activeSubscriptions: families.filter((f) => f.subscription.status === 'active').length, // 1,086
    activePercent: 87,
    pendingInvitations: invitations.filter((i) => i.status === 'pending').length, // 214
  },
  newFamiliesByMonth: MONTHS.map((month, i) => ({ month, count: COUNTS[i] })),
  planDistribution: [
    { planId: 'immediate' as const, percent: 52 },
    { planId: 'extended' as const, percent: 33 },
    { planId: 'unlimited' as const, percent: 15 },
  ],
});
