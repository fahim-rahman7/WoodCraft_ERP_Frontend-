import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('accessToken');
  
  // Replace with actual user context/role from your TanStack user query if needed
  const userRole = localStorage.getItem('userRole') || 'staff'; 

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};