import { Card } from '@/components/ui/Card';
import { ProgressTrack } from '@/components/ui/ProgressTrack';
import { StatusPill } from '@/components/ui/StatusPill';
import { formatCurrency, formatDate } from '@/lib/format';
import { PLAN_LABELS } from '@/lib/labels';
import type { Subscription } from '@/types/domain';

export function SubscriptionCard({ subscription: s }: { subscription: Subscription }) {
  const cycle = s.billing === 'yearly' ? 'year' : 'month';
  const timing = s.expiredAt
    ? `Expired ${formatDate(s.expiredAt)}`
    : s.renewsAt
      ? `Renews ${formatDate(s.renewsAt)}`
      : null;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Subscription
        </p>
        <StatusPill status={s.status} />
      </div>
      <p className="mt-3 text-[24px] font-bold leading-[30px] text-ink">{PLAN_LABELS[s.planId]}</p>
      <p className="mt-1 text-base text-ink-muted">
        {formatCurrency(s.price)} / {cycle}
        {timing && ` · ${timing}`}
      </p>
      <div className="mt-5 flex items-center justify-between text-base">
        <span className="text-ink-muted">Contacts used</span>
        <span className="font-semibold text-ink">
          {s.contactLimit === null
            ? `${s.contactsUsed} · unlimited`
            : `${s.contactsUsed} of ${s.contactLimit}`}
        </span>
      </div>
      {s.contactLimit !== null && (
        <ProgressTrack
          className="mt-2"
          size={10}
          value={s.contactsUsed}
          max={s.contactLimit}
          tone={s.contactsUsed === s.contactLimit ? 'danger' : 'brand'}
          label="Contacts used"
        />
      )}
    </Card>
  );
}
