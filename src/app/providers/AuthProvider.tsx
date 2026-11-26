import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { loginRequest } from '@/features/auth/api';
import type { SignInValues } from '@/features/auth/schema';
import type { LoginResponse } from '@/features/auth/types';
import { setAuthToken } from '@/lib/apiClient';
import { AuthContext, type AuthContextValue } from './authContext';

const STORAGE_KEY = 'lh_session';

function readSession(): LoginResponse | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LoginResponse) : null;
  } catch {
    return null;
  }
}

function writeSession(session: LoginResponse | null): void {
  try {
    if (session) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable: session lives in memory only */
  }
}

/** Fake auth: token held in memory and mirrored to sessionStorage. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<LoginResponse | null>(() => {
    const stored = readSession();
    setAuthToken(stored?.token ?? null); // must be set before children start querying
    return stored;
  });

  const login = useCallback(async (values: SignInValues) => {
    const result = await loginRequest(values);
    setAuthToken(result.token);
    writeSession(result);
    setSession(result);
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    writeSession(null);
    setSession(null);
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({ admin: session?.admin ?? null, isAuthenticated: session !== null, login, logout }),
    [session, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
