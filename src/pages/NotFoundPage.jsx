import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        {/* 404 Badge */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 font-bold text-xl mb-4 border border-blue-100">
          404
        </div>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          Page Not Found
        </h1>
        
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>

        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center w-full px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};