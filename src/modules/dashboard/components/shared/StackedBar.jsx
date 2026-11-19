import { formatNumber } from '../dashboardTheme';

// Horizontal segmented bar, e.g. Open / In progress / Completed.
export const StackedBar = ({ segments }) => {
  const total = segments.reduce((sum, s) => sum + (Number(s.value) || 0), 0);
  return (
    <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#f1ebe3]">
      {total > 0 &&
        segments.map((s) =>
          s.value > 0 ? (
            <div
              key={s.label}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{ width: `${(s.value / total) * 100}%`, backgroundColor: s.color }}
              title={`${s.label}: ${formatNumber(s.value)}`}
            />
          ) : null
        )}
    </div>
  );
};
