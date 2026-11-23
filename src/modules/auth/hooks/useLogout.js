import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logoutApi } from '../api/auth.api';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutApi,
    onSettled: () => {
      // 1. Wipe all stored session credentials
      localStorage.removeItem('accessToken');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('activeOrgId');

      // 2. Clear cached data across the app
      queryClient.clear();

      // 3. Redirect to login
      navigate('/login', { replace: true });
    },
  });
};
