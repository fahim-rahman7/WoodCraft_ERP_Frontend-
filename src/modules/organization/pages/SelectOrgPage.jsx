import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTenant } from '../../../context/TenantContext';
import { useLogout } from '../../auth/hooks/useAuthMutations';
import api from '../../../api/axios';
import {
  ArrowRight,
  Building2,
  Factory,
  Hash,
  Landmark,
  LogOut,
  Plus,
  Warehouse,
} from 'lucide-react';

// ---------- Presentation helpers (design only) ----------

const PLAN_STYLES = {
  PRO: {
    label: 'Pro Plan',
    badge: 'bg-[#3b2213] text-white',
    tile: 'bg-[#3b2213] text-white',
    icon: Factory,
  },
  ENTERPRISE: {
    label: 'Enterprise',
    badge: 'bg-[#2b2522] text-white',
    tile: 'bg-[#2b2522] text-white',
    icon: Landmark,
  },
  FREE: {
    label: 'Free Plan',
    badge: 'bg-[#ece3d8] text-[#5a3e2b]',
    tile: 'bg-[#f1e9df] text-[#3b2213] border border-[#e2d6c8]',
    icon: Warehouse,
  },
};

const STATUS_DOT = {
  ACTIVE: 'bg-emerald-500',
  PAST_DUE: 'bg-amber-500',
  CANCELLED: 'bg-red-500',
  EXPIRED: 'bg-red-500',
};

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const SelectOrgPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { switchOrg } = useTenant();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const [isCreating, setIsCreating] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Fetch User Memberships
  const {
    data: userMemberships = [],
    isLoading: isLoadingOrgs,
  } = useQuery({
    queryKey: ['my-memberships'],
    queryFn: async () => {
      const res = await api.get('/organizations');
      return res.data?.data || res.data || [];
    },
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  // 2. Organization Create Mutation
  const createOrgMutation = useMutation({
    mutationFn: async (name) => {
      const res = await api.post('/organizations/create', { name });
      return res.data;
    },
    onSuccess: async (res) => {
      const newOrg = res.data?.organization || res.data;
      const newOrgId = newOrg?._id || newOrg?.id;

      await queryClient.invalidateQueries({ queryKey: ['my-memberships'] });

      if (newOrgId) {
        switchOrg(String(newOrgId));
        navigate('/dashboard', { replace: true });
      }
    },
    onError: (err) => {
      setErrorMsg(
        err.response?.data?.message || 'Failed to create organization. Try a different name.'
      );
    },
  });

  const handleSelect = (orgId) => {
    if (!orgId) return;
    switchOrg(String(orgId));
    navigate('/dashboard', { replace: true });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!orgName.trim()) return;
    createOrgMutation.mutate(orgName.trim());
  };

  const workspaceCount = userMemberships.length;

  return (
    <div className="min-h-screen bg-[#f7f3ee] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Top bar with Logout */}
        <div className="flex justify-end">
          <button
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-2 rounded-md border border-[#e2d6c8] bg-white/70 px-3.5 py-2 text-sm font-medium text-[#5a3e2b] transition-colors hover:bg-white hover:text-[#2a1a10] disabled:opacity-50 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? 'Logging out...' : 'Log Out'}
          </button>
        </div>

        {/* Page Header */}
        <header className="mt-6 mb-10 text-center sm:mt-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ece3d8] px-3 py-1 font-serif text-[10px] font-bold uppercase tracking-[0.12em] text-[#5a3e2b]">
            <Building2 className="h-3 w-3" />
            Tenant Portal · Select Workspace
          </span>

          <h1 className="mt-4 font-serif text-3xl font-bold text-[#2a1a10] sm:text-4xl">
            Choose an organization
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[#6b5d52]">
            Select an enterprise workspace to access factory operations, telemetry, and inventory
            records.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-serif text-[10px] uppercase tracking-[0.12em] text-[#8a7b6f]">
            <span className="inline-flex items-center gap-1.5 rounded bg-[#ece3d8] px-2 py-1 text-[#5a3e2b]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7a4a2a]" />
              Session: Active
            </span>
            <span className="text-[#c9b9a8]">•</span>
            <span>
              {isLoadingOrgs
                ? 'Loading workspaces...'
                : `${workspaceCount} ${workspaceCount === 1 ? 'Workspace' : 'Workspaces'} Available`}
            </span>
          </div>
        </header>

        {errorMsg && (
          <div className="mx-auto mb-6 max-w-lg rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Loading State */}
        {isLoadingOrgs ? (
          <div className="grid gap-5 md:grid-cols-2">
            {[0, 1].map((n) => (
              <div
                key={n}
                className="animate-pulse rounded-xl border border-[#ece4da] bg-white p-6"
              >
                <div className="flex gap-2">
                  <div className="h-5 w-16 rounded bg-[#efe7dd]" />
                  <div className="h-5 w-14 rounded bg-[#efe7dd]" />
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-11 w-11 rounded-md bg-[#efe7dd]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-[#efe7dd]" />
                    <div className="h-3 w-1/3 rounded bg-[#f3ede6]" />
                  </div>
                </div>
                <div className="mt-5 h-20 rounded-lg bg-[#f6f0e9]" />
                <div className="mt-5 flex items-center justify-between">
                  <div className="h-3 w-24 rounded bg-[#f3ede6]" />
                  <div className="h-9 w-28 rounded-md bg-[#efe7dd]" />
                </div>
              </div>
            ))}
          </div>
        ) : isCreating ? (
          /* Create Workspace Form */
          <div className="mx-auto w-full max-w-lg rounded-xl border border-[#ece4da] bg-white p-6 shadow-[0_1px_2px_rgba(60,35,20,0.06)] sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#efe5da] text-[#3b2213]">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-[#2a1a10]">
                  Create new organization
                </h2>
                <p className="text-sm text-[#6b5d52]">
                  Set up a dedicated workspace with its own inventory ledger.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block font-serif text-[11px] font-bold uppercase tracking-[0.1em] text-[#5a3e2b]">
                  Organization Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Timber Co."
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full rounded-md border border-[#ddd0c1] bg-[#fdfbf8] px-3.5 py-2.5 text-sm text-[#2a1a10] placeholder:text-[#a89888] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#7a4a2a]"
                />
              </div>

              <div className="mt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={createOrgMutation.isPending}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-[#3b2213] py-2.5 font-serif text-sm font-bold text-white transition-colors hover:bg-[#4d2e1a] disabled:opacity-50 cursor-pointer"
                >
                  {createOrgMutation.isPending ? 'Creating...' : 'Create Workspace'}
                  {!createOrgMutation.isPending && (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setErrorMsg('');
                  }}
                  className="rounded-md bg-[#efe7dd] px-5 py-2.5 font-serif text-sm font-bold text-[#3b2213] transition-colors hover:bg-[#e6dccf] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Workspace Grid */
          <div className="grid gap-5 md:grid-cols-2">
            {userMemberships.map((item) => {
              const org = item.organizationId || item.organization || item;
              const orgId = typeof org === 'object' ? (org._id || org.id) : org;
              const orgNameDisplay = org?.name || item.name || 'Unnamed Organization';
              const roleDisplay = item.myRole || item.role || 'MEMBER';
              const statusDisplay = org?.subscriptionStatus || 'ACTIVE';
              const plan = PLAN_STYLES[org?.plan] || PLAN_STYLES.FREE;

              return (
                <div
                  key={orgId || Math.random()}
                  onClick={() => handleSelect(orgId)}
                  className="group flex cursor-pointer flex-col rounded-xl border border-[#ece4da] bg-white p-5 shadow-[0_1px_2px_rgba(60,35,20,0.06)] transition-all hover:-translate-y-0.5 hover:border-[#d9cbbb] hover:shadow-md sm:p-6"
                >
                  {/* Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        className={`rounded px-2 py-0.5 font-serif text-[10px] font-bold uppercase tracking-[0.1em] ${plan.badge}`}
                      >
                        {plan.label}
                      </span>
                      <span className="rounded border border-[#e2d6c8] bg-[#f6f0e9] px-2 py-0.5 font-serif text-[10px] font-bold uppercase tracking-[0.1em] text-[#3b2213]">
                        {roleDisplay}
                      </span>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded border border-[#ece4da] bg-[#faf7f3] px-2 py-0.5 font-serif text-[10px] uppercase tracking-[0.1em] text-[#6b5d52]">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[statusDisplay] || 'bg-slate-400'}`}
                      />
                      {statusDisplay.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Identity */}
                  <div className="mt-4 flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${plan.tile}`}
                    >
                      <plan.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-serif text-lg font-bold text-[#2a1a10] transition-colors group-hover:text-[#7a4a2a]">
                        {orgNameDisplay}
                      </h3>
                      {orgId && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-[#8a7b6f]">
                          <Hash className="h-3 w-3" />
                          Workspace {String(orgId).slice(-6).toUpperCase()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Details Panel */}
                  <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg bg-[#f6f0e9] p-4">
                    <div>
                      <p className="font-serif text-[10px] font-bold uppercase tracking-[0.1em] text-[#5a3e2b]">
                        Subscription
                      </p>
                      <p className="mt-1 font-serif text-sm font-bold capitalize text-[#2a1a10]">
                        {statusDisplay.replace('_', ' ').toLowerCase()}
                      </p>
                    </div>
                    <div>
                      <p className="font-serif text-[10px] font-bold uppercase tracking-[0.1em] text-[#5a3e2b]">
                        Established
                      </p>
                      <p className="mt-1 font-serif text-sm font-bold text-[#2a1a10]">
                        {formatDate(org?.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto flex justify-end pt-5">
                    <button
                      type="button"
                      className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md bg-[#3b2213] px-4 py-2.5 font-serif text-sm font-bold text-white transition-colors group-hover:bg-[#4d2e1a] cursor-pointer"
                    >
                      Open Workspace
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Create New Organization Tile */}
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className={`group flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-[#e2d6c8] bg-transparent p-6 text-center transition-colors hover:border-[#c9b39c] hover:bg-white/60 cursor-pointer ${
                workspaceCount === 0 ? 'md:col-span-2' : ''
              }`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ece3d8] text-[#3b2213] transition-transform group-hover:scale-105">
                <Plus className="h-5 w-5" />
              </span>
              <span className="mt-4 font-serif text-lg font-bold text-[#2a1a10]">
                + Create new organization
              </span>
              <span className="mt-1.5 max-w-xs text-sm text-[#6b5d52]">
                {workspaceCount === 0
                  ? "You're not part of any workspace yet. Set one up to get started."
                  : 'Set up a new factory or timber enterprise workspace with dedicated inventory ledger.'}
              </span>
              <span className="mt-4 inline-flex items-center gap-1.5 font-serif text-sm font-bold text-[#5a3e2b] group-hover:text-[#2a1a10]">
                Register New Facility
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
