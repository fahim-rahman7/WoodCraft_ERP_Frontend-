import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarPlus,
  ChevronDown,
  CircleCheck,
  CirclePause,
  CirclePlus,
  Download,
  FilterX,
  Mail,
  MapPin,
  Search,
  TriangleAlert,
  Truck,
  Users,
} from 'lucide-react';
import { useTenant } from '../../../../context/TenantContext';
import { useSuppliers } from '../hooks/suppliers.hooks';
import {
  ActionButton,
  DashboardShell,
  EmptyState,
  MetricCard,
  PageHeader,
  TableHeader,
} from '../../../dashboard/components/shared';
import { formatDate, initials, monthKey, shortId } from '../../../dashboard/components/dashboardTheme';

const isThisMonth = (value) => monthKey(value) === monthKey(new Date());

const StatusPill = ({ status }) => {
  const active = status === 'ACTIVE';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
        active ? 'border-[#e2d6c8] bg-[#f6f0e9] text-[#2a1a10]' : 'border-slate-200 bg-slate-100 text-slate-500'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
      {status}
    </span>
  );
};

const selectClass =
  'w-full cursor-pointer appearance-none rounded-md border border-[#e2d6c8] bg-white py-2 pl-3 pr-8 text-xs font-medium text-[#2a1a10] focus:outline-none focus:ring-2 focus:ring-[#7a4a2a]';

