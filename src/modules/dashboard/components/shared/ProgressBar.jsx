const BAR_COLORS = {
  brown: 'bg-[#3b2213]',
  red: 'bg-red-500',
  amber: 'bg-amber-500',
  green: 'bg-emerald-600',
};

export const ProgressBar = ({ value, max, tone = 'brown' }) => {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f1ebe3]">
      <div
        className={`h-full rounded-full ${BAR_COLORS[tone] || BAR_COLORS.brown}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};
