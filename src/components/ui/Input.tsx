import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type InputSize = 'search' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  inputSize?: InputSize;
  invalid?: boolean;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  wrapperClassName?: string;
}

const heights: Record<InputSize, string> = {
  search: 'h-12', // 48
  md: 'h-[52px]', // 52–54 (forms)
  lg: 'h-[60px]', // 60 (modal)
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { inputSize = 'md', invalid, leftAddon, rightAddon, className, wrapperClassName, ...rest },
  ref,
) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-input border bg-surface px-4 transition-shadow',
        'focus-within:ring-2 focus-within:ring-brand',
        invalid ? 'border-danger' : 'border-line',
        heights[inputSize],
        wrapperClassName,
      )}
    >
      {leftAddon && <span className="shrink-0 text-ink-subtle">{leftAddon}</span>}
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          'min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-subtle',
          className,
        )}
        {...rest}
      />
      {rightAddon && <span className="shrink-0 text-ink-muted">{rightAddon}</span>}
    </div>
  );
});