export const SuppliersPage = () => {
  const navigate = useNavigate();
  const { currentOrg } = useTenant();
  const { data: suppliers = [], isPending, isError } = useSuppliers(currentOrg?._id);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');

  // Summary numbers
  const activeCount = suppliers.filter((s) => s.status === 'ACTIVE').length;
  const inactiveCount = suppliers.length - activeCount;
  const addedThisMonth = suppliers.filter((s) => isThisMonth(s.createdAt)).length;
  const activePct = suppliers.length ? (activeCount / suppliers.length) * 100 : 0;

  // Search + status filter (on the already-loaded list)
  const q = search.trim().toLowerCase();
  const filtered = suppliers.filter(
    (s) =>
      (status === 'ALL' || s.status === status) &&
      (!q || [s.name, s.phone, s.email, s.address].some((v) => v?.toLowerCase().includes(q)))
  );
  const hasFilters = q !== '' || status !== 'ALL';

  const clearFilters = () => {
    setSearch('');
    setStatus('ALL');
  };

  return (
    <DashboardShell>
      <PageHeader
        eyebrow="Procurement & Vendor Management"
        tag="Suppliers"
        title="Suppliers"
        subtitle={`Manage raw timber concessionaires, hardware distributors and chemical suppliers for ${currentOrg?.name || 'your workspace'}.`}
        actions={
          <>
            {/* Export: শুধু ডিজাইন, এখনো কোনো কাজ যুক্ত হয়নি */}
            <ActionButton variant="secondary" icon={Download}>
              Export Directory
            </ActionButton>
            <ActionButton icon={CirclePlus} onClick={() => navigate('/suppliers/add')}>
              Add Supplier
            </ActionButton>
          </>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Suppliers"
          icon={Users}
          value={suppliers.length}
          unit="Vendors"
          progress={activePct}
          sub={
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Active: <b className="text-[#2a1a10]">{activeCount}</b>
              <span className="text-[#c9b9a8]">·</span>
              Inactive: <b className="text-[#2a1a10]">{inactiveCount}</b>
            </span>
          }
        />
        <MetricCard
          label="Active Vendors"
          icon={CircleCheck}
          value={activeCount}
          unit="Active"
          sub="Currently available for purchase orders"
          progress={activePct}
        />
        <MetricCard
          label="Inactive Vendors"
          icon={CirclePause}
          value={inactiveCount}
          unit="Paused"
          sub="Not used for new orders"
          progress={suppliers.length ? 100 - activePct : 0}
        />
        <MetricCard
          label="Added This Month"
          icon={CalendarPlus}
          value={addedThisMonth}
          unit="New"
          sub={suppliers[0] ? `Latest: ${suppliers[0].name}` : 'No suppliers yet'}
        />
      </div>

      {/* Directory */}
      <section className="rounded-xl border border-[#ece4da] bg-white shadow-[0_1px_2px_rgba(60,35,20,0.05)]">
        {/* Filter bar */}
        <div className="flex flex-col gap-3 border-b border-[#f1ebe3] p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a89888]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by supplier name, phone, email or address"
              className="w-full rounded-md border border-[#e2d6c8] bg-[#fdfbf8] py-2 pl-9 pr-3 text-sm text-[#2a1a10] placeholder:text-[#a89888] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#7a4a2a]"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative w-40">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={selectClass}
              >
                <option value="ALL">Status: All</option>
                <option value="ACTIVE">Status: Active</option>
                <option value="INACTIVE">Status: Inactive</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a6a52]" />
            </div>
            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasFilters}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#e2d6c8] bg-white px-3 py-2 text-xs font-semibold text-[#3b2213] transition-colors hover:bg-[#f6f0e9] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              <FilterX className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
        </div>

        {isPending ? (
          <div className="divide-y divide-[#f1ebe3]">
            {[0, 1, 2, 3].map((n) => (
              <div key={n} className="flex animate-pulse items-center gap-4 px-5 py-4">
                <div className="h-9 w-9 rounded-md bg-[#efe7dd]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/3 rounded bg-[#efe7dd]" />
                  <div className="h-3 w-1/5 rounded bg-[#f3ede6]" />
                </div>
                <div className="h-5 w-16 rounded bg-[#f3ede6]" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-5">
            <div className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              <TriangleAlert className="h-4 w-4" />
              Failed to load suppliers.
            </div>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="p-5">
            <EmptyState icon={Truck} title="No suppliers yet" text="Suppliers added to this workspace will appear here." />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-5">
            <EmptyState icon={Search} title="No suppliers match your filters" text="Try another search or clear the filters." />
          </div>
        ) : (
          <>
            <p className="px-5 pt-3 font-mono text-[11px] text-[#8a7b6f]">
              Showing <b className="text-[#2a1a10]">{filtered.length}</b> of{' '}
              <b className="text-[#2a1a10]">{suppliers.length}</b> suppliers
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <TableHeader
                  columns={[
                    { label: 'Supplier Details' },
                    { label: 'Phone Number' },
                    { label: 'Email Address' },
                    { label: 'Address' },
                    { label: 'Status' },
                  ]}
                />
                <tbody className="divide-y divide-[#f1ebe3]">
                  {filtered.map((supplier) => (
                    <tr
                      key={supplier._id}
                      className={`transition-colors hover:bg-[#fbf8f4] ${supplier.status === 'INACTIVE' ? 'opacity-60' : ''}`}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#e2d6c8] bg-[#f6f0e9] font-serif text-xs font-bold text-[#3b2213]">
                            {initials(supplier.name)}
                          </span>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-serif font-bold text-[#2a1a10]">{supplier.name}</p>
                              <span className="rounded bg-[#f6e9d9] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#7a4a2a]">
                                #{shortId(supplier._id)}
                              </span>
                            </div>
                            <p className="font-mono text-[11px] text-[#8a7b6f]">Since {formatDate(supplier.createdAt)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-[#2a1a10]">
                        {supplier.phone || '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        {supplier.email ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-[#5a3e2b]">
                            <Mail className="h-3.5 w-3.5 text-[#8a6a52]" />
                            {supplier.email}
                          </span>
                        ) : (
                          <span className="text-[#a89888]">—</span>
                        )}
                      </td>
                      <td className="max-w-[220px] px-5 py-3.5">
                        {supplier.address ? (
                          <span className="inline-flex items-start gap-1.5 text-xs text-[#5a3e2b]">
                            <MapPin className="mt-px h-3.5 w-3.5 shrink-0 text-[#8a6a52]" />
                            <span className="truncate">{supplier.address}</span>
                          </span>
                        ) : (
                          <span className="text-[#a89888]">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusPill status={supplier.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </DashboardShell>
  );
};
