import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './providers/authContext';

/** Redirects to /login (remembering where the user was headed) when not signed in. */
export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return <Outlet />;
}
