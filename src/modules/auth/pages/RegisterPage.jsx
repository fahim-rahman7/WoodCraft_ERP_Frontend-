import { useState } from 'react';
import {
  User,
  Mail,
  Building2,
  ChevronDown,
  ShieldCheck,
  Gauge,
  QrCode,
  Warehouse,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthPageShell } from '../components/AuthPageShell';
import { AuthBrandPanel } from '../components/AuthBrandPanel';
import { AuthCard } from '../components/AuthCard';
import { AuthInput } from '../components/AuthInput';
import { PasswordInput } from '../components/PasswordInput';
import { AuthCheckbox } from '../components/AuthCheckbox';
import { AuthAlert } from '../components/AuthAlert';
import { AuthSubmitButton } from '../components/AuthSubmitButton';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';
import { useRegister } from '../hooks/useRegister';

const FEATURES = [
  {
    icon: Gauge,
    title: 'Precision Kiln & Moisture Tracking',
    description:
      'Real-time moisture content sensor telemetry from green log to kiln-cured specs across automated kilns.',
    badge: '10% MC',
  },
  {
    icon: QrCode,
    title: 'End-to-End Batch Traceability',
    description:
      'Trace CFT volumes, saw log allocations, and cutting tickets down to individual joinery work orders.',
    badge: 'CFT Ledger',
  },
  {
    icon: Warehouse,
    title: 'Multi-Yard & Depot Inventory',
    description:
      'Live ledger for raw logs, planed teak, sheesham planks, brass fittings, and dispatch shipments.',
    badge: 'DAC / CTG',
  },
];

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [assignedFacility, setAssignedFacility] = useState('DHK-02');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const { mutate: register, isPending } = useRegister();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreeTerms) return;
    setErrorMsg('');

    register(
      { name: fullName, email, password },
      {
        onSuccess: () => {
          // Move the new operator to the OTP verification step
          navigate(`/verify-otp?email=${encodeURIComponent(email)}`, { replace: true });
        },
        onError: (err) => {
          setErrorMsg(
            err.response?.data?.message || err.message || 'Registration failed. Please try again.'
          );
        },
      }
    );
  };

  return (
    <AuthPageShell
      brand={
        <AuthBrandPanel
          subtitle="TIMBER OS • PLANT OPS"
          features={FEATURES}
          footerLeft="Dhaka Plant #02 & Central Depots"
          footerRight="Encrypted TLS 1.3 Certified"
        />
      }
    >
      <AuthCard maxWidth="max-w-[530px]">
        {/* Header badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ebdccd]/50 text-[#543b2a] text-[11px] font-semibold tracking-wide border border-[#ddcaa8]/50">
          <ShieldCheck className="w-3.5 h-3.5 text-[#8b5a2b]" />
          OPERATOR & MANAGEMENT PORTAL
        </div>

        {/* Title */}
        <div className="mt-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#2b170e]">Create your account</h2>
          <p className="mt-1 text-xs text-[#715440] leading-relaxed">
            Set up your operator or managerial credentials for WoodCraft ERP.
          </p>
        </div>

        {errorMsg && (
          <AuthAlert variant="error" className="mt-5">
            {errorMsg}
          </AuthAlert>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <AuthInput
            label="Full Name"
            icon={User}
            labelRight="(min 4 characters)"
            type="text"
            required
            minLength={4}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            hint="Must be at least 4 characters as registered in HR payroll."
            placeholder="Tariqul Islam"
          />

          <AuthInput
            label="Work Email"
            icon={Mail}
            labelRight="Corporate ID"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputClassName="font-mono"
            placeholder="e.g. tariqul@bengaltimber.com"
          />

          <AuthInput
            as="select"
            label="Assigned Facility / Plant"
            icon={Building2}
            value={assignedFacility}
            onChange={(e) => setAssignedFacility(e.target.value)}
            inputClassName="text-xs font-medium appearance-none"
            trailing={
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#8c6b53]">
                <ChevronDown className="w-4 h-4" />
              </div>
            }
          >
            <option value="DHK-02">Dhaka Plant #02 (Savar Industrial Area)</option>
            <option value="CTG-01">Chittagong Sawmill & Export Terminal (CTG-01)</option>
            <option value="SYL-01">Sylhet Hardwood Reserve Depot (SYL-01)</option>
          </AuthInput>

          <div>
            <PasswordInput
              label="Password"
              labelRight="(min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••••••"
            />
            <PasswordStrengthMeter password={password} />
            <p className="mt-1 text-[11px] text-[#8c7462]">
              Minimum 6 characters. Use letters, numbers, and symbols.
            </p>
          </div>

          <div className="pt-1">
            <AuthCheckbox checked={agreeTerms} onChange={setAgreeTerms}>
              I agree to the{' '}
              <a href="#terms" className="font-semibold text-[#3b1e0f] underline hover:text-[#4a2a17]">
                Factory Operating Terms
              </a>{' '}
              &amp;{' '}
              <a href="#security" className="font-semibold text-[#3b1e0f] underline hover:text-[#4a2a17]">
                Data Security Protocol
              </a>
              .
            </AuthCheckbox>
          </div>

          <AuthSubmitButton loading={isPending} disabled={!agreeTerms} className="mt-2">
            Create account
          </AuthSubmitButton>
        </form>

        <div className="mt-6 text-center text-xs text-[#523c2d]">
          <span>Already registered? </span>
          <Link to="/login" className="font-bold text-[#4a2a17] hover:underline">
            Log in
          </Link>
        </div>
      </AuthCard>
    </AuthPageShell>
  );
};
