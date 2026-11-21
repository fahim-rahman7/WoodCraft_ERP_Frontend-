import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, CircleCheck, CreditCard, Mail, Send, TriangleAlert, UserPlus } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a1a10]/40 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-[#ece4da] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-[#f1ebe3] bg-[#fbf8f4] px-6 py-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#3b2213] text-white shadow-sm">
            <UserPlus className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="font-serif text-lg font-bold leading-snug text-[#2a1a10]">
              Invite Member to {orgName}
            </h3>
            <p className="mt-0.5 text-xs text-[#6b5d52]">
              Send an email invitation to join this workspace.
            </p>
          </div>
        </div>

        <div className="px-6 py-5">
          {successMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
              <CircleCheck className="mt-px h-4 w-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Subscription Error Special Banner & CTA */}
          {isSubscriptionError ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-center">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-amber-700 shadow-sm">
                <CreditCard className="h-5 w-5" />
              </span>
              <div className="mt-3 font-serif text-base font-bold text-[#2a1a10]">
                Active Subscription Required
              </div>
              <p className="mx-auto mt-1 max-w-sm text-xs text-amber-800">
                Your organization does not have an active subscription plan. To invite team members and unlock ERP features, please subscribe to a plan.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/billing'); // Tomar billing/subscription page route
                  }}
                  className="inline-flex items-center gap-2 rounded-md bg-[#3b2213] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#4d2e1a] cursor-pointer"
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  Go to Billing & Subscribe
                </button>
                <button
                  type="button"
                  onClick={() => reset()}
                  className="rounded-md border border-[#e2d6c8] bg-white px-4 py-2 text-xs font-semibold text-[#3b2213] transition-colors hover:bg-[#f6f0e9] cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  <TriangleAlert className="mt-px h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
              <form onSubmit={handleInvite} className="flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5a3e2b]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a89888]" />
                    <input
                      type="email"
                      required
                      placeholder="colleague@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-md border border-[#ddd0c1] bg-[#fdfbf8] py-2.5 pl-9 pr-3 text-sm text-[#2a1a10] placeholder:text-[#a89888] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#7a4a2a]"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5a3e2b]">
                    Select Role
                  </label>
                  <div className="relative">
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full cursor-pointer appearance-none rounded-md border border-[#ddd0c1] bg-[#fdfbf8] py-2.5 pl-3 pr-9 text-sm text-[#2a1a10] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#7a4a2a]"
                    >
                      <option value="STAFF">Staff</option>
                      <option value="MANAGER">Manager</option>
                      <option value="HR">HR</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a6a52]" />
                  </div>
                </div>

                <div className="mt-2 flex gap-2 border-t border-dashed border-[#ece4da] pt-4">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-[#3b2213] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4d2e1a] disabled:opacity-50 cursor-pointer"
                  >
                    {!isPending && <Send className="h-4 w-4" />}
                    {isPending ? 'Sending...' : 'Send Invite'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md border border-[#e2d6c8] bg-[#efe7dd] px-5 py-2.5 text-sm font-semibold text-[#3b2213] transition-colors hover:bg-[#e6dccf] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
