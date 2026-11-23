import { getPasswordStrength } from '../utils/passwordStrength';

/** Four-segment password strength meter. */
export const PasswordStrengthMeter = ({ password }) => {
  const { label, score } = getPasswordStrength(password);

  return (
    <>
      <div className="mt-2 flex items-center justify-between text-[11px]">
        <span className="text-[#8c7462]">Password strength</span>
        <span className="font-bold text-[#3b1e0f]">{label}</span>
      </div>
      <div className="mt-1 grid grid-cols-4 gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((segment) => (
          <div
            key={segment}
            className={`rounded-full transition-colors ${
              score >= segment ? 'bg-[#4a2a17]' : 'bg-[#e4d3c1]'
            }`}
          ></div>
        ))}
      </div>
    </>
  );
};
