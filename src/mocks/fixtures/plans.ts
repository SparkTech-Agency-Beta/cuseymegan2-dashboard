import type { Plan } from '@/types/domain';

export const plans: Plan[] = [
  {
    id: 'immediate',
    name: 'Immediate Family',
    contactLimit: 2,
    monthlyPrice: 1.99,
    yearlyPrice: 15,
    isLive: true,
  },
  {
    id: 'extended',
    name: 'Extended Family',
    contactLimit: 6,
    monthlyPrice: 2.99,
    yearlyPrice: 25,
    isLive: true,
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    contactLimit: null,
    monthlyPrice: 4.99,
    yearlyPrice: 49.99,
    isLive: true,
  },
];
