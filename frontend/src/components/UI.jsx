/**
 * Toast container — place once near the root of the app.
 */
export function ToastContainer({ toasts }) {
  if (!toasts.length) return null;
  const colorMap = {
    success: 'bg-emerald-500',
    error:   'bg-red-500',
    info:    'bg-blue-500',
    warning: 'bg-amber-500',
  };
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
      {toasts.map(t => (
        <div key={t.id}
          className={`${colorMap[t.type] ?? 'bg-slate-700'} text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-3 animate-slide-up`}
        >
          <span>{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

/**
 * Full-screen loading overlay.
 */
export function Spinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/**
 * Reusable input field with label and error.
 */
export function FormField({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
      <input
        {...props}
        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all
          ${error ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'}
          focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}

/**
 * Select dropdown field.
 */
export function SelectField({ label, error, children, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
      <select
        {...props}
        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-white
          ${error ? 'border-red-400' : 'border-slate-200'}
          focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
      >
        {children}
      </select>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}

/**
 * Primary button with loading state.
 */
export function PrimaryButton({ children, loading, disabled, className = '', ...props }) {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`relative flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 
        text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95
        disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}

/**
 * Protected route guard — redirects unauthorized users.
 */
import { Navigate } from 'react-router-dom';
export function ProtectedRoute({ condition, redirectTo = '/login', children }) {
  if (!condition) return <Navigate to={redirectTo} replace />;
  return children;
}
