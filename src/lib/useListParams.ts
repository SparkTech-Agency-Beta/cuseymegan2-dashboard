import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/** Filter / search / page state kept in the URL (`?status=active&q=sarah&page=2`). */
export function useListParams<T extends string>(allowed: readonly T[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawStatus = searchParams.get('status');
  const status = (allowed.find((s) => s === rawStatus) ?? allowed[0]) as T;
  const q = searchParams.get('q') ?? '';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const setStatus = useCallback(
    (next: T) =>
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (next === allowed[0]) params.delete('status');
        else params.set('status', next);
        params.delete('page');
        return params;
      }),
    [allowed, setSearchParams],
  );

  const setPage = useCallback(
    (next: number) =>
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (next <= 1) params.delete('page');
        else params.set('page', String(next));
        return params;
      }),
    [setSearchParams],
  );

  return { status, q, page, setStatus, setPage };
}
