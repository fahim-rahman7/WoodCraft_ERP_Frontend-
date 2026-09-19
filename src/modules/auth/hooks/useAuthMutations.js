import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginApi, registerApi, verifyOtpApi, resendOtpApi, logoutApi, } from '../api/auth.api';
import { useNavigate } from 'react-router-dom';

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

export const useRegister = () => useMutation({ mutationFn: registerApi });
export const useVerifyOtp = () => useMutation({ mutationFn: verifyOtpApi });
export const useResendOtp = () => useMutation({ mutationFn: resendOtpApi });


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
  
        // 2. Clear TanStack Query cached data across the app
        queryClient.clear();
  
        // 3. Redirect to login page
        navigate('/login', { replace: true });
      },
    });
  };