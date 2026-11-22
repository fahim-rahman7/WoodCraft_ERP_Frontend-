import { useMutation } from '@tanstack/react-query';
import { resetPasswordApi } from '../api/auth.api';

export const useResetPassword = () => useMutation({ mutationFn: resetPasswordApi });
