// Beige tile with a label and a value. With an icon it is compact; without one the value is large.
export const StatTile = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-lg bg-[#f6f0e9] p-3">
    {Icon && (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-[#3b2213]">
        <Icon className="h-4 w-4" />
      </span>
    )}
    <div className="min-w-0">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8a7b6f]">{label}</p>
      <p className={`font-serif font-bold text-[#2a1a10] ${Icon ? 'text-sm' : 'mt-1 text-2xl'}`}>{value}</p>
    </div>
  </div>
);
