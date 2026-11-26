import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import SignInPage from '@/features/auth/SignInPage';
import { FamilyHeader } from '@/features/families/components/FamilyHeader';
import FamiliesPage from '@/features/families/FamiliesPage';
import FamilyDetailPage from '@/features/families/FamilyDetailPage';
import InvitationsPage from '@/features/invitations/InvitationsPage';
import NotificationsPage from '@/features/notifications/NotificationsPage';
import OverviewPage from '@/features/overview/OverviewPage';
import PlansPage from '@/features/plans/PlansPage';
import SubscriptionsPage from '@/features/subscriptions/SubscriptionsPage';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { RequireAuth } from './RequireAuth';
import type { RouteHandle } from './routeHandle';

const page = (path: string, element: RouteObject['element'], handle: RouteHandle): RouteObject => ({
  path,
  element,
  handle,
});

// TODO(figma): the Subscriptions / Plans / Notifications subtitles are truncated in the spec and
// could not be read from Figma (MCP rate limit). Replace the placeholders below with the exact text.
export const router = createBrowserRouter([
  { element: <AuthLayout />, children: [{ path: '/login', element: <SignInPage /> }] },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/', element: <Navigate to="/overview" replace /> },
          page('/overview', <OverviewPage />, {
            title: 'Overview',
            subtitle: 'See how families are using Little Hellos',
            searchPlaceholder: 'Search families…',
          }),
          page('/families', <FamiliesPage />, {
            title: 'Families',
            subtitle: 'All parent accounts and their plans',
            searchPlaceholder: 'Search families…',
          }),
          page('/families/:familyId', <FamilyDetailPage />, {
            title: 'Family',
            searchPlaceholder: 'Search families…',
            Header: FamilyHeader,
          }),
          page('/invitations', <InvitationsPage />, {
            title: 'Invitations',
            subtitle: 'SMS invitations sent to contacts',
            searchPlaceholder: 'Search invitations…',
          }),
          page('/subscriptions', <SubscriptionsPage />, {
            title: 'Subscriptions',
            subtitle: 'Billing status for every family', // TODO(figma)
            searchPlaceholder: 'Search…',
          }),
          page('/plans', <PlansPage />, {
            title: 'Plans',
            subtitle: 'Pricing and contact limits', // TODO(figma)
            searchPlaceholder: 'Search…',
          }),
          page('/notifications', <NotificationsPage />, {
            title: 'Notifications',
            subtitle: 'Recent activity across families', // TODO(figma)
            searchPlaceholder: 'Search…',
          }),
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/overview" replace /> },
]);
