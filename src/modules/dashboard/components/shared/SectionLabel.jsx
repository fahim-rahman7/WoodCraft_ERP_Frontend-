// Small uppercase caption placed above a chart or block inside a card.
export const SectionLabel = ({ children, className = '' }) => (
  <p className={`font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b5d52] ${className}`}>
    {children}
  </p>
);
