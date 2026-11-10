export const HrDashboardView = ({ data, org, onOpenInvite }) => {
    const members = data?.membersList || [];
    const roleBreakdown = data?.roleBreakdown || {};
  
    return (
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 md:p-8 text-white shadow-xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-1">{org?.name} - HR & Team Directory 👥</h2>
            <p className="text-emerald-100 text-sm">Manage workspace memberships, staff roles, and invitations.</p>
          </div>
          <button
            onClick={onOpenInvite}
            className="px-4 py-2.5 bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl font-semibold text-xs shadow-sm cursor-pointer"
          >
            + Invite Member
          </button>
        </div>
  
        {/* Role Breakdown Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {Object.entries(roleBreakdown).map(([role, count]) => (
            <div key={role} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase">{role}</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{count} Members</div>
            </div>
          ))}
        </div>
  
        {/* Team Members Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden p-6">
          <h3 className="text-base font-bold text-slate-900 mb-4">Workspace Active Members</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-100">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-900">{m.userId?.name || 'N/A'}</td>
                    <td className="p-3 text-slate-600">{m.userId?.email || 'N/A'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold text-[10px]">
                        {m.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold text-[10px]">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };