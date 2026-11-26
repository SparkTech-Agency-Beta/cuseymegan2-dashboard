import { differenceInCalendarDays, differenceInMinutes, format } from 'date-fns';

const numberFormatter = new Intl.NumberFormat('en-US');

/** 1248 → "1,248" */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** 15 → "$15", 2.99 → "$2.99" */
export function formatCurrency(value: number): string {
  const hasCents = Math.round(value * 100) % 100 !== 0;
  return `$${value.toFixed(hasCents ? 2 : 0)}`;
}

/** ISO string → "Nov 2, 2026" */
export function formatDate(iso: string): string {
  return format(new Date(iso), 'MMM d, yyyy');
}

/** ISO string → "Oct 28" (used for "Expired Oct 28") */
export function formatShortDate(iso: string): string {
  return format(new Date(iso), 'MMM d');
}

/** ISO string → "2 min ago" / "1 hr ago" / "Yesterday" / "3 days ago" / "Nov 2, 2026" */
export function timeAgo(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  const minutes = differenceInMinutes(now, date);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const days = differenceInCalendarDays(now, date);
  if (days === 0) return `${Math.floor(minutes / 60)} hr ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return formatDate(iso);
}
