import { AuthTopBar } from './AuthTopBar';
import { AuthFooter } from './AuthFooter';

/**
 * Full-page layout for auth screens: top bar + split main area + footer.
 * `brand` renders the left panel, `children` render the right-side form card.
 */
export const AuthPageShell = ({ brand, children }) => (
  <div className="min-h-screen w-full bg-[#fdf9f2] text-[#2c2017] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col justify-between selection:bg-[#4a2a17] selection:text-white">
    <AuthTopBar />
    <main className="flex-1 flex flex-col lg:flex-row relative">
      {brand}
      {children}
    </main>
    <AuthFooter />
  </div>
);
