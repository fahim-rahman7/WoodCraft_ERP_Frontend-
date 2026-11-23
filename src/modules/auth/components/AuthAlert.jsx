import { AlertCircle, CheckCircle2 } from 'lucide-react';

const VARIANTS = {
  error: {
    Icon: AlertCircle,
    box: 'bg-[#faeceb] border-[#f3c9c6] text-[#7d2019]',
    icon: 'text-[#d93829]',
    title: 'text-[#8b1e16]',
    body: 'text-[#a82d24]',
  },
  success: {
    Icon: CheckCircle2,
    box: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    icon: 'text-emerald-600',
    title: 'text-emerald-800',
    body: 'text-emerald-700',
  },
  warning: {
    Icon: AlertCircle,
    box: 'bg-[#f5efe6] border-[#e4d3c1] text-[#523c2d]',
    icon: 'text-[#8b5a2b]',
    title: 'text-[#3b2316]',
    body: 'text-[#523c2d]',
  },
};

/** Inline alert banner with error / success / warning variants. */
export const AuthAlert = ({ variant = 'error', title, children, className = '' }) => {
  const v = VARIANTS[variant] || VARIANTS.error;
  const Icon = v.Icon;

  return (
    <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${v.box} ${className}`}>
      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${v.icon}`} />
      <div className="flex-1">
        {title && <div className={`font-bold ${v.title}`}>{title}</div>}
        <div className={`leading-relaxed ${title ? 'mt-0.5' : ''} ${v.body}`}>{children}</div>
      </div>
    </div>
  );
};
