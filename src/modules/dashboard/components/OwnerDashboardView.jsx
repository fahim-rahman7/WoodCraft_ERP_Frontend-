import { useNavigate } from 'react-router-dom';

export const OwnerDashboardView = ({ data, org, onOpenInvite }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Welcome back to {org?.name} (Owner) 🚀</h2>
          <p className="text-blue-100 text-sm">
            Executive control center for subscription, financials, and team operations.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onOpenInvite}
            className="px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            👥 Invite Member
          </button>
          <button
            onClick={() => navigate('/billing')}
            className="px-4 py-2.5 bg-blue-800/80 hover:bg-blue-800 text-white rounded-xl font-semibold text-xs transition-colors border border-blue-400/30 cursor-pointer"
          >
            💳 Billing & Plans
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">Live Stock</span>
          <div className="text-2xl font-bold text-slate-900 mt-3">{data?.metrics?.totalInventoryStock || 0} Units</div>
          <p className="text-xs text-slate-500 mt-1">Total available inventory</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full">Reserved</span>
          <div className="text-2xl font-bold text-slate-900 mt-3">{data?.metrics?.totalReservedStock || 0} Units</div>
          <p className="text-xs text-slate-500 mt-1">Locked in production</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">Completed</span>
          <div className="text-2xl font-bold text-slate-900 mt-3">{data?.metrics?.completedWorkOrders || 0}</div>
          <p className="text-xs text-slate-500 mt-1">Finished work orders</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">Team</span>
          <div className="text-2xl font-bold text-slate-900 mt-3">{data?.teamStats?.activeMembersCount || 0} Members</div>
          <p className="text-xs text-slate-500 mt-1">{data?.teamStats?.pendingInvitationsCount || 0} pending invites</p>
        </div>
      </div>
    </div>
  );
};