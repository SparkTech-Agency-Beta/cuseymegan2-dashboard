import { Outlet } from 'react-router-dom';
import { useAuth } from '@/app/providers/authContext';
import { BackgroundGlow } from '@/components/layout/BackgroundGlow';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useUnreadCount } from '@/features/notifications/api';

export function DashboardLayout() {
  const unreadCount = useUnreadCount();
  const { admin, logout } = useAuth();

  return (
    <div className="min-h-screen bg-surface-muted">
      <Sidebar
        unreadCount={unreadCount}
        adminName={admin?.name ?? 'Admin'}
        adminEmail={admin?.email}
        onLogout={logout}
      />
      <div className="relative overflow-hidden lg:ml-[248px]">
        <BackgroundGlow className="-right-24 -top-48" />
        <div className="relative mx-auto flex max-w-[1192px] flex-col gap-8 px-8 py-8">
          <TopBar hasUnread={unreadCount > 0} />
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
