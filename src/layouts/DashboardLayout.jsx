import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import { useLogout } from '../modules/auth/hooks/useAuthMutations';

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentOrg } = useTenant();
  const { mutate: logout, isPending } = useLogout();

  // ইউজারের বর্তমান রোল (currentOrg থেকে নেওয়া, না থাকলে ডিফল্ট OWNER)
  const userRole = currentOrg?.myRole || 'STAFF';

  // স্ক্রিনশট অনুযায়ী সমস্ত মেনু ও সেকশন এবং কোন রোলের জন্য কোনটি দৃশ্যমান হবে তার ম্যাপিং
  const menuSections = [
    {
      section: 'OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: '📊', roles: ['OWNER', 'MANAGER', 'HR'] },
      ],
    },
    {
      section: 'PROCUREMENT',
      items: [
        { name: 'Suppliers', path: '/suppliers', icon: '🚚', roles: ['OWNER', 'MANAGER'] },
        { name: 'Purchase Orders', path: '/purchase-orders', icon: '📝', roles: ['OWNER', 'MANAGER'] },
      ],
    },
    {
      section: 'INVENTORY',
      items: [
        { name: 'Stock', path: '/inventory', icon: '📦', roles: ['OWNER', 'MANAGER'] },
        { name: 'Items', path: '/items', icon: '🏷️', roles: ['OWNER', 'MANAGER'] },
        { name: 'Categories', path: '/categories', icon: '📂', roles: ['OWNER', 'MANAGER'] },
        { name: 'Warehouses', path: '/warehouses', icon: '🏢', roles: ['OWNER', 'MANAGER'] },
        { name: 'Batches', path: '/batches', icon: '🏷️', roles: ['OWNER', 'MANAGER'] },
        { name: 'Goods Receipts', path: '/goods-receipts', icon: '📥', roles: ['OWNER', 'MANAGER'] },
        { name: 'Quality Inspections', path: '/quality-inspections', icon: '🔍', roles: ['OWNER', 'MANAGER'] },
        { name: 'Transfers', path: '/transfers', icon: '🔄', roles: ['OWNER', 'MANAGER'] },
        { name: 'Adjustments', path: '/adjustments', icon: '⚙️', roles: ['OWNER', 'MANAGER'] },
        { name: 'Scraps', path: '/scraps', icon: '🗑️', roles: ['OWNER', 'MANAGER'] },
        { name: 'Stock Movements', path: '/stock-movements', icon: '📈', roles: ['OWNER', 'MANAGER'] },
      ],
    },
    {
      section: 'PRODUCTION',
      items: [
        { name: 'BOMs', path: '/boms', icon: '📋', roles: ['OWNER', 'MANAGER'] },
        { name: 'Production Orders', path: '/production-orders', icon: '🏭', roles: ['OWNER', 'MANAGER'] },
        { name: 'Work Orders', path: '/work-orders', icon: '🔨', roles: ['OWNER', 'MANAGER'] },
        { name: 'Material Issues', path: '/material-issues', icon: '📤', roles: ['OWNER', 'MANAGER'] },
      ],
    },
    {
      section: 'SALES',
      items: [
        { name: 'Customers', path: '/customers', icon: '👥', roles: ['OWNER', 'MANAGER'] },
        { name: 'Sales Orders', path: '/sales-orders', icon: '🛒', roles: ['OWNER', 'MANAGER'] },
        { name: 'Invoices', path: '/invoices', icon: '📄', roles: ['OWNER', 'MANAGER'] },
      ],
    },
    {
      section: 'ORGANIZATION',
      items: [
        { name: 'Members', path: '/members', icon: '👤', roles: ['OWNER', 'HR'] },
        { name: 'Billing & Plan', path: '/billing', icon: '💳', roles: ['OWNER'] },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar - স্ক্রিনশটের মতো ডার্ক ও প্রফেশনাল লুক */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 select-none">
        {/* Brand & Version Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <span className="text-white font-bold text-sm tracking-wide flex items-center gap-2">
            🪵 WoodCraft ERP
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
            v1.1
          </span>
        </div>

        {/* Active Workspace Info Card */}
        {currentOrg && (
          <div className="mx-3 mt-4 p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Workspace
              </span>
              <span className="text-[10px] uppercase bg-blue-500/20 text-blue-400 px-1.5 py-0.2 rounded font-bold">
                {userRole}
              </span>
            </div>
            <div className="text-white font-semibold text-xs truncate mb-2">
              {currentOrg.name}
            </div>
            <button
              onClick={() => navigate('/select-org')}
              className="w-full py-1.5 px-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] rounded-lg font-medium transition-colors cursor-pointer text-center"
            >
              Switch Org
            </button>
          </div>
        )}

        {/* Scrollable Role-Filtered Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
          {menuSections.map((group, idx) => {
            // ঐ রোলের জন্য এই সেকশনে কোনো আইটেম এলাউড আছে কিনা চেক করি
            const authorizedItems = group.items.filter((item) =>
              item.roles.includes(userRole)
            );

            // যদি একটা আইটেমও এলাউড না থাকে, তবে পুরো সেকশনটি হাইড থাকবে (HR-এর জন্য Inventory বা Production সেকশন দেখাবেই না)
            if (authorizedItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                <div className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1.5">
                  {group.section}
                </div>
                {authorizedItems.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <button
                      key={link.path}
                      onClick={() => navigate(link.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-600 text-white font-semibold shadow-md'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="text-sm">{link.icon}</span>
                      <span className="truncate">{link.name}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={() => logout()}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            {isPending ? 'Logging out...' : '🚪 Log Out'}
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
            <span>Home</span>
            <span>/</span>
            <span>Overview</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/select-org')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              + New / Switch Workspace
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="h-8 w-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {currentOrg?.name?.charAt(0) || 'W'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Outlet */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};