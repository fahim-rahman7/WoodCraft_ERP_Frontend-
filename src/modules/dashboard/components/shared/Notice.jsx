export const Notice = ({ icon: Icon, title, children, action, tone = 'neutral' }) => (
  <div
    className={`flex flex-col gap-3 rounded-lg border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
      tone === 'warn' ? 'border-amber-200 bg-amber-50' : 'border-[#e2d6c8] bg-[#efe5d8]'
    }`}
  >
    <div className="flex items-start gap-3 text-sm text-[#3b2213]">
      {Icon && (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white/70">
          <Icon className="h-3.5 w-3.5" />
        </span>
      )}
      <p className="pt-0.5">
        {title && <span className="font-semibold">{title} </span>}
        {children}
      </p>
    </div>
    {action}
  </div>
);
