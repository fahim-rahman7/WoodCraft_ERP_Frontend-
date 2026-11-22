import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../api/auth.api';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (response) => {
      const { accessToken, user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('auth_user', JSON.stringify(user));

      queryClient.resetQueries({ queryKey: ['my-memberships'] });

      navigate('/select-org', { replace: true });
    },
  });
};
