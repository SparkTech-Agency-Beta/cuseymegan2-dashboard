import { LogOut } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

interface AdminCardProps {
  name: string;
  email?: string;
  onLogout: () => void;
}

export function AdminCard({ name, email, onLogout }: AdminCardProps) {
  return (
    <div className="flex h-16 items-center gap-3 rounded-input bg-surface-muted px-3">
      <Avatar name={name} size={40} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-ink">{name}</p>
        <p className="truncate text-sm text-ink-muted">{email ?? 'Signed in'}</p>
      </div>
      <button
        type="button"
        aria-label="Log out"
        onClick={onLogout}
        className="inline-flex size-9 items-center justify-center rounded-input text-ink-muted hover:bg-surface-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <LogOut className="size-5" aria-hidden />
      </button>
    </div>
  );
}
