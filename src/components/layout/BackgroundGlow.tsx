import { cn } from '@/lib/cn';

interface BackgroundGlowProps {
  /** Ellipse diameter in px: 520 (top-right) or 480 (Sign In bottom-left). */
  size?: number;
  className?: string;
}

/** Decorative blurred brand-colour ellipse. Position it with `className`. */
export function BackgroundGlow({ size = 520, className }: BackgroundGlowProps) {
  return (
    <div
      aria-hidden
      style={{ width: size, height: size }}
      className={cn(
        'pointer-events-none absolute rounded-pill bg-brand opacity-10 blur-3xl',
        className,
      )}
    />
  );
}
