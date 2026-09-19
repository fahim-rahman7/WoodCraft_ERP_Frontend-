import { Navigate, Outlet } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';

export const ProtectedRoute = ({ allowedRoles, requireOrg = true }) => {
  const token = localStorage.getItem('accessToken');
  const { activeOrgId, activeContext, isLoadingOrgs, userMemberships } = useTenant();

  // 1. Authentication Check
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Loading State (prevents premature redirects while fetching org context)
  if (isLoadingOrgs) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#64748b' }}>
        Loading session...
      </div>
    );
  }

  // 3. Organization Check
  if (requireOrg && (!activeOrgId || userMemberships.length === 0)) {
    return <Navigate to="/select-org" replace />;
  }

  // 4. Role Permission Check (FIXED: Explicitly rejects if role is missing or unallowed)
  if (allowedRoles) {
    const userRole = activeContext?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};