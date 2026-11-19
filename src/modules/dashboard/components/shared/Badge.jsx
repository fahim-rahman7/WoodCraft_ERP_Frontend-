const TONES = {
  red: 'bg-red-50 text-red-700 border-red-200',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  brown: 'bg-[#3b2213] text-white border-[#3b2213]',
  neutral: 'bg-[#f6f0e9] text-[#5a3e2b] border-[#e2d6c8]',
};

export const Badge = ({ tone = 'neutral', children, className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 whitespace-nowrap rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${TONES[tone] || TONES.neutral} ${className}`}
  >
    {children}
  </span>
);
