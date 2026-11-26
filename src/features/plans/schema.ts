import { z } from 'zod';

const price = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, 'Enter an amount with up to 2 decimals')
  .refine((v) => Number(v) > 0, 'Must be greater than 0')
  .transform(Number);

export const editPlanSchema = z.object({
  unlimited: z.boolean(),
  contactLimit: z.number().int().min(1, 'Minimum is 1 contact'),
  monthlyPrice: price,
  yearlyPrice: price,
});

export type EditPlanInput = z.input<typeof editPlanSchema>;
export type EditPlanOutput = z.output<typeof editPlanSchema>;
