import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Guards
import { ProtectedRoute } from './ProtectedRoute';

// Dummy/Module Page Imports
const LoginPage = () => <h2>Login Page</h2>;
const RegisterPage = () => <h2>Register Page</h2>;
const DashboardPage = () => <h2>Dashboard Home</h2>;
const InventoryPage = () => <h2>Inventory Management</h2>;
const SalesPage = () => <h2>Sales Management</h2>;
const UnauthorizedPage = () => <h2>403 - Access Denied</h2>;
const NotFoundPage = () => <h2>404 - Page Not Found</h2>;

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public / Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected ERP Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          
          {/* Role-restricted Route Example */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'manager']} />}>
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