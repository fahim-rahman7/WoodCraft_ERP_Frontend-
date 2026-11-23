import { useState } from 'react';
import {
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
  Headphones,
  Clock,
  Gauge,
  QrCode,
  Warehouse,
  Box,
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthPageShell } from '../components/AuthPageShell';
import { AuthBrandPanel } from '../components/AuthBrandPanel';
import { AuthCard } from '../components/AuthCard';
import { AuthCheckbox } from '../components/AuthCheckbox';
import { AuthAlert } from '../components/AuthAlert';
import { AuthSubmitButton } from '../components/AuthSubmitButton';
import { OtpInput } from '../components/OtpInput';
import { useVerifyOtp } from '../hooks/useVerifyOtp';
import { useResendOtp } from '../hooks/useResendOtp';
import { useCountdown } from '../hooks/useCountdown';

const EMPTY_OTP = ['', '', '', '', '', ''];
const RESEND_COOLDOWN = 45;

const FEATURES = [
  {
    icon: Gauge,
    title: 'Precision Kiln & Moisture Tracking',
    description:
      'Real-time moisture content sensor telemetry from green log intake to 10% kiln specification.',
    badge: '10% MC',
  },
  {
    icon: QrCode,
    title: 'End-to-End Batch Traceability',
    description:
      'Trace CFT volumes, saw log allocations, and cutting tickets down to individual line operators.',
    badge: 'CFT-LEDGER',
  },
  {
    icon: Warehouse,
    title: 'Multi-Yard & Depot Inventory',
    description:
      'Live ledger for raw logs, planks, brass hardware, and consignment transfers across Dhaka and Chittagong.',
    badge: 'DAC / CTG',
  },
];

export const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState(EMPTY_OTP);
  const [trustTerminal, setTrustTerminal] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [resetSignal, setResetSignal] = useState(0);

  const { seconds, canResend, start } = useCountdown(RESEND_COOLDOWN);
  const { mutate: verify, isPending } = useVerifyOtp();
  const { mutate: resend, isPending: isResending } = useResendOtp();

  const handleChange = (next) => {
    setOtp(next);
    if (hasError) setHasError(false);
  };

  const handleResend = () => {
    if (!canResend) return;
    setHasError(false);
    setNotice('');
    setOtp(EMPTY_OTP);
    setResetSignal((n) => n + 1);

    resend(
      { email },
      {
        onSuccess: () => {
          start(RESEND_COOLDOWN);
          setNotice('A fresh 6-digit verification code has been sent to your email.');
        },
        onError: (err) => {
          setHasError(true);
          setErrorMessage(
            err.response?.data?.message || err.message || 'Could not resend the code.'
          );
        },
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return;

    setHasError(false);
    setNotice('');

    verify(
      { email, otp: code },
      {
        onSuccess: () => {
          navigate('/login', { replace: true });
        },
        onError: (err) => {
          setHasError(true);
          setErrorMessage(
            err.response?.data?.message || err.message || 'Invalid or expired OTP.'
          );
        },
      }
    );
  };

  return (
    <AuthPageShell
      brand={
        <AuthBrandPanel
          subtitle="TIMBER & PROCESSING OS"
          eyebrow="MANUFACTURING TELEMETRY & ERP"
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
            <ShieldCheck className="w-6 h-6 text-[#7a4825]" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4ece3] border border-[#ddcaa8]/60 text-xs font-mono text-[#694e3c]">
            <Clock className="w-3.5 h-3.5 text-[#8c6b53]" />
            <span>Code expires in 10:00</span>
          </div>
        </div>

        {/* Title */}
        <div className="mt-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#8c6b53]">
            ACCESS AUTHORIZATION
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#2b170e] mt-1">
            Two-Factor Authentication
          </h2>
          <div className="mt-2 text-xs text-[#715440] leading-relaxed flex flex-wrap items-center gap-1.5">
            <span>We sent a 6-digit verification code to</span>
            <span className="font-mono font-semibold px-1.5 py-0.5 bg-[#f6eee5] text-[#3b1e0f] rounded border border-[#e8d7c5]">
              {email || 'your email'}
            </span>
            <Link
              to="/login"
              className="font-semibold text-[#4a2a17] hover:underline inline-flex items-center gap-0.5 ml-1"
            >
              Change email →
            </Link>
          </div>
        </div>

        {!email && (
          <AuthAlert variant="warning" className="mt-5">
            No email address was provided. Please log in again so we know where to send your code.
          </AuthAlert>
        )}

        {notice && (
          <AuthAlert variant="success" className="mt-5">
            {notice}
          </AuthAlert>
        )}

        <form onSubmit={handleSubmit} className="mt-7">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#694e3c]">
              Terminal Passcode (OTP)
            </label>
            <span className="text-[10px] font-mono text-[#8c7462] tracking-wider uppercase">
              6-DIGIT SYNC
            </span>
          </div>

          <OtpInput
            value={otp}
            onChange={handleChange}
            hasError={hasError}
            resetSignal={resetSignal}
          />

          {hasError && errorMessage && (
            <AuthAlert variant="error" title="Invalid OTP" className="mt-4">
              {errorMessage}
            </AuthAlert>
          )}

          {/* Resend */}
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-[#715440]">Didn't receive the email?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isResending}
              className={`inline-flex items-center gap-1.5 font-medium transition-colors ${
                canResend
                  ? 'text-[#4a2a17] hover:underline font-semibold cursor-pointer'
                  : 'text-[#9c8472] cursor-not-allowed opacity-80'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>
                {canResend
                  ? isResending
                    ? 'Sending...'
                    : 'Resend code'
                  : `Resend code (available in ${seconds}s)`}
              </span>
            </button>
          </div>

          <AuthSubmitButton
            loading={isPending}
            disabled={!email || otp.join('').length < 6}
            className="mt-5"
          >
            Verify &amp; Enter Dashboard
          </AuthSubmitButton>

          <div className="mt-4 flex items-center">
            <AuthCheckbox checked={trustTerminal} onChange={setTrustTerminal}>
              <span className="font-medium">
                Trust this terminal for 30 days (Plant Workstation)
              </span>
            </AuthCheckbox>
          </div>
        </form>

        {/* Back to login / help */}
        <div className="mt-6 pt-5 border-t border-[#ebdccd]/80 flex items-center justify-between text-xs">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 font-semibold text-[#4a2a17] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
          <a
            href="#admin"
            className="inline-flex items-center gap-1.5 text-[#715440] hover:text-[#2b170e]"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Need help? Contact Plant IT Admin</span>
          </a>
        </div>

        {/* Session info bar */}
        <div className="mt-4 p-2.5 rounded-lg bg-[#f7f2eb] border border-[#ebdccd] flex items-center justify-between text-[11px] font-mono text-[#8c7462]">
          <div className="flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-[#7a4825]" />
            <span>SESSION: 0x9F41-TK-CTG</span>
          </div>
          <span className="font-semibold text-[#5a3a25]">2FA-MFA ACTIVE</span>
        </div>
      </AuthCard>
    </AuthPageShell>
  );
};
