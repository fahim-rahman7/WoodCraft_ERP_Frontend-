import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSendInvitation } from '../../invitation/hooks/useInvitationMutations'; 

export const InviteMemberModal = ({ isOpen, onClose, orgName, orgId }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('STAFF');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // TanStack Query mutation hook
  const { mutate, isPending, error, reset } = useSendInvitation();

  if (!isOpen) return null;

  const handleInvite = (e) => {
    e.preventDefault();
    setSuccessMessage('');

    mutate(
      { orgId, email, role },
      {
        onSuccess: () => {
          setSuccessMessage(`Invitation sent to ${email} successfully!`);
          setEmail('');
        },
      }
    );
  };

  // Check if error is due to missing active subscription (Status 402)
  const isSubscriptionError = 
    error?.response?.status === 402 || 
    error?.response?.data?.message?.toLowerCase().includes('subscription');

  const errorMessage = error?.response?.data?.message || error?.message;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-xl border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Invite Member to {orgName}
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Send an email invitation to join this workspace.
        </p>

        {successMessage && (
          <div className="p-3 rounded-lg text-xs mb-4 border bg-green-50 text-green-800 border-green-200">
            {successMessage}
          </div>
        )}

        {/* Subscription Error Special Banner & CTA */}
        {isSubscriptionError ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-center">
            <div className="text-amber-900 font-semibold text-sm mb-1">
              Active Subscription Required
            </div>
            <p className="text-xs text-amber-700 mb-4">
              Your organization does not have an active subscription plan. To invite team members and unlock ERP features, please subscribe to a plan.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/billing'); // Tomar billing/subscription page route
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer shadow-sm"
              >
                Go to Billing & Subscribe
              </button>
              <button
                type="button"
                onClick={() => reset()}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : (
          <>
            {errorMessage && (
              <div className="p-3 rounded-lg text-xs mb-4 border bg-red-50 text-red-800 border-red-200">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleInvite} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Select Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="STAFF">Staff</option>
                  <option value="MANAGER">Manager</option>
                  <option value="HR">HR</option>
                </select>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md text-sm font-medium transition-colors cursor-pointer"
                >
                  {isPending ? 'Sending...' : 'Send Invite'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-sm font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};