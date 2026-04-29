import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ to, label, icon, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-6 py-4 no-underline font-bold text-sm uppercase tracking-widest transition-all ${
      active 
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 rounded-2xl mx-4' 
      : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50/50 rounded-2xl mx-4'
    }`}
  >
    <span className="text-xl">{icon}</span>
    {label}
  </Link>
);

export default function AdminLayout({ children }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  // Close sidebar when route changes on mobile
  React.useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-slate-50 font-['Outfit'] relative overflow-x-hidden">
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-slate-200 flex flex-col z-50 transition-transform duration-300
        w-72 lg:w-80
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 lg:p-8 pb-12 flex items-center justify-between lg:justify-start gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">J</div>
            <span className="text-xl lg:text-2xl font-black text-slate-900 tracking-tighter uppercase">Prime<span className="text-blue-600">Admin</span></span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-900">✕</button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          <SidebarItem to="/admin" label="Dashboard" icon="📊" active={location.pathname === '/admin'} />
          <SidebarItem to="/admin/users" label="Users" icon="👥" active={location.pathname === '/admin/users'} />
          <SidebarItem to="/admin/companies" label="Companies" icon="🏢" active={location.pathname === '/admin/companies'} />
          <SidebarItem to="/admin/jobs" label="Jobs" icon="💼" active={location.pathname === '/admin/jobs'} />
          <SidebarItem to="/admin/applications" label="Applications" icon="📨" active={location.pathname === '/admin/applications'} />
          <SidebarItem to="/admin/reports" label="Reports" icon="📈" active={location.pathname === '/admin/reports'} />
        </nav>

        <div className="p-6 lg:p-8 border-t border-slate-100 space-y-4">
           <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black shrink-0">{user?.fullName?.charAt(0)}</div>
              <div className="overflow-hidden">
                 <p className="text-sm font-bold text-slate-900 truncate">{user?.fullName}</p>
                 <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">System Admin</span>
              </div>
           </div>
           <button 
            onClick={logout}
            className="w-full py-4 rounded-2xl bg-rose-50 text-rose-600 font-bold text-xs uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100"
           >
             Log Out
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* TOP NAVBAR */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 lg:px-10 flex items-center justify-between sticky top-0 z-30">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsOpen(true)}
                className="p-2 -ml-2 lg:hidden text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
              <div className="flex items-center gap-2 hidden sm:flex">
                <span className="text-slate-400 font-bold text-[10px] lg:text-xs uppercase tracking-widest">System</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 font-bold text-[10px] lg:text-xs uppercase tracking-widest">{location.pathname.split('/').pop() || 'Dashboard'}</span>
              </div>
           </div>
           <div className="flex gap-2 lg:gap-4">
              <button className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">🔔</button>
              <button className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">⚙️</button>
           </div>
        </header>

        <div className="p-4 lg:p-10 animate-slide-up">
          {children}
        </div>
      </main>
    </div>
  );
}
