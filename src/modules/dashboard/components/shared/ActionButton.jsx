export const ActionButton = ({ variant = 'primary', icon: Icon, children, ...props }) => (
  <button
    type="button"
    className={`inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3.5 py-2 text-sm font-semibold transition-colors cursor-pointer ${
      variant === 'primary'
        ? 'bg-[#3b2213] text-white hover:bg-[#4d2e1a]'
        : 'border border-[#e2d6c8] bg-[#efe7dd] text-[#2a1a10] hover:bg-[#e6dccf]'
    }`}
    {...props}
  >
    {Icon && <Icon className="h-4 w-4" />}
    {children}
  </button>
);
