export const LegendDot = ({ color, label }) => (
  <span className="inline-flex items-center gap-1.5 text-xs text-[#6b5d52]">
    <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
    {label}
  </span>
);
