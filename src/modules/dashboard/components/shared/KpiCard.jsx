import { Badge } from './Badge';

export const KpiCard = ({ label, badge, badgeTone = 'neutral', value, unit, alert = false, sub, footer }) => (
  <div className="flex flex-col rounded-xl border border-[#ece4da] bg-white p-4 shadow-[0_1px_2px_rgba(60,35,20,0.05)]">
    <div className="flex items-start justify-between gap-2">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b5d52]">
        {label}
      </span>
      {badge && <Badge tone={badgeTone}>{badge}</Badge>}
    </div>
    <div className={`mt-2 font-serif text-2xl font-bold ${alert ? 'text-red-600' : 'text-[#2a1a10]'}`}>
      {value}
      {unit && <span className="ml-1.5 text-lg">{unit}</span>}
    </div>
    {sub && <p className="mt-1 text-xs text-[#8a7b6f]">{sub}</p>}
    {footer && (
      <div className="mt-auto pt-3">
        <div className="border-t border-dashed border-[#ece4da] pt-2.5 font-mono text-[10px] uppercase tracking-wider text-[#8a7b6f]">
          {footer}
        </div>
      </div>
    )}
  </div>
);
