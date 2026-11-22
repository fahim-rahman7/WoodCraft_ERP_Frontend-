/**
 * Right-side column with the white form card. Keeps the responsive
 * section padding + card chrome consistent across auth pages.
 */
export const AuthCard = ({ children, maxWidth = 'max-w-[510px]', className = '' }) => (
  <section className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 xl:p-16 relative">
    <div
      className={`w-full ${maxWidth} bg-white rounded-2xl border border-[#e5d6c5] shadow-xl shadow-[#4a2a17]/5 p-7 sm:p-9 relative z-10 ${className}`}
    >
      {children}
    </div>
  </section>
);
