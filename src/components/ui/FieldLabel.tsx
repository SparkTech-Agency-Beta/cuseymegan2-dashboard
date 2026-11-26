import type { LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** `upper` = small uppercase label (Plans / modal); `sentence` = Sign In. */
  variant?: 'upper' | 'sentence';
}

export function FieldLabel({ variant = 'upper', className, ...rest }: FieldLabelProps) {
  return (
    <label
      className={cn(
        'mb-2 block font-semibold',
        variant === 'upper'
          ? 'text-xs uppercase tracking-wider text-ink-muted'
          : 'text-sm text-ink',
        className,
      )}
      {...rest}
    />
  );
}
