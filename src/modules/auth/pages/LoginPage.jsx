import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useAuthMutations';

export const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  const errorMessage =
    error?.response?.data?.message || (error ? 'Login failed. Please check your credentials.' : '');

  return (
    <div className="w-full max-w-[400px] p-8 border border-slate-200 rounded-xl bg-white shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Sign In</h2>
      <p className="text-slate-500 text-sm mb-6">Access your Woodcraft ERP account</p>

      {errorMessage && (
        <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-md mb-4 text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-md text-sm transition-colors cursor-pointer mt-1"
        >
          {isPending ? 'Authenticating...' : 'Log In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium underline">
          Register here
        </Link>
      </p>
    </div>
  );
};