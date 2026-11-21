import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import { useLogout } from '../modules/auth/hooks/useAuthMutations';
import {
  Activity,
  ArrowLeftRight,
  ClipboardList,
  CreditCard,
  Factory,
  FolderTree,
  Hammer,
  LayoutDashboard,
  Layers,
  ListTree,
  LogOut,
  Package,
  PackageCheck,
  PackageMinus,
  Receipt,
  Repeat,
  ScanSearch,
  ShoppingCart,
  SlidersHorizontal,
  Tag,
  Trash2,
  TreePine,
  Truck,
  UserCog,
  Users,
  Warehouse,
} from 'lucide-react';

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
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['OWNER', 'MANAGER', 'HR'] },
      ],
    },
    {
      section: 'PROCUREMENT',
      items: [
        { name: 'Suppliers', path: '/suppliers', icon: Truck, roles: ['OWNER', 'MANAGER'] },
        { name: 'Purchase Orders', path: '/purchase-orders', icon: ClipboardList, roles: ['OWNER', 'MANAGER'] },
      ],
    },
    {
      section: 'INVENTORY',
      items: [
        { name: 'Stock', path: '/inventory', icon: Package, roles: ['OWNER', 'MANAGER'] },
        { name: 'Items', path: '/items', icon: Tag, roles: ['OWNER', 'MANAGER'] },
        { name: 'Categories', path: '/categories', icon: FolderTree, roles: ['OWNER', 'MANAGER'] },
        { name: 'Warehouses', path: '/warehouses', icon: Warehouse, roles: ['OWNER', 'MANAGER'] },
        { name: 'Batches', path: '/batches', icon: Layers, roles: ['OWNER', 'MANAGER'] },
        { name: 'Goods Receipts', path: '/goods-receipts', icon: PackageCheck, roles: ['OWNER', 'MANAGER'] },
        { name: 'Quality Inspections', path: '/quality-inspections', icon: ScanSearch, roles: ['OWNER', 'MANAGER'] },
        { name: 'Transfers', path: '/transfers', icon: ArrowLeftRight, roles: ['OWNER', 'MANAGER'] },
        { name: 'Adjustments', path: '/adjustments', icon: SlidersHorizontal, roles: ['OWNER', 'MANAGER'] },
        { name: 'Scraps', path: '/scraps', icon: Trash2, roles: ['OWNER', 'MANAGER'] },
        { name: 'Stock Movements', path: '/stock-movements', icon: Activity, roles: ['OWNER', 'MANAGER'] },
      ],
    },
    {
      section: 'PRODUCTION',
      items: [
        { name: 'BOMs', path: '/boms', icon: ListTree, roles: ['OWNER', 'MANAGER'] },
        { name: 'Production Orders', path: '/production-orders', icon: Factory, roles: ['OWNER', 'MANAGER'] },
        { name: 'Work Orders', path: '/work-orders', icon: Hammer, roles: ['OWNER', 'MANAGER'] },
        { name: 'Material Issues', path: '/material-issues', icon: PackageMinus, roles: ['OWNER', 'MANAGER'] },
      ],
    },
    {
      section: 'SALES',
      items: [
        { name: 'Customers', path: '/customers', icon: Users, roles: ['OWNER', 'MANAGER'] },
        { name: 'Sales Orders', path: '/sales-orders', icon: ShoppingCart, roles: ['OWNER', 'MANAGER'] },
        { name: 'Invoices', path: '/invoices', icon: Receipt, roles: ['OWNER', 'MANAGER'] },
      ],
    },
    {
      section: 'ORGANIZATION',
      items: [
        { name: 'Members', path: '/members', icon: UserCog, roles: ['OWNER', 'HR'] },
        { name: 'Billing & Plan', path: '/billing', icon: CreditCard, roles: ['OWNER'] },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar - ক্রিম/কাঠ-বাদামি থিম, স্ক্রল করলেও স্ক্রিনে আটকে থাকে */}
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 select-none flex-col border-r border-[#e8dfd4] bg-[#f6f1ea] text-[#5a3e2b]">
        {/* Brand & Version Header */}
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-[#e8dfd4] px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#3b2213] text-white shadow-sm">
              <TreePine className="h-5 w-5" />
            </span>
            <span className="truncate font-serif text-[15px] font-bold text-[#2a1a10]">WoodCraft ERP</span>
          </div>
          <span className="shrink-0 rounded border border-[#e2d6c8] bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#5a3e2b]">
            v1.1
          </span>
        </div>

        {/* Scrollable Role-Filtered Navigation Links */}
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4 [scrollbar-color:#d9cbbb_transparent] [scrollbar-width:thin]">
          {menuSections.map((group, idx) => {
            // ঐ রোলের জন্য এই সেকশনে কোনো আইটেম এলাউড আছে কিনা চেক করি
            const authorizedItems = group.items.filter((item) =>
              item.roles.includes(userRole)
            );

            // যদি একটা আইটেমও এলাউড না থাকে, তবে পুরো সেকশনটি হাইড থাকবে (HR-এর জন্য Inventory বা Production সেকশন দেখাবেই না)
            if (authorizedItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-0.5">
                <div className="mb-1.5 px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a7b6f]">
                  {group.section}
                </div>
                {authorizedItems.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <button
                      key={link.path}
                      onClick={() => navigate(link.path)}
                      className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#3b2213] font-semibold text-white shadow-sm'
                          : 'text-[#5a3e2b] hover:bg-[#ece3d8] hover:text-[#2a1a10]'
                      }`}
                    >
                      <link.icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? 'text-white' : 'text-[#8a6a52] group-hover:text-[#3b2213]'
                        }`}
                      />
                      <span className="truncate">{link.name}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer: Active Workspace + Log Out */}
        <div className="shrink-0 space-y-2 border-t border-[#e8dfd4] p-3">
          {currentOrg && (
            <div className="rounded-lg border border-[#e2d6c8] bg-white/70 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8a7b6f]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Workspace
                </span>
                <span className="rounded border border-[#e2d6c8] bg-[#f6f0e9] px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#3b2213]">
                  {userRole}
                </span>
              </div>
              <div className="mt-1.5 truncate font-serif text-sm font-bold text-[#2a1a10]">
                {currentOrg.name}
              </div>
              <button
                onClick={() => navigate('/select-org')}
                className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-[#efe7dd] px-2 py-1.5 text-[11px] font-semibold text-[#3b2213] transition-colors hover:bg-[#e6dccf] cursor-pointer"
              >
                <Repeat className="h-3.5 w-3.5" />
                Switch Org
              </button>
            </div>
          )}

          <button
            onClick={() => logout()}
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            {isPending ? 'Logging out...' : 'Log Out'}
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