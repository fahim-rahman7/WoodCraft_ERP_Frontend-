import { Check } from 'lucide-react';

/** Custom-styled checkbox used across auth forms. */
export const AuthCheckbox = ({ checked, onChange, children, className = '' }) => (
  <label className={`flex items-start gap-2.5 cursor-pointer text-xs text-[#523c2d] ${className}`}>
    <div className="relative flex items-center mt-0.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div
        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
          checked ? 'bg-[#3b1e0f] border-[#3b1e0f] text-white' : 'bg-[#fcf8f2] border-[#ddcaa8]'
        }`}
      >
        {checked && <Check className="w-3 h-3 stroke-[3]" />}
      </div>
    </div>
    <span className="leading-snug">{children}</span>
  </label>
);
