export const EmptyState = ({ icon: Icon, title, text }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#e2d6c8] bg-[#fbf8f4] px-4 py-8 text-center">
    {Icon && (
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efe7dd] text-[#7a4a2a]">
        <Icon className="h-5 w-5" />
      </span>
    )}
    <p className="mt-3 font-serif text-sm font-bold text-[#2a1a10]">{title}</p>
    {text && <p className="mt-1 max-w-xs text-xs text-[#8a7b6f]">{text}</p>}
  </div>
);
