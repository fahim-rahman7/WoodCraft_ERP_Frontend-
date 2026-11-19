export const Card = ({ title, icon: Icon, meta, children, className = '', bodyClassName = '' }) => (
  <section
    className={`flex flex-col rounded-xl border border-[#ece4da] bg-white shadow-[0_1px_2px_rgba(60,35,20,0.05)] ${className}`}
  >
    {(title || meta) && (
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f1ebe3] px-5 py-3.5">
        <h2 className="flex items-center gap-2 font-serif text-base font-bold text-[#2a1a10]">
          {Icon && <Icon className="h-4 w-4 text-[#7a4a2a]" />}
          {title}
        </h2>
        {meta && (
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#8a7b6f]">
            {meta}
          </div>
        )}
      </header>
    )}
    <div className={`flex-1 p-5 ${bodyClassName}`}>{children}</div>
  </section>
);
