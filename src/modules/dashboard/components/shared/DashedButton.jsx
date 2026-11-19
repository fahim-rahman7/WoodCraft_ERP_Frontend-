// Full-width dashed call-to-action, e.g. "Invite a new member".
export const DashedButton = ({ icon: Icon, children, className = '', ...props }) => (
  <button
    type="button"
    className={`inline-flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-[#c9b39c] py-2.5 text-sm font-semibold text-[#3b2213] transition-colors hover:bg-[#f6f0e9] cursor-pointer ${className}`}
    {...props}
  >
    {Icon && <Icon className="h-4 w-4" />}
    {children}
  </button>
);
