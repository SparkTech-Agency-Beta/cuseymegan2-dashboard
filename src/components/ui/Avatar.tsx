import { cn } from '@/lib/cn';

// Deterministic colour per name, built only from design tokens.
const TONES = [
  'bg-brand-soft text-brand',
  'bg-plan-immediate-soft text-plan-immediate',
  'bg-plan-extended-soft text-plan-extended',
  'bg-plan-unlimited-soft text-plan-unlimited',
  'bg-success-soft text-success',
  'bg-warning-soft text-warning',
] as const;

function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const letters =
    parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[parts.length - 1][0];
  return letters.toUpperCase();
}

interface AvatarProps {
  name: string;
  src?: string;
  /** Pixel size. Figma uses 40, 42, 64 and 96. */
  size?: number;
  className?: string;
}

export function Avatar({ name, src, size = 42, className }: AvatarProps) {
  const style = { width: size, height: size, fontSize: Math.round(size * 0.38) };
  if (src) {
    return (
      <img
        src={src}
        alt=""
        style={style}
        className={cn('shrink-0 rounded-pill object-cover', className)}
      />
    );
  }
  return (
    <span
      aria-hidden
      style={style}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-pill font-semibold',
        TONES[hash(name) % TONES.length],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
