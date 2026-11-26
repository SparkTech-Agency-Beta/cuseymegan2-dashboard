import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import type { Child } from '@/types/domain';

export function ChildrenSection({ items }: { items: Child[] }) {
  return (
    <section aria-labelledby="children-title">
      <h2 id="children-title" className="mb-4 text-[24px] font-bold leading-[30px] text-ink">
        Children
      </h2>
      {items.length === 0 ? (
        <p className="text-base text-ink-muted">No children added yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map((child) => (
            <li key={child.id}>
              <Card className="flex h-24 items-center gap-4 px-4">
                <Avatar name={child.name} src={child.avatarUrl} size={64} />
                <div>
                  <p className="text-lg font-semibold text-ink">{child.name}</p>
                  <p className="text-sm text-ink-muted">
                    {child.approvedContacts} approved contact
                    {child.approvedContacts === 1 ? '' : 's'}
                  </p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
