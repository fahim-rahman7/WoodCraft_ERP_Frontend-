import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTenant } from '../../../context/TenantContext';
import { useLogout } from '../../auth/hooks/useAuthMutations';
import api from '../../../api/axios';

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 relative">
      
      {/* Top Header with Logout */}
      <div className="absolute top-6 right-8">
        <button
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="px-4 py-2 bg-transparent border border-slate-300 hover:bg-slate-100 rounded-md text-slate-600 hover:text-slate-900 cursor-pointer text-sm font-medium transition-colors"
        >
          {isLoggingOut ? 'Logging out...' : 'Log Out'}
        </button>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-[520px] bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          Select Workspace
        </h2>
        <p className="text-slate-500 text-sm mb-8">
          Choose an organization to continue or create a new workspace.
        </p>

        {errorMsg && (
          <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-md mb-6 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Loading State */}
        {isLoadingOrgs ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            Loading workspaces...
          </div>
        ) : (
          <>
            {/* List of Existing Workspaces */}
            {userMemberships.length > 0 && !isCreating && (
              <div className="flex flex-col gap-3 mb-6">
                {userMemberships.map((item) => {
                  const org = item.organizationId || item.organization || item;
                  const orgId = typeof org === 'object' ? (org._id || org.id) : org;
                  const orgNameDisplay = org?.name || item.name || 'Unnamed Organization';
                  const roleDisplay = item.myRole || item.role || 'MEMBER';
                  const statusDisplay = org?.subscriptionStatus || 'ACTIVE';

                  return (
                    <div
                      key={orgId || Math.random()}
                      onClick={() => handleSelect(orgId)}
                      className="p-4 border border-slate-200 hover:border-blue-600 rounded-lg cursor-pointer flex justify-between items-center transition-colors bg-white group"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 text-[15px] group-hover:text-blue-600 transition-colors">
                          {orgNameDisplay}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Role: <span className="capitalize font-medium text-slate-700">{roleDisplay.toLowerCase()}</span>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 font-medium uppercase tracking-wide">
                        {statusDisplay}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Create Workspace Section */}
            {isCreating ? (
              <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Timber Co."
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={createOrgMutation.isPending}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md font-medium text-sm transition-colors cursor-pointer"
                  >
                    {createOrgMutation.isPending ? 'Creating...' : 'Create Workspace'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setErrorMsg('');
                    }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md font-medium text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className={`w-full p-3 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
                  userMemberships.length === 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-transparent text-blue-600 hover:bg-blue-50 border border-dashed border-blue-600'
                }`}
              >
                + Create New Workspace
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};