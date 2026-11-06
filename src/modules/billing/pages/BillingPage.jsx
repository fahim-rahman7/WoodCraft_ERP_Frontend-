import { useState } from 'react';
import { createCheckoutApi } from '../api/billing.api';

export const BillingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('PRO');
  const [cusPhone, setCusPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const data = await createCheckoutApi({ plan: selectedPlan, cusPhone });
      
      if (data?.data?.gatewayUrl) {
        // Redirect user to SSLCommerz Payment Gateway URL
        window.location.href = data.data.gatewayUrl;
      } else {
        setErrorMessage('Failed to get payment gateway URL.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Something went wrong during checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Billing & Subscription</h1>
        <p className="text-xs text-slate-500 mt-1">
          Upgrade your organization plan to activate member invitations and full ERP features.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleCheckout} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PRO Plan Card */}
          <div 
            onClick={() => setSelectedPlan('PRO')}
            className={`cursor-pointer rounded-xl p-6 border-2 transition-all ${
              selectedPlan === 'PRO' ? 'border-blue-600 bg-blue-50/20 shadow-sm' : 'border-slate-200 bg-white'
            }`}
          >
            <h3 className="text-lg font-bold text-slate-900">PRO Plan</h3>
            <p className="text-2xl font-extrabold text-blue-600 my-2">
              ৳5,000 <span className="text-xs font-normal text-slate-500">/ month</span>
            </p>
            <p className="text-xs text-slate-600">
              Ideal for growing teams needing full access, inventory control, and member management.
            </p>
          </div>

          {/* ENTERPRISE Plan Card */}
          <div 
            onClick={() => setSelectedPlan('ENTERPRISE')}
            className={`cursor-pointer rounded-xl p-6 border-2 transition-all ${
              selectedPlan === 'ENTERPRISE' ? 'border-blue-600 bg-blue-50/20 shadow-sm' : 'border-slate-200 bg-white'
            }`}
          >
            <h3 className="text-lg font-bold text-slate-900">ENTERPRISE Plan</h3>
            <p className="text-2xl font-extrabold text-blue-600 my-2">
              ৳15,000 <span className="text-xs font-normal text-slate-500">/ month</span>
            </p>
            <p className="text-xs text-slate-600">
              Advanced enterprise features with high scalability, priority support, and secure operations.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Phone Number <span className="text-slate-400 font-normal">(Required for SSLCommerz payment)</span>
            </label>
            <input
              type="text"
              required
              placeholder="017xxxxxxxx"
              value={cusPhone}
              onChange={(e) => setCusPhone(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition-all shadow-sm cursor-pointer"
          >
            {loading ? 'Initializing SSLCommerz Gateway...' : `Proceed to Pay ৳${selectedPlan === 'PRO' ? '5,000' : '15,000'}`}
          </button>
        </div>
      </form>
    </div>
  );
};