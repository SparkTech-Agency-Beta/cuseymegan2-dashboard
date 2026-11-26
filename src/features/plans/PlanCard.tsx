import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { Input } from '@/components/ui/Input';
import { StatusPill } from '@/components/ui/StatusPill';
import { formatCurrency } from '@/lib/format';
import type { Plan } from '@/types/domain';

interface PlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
}

export function PlanCard({ plan, onEdit }: PlanCardProps) {
  const subtitle =
    plan.contactLimit === null ? 'Unlimited contacts' : `Up to ${plan.contactLimit} contacts`;
  const fields: Array<[string, string]> = [
    ['Contact limit', plan.contactLimit === null ? 'Unlimited' : `${plan.contactLimit} contacts`],
    ['Monthly price', `${formatCurrency(plan.monthlyPrice)} / month`],
    ['Yearly price', `${formatCurrency(plan.yearlyPrice)} / year`],
  ];

  return (
    <Card className="flex min-h-[453px] flex-col p-6">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[22px] font-bold leading-[27px] text-ink">{plan.name}</h2>
          <p className="text-base text-ink-muted">{subtitle}</p>
        </div>
        {plan.isLive && <StatusPill status="live" />}
      </div>
      <div className="flex flex-1 flex-col gap-4">
        {fields.map(([label, value]) => {
          const id = `${plan.id}-${label.replace(/\s/g, '-').toLowerCase()}`;
          return (
            <div key={id}>
              <FieldLabel htmlFor={id}>{label}</FieldLabel>
              <Input id={id} readOnly value={value} tabIndex={-1} inputSize="md" />
            </div>
          );
        })}
      </div>
      <Button
        fullWidth
        size="xl"
        className="mt-6"
        leftIcon={<Pencil className="size-5" aria-hidden />}
        onClick={() => onEdit(plan)}
      >
        Edit plan
      </Button>
    </Card>
  );
}
