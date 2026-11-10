import { useState } from 'react';
import { useTenant } from '../../../context/TenantContext';
import { useDashboard } from '../api/dashboard.api';
import { InviteMemberModal } from '../../organization/components/InviteMemberModal';

// Sub-views for different roles
import { OwnerDashboardView } from '../components/OwnerDashboardView';
import { ManagerDashboardView } from '../components/ManagerDashboardView';
import { HrDashboardView } from '../components/HrDashboardView';

export const DashboardPage = () => {
  const { currentOrg } = useTenant();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // active membership থেকে currentOrg-এর সাপেক্ষে ইউজারের রোল বের করা 
  // (ধরে নিচ্ছি currentOrg অবজেক্টের ভেতরে ইউজারর রোল বা মেম্বারশিপ ইনফো আছে, অথবা লোকালস্টোরেজ/টেম্পলেট থেকে আসছে)
  const userRole = currentOrg?.myRole || 'STAFF'; // Fallback to OWNER if not specified

  const { data: dashboardData, isLoading, error } = useDashboard(currentOrg?._id, userRole);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500 font-medium">
        Loading {userRole.toLowerCase()} workspace dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-500 font-medium">
        Failed to load dashboard. You might not have permission for this workspace role.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Role-based View Rendering */}
      {userRole === 'OWNER' && (
        <OwnerDashboardView 
          data={dashboardData} 
          org={currentOrg} 
          onOpenInvite={() => setIsInviteModalOpen(true)} 
        />
      )}

      {userRole === 'MANAGER' && (
        <ManagerDashboardView 
          data={dashboardData} 
          org={currentOrg} 
        />
      )}

      {userRole === 'HR' && (
        <HrDashboardView 
          data={dashboardData} 
          org={currentOrg} 
          onOpenInvite={() => setIsInviteModalOpen(true)} 
        />
      )}

      {/* Shared Invite Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        orgName={currentOrg?.name}
        orgId={currentOrg?._id}
      />
    </div>
  );
};