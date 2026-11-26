import { DataTable, type Column } from '@/components/data-table/DataTable';
import { PersonCell } from '@/components/shared/PersonCell';
import { StatusPill } from '@/components/ui/StatusPill';
import { formatDate } from '@/lib/format';
import type { Contact } from '@/types/domain';

const columns: Column<Contact>[] = [
  {
    key: 'contact',
    header: 'Contact',
    width: 272,
    cell: (c) => <PersonCell name={c.name} secondary={c.phone} />,
  },
  { key: 'child', header: 'For child', width: 110, cell: (c) => c.childName },
  { key: 'status', header: 'Status', width: 150, cell: (c) => <StatusPill status={c.status} /> },
  { key: 'added', header: 'Added', width: 120, cell: (c) => formatDate(c.addedAt) },
];

export function ContactsSection({ contacts }: { contacts: Contact[] }) {
  return (
    <section aria-labelledby="contacts-title">
      <h2 id="contacts-title" className="mb-4 text-[24px] font-bold leading-[30px] text-ink">
        Approved contacts
      </h2>
      <DataTable
        caption="Approved contacts"
        columns={columns}
        rows={contacts}
        getRowId={(c) => c.id}
        emptyTitle="No contacts yet"
        emptyDescription="This family hasn't invited anyone."
      />
    </section>
  );
}
