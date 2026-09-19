import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVerifyOtp, useResendOtp } from '../hooks/useAuthMutations';

export const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { mutate: verifyOtp, isPending: isVerifying, error: verifyError } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResending, error: resendError } = useResendOtp();

  const handleVerify = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    verifyOtp(
      { email, otp },
      {
        onSuccess: () => {
          navigate('/login', { replace: true });
        },
      }
    );
  };

  const handleResend = () => {
    if (!email) return;
    setSuccessMsg('');
    resendOtp(
      { email },
      {
        onSuccess: (res) => {
          setSuccessMsg(res?.message || 'A new OTP has been sent to your email.');
        },
      }
    );
  };

  const errorMessage =
    verifyError?.response?.data?.message ||
    resendError?.response?.data?.message ||
    (verifyError || resendError ? 'An error occurred. Please try again.' : '');

  return (
    <div className="w-full max-w-[400px] p-8 border border-slate-200 rounded-xl bg-white shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Verify OTP</h2>
      <p className="text-slate-500 text-sm mb-6">
        Confirm your email address and enter the verification code.
      </p>

      {errorMessage && (
        <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-md mb-4 text-sm">
          {errorMessage}
        </div>
      )}

      {successMsg && (
        <div className="text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-md mb-4 text-sm">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">OTP Code</label>
          <input
            type="text"
            required
            maxLength={6}
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-center text-lg font-semibold tracking-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isVerifying}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-md text-sm transition-colors cursor-pointer mt-1"
        >
          {isVerifying ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600">
        <span>Didn't receive code? </span>
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || !email}
          className="text-blue-600 hover:text-blue-700 font-medium underline disabled:opacity-50 disabled:no-underline cursor-pointer"
        >
          {isResending ? 'Resending...' : 'Resend OTP'}
        </button>
      </div>
    </div>
  );
};