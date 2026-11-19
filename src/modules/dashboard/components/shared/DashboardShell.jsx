// Paints the whole dashboard body in the warm cream tone (cancels the layout's padding).
export const DashboardShell = ({ children }) => (
  <div className="-m-6 min-h-full bg-[#f7f3ee] p-6 text-[#2a1a10] lg:-m-8 lg:p-8">
    <div className="mx-auto w-full max-w-[1400px] space-y-6">{children}</div>
  </div>
);
