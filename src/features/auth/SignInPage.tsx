import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/authContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { Input } from '@/components/ui/Input';
import { signInSchema, type SignInValues } from './schema';

export default function SignInPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/overview';

  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });

  if (isAuthenticated) return <Navigate to={from} replace />;

  async function onSubmit(values: SignInValues) {
    setFormError(null);
    try {
      await login(values);
      navigate(from, { replace: true });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Something went wrong.');
    }
  }

  return (
    <Card className="w-[460px] max-w-full p-10">
      <span className="mx-auto mb-6 flex size-24 items-center justify-center rounded-card bg-brand text-5xl font-bold text-surface">
        L
      </span>
      <h1 className="text-center text-[32px] font-bold leading-[41px] text-ink">
        Little Hellos Admin
      </h1>
      {/* TODO(figma): subtitle is truncated in the spec ("Sign in to manage families…"); copy exact text. */}
      <p className="mb-8 mt-2 text-center text-base text-ink-muted">
        Sign in to manage families, invitations and plans.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        {formError && (
          <div
            role="alert"
            className="rounded-input border border-danger bg-danger-soft px-4 py-3 text-sm font-medium text-danger"
          >
            {formError}
          </div>
        )}
        <div>
          <FieldLabel htmlFor="email" variant="sentence">
            Email
          </FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="admin@littlehellos.app"
            invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-sm text-danger">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <FieldLabel htmlFor="password" variant="sentence">
            Password
          </FieldLabel>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            rightAddon={
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((v) => !v)}
                className="rounded-input p-1 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                {showPassword ? (
                  <EyeOff className="size-5" aria-hidden />
                ) : (
                  <Eye className="size-5" aria-hidden />
                )}
              </button>
            }
            {...register('password')}
          />
          {errors.password && (
            <p id="password-error" className="mt-1.5 text-sm text-danger">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button type="submit" size="xl" fullWidth loading={isSubmitting} className="mt-2">
          Sign In
        </Button>
      </form>
    </Card>
  );
}
