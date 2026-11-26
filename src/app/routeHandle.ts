import type { ComponentType } from 'react';

/** Static per-route data read by the TopBar via `useMatches()`. */
export interface RouteHandle {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  /** Optional component that renders a data-driven title/subtitle (Family Detail). */
  Header?: ComponentType;
}
