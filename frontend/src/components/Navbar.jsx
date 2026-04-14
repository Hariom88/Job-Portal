import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin, isCompany, isCandidate, dashboardPath } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const NavLinks = () => (
    <>
      {isCandidate && (
        <>
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-slate-600 font-bold hover:text-blue-600 no-underline transition-colors text-xs uppercase tracking-widest">Find Jobs</Link>
          <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-slate-600 font-bold hover:text-blue-600 no-underline transition-colors text-xs uppercase tracking-widest">My Applications</Link>
        </>
      )}
      {isCompany && (
        <>
          <Link to="/post-job" onClick={() => setIsMenuOpen(false)} className="text-slate-600 font-bold hover:text-blue-600 no-underline transition-colors text-xs uppercase tracking-widest">Post a Job</Link>
          <Link to="/company" onClick={() => setIsMenuOpen(false)} className="text-slate-600 font-bold hover:text-blue-600 no-underline transition-colors text-xs uppercase tracking-widest">Recruit Center</Link>
        </>
      )}
      {isAdmin && (
        <>
          <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-slate-600 font-bold hover:text-blue-600 no-underline transition-colors text-xs uppercase tracking-widest">Dashboard</Link>
          <Link to="/admin/users" onClick={() => setIsMenuOpen(false)} className="text-slate-600 font-bold hover:text-blue-600 no-underline transition-colors text-xs uppercase tracking-widest">Users</Link>
          <Link to="/admin/companies" onClick={() => setIsMenuOpen(false)} className="text-slate-600 font-bold hover:text-blue-600 no-underline transition-colors text-xs uppercase tracking-widest">Companies</Link>
          <Link to="/admin/jobs" onClick={() => setIsMenuOpen(false)} className="text-slate-600 font-bold hover:text-blue-600 no-underline transition-colors text-xs uppercase tracking-widest">Jobs</Link>
        </>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline text-slate-900 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">J</div>
          <span className="text-xl font-extrabold tracking-tight">PrimeJobs</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
          <div className="w-px h-6 bg-slate-200 mx-2"></div>
          
          {user ? (
            <div className="flex items-center gap-4">
               <Link to="/profile" className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 group-hover:scale-105 transition-transform">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="P" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-black text-slate-400">{user.fullName.charAt(0)}</span>
                  )}
               </Link>
               <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs uppercase tracking-widest border border-rose-100 hover:bg-rose-100 transition-all">Log Out</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 font-bold text-slate-600 hover:text-slate-900 no-underline text-xs uppercase tracking-widest transition-colors">Log In</Link>
              <Link to="/signup" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 no-underline transition-all active:scale-95">Signup</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-4 flex flex-col items-center animate-in slide-in-from-top duration-300">
          <NavLinks />
          <div className="w-full h-px bg-slate-100"></div>
          {user ? (
            <button onClick={handleLogout} className="w-full py-4 rounded-2xl bg-rose-50 text-rose-600 font-black text-xs uppercase tracking-widest">Log Out</button>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center font-black text-slate-600 uppercase text-xs">Log In</Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100">Signup</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
