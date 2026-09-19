import { Outlet, Navigate } from 'react-router-dom';

export const AuthLayout = () => {
  const token = localStorage.getItem('accessToken');

  // If user is already logged in, redirect them away from auth pages
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <Outlet />
      </div>
    </div>
  );
};