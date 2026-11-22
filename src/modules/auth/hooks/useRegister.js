import { useMutation } from '@tanstack/react-query';
import { registerApi } from '../api/auth.api';

export const useRegister = () => useMutation({ mutationFn: registerApi });
