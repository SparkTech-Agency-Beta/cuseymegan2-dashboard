import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/cn';

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Text shown between the buttons, e.g. "6 contacts". */
  format?: (value: number) => string;
  label: string;
  disabled?: boolean;
}

const buttonClass = cn(
  'inline-flex size-12 items-center justify-center rounded-input border border-line bg-surface text-ink',
  'hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
  'disabled:cursor-not-allowed disabled:opacity-40',
);

export function Stepper({
  value,
  onChange,
  min = 1,
  max = Number.MAX_SAFE_INTEGER,
  format = String,
  label,
  disabled,
}: StepperProps) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-3">
      <button
        type="button"
        className={buttonClass}
        aria-label={`Decrease ${label}`}
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus className="size-5" aria-hidden />
      </button>
      <output
        aria-live="polite"
        className="flex h-12 flex-1 items-center justify-center rounded-input border border-line bg-surface-muted text-base font-semibold text-ink"
      >
        {format(value)}
      </output>
      <button
        type="button"
        className={buttonClass}
        aria-label={`Increase ${label}`}
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus className="size-5" aria-hidden />
      </button>
    </div>
  );
}
