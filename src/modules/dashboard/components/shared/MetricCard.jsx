// Stat card with an icon box and an optional progress bar (used on list pages, e.g. Suppliers).
export const MetricCard = ({ label, icon: Icon, value, unit, sub, progress }) => (
  <div className="flex flex-col rounded-xl border border-[#ece4da] bg-white p-4 shadow-[0_1px_2px_rgba(60,35,20,0.05)]">
    <div className="flex items-start justify-between gap-2">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b5d52]">
        {label}
      </span>
      {Icon && (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#ece4da] bg-[#f6f0e9] text-[#7a4a2a]">
          <Icon className="h-4 w-4" />
        </span>
      )}
    </div>
    <div className="mt-1 font-serif text-2xl font-bold text-[#2a1a10]">
      {value}
      {unit && <span className="ml-1.5 text-lg">{unit}</span>}
    </div>
    {sub && <div className="mt-1 text-xs text-[#8a7b6f]">{sub}</div>}
    {progress != null && (
      <div className="mt-auto pt-3">
        <div className="h-1 w-full overflow-hidden rounded-full bg-[#f1ebe3]">
          <div
            className="h-full rounded-full bg-[#3b2213]"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      </div>
    )}
  </div>
);
