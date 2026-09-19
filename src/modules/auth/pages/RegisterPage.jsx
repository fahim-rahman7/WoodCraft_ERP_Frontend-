import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from '../hooks/useAuthMutations';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const { mutate: register, isPending, error } = useRegister();

  const handleSubmit = (e) => {
    e.preventDefault();
    register(formData, {
      onSuccess: () => {
        // Pass email in router state so VerifyOtpPage can pre-fill it
        navigate('/verify-otp', { state: { email: formData.email }, replace: true });
      },
    });
  };

  const errorMessage =
    error?.response?.data?.message || (error ? 'Registration failed. Try again.' : '');

  return (
    <div className="w-full max-w-[400px] p-8 border border-slate-200 rounded-xl bg-white shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Create Account</h2>
      <p className="text-slate-500 text-sm mb-6">Join Woodcraft ERP</p>

      {errorMessage && (
        <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-md mb-4 text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium rounded-md text-sm transition-colors cursor-pointer mt-1"
        >
          {isPending ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already registered?{' '}
        <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};