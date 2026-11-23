import { Flame, Headphones } from 'lucide-react';

export const AuthTopBar = () => (
  <header className="hidden lg:flex items-center justify-between px-8 py-3.5 border-b border-[#ebdccd]/80 bg-[#fdf9f2]/90 backdrop-blur z-20">
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-[#4a2a17] flex items-center justify-center text-[#fdf9f2] shadow-sm">
        <Flame className="w-4 h-4 text-[#e0a96d]" />
      </div>
      <div>
        <div className="text-sm font-bold tracking-tight text-[#2b170e]">WoodCraft ERP</div>
        <div className="text-[10px] tracking-wider uppercase font-semibold text-[#8c6b53]">
          Timber &amp; Plant Ops
        </div>
      </div>
    </div>

    <div className="flex items-center gap-6 text-xs text-[#715440]">
      <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#ebdccd]/60 border border-[#ddcaa8]/50">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="font-mono font-medium tracking-tight">NODE: CTG-PLANT-01</span>
      </div>
      <a
        href="#support"
        className="flex items-center gap-1.5 font-medium hover:text-[#4a2a17] transition-colors"
      >
        <Headphones className="w-3.5 h-3.5" />
        <span>Facility Support</span>
      </a>
    </div>
  </header>
);
