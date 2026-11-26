import { CreditCard, Bell, Layers, LayoutGrid, Mail, Users, type LucideIcon } from 'lucide-react';
import { AdminCard } from './AdminCard';
import { SidebarNavItem } from './SidebarNavItem';

interface NavEntry {
  to: string;
  label: string;
  icon: LucideIcon;
}

const NAV: NavEntry[] = [
  { to: '/overview', label: 'Overview', icon: LayoutGrid },
  { to: '/families', label: 'Families', icon: Users },
  { to: '/invitations', label: 'Invitations', icon: Mail },
  { to: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { to: '/plans', label: 'Plans', icon: Layers },
  { to: '/notifications', label: 'Notifications', icon: Bell },
];

interface SidebarProps {
  unreadCount: number;
  adminName: string;
  adminEmail?: string;
  onLogout: () => void;
}

export function Sidebar({ unreadCount, adminName, adminEmail, onLogout }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[248px] flex-col border-r border-line bg-surface px-[18px] py-6 lg:flex">
      <div className="mb-8 flex items-center gap-3 px-1">
        {/* ASSUMPTION: letter tile stands in for the app icon until the logo asset is provided. */}
        <span className="inline-flex size-10 items-center justify-center rounded-input bg-brand text-lg font-bold text-surface">
          L
        </span>
        <span className="text-xl font-bold text-ink">Little Hellos</span>
      </div>
      <nav aria-label="Main" className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => (
          <SidebarNavItem
            key={item.to}
            {...item}
            badgeCount={item.to === '/notifications' ? unreadCount : 0}
          />
        ))}
      </nav>
      <AdminCard name={adminName} email={adminEmail} onLogout={onLogout} />
    </aside>
  );
}
