import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAcceptInvitation } from '../modules/invitation/hooks/useInvitationMutations';

export const AcceptInvitationPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const { mutate, isPending } = useAcceptInvitation();

  const handleAccept = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!token) {
      setMessage({ type: 'error', text: 'Invitation token is missing from the URL.' });
      return;
    }

    mutate(
      { token, name, password },
      {
        onSuccess: (data) => {
          setMessage({ 
            type: 'success', 
            text: data?.message || 'Invitation accepted successfully! Redirecting...' 
          });
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        },
        onError: (err) => {
          const errorMsg = err.response?.data?.message || 'Failed to accept invitation.';
          setMessage({ type: 'error', text: errorMsg });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
        {/* Header / Branding */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Join Workspace
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Accept your organization invitation to get started. If you are new, please fill in your details below.
          </p>
        </div>

        {/* Status Message Banner */}
        {message.text && (
          <div
            className={`mb-5 p-3 rounded-xl text-xs font-medium border flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleAccept} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Full Name <span className="text-slate-400 font-normal">(Optional if account exists)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Password <span className="text-slate-400 font-normal">(Optional if account exists)</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isPending || message.type === 'success'}
            className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-all shadow-sm cursor-pointer"
          >
            {isPending ? 'Processing...' : 'Accept Invitation'}
          </button>
        </form>
      </div>
    </div>
  );
};