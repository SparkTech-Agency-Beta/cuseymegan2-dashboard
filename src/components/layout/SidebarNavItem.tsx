import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';

interface SidebarNavItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
  badgeCount?: number;
}

export function SidebarNavItem({ to, label, icon: Icon, badgeCount = 0 }: SidebarNavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex h-[50px] items-center gap-3 rounded-input px-3 text-[17px] font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
          isActive ? 'bg-brand-soft text-brand' : 'text-ink-muted hover:bg-surface-sunken',
        )
      }
    >
      <Icon className="size-[22px] shrink-0" aria-hidden />
      <span className="flex-1">{label}</span>
      <Badge count={badgeCount} />
    </NavLink>
  );
}
