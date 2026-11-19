import { CalendarDays } from 'lucide-react';
import { todayLabel } from '../dashboardTheme';
import { Badge } from './Badge';

export const PageHeader = ({ eyebrow, tag, title, subtitle, actions }) => (
  <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6b5d52]">
          {eyebrow}
        </span>
        {tag && <Badge tone="neutral">{tag}</Badge>}
      </div>
      <h1 className="mt-2 font-serif text-3xl font-bold leading-tight text-[#2a1a10] sm:text-4xl">
        {title}
      </h1>
      {subtitle && <p className="mt-1.5 max-w-2xl text-sm text-[#6b5d52]">{subtitle}</p>}
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-[#e2d6c8] bg-white px-3 py-2 font-mono text-[11px] text-[#5a3e2b]">
        <CalendarDays className="h-3.5 w-3.5" />
        Today · {todayLabel()}
      </span>
      {actions}
    </div>
  </div>
);
