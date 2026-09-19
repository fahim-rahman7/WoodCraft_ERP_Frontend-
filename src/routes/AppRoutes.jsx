import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Guards
import { ProtectedRoute } from './ProtectedRoute';

// Module Pages
import { LoginPage } from '../modules/auth/pages/LoginPage';
import { RegisterPage } from '../modules/auth/pages/RegisterPage';
import { VerifyOtpPage } from '../modules/auth/pages/VerifyOtpPage';
import { DashboardPage } from '../modules/dashboard/pages/DashboardPage';
import { InventoryPage } from '../modules/inventory/pages/InventoryPage';
import { SalesPage } from '../modules/sales/pages/SalesPage';
import { SelectOrgPage } from '../modules/organization/pages/SelectOrgPage';

// Common Error Pages
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public / Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
      </Route>

      {/* Workspace Selection Page (Requires Auth Token, but does not require an active org header) */}
      <Route element={<ProtectedRoute requireOrg={false} />}>
        <Route path="/select-org" element={<SelectOrgPage />} />
      </Route>

      {/* Protected ERP Routes (Requires Auth Token + Active Org) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />

          {/* Role-restricted Route (Aligned with Mongoose Enum: 'OWNER', 'MANAGER') */}
          <Route element={<ProtectedRoute allowedRoles={['OWNER', 'MANAGER']} />}>
            <Route path="/sales" element={<SalesPage />} />
          </Route>
        </Route>
      </Route>

      {/* Redirect Root to Dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Error Routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};