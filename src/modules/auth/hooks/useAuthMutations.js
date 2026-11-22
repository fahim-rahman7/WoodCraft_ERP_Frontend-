// Barrel file: keeps a single import surface for auth hooks while the
// implementations live in small, focused modules.
export { useLogin } from './useLogin';
export { useRegister } from './useRegister';
export { useVerifyOtp } from './useVerifyOtp';
export { useResendOtp } from './useResendOtp';
export { useLogout } from './useLogout';
export { useCountdown } from './useCountdown';
