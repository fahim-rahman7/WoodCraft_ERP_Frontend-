/**
 * Labelled input / select with an optional leading icon and trailing slot.
 * Accepts all native input/select props via `...props`.
 */
export const AuthInput = ({
  label,
  icon: Icon,
  labelRight,
  hint,
  trailing,
  className = '',
  inputClassName = '',
  as: Comp = 'input',
  children,
  ...props
}) => (
  <div className={className}>
    {(label || labelRight) && (
      <div className="flex items-center justify-between mb-1.5">
        {label && (
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#694e3c]">
            {label}
          </label>
        )}
        {labelRight && <span className="text-[10px] text-[#9c8472] font-mono">{labelRight}</span>}
      </div>
    )}

    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8c6b53]">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <Comp
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${trailing ? 'pr-10' : 'pr-4'} py-2.5 rounded-lg bg-[#fcf8f2] border border-[#ddcaa8] text-sm text-[#2b170e] focus:outline-none focus:ring-2 focus:ring-[#4a2a17]/20 focus:border-[#4a2a17] transition-all ${inputClassName}`}
        {...props}
      >
        {children}
      </Comp>
      {trailing}
    </div>

    {hint && <p className="mt-1 text-[11px] text-[#8c7462]">{hint}</p>}
  </div>
);
