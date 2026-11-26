import { createContext, useContext } from 'react';
import type { Admin } from '@/features/auth/types';
import type { SignInValues } from '@/features/auth/schema';

export interface AuthContextValue {
  admin: Admin | null;
  isAuthenticated: boolean;
  login: (values: SignInValues) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
