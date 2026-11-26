import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PlanTag } from '@/components/ui/PlanTag';
import { Stepper } from '@/components/ui/Stepper';
import { cn } from '@/lib/cn';
import type { Plan } from '@/types/domain';
import { useUpdatePlan } from './api';
import { editPlanSchema, type EditPlanInput, type EditPlanOutput } from './schema';

const DEFAULT_LIMIT_WHEN_LIMITED = 10;

interface EditPlanModalProps {
  plan: Plan;
  onClose: () => void;
}

export function EditPlanModal({ plan, onClose }: EditPlanModalProps) {
  const update = useUpdatePlan();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<EditPlanInput, unknown, EditPlanOutput>({
    resolver: zodResolver(editPlanSchema),
    defaultValues: {
      unlimited: plan.contactLimit === null,
      contactLimit: plan.contactLimit ?? DEFAULT_LIMIT_WHEN_LIMITED,
      monthlyPrice: String(plan.monthlyPrice),
      yearlyPrice: String(plan.yearlyPrice),
    },
  });
  const [unlimited, monthly, yearly] = useWatch({
    control,
    name: ['unlimited', 'monthlyPrice', 'yearlyPrice'],
  });
  const yearlyTooHigh =
    Number(monthly) > 0 && Number(yearly) > 0 && Number(yearly) >= 12 * Number(monthly);

  function requestClose() {
    if (isDirty && !window.confirm('Discard your unsaved changes?')) return;
    onClose();
  }

  function onSubmit(values: EditPlanOutput) {
    update.mutate({
      id: plan.id,
      contactLimit: values.unlimited ? null : values.contactLimit,
      monthlyPrice: values.monthlyPrice,
      yearlyPrice: values.yearlyPrice,
    });
    onClose(); // optimistic: the card already shows the new values
  }

  return (
    <Modal open onClose={requestClose} title="Edit plan" headerExtra={<PlanTag plan={plan.id} />}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <div>
          <FieldLabel htmlFor="contact-limit">Contact limit</FieldLabel>
          {plan.contactLimit === null && (
            <Controller
              control={control}
              name="unlimited"
              render={({ field }) => (
                <button
                  type="button"
                  role="switch"
                  aria-checked={field.value}
                  onClick={() => field.onChange(!field.value)}
                  className="mb-3 flex items-center gap-3 rounded-input text-base font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <span
                    className={cn(
                      'relative h-7 w-12 rounded-pill transition-colors',
                      field.value ? 'bg-brand' : 'bg-line',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 size-5 rounded-pill bg-surface transition-all',
                        field.value ? 'left-6' : 'left-1',
                      )}
                    />
                  </span>
                  Unlimited
                </button>
              )}
            />
          )}
          {!unlimited && (
            <Controller
              control={control}
              name="contactLimit"
              render={({ field }) => (
                <Stepper
                  label="contact limit"
                  value={field.value}
                  onChange={field.onChange}
                  min={1}
                  format={(v) => `${v} contact${v === 1 ? '' : 's'}`}
                />
              )}
            />
          )}
          {errors.contactLimit && (
            <p className="mt-1.5 text-sm text-danger">{errors.contactLimit.message}</p>
          )}
        </div>

        <div>
          <FieldLabel htmlFor="monthly-price">Monthly price</FieldLabel>
          <Input
            id="monthly-price"
            inputMode="decimal"
            inputSize="lg"
            invalid={!!errors.monthlyPrice}
            leftAddon="$"
            rightAddon="per month"
            {...register('monthlyPrice')}
          />
          {errors.monthlyPrice && (
            <p className="mt-1.5 text-sm text-danger">{errors.monthlyPrice.message}</p>
          )}
        </div>
        <div>
          <FieldLabel htmlFor="yearly-price">Yearly price</FieldLabel>
          <Input
            id="yearly-price"
            inputMode="decimal"
            inputSize="lg"
            invalid={!!errors.yearlyPrice}
            leftAddon="$"
            rightAddon="per year"
            {...register('yearlyPrice')}
          />
          {errors.yearlyPrice && (
            <p className="mt-1.5 text-sm text-danger">{errors.yearlyPrice.message}</p>
          )}
          {yearlyTooHigh && (
            <p role="status" className="mt-1.5 text-sm font-medium text-warning">
              Yearly price is not lower than 12 × the monthly price — is that intended?
            </p>
          )}
        </div>

        <div className="mt-2 flex gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-14 w-[222px]"
            onClick={requestClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-14 w-[222px]"
            leftIcon={<Check className="size-5" aria-hidden />}
          >
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
