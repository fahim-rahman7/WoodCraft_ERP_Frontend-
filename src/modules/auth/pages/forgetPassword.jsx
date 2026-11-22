import { useState } from 'react';
import {
  ShieldCheck,
  RotateCcw,
  Mail,
  Building2,
  ChevronDown,
  ArrowLeft,
  Headphones,
  PhoneCall,
  Gauge,
  QrCode,
  Warehouse,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthPageShell } from '../components/AuthPageShell';
import { AuthBrandPanel } from '../components/AuthBrandPanel';
import { AuthCard } from '../components/AuthCard';
import { AuthInput } from '../components/AuthInput';
import { AuthAlert } from '../components/AuthAlert';
import { AuthSubmitButton } from '../components/AuthSubmitButton';
import { useForgotPassword } from '../hooks/useForgotPassword';

const FEATURES = [
  {
    icon: Gauge,
    title: 'Precision Kiln & Moisture Tracking',
    description: 'Live sensor feeds from drying chambers',
    badge: '10.4% SPEC',
  },
  {
    icon: QrCode,
    title: 'End-to-End Batch Traceability',
    description: 'Teak, Mahogany, Sheesham log chains',
    badge: 'CFT METRICS',
  },
  {
    icon: Warehouse,
    title: 'Multi-Yard & Depot Inventory',
    description: 'Inter-facility dispatch & cutting tickets',
    badge: 'DHK • CTG',
  },
];

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [terminalNode, setTerminalNode] = useState('CTG-01');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSuccess(false);

    forgotPassword(
      { email },
      {
        onSuccess: () => setIsSuccess(true),
        onError: (err) =>
          setErrorMsg(
            err.response?.data?.message ||
              err.message ||
              'Could not send the reset email. Please try again.'
          ),
      }
    );
  };

  return (
    <AuthPageShell
      brand={
        <AuthBrandPanel
          subtitle="Industrial Forestry Suite / V1.4 Enterprise"
          features={FEATURES}
          footerLeft="Dhaka Plant #02 & Central Depots • Encrypted TLS 1.3"
          footerRight="TELEMETRY ONLINE"
        />
      }
    >
      <AuthCard maxWidth="max-w-[530px]">
        {/* Top security header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#ebdccd]/70">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ebdccd]/50 text-[#543b2a] text-[11px] font-semibold tracking-wide border border-[#ddcaa8]/50">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8b5a2b]" />
            CREDENTIAL RECOVERY
          </div>
          <span className="text-[11px] font-mono text-[#8c7462]">PORTAL-SEC-409</span>
        </div>

        {/* Title */}
        <div className="mt-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#f7f2eb] border border-[#ebdccd] flex items-center justify-center text-[#4a2a17] shrink-0">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#2b170e]">
              Reset your password
            </h2>
            <p className="mt-1 text-xs text-[#715440] leading-relaxed">
              Enter your registered corporate work email address. We'll send an encrypted reset
              authorization link and 6-digit recovery OTP.
            </p>
          </div>
        </div>

        {/* Domain notice */}
        <AuthAlert variant="warning" className="mt-5">
          <strong className="font-semibold text-[#3b2316]">Domain Clearance Required:</strong>{' '}
          Resets are strictly restricted to authenticated plant operators with an active corporate
          address (
          <span className="font-semibold text-[#4a2a17]">@bengaltimber.com</span> or registered
          sawmill tenant domain).
        </AuthAlert>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <AuthInput
            label="Corporate Work Email"
            icon={Mail}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputClassName="font-mono"
            placeholder="operator@bengaltimber.com"
          />

          <AuthInput
            as="select"
            label="Assigned Plant / Terminal Node"
            icon={Building2}
            labelRight="Optional Routing"
            value={terminalNode}
            onChange={(e) => setTerminalNode(e.target.value)}
            inputClassName="text-xs font-medium appearance-none"
            trailing={
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#8c6b53]">
                <ChevronDown className="w-4 h-4" />
              </div>
            }
          >
            <option value="CTG-01">Chittagong Sawmill & Export Terminal (CTG-01)</option>
            <option value="DHK-02">Savar Joinery & Kiln Plant #02 (DHK-02)</option>
            <option value="SYL-01">Sylhet Hardwood Reserve Depot (SYL-01)</option>
          </AuthInput>

          <AuthSubmitButton loading={isPending} className="mt-2">
            Send Recovery Link &amp; OTP
          </AuthSubmitButton>
        </form>

        {errorMsg && (
          <AuthAlert variant="error" title="Reset Failed" className="mt-4">
            {errorMsg}
          </AuthAlert>
        )}

        {isSuccess && (
          <AuthAlert variant="success" className="mt-4">
            Recovery instructions and 6-digit OTP dispatched to your corporate email.
          </AuthAlert>
        )}

        {/* Terminal fallback */}
        <div className="mt-6 pt-5 border-t border-[#ebdccd]/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#9c8472] text-center mb-3">
            Terminal Fallback
          </div>

          <div className="flex items-center justify-between text-xs mb-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 font-semibold text-[#4a2a17] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Remember your password? Log in
            </Link>
            <a
              href="#admin"
              className="inline-flex items-center gap-1 text-[#715440] hover:text-[#2b170e]"
            >
              <Headphones className="w-3 h-3" />
              Contact Plant IT Admin
            </a>
          </div>

          <div className="p-3 rounded-xl bg-[#f7f2eb] border border-[#ebdccd] flex items-center justify-between text-xs text-[#523c2d]">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-[#8b5a2b]" />
              <span>
                Plant Dispatch Desk:{' '}
                <strong className="font-mono text-[#2b170e]">+880 (02) 988-2101 ext #402</strong>
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
              24/7 SHIFT
            </span>
          </div>

          <div className="mt-4 text-[10px] font-mono text-[#8c7462] flex items-center justify-between">
            <span>TERMINAL AUTH: CTG-RECOVERY-GATEWAY</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#7a573e]" />
              BD Cyber Act Standards • ISO 9001:2015
            </span>
          </div>
        </div>
      </AuthCard>
    </AuthPageShell>
  );
};
