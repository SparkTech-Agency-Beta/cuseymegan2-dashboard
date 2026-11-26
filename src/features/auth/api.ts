import { apiClient } from '@/lib/apiClient';
import type { SignInValues } from './schema';
import type { LoginResponse } from './types';

export function loginRequest(values: SignInValues): Promise<LoginResponse> {
  return apiClient<LoginResponse>('/auth/login', { method: 'POST', body: values });
}
