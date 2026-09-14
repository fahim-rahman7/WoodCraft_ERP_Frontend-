import { Outlet, Navigate } from 'react-router-dom';

export const AuthLayout = () => {
  const token = localStorage.getItem('accessToken');

  // If user is already logged in, redirect them away from auth pages
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-layout-container" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <div className="auth-card">
        <Outlet />
      </div>
    </div>
  );
};