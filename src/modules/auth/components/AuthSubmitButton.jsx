import { ArrowRight } from 'lucide-react';

/** Primary dark submit button with a built-in loading spinner. */
export const AuthSubmitButton = ({
  loading = false,
  disabled = false,
  icon: Icon = ArrowRight,
  children,
  className = '',
}) => (
  <button
    type="submit"
    disabled={loading || disabled}
    className={`w-full py-3 px-4 rounded-xl bg-[#3b1e0f] hover:bg-[#2b1307] text-[#fffdfa] font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#4a2a17]/20 transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer ${className}`}
  >
    {loading ? (
      <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
    ) : (
      <>
        <span>{children}</span>
        {Icon && <Icon className="w-4 h-4" />}
      </>
    )}
  </button>
);
