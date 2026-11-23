import { useState } from 'react';
import {
  Mail,
  ArrowRight,
  Warehouse,
  ChevronDown,
  Clock,
  ShieldCheck,
  Gauge,
  QrCode,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthPageShell } from '../components/AuthPageShell';
import { AuthBrandPanel } from '../components/AuthBrandPanel';
import { AuthCard } from '../components/AuthCard';
import { AuthInput } from '../components/AuthInput';
import { PasswordInput } from '../components/PasswordInput';
import { AuthCheckbox } from '../components/AuthCheckbox';
import { AuthAlert } from '../components/AuthAlert';
import { AuthSubmitButton } from '../components/AuthSubmitButton';
import { useLogin } from '../hooks/useLogin';

const FEATURES = [
  {
    icon: Gauge,
    title: 'Precision Kiln & Moisture Tracking',
    description:
      'Real-time moisture content sensor telemetry from raw river-floated logs to precise 10% industrial dry-kiln specs.',
    badge: '10.4% SPEC',
  },
  {
    icon: QrCode,
    title: 'End-to-End Batch Traceability',
    description:
      'Trace round log volumes, saw-mill allocations, yield loss ratios, and master cutting tickets down to specific joinery work orders.',
    badge: 'CFT METRICS',
  },
  {
    icon: Warehouse,
    title: 'Multi-Yard & Depot Inventory',
    description:
      'Live automated ledger for raw timber species, kiln-dried planks, brass fittings, and finished consignment logistics.',
    badge: 'DHK • CTG',
  },
];

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [defaultNode, setDefaultNode] = useState('CTG-MILL-MAIN');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setNeedsVerification(false);

    login(
      { email, password },
      {
        onError: (err) => {
          if (err.response?.status === 403) {
            // Account exists but email/OTP not verified yet
            setNeedsVerification(true);
          } else {
            setErrorMsg(
              err.response?.data?.message || err.message || 'Login failed. Please try again.'
            );
          }
        },
      }
    );
  };

  const verifyLink = `/verify-otp?email=${encodeURIComponent(email)}`;

  return (
    <AuthPageShell
      brand={
        <AuthBrandPanel
          subtitle="Industrial Forestry Suite"
          features={FEATURES}
          footerLeft="🔒 Dhaka Plant #02 & Central Depots • Encrypted TLS 1.3"
          footerRight="TELEMETRY ONLINE"
        />
      }
    >
      <AuthCard>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#2b170e]">
              Log in to your account
            </h2>
            <p className="mt-1 text-xs text-[#715440] leading-relaxed">
              Enter your corporate credentials to access the production workspace.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#f3eae0] text-[#694e3c] font-semibold border border-[#e4d3c1]">
            PLANT-PORTAL
          </span>
        </div>

        {/* Verification required notice (shown when backend rejects unverified account) */}
        {needsVerification && (
          <AuthAlert variant="error" title="Verification Required" className="mt-5">
            Please verify your corporate email before logging in.
            <Link
              to={verifyLink}
              className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-[#b5261b] hover:underline"
            >
              <span>Verify now</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </AuthAlert>
        )}

        {/* Generic error notice */}
        {errorMsg && (
          <AuthAlert variant="error" className="mt-5">
            {errorMsg}
          </AuthAlert>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <AuthInput
            label="Work Email"
            icon={Mail}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputClassName="font-mono"
            placeholder="tariqul@bengaltimber.com"
          />

          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••••••"
            labelRight={
              <Link to="/forget-pass" className="text-xs font-semibold text-[#4a2a17] hover:underline">
                Forgot password?
              </Link>
            }
          />

          {/* Remember terminal checkbox */}
          <div className="flex items-center justify-between pt-1">
            <AuthCheckbox checked={rememberTerminal} onChange={setRememberTerminal}>
              <span className="font-medium">Remember terminal session</span>
            </AuthCheckbox>
            <div className="flex items-center gap-1 text-[11px] font-mono text-[#8c7462]">
              <Clock className="w-3 h-3" />
              <span>30-day lease</span>
            </div>
          </div>

          <AuthSubmitButton loading={isPending} className="mt-3">
            Log in to Workspace
          </AuthSubmitButton>
        </form>

        {/* Create account callout */}
        <div className="mt-5 p-3 rounded-xl bg-[#f7f2eb] border border-[#ebdccd] text-center text-xs text-[#523c2d]">
          <span>Don't have an enterprise account? </span>
          <Link to="/register" className="font-bold text-[#4a2a17] hover:underline">
            Create an account
          </Link>
        </div>

        {/* Default node switcher */}
        <div className="mt-4 pt-4 border-t border-[#ebdccd]/70 flex items-center justify-between text-xs text-[#715440]">
          <div className="flex items-center gap-2">
            <Warehouse className="w-3.5 h-3.5 text-[#8b5a2b]" />
            <span className="text-[11px] text-[#8c7462]">Default Node:</span>
            <span className="font-mono font-semibold text-[#2b170e]">{defaultNode}</span>
          </div>
          <button
            type="button"
            onClick={() =>
              setDefaultNode(defaultNode === 'CTG-MILL-MAIN' ? 'SAVAR-YARD-02' : 'CTG-MILL-MAIN')
            }
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4a2a17] hover:underline cursor-pointer"
          >
            <span>Switch Node</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </AuthCard>

      {/* Security compliance stamp */}
      {/* <div className="mt-6 text-center text-[11px] text-[#8c7462]">
        <div className="flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#7a573e]" />
          <span>BD Cyber Act Standards &nbsp;•&nbsp; ISO 9001:2015 Timber Ops</span>
        </div>
        <div className="mt-1 text-[10px] text-[#a48e7f]">
          Secured by WoodCraft Enterprise Access & Biometric Logging Services.
        </div>
      </div> */}
    </AuthPageShell>
  );
};
