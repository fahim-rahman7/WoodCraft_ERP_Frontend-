import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import { useLogout } from '../modules/auth/hooks/useAuthMutations';

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentOrg } = useTenant();
  const { mutate: logout, isPending } = useLogout();

  // Navigation Links configuration
  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Inventory & Stock', path: '/inventory', icon: '📦' },
    { name: 'Sales & Orders', path: '/sales', icon: '🛒' },
    { name: 'Billing & Plans', path: '/billing', icon: '💳' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 hidden md:flex">
        {/* Logo / Brand Area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-white font-bold text-lg tracking-wide flex items-center gap-2">
            🪵 WoodCraft ERP
          </span>
        </div>

        {/* Workspace Info Card inside Sidebar */}
        {currentOrg && (
          <div className="mx-4 mt-5 p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Active Workspace
            </div>
            <div className="text-white font-medium text-sm truncate mb-2">
              {currentOrg.name}
            </div>
            <button
              onClick={() => navigate('/select-org')}
              className="w-full py-1.5 px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-lg font-medium transition-colors cursor-pointer text-center block"
            >
              Switch Workspace
            </button>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-base">{link.icon}</span>
                {link.name}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Info */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => logout()}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            {isPending ? 'Logging out...' : '🚪 Log Out'}
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar for Mobile & Quick Actions */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <h1 className="text-slate-900 font-bold text-base md:text-lg">
              {currentOrg ? `${currentOrg.name} Dashboard` : 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/select-org')}
              className="md:hidden px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
            >
              Switch Org
            </button>
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {currentOrg?.name?.charAt(0) || 'W'}
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};