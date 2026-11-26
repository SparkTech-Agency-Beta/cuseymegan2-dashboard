import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Link, useLocation, useMatches, useSearchParams } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import type { RouteHandle } from '@/app/routeHandle';
import { Input } from '@/components/ui/Input';

const SEARCH_DEBOUNCE_MS = 300;

/** Search box synced (debounced) to `?q=`. Remounted per route so each page starts fresh. */
function SearchBox({ placeholder }: { placeholder: string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get('q') ?? '');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.value;
    setValue(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next.trim()) params.set('q', next.trim());
          else params.delete('q');
          params.delete('page');
          return params;
        },
        { replace: true },
      );
    }, SEARCH_DEBOUNCE_MS);
  }

  return (
    <Input
      type="search"
      inputSize="search"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-label={placeholder}
      leftAddon={<Search className="size-5" aria-hidden />}
      wrapperClassName="w-[300px]"
    />
  );
}

/** Title + subtitle block; also used by data-driven route headers. */
export function PageTitle({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <div>
      <h1 className="text-[36px] font-bold leading-[44px] text-ink">{title}</h1>
      {subtitle && <p className="text-sm text-ink-muted">{subtitle}</p>}
    </div>
  );
}

interface TopBarProps {
  hasUnread: boolean;
}

export function TopBar({ hasUnread }: TopBarProps) {
  const matches = useMatches();
  const { pathname } = useLocation();
  const handle = [...matches].reverse().find((m) => m.handle)?.handle as RouteHandle | undefined;

  return (
    <header className="flex min-h-[66px] flex-wrap items-center justify-between gap-4">
      {handle?.Header ? (
        <handle.Header />
      ) : (
        <PageTitle title={handle?.title} subtitle={handle?.subtitle} />
      )}
      <div className="flex items-center gap-3">
        {handle?.searchPlaceholder && (
          <SearchBox key={pathname} placeholder={handle.searchPlaceholder} />
        )}
        <Link
          to="/notifications"
          aria-label={hasUnread ? 'Notifications (unread)' : 'Notifications'}
          className="relative inline-flex size-12 items-center justify-center rounded-input border border-line bg-surface text-ink hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Bell className="size-[22px]" aria-hidden />
          {hasUnread && (
            <span className="absolute right-3 top-3 size-2.5 rounded-pill border-2 border-surface bg-danger" />
          )}
        </Link>
      </div>
    </header>
  );
}
