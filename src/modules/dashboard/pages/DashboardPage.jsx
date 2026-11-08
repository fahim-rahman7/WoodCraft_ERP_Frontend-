import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../../../context/TenantContext';
import { InviteMemberModal } from '../../organization/components/InviteMemberModal';
// API client import (assume standard axios instance)
import api from '../../../api/axios'; 

export const DashboardPage = () => {
  const { currentOrg } = useTenant();
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Determine user role or fetch respective dashboard data based on membership/role
  // For demonstration, we fetch the owner/manager/hr aggregated summary endpoints
  useEffect(() => {
    const fetchDashboard = async () => {
      if (!currentOrg?._id) return;
      try {
        setLoading(true);
        // Depending on role, we can fetch owner or manager endpoint. Let's fetch owner/manager stats.
        // You can customize this endpoint call based on req.membership.role or fetch general overview.
        const res = await api.get('/dashboard/owner', {
          headers: { 'x-organization-id': currentOrg._id }
        });
        setDashboardData(res.data.data);
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [currentOrg]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500 font-medium">
        Loading workspace dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">
            Welcome back to {currentOrg?.name} 🚀
          </h2>
          <p className="text-blue-100 text-sm">
            Here is your executive overview of inventory, production status, and team operations.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-semibold text-xs transition-colors shadow-sm cursor-pointer flex items-center gap-2"
          >
            👥 Invite Member
          </button>
          <button
            onClick={() => navigate('/billing')}
            className="px-4 py-2.5 bg-blue-800/80 hover:bg-blue-800 text-white rounded-xl font-semibold text-xs transition-colors border border-blue-400/30 cursor-pointer flex items-center gap-2"
          >
            💳 Billing & Plans
          </button>
        </div>
      </div>

      {/* Analytics Grid / Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Inventory Stock */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 bg-blue-50 text-blue-600 rounded-xl text-lg">📦</span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">
              Live Stock
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 mb-0.5">
              {dashboardData?.metrics?.totalInventoryStock || 0} Units
            </div>
            <p className="text-xs text-slate-500">Total available inventory</p>
          </div>
        </div>

        {/* Reserved Stock */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 bg-amber-50 text-amber-600 rounded-xl text-lg">🔒</span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full">
              Reserved
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 mb-0.5">
              {dashboardData?.metrics?.totalReservedStock || 0} Units
            </div>
            <p className="text-xs text-slate-500">Locked in production/orders</p>
          </div>
        </div>

        {/* Completed Work Orders */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-lg">✅</span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
              Completed
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 mb-0.5">
              {dashboardData?.metrics?.completedWorkOrders || 0}
            </div>
            <p className="text-xs text-slate-500">Finished production batches</p>
          </div>
        </div>

        {/* Team Members Count */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 bg-indigo-50 text-indigo-600 rounded-xl text-lg">👥</span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
              Active Team
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 mb-0.5">
              {dashboardData?.teamStats?.activeMembersCount || 0} Members
            </div>
            <p className="text-xs text-slate-500">
              {dashboardData?.teamStats?.pendingInvitationsCount || 0} pending invitations
            </p>
          </div>
        </div>
      </div>

      {/* Subscription & Quick Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            📊 Workspace Operational Summary
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex justify-between items-center">
              <div>
                <div className="text-sm font-semibold text-slate-800">Subscription Plan</div>
                <div className="text-xs text-slate-500">Current tier status for {currentOrg?.name}</div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                dashboardData?.subscription?.status === 'ACTIVE' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {dashboardData?.subscription?.plan || 'PRO'} ({dashboardData?.subscription?.status || 'INACTIVE'})
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex justify-between items-center">
              <div>
                <div className="text-sm font-semibold text-slate-800">Quick Inventory Access</div>
                <div className="text-xs text-slate-500">Manage stock items, warehouses & scrap logs</div>
              </div>
              <button
                onClick={() => navigate('/inventory')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium cursor-pointer"
              >
                View Inventory →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4">⚡ Quick Actions</h3>
            <div className="space-y-2.5">
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold transition-colors border border-slate-200/60 cursor-pointer flex items-center justify-between"
              >
                <span>Invite New Team Member</span>
                <span>➕</span>
              </button>
              <button
                onClick={() => navigate('/sales')}
                className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold transition-colors border border-slate-200/60 cursor-pointer flex items-center justify-between"
              >
                <span>View Sales & Orders</span>
                <span>🛒</span>
              </button>
              <button
                onClick={() => navigate('/billing')}
                className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold transition-colors border border-slate-200/60 cursor-pointer flex items-center justify-between"
              >
                <span>Manage Billing & SSLCommerz</span>
                <span>💳</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Member Modal Component */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        orgName={currentOrg?.name}
        orgId={currentOrg?._id}
      />
    </div>
  );
};