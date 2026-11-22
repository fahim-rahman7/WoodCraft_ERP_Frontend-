import { useMutation } from '@tanstack/react-query';
import { resendOtpApi } from '../api/auth.api';

export const useResendOtp = () => useMutation({ mutationFn: resendOtpApi });
