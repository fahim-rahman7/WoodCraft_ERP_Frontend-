import { Outlet, useNavigate } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import { useLogout } from '../modules/auth/hooks/useAuthMutations';

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const { currentOrg } = useTenant();
  const { mutate: logout, isPending } = useLogout();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-6">
          <h3 className="m-0 text-slate-900 font-bold text-lg">Woodcraft ERP</h3>

          {/* Active Workspace Badge & Switch Button */}
          {currentOrg && (
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
              <span className="text-[13px] text-slate-600 font-medium">
                {currentOrg.name}
              </span>
              <button
                onClick={() => navigate('/select-org')}
                className="bg-transparent border-none text-blue-600 hover:text-blue-700 text-xs font-semibold underline cursor-pointer p-0"
              >
                Switch
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/select-org')}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-md text-slate-700 cursor-pointer text-[13px] font-medium transition-colors"
          >
            + New / Switch Org
          </button>

          <button
            onClick={() => logout()}
            disabled={isPending}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-md cursor-pointer font-medium text-[13px] transition-colors"
          >
            {isPending ? 'Logging out...' : 'Log Out'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
};