import { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  ArrowLeft,
  Clock,
  Gauge,
  QrCode,
  Warehouse,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthPageShell } from '../components/AuthPageShell';
import { AuthBrandPanel } from '../components/AuthBrandPanel';
import { AuthCard } from '../components/AuthCard';
import { PasswordInput } from '../components/PasswordInput';
import { AuthAlert } from '../components/AuthAlert';
import { AuthSubmitButton } from '../components/AuthSubmitButton';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';
import { useResetPassword } from '../hooks/useResetPassword';

const FEATURES = [
  {
    icon: Gauge,
    title: 'Precision Kiln & Moisture Tracking',
    description: 'Real-time moisture content sensor telemetry from green log to kiln specification.',
    badge: '10% MC',
  },
  {
    icon: QrCode,
    title: 'End-to-End Batch Traceability',
    description: 'Trace CFT volumes, saw log allocations, and cutting tickets down to line operators.',
    badge: 'CFT-LEDGER',
  },
  {
    icon: Warehouse,
    title: 'Multi-Yard & Depot Inventory',
    description: 'Live ledger for raw logs, planks, and consignment transfers across Dhaka and Chittagong.',
    badge: 'DAC / CTG',
  },
];

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: resetPassword, isPending } = useResetPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    resetPassword(
      { token, newPassword },
      {
        onSuccess: () => setIsSuccess(true),
        onError: (err) =>
          setErrorMsg(
            err.response?.data?.message ||
              err.message ||
              'This reset link is invalid or has expired. Please request a new one.'
          ),
      }
    );
  };

  return (
    <AuthPageShell
      brand={
        <AuthBrandPanel
          subtitle="TIMBER & PROCESSING OS"
          eyebrow="CREDENTIAL RECOVERY"
          features={FEATURES}
          footerLeft="Dhaka Plant #02 & Central Depots"
          footerRight="Encrypted TLS 1.3"
        />
      }
    >
      <AuthCard maxWidth="max-w-[530px]">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-[#f7f2eb] border border-[#ebdccd] flex items-center justify-center text-[#4a2a17]">
            <KeyRound className="w-6 h-6 text-[#7a4825]" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4ece3] border border-[#ddcaa8]/60 text-xs font-mono text-[#694e3c]">
            <Clock className="w-3.5 h-3.5 text-[#8c6b53]" />
            <span>Link expires in 15:00</span>
          </div>
        </div>

        {/* Title */}
        <div className="mt-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#8c6b53]">
            SET NEW CREDENTIAL
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#2b170e] mt-1">
            Create a new password
          </h2>
          <p className="mt-2 text-xs text-[#715440] leading-relaxed">
            Choose a strong password for your WoodCraft ERP account. You'll use it the next time you
            log in.
          </p>
        </div>

        {!token && (
          <AuthAlert variant="warning" className="mt-5">
            No reset token was found in the link. Please open the reset link from your email again,
            or{' '}
            <Link to="/forget-pass" className="font-semibold hover:underline">
              request a new one
            </Link>
            .
          </AuthAlert>
        )}

        {errorMsg && (
          <AuthAlert variant="error" title="Reset Failed" className="mt-5">
            {errorMsg}
          </AuthAlert>
        )}

        {isSuccess ? (
          <>
            <AuthAlert variant="success" title="Password updated" className="mt-5">
              Your password has been reset successfully. You can now log in with your new password.
            </AuthAlert>
            <Link
              to="/login"
              className="mt-6 w-full py-3 px-4 rounded-xl bg-[#3b1e0f] hover:bg-[#2b1307] text-[#fffdfa] font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#4a2a17]/20 transition-all active:scale-[0.99]"
            >
              <span>Go to Login</span>
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <PasswordInput
                label="New Password"
                labelRight="(min 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••••••"
              />
              <PasswordStrengthMeter password={newPassword} />
            </div>

            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••••••"
            />

            <AuthSubmitButton
              loading={isPending}
              disabled={!token || newPassword.length < 6 || confirmPassword.length < 6}
              className="mt-2"
            >
              Reset Password
            </AuthSubmitButton>
          </form>
        )}

        {/* Back to login */}
        <div className="mt-6 pt-5 border-t border-[#ebdccd]/80 flex items-center justify-between text-xs">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 font-semibold text-[#4a2a17] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
          <span className="font-mono text-[#8c7462]">CREDENTIAL RECOVERY</span>
        </div>
      </AuthCard>
    </AuthPageShell>
  );
};
