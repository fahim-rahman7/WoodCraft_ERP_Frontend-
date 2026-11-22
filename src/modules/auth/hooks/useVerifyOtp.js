import { useMutation } from '@tanstack/react-query';
import { verifyOtpApi } from '../api/auth.api';

export const useVerifyOtp = () => useMutation({ mutationFn: verifyOtpApi });
