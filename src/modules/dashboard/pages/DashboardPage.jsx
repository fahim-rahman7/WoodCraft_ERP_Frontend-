import { useState } from 'react';
import { useTenant } from '../../../context/TenantContext';
import { InviteMemberModal } from '../../organization/components/InviteMemberModal';

export const DashboardPage = () => {
  const { currentOrg, isLoadingOrgs } = useTenant();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // Safeguard: Extract name dynamically
  const orgName = currentOrg?.name || 'Workspace';

  return (
    <div className="p-6">
      {/* Dashboard Top Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 m-0">
            {isLoadingOrgs ? 'Loading workspace...' : `${orgName} Dashboard`}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Welcome to Woodcraft ERP System
          </p>
        </div>

        {/* Invite Member Button */}
        <button
          onClick={() => setIsInviteOpen(true)}
          className="px-4 py-[9px] bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          + Invite Member
        </button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-sm">
          <h3 className="m-0 text-sm font-medium text-slate-500">Total Sales</h3>
          <p className="text-2xl font-bold mt-2 text-slate-900">$45,230</p>
        </div>

        <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-sm">
          <h3 className="m-0 text-sm font-medium text-slate-500">Inventory Items</h3>
          <p className="text-2xl font-bold mt-2 text-slate-900">1,240</p>
        </div>

        <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-sm">
          <h3 className="m-0 text-sm font-medium text-slate-500">Pending Orders</h3>
          <p className="text-2xl font-bold mt-2 text-slate-900">18</p>
        </div>
      </div>

      {/* Invite Modal Component */}
      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        orgName={orgName}
      />
    </div>
  );
};