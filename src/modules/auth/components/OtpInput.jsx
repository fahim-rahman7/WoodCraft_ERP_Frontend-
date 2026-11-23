import { useEffect, useRef } from 'react';

/**
 * Six-box OTP input. Controlled via `value` (array of 6 strings) + `onChange`.
 * `resetSignal` changing re-focuses the first box (used after a resend).
 */
export const OtpInput = ({ value, onChange, hasError = false, resetSignal = 0 }) => {
  const refs = useRef([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, [resetSignal]);

  const handleChange = (index, raw) => {
    const char = raw.replace(/\D/g, '').slice(-1);
    const next = [...value];
    next[index] = char;
    onChange(next);
    if (char && index < 5) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        refs.current[index - 1]?.focus();
      } else {
        const next = [...value];
        next[index] = '';
        onChange(next);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const next = [...value];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    onChange(next);

    const nextIndex = Math.min(pasted.length, 5);
    refs.current[nextIndex]?.focus();
  };

  return (
    <div className="grid grid-cols-6 gap-2 sm:gap-3">
      {value.map((digit, index) => {
        const isLastActive = index === 5 && hasError;
        return (
          <input
            key={index}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`w-full aspect-square sm:h-14 text-center font-bold text-xl sm:text-2xl rounded-xl border transition-all outline-none font-mono ${
              isLastActive
                ? 'bg-[#fbeaea] border-[#e7a3a0] text-[#a82d24] focus:ring-2 focus:ring-red-400/20'
                : hasError
                  ? 'bg-[#fcf8f2] border-[#e2cfbe] text-[#2b170e] focus:border-[#4a2a17] focus:ring-2 focus:ring-[#4a2a17]/15'
                  : 'bg-[#fcf8f2] border-[#ddcaa8] text-[#2b170e] focus:border-[#4a2a17] focus:ring-2 focus:ring-[#4a2a17]/20'
            }`}
          />
        );
      })}
    </div>
  );
};
