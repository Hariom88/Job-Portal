import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin, isCompany, isCandidate, dashboardPath } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline text-slate-900 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">J</div>
          <span className="text-xl font-extrabold tracking-tight">PrimeJobs</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {/* CANDIDATE SPECIFIC LINKS */}
          {isCandidate && (
            <>
              <Link to="/" className="text-slate-600 font-bold hover:text-blue-600 no-underline transition-colors text-xs uppercase tracking-widest">Find Jobs</Link>
              <Link to="/dashboard" className="text-slate-600 font-bold hover:text-blue-600 no-underline transition-colors text-xs uppercase tracking-widest">My Applications</Link>
            </>
          )}

          {/* COMPANY SPECIFIC LINKS */}
          {isCompany && (
            <>
              <Link to="/post-job" className="text-slate-600 font-bold hover:text-blue-600 no-underline transition-colors text-xs uppercase tracking-widest">Post a Job</Link>
              <Link to="/company" className="text-slate-600 font-bold hover:text-blue-600 no-underline transition-colors text-xs uppercase tracking-widest">Recruit Center</Link>
            </>
          )}

          {/* ADMIN SPECIFIC LINKS */}
          {isAdmin && (
            <>
              <Link to="/admin" className="text-slate-600 font-bold hover:text-blue-600 no-underline transition-colors text-xs uppercase tracking-widest">Dashboard</Link>
              <Link to="/admin/users" className="text-slate-600 font-bold hover:text-blue-600 no-underline transition-colors text-xs uppercase tracking-widest">Users</Link>
              <Link to="/admin/companies" className="text-slate-600 font-bold hover:text-blue-600 no-underline transition-colors text-xs uppercase tracking-widest">Companies</Link>
              <Link to="/admin/jobs" className="text-slate-600 font-bold hover:text-blue-600 no-underline transition-colors text-xs uppercase tracking-widest">Jobs</Link>
              <Link to="/admin/applications" className="text-slate-600 font-bold hover:text-blue-600 no-underline transition-colors text-xs uppercase tracking-widest">Apps</Link>
              <Link to="/admin/reports" className="text-slate-600 font-bold hover:text-blue-600 no-underline transition-colors text-xs uppercase tracking-widest">Reports</Link>
            </>
          )}
          
          <div className="w-px h-6 bg-slate-200 mx-2"></div>
          
          {user ? (
            <div className="flex items-center gap-4">
               <Link to={dashboardPath} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-widest border border-slate-900 hover:bg-slate-800 no-underline transition-all shadow-lg shadow-slate-200">Dashboard</Link>
               <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs uppercase tracking-widest border border-rose-100 hover:bg-rose-100 transition-all">Log Out</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 font-bold text-slate-600 hover:text-slate-900 no-underline text-xs uppercase tracking-widest transition-colors">Log In</Link>
              <Link to="/signup" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 no-underline transition-all active:scale-95">Signup</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
