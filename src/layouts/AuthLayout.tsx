import { Outlet } from 'react-router-dom';
import { BackgroundGlow } from '@/components/layout/BackgroundGlow';

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-muted p-6">
      <BackgroundGlow size={520} className="-right-32 -top-32" />
      <BackgroundGlow size={480} className="-bottom-32 -left-32" />
      <main className="relative">
        <Outlet />
      </main>
    </div>
  );
}
