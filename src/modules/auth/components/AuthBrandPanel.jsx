import { Flame } from 'lucide-react';

/**
 * Left-side marketing/brand panel shared by every auth page.
 * Content is data-driven so each page can supply its own copy.
 */
export const AuthBrandPanel = ({
  subtitle = 'Industrial Forestry Suite',
  eyebrow,
  features = [],
  footerLeft = 'Dhaka Plant #02 & Central Depots',
  footerRight = 'TELEMETRY ONLINE',
}) => (
  <section className="lg:w-[46%] xl:w-[44%] bg-[#361e12] text-[#f7f3ec] p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden">
    {/* Concentric growth-ring watermark */}
    <div className="absolute -left-12 top-1/4 w-[520px] h-[520px] rounded-full border border-white/[0.04] pointer-events-none"></div>
    <div className="absolute -left-28 top-1/4 w-[680px] h-[680px] rounded-full border border-white/[0.03] pointer-events-none"></div>
    <div className="absolute -left-44 top-1/4 w-[840px] h-[840px] rounded-full border border-dashed border-white/[0.02] pointer-events-none"></div>

    <div className="relative z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center backdrop-blur-sm shadow-inner">
            <Flame className="w-5 h-5 text-[#e6b17e]" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-white">WoodCraft ERP</div>
            <div className="text-[11px] tracking-wider uppercase font-semibold text-[#caa78e]">
              {subtitle}
            </div>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-mono text-[#ecd8c7] border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          v1.4 Enterprise
        </div>
      </div>

      <div className="mt-12 lg:mt-16">
        {eyebrow && (
          <div className="text-[11px] font-mono tracking-wider text-[#caa78e] uppercase mb-2">
            {eyebrow}
          </div>
        )}
        <h1 className="text-3xl lg:text-[40px] font-extrabold text-[#fffdfa] leading-[1.16] tracking-tight max-w-lg">
          From timber to finished furniture, one source of truth.
        </h1>
        <p className="mt-4 text-[#c7b5a7] text-sm lg:text-[15px] leading-relaxed max-w-md">
          The complete enterprise operating system engineered for timber milling, kiln drying, batch
          compliance, and furniture craftsmanship in Bangladesh.
        </p>
      </div>

      <div className="mt-10 space-y-3.5 max-w-md">
        {features.map(({ icon: Icon, title, description, badge }) => (
          <div
            key={title}
            className="p-3.5 rounded-xl bg-black/20 border border-white/10 backdrop-blur-sm flex items-start justify-between hover:bg-black/30 transition-all"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#4a2a17] flex items-center justify-center text-[#e6b17e] shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">{title}</div>
                <div className="text-[11px] text-[#b39e8f] leading-snug mt-0.5">{description}</div>
              </div>
            </div>
            {badge && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#dfcfc2] border border-white/10 shrink-0 ml-2">
                {badge}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>

    <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#b8a18f] font-mono">
      <span>{footerLeft}</span>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span className="text-white text-[11px] tracking-wide">{footerRight}</span>
      </div>
    </div>
  </section>
);
