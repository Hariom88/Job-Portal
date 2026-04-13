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

  return (
    <div className="flex min-h-screen bg-slate-50 font-['Outfit']">
      {/* SIDEBAR */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-8 pb-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">J</div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Prime<span className="text-blue-600">Admin</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem to="/admin" label="Dashboard" icon="📊" active={location.pathname === '/admin'} />
          <SidebarItem to="/admin/users" label="Users" icon="👥" active={location.pathname === '/admin/users'} />
          <SidebarItem to="/admin/companies" label="Companies" icon="🏢" active={location.pathname === '/admin/companies'} />
          <SidebarItem to="/admin/jobs" label="Jobs" icon="💼" active={location.pathname === '/admin/jobs'} />
          <SidebarItem to="/admin/applications" label="Applications" icon="📨" active={location.pathname === '/admin/applications'} />
          <SidebarItem to="/admin/reports" label="Reports" icon="📈" active={location.pathname === '/admin/reports'} />
        </nav>

        <div className="p-8 border-t border-slate-100 space-y-4">
           <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black">{user?.fullName?.charAt(0)}</div>
              <div className="overflow-hidden">
                 <p className="text-sm font-bold text-slate-900 truncate">{user?.fullName}</p>
                 <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">System Admin</span>
              </div>
           </div>
           <button 
            onClick={logout}
            className="w-full py-4 rounded-2xl bg-rose-50 text-rose-600 font-bold text-xs uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100"
           >
             Log Out System
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        {/* TOP NAVBAR (Optional inside layout) */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 z-10">
           <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">System</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900 font-bold text-xs uppercase tracking-widest">{location.pathname.split('/').pop() || 'Dashboard'}</span>
           </div>
           <div className="flex gap-4">
              <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">🔔</button>
              <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">⚙️</button>
           </div>
        </header>

        <div className="p-10 animate-slide-up">
          {children}
        </div>
      </main>
    </div>
  );
}
