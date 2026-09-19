import { Link } from 'react-router-dom';

export const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        {/* 403 Badge */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 font-bold text-xl mb-4 border border-red-100">
          403
        </div>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          Access Denied
        </h1>
        
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>

        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center w-full px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};