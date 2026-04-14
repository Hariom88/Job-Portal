import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../hooks/useHooks';
import { motion } from 'framer-motion';

const validate = (fields) => {
  const errs = {};
  if (!fields.email) errs.email = 'Email range required';
  else if (!/\S+@\S+\.\S+/.test(fields.email)) errs.email = 'Format mismatch';
  if (!fields.password) errs.password = 'Key required';
  return errs;
};

export function LoginPage() {
  const { user, login } = useAuth();
  const { loading, run } = useAsync();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [apiErr, setApiErr] = useState('');

  useEffect(() => {
    if (user) {
      const role = user.role?.name;
      const path = role === 'ADMIN' ? '/admin' : role === 'COMPANY' ? '/company' : '/dashboard';
      navigate(path, { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiErr('');
    try {
      await run(() => login(form.email, form.password));
    } catch (err) {
      setApiErr(err?.response?.data || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 p-12 space-y-10 relative z-10 border border-slate-100"
      >
        <div className="text-center space-y-1">
          <div className="inline-flex w-12 h-12 bg-blue-600 rounded-2xl items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200 mb-4">J</div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 font-medium">Log in to manage your career</p>
        </div>

        {apiErr && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold px-4 py-3 rounded-2xl text-center">
            {apiErr}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Email Address</label>
                <input 
                  type="email" name="email" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold"
                  value={form.email} onChange={handleChange}
                />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Password</label>
                <input 
                  type="password" name="password" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold"
                  value={form.password} onChange={handleChange}
                />
             </div>
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-slate-400 text-xs font-bold hover:text-blue-600 no-underline transition-colors">Forgot Password?</Link>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-slate-900 text-white py-4.5 rounded-2xl font-bold text-sm tracking-wide shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm font-medium text-slate-400">
          New here? <Link to="/signup" className="text-blue-600 font-bold no-underline hover:underline">Create an account</Link>
        </p>
      </motion.div>
    </div>
  );
}

export function SignupPage() {
  const { signup } = useAuth();
  const { loading, run } = useAsync();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'CANDIDATE' });
  const [apiErr, setApiErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiErr('');
    try {
      await run(() => signup(form));
      navigate('/login');
    } catch (err) {
      setApiErr(err?.response?.data || 'An error occurred during registration');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 relative overflow-hidden">
        <div className="w-full max-w-[480px] bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 p-12 space-y-8 relative z-10 border border-slate-100">
            <div className="text-center space-y-1">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h1>
                <p className="text-slate-400 font-medium">Join thousands of professional builders</p>
            </div>
            
            {apiErr && <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold px-4 py-3 rounded-2xl text-center">{apiErr}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 ml-1">Full Name</label>
                        <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 font-semibold" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 ml-1">Email</label>
                        <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 font-semibold" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 ml-1">Password</label>
                        <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 font-semibold" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                    </div>
                </div>

                <div className="flex gap-4 p-1 bg-slate-50 rounded-[24px] border border-slate-100">
                    <button type="button" onClick={() => setForm({...form, role: 'CANDIDATE'})} className={`flex-1 py-3 px-4 rounded-[20px] font-bold text-xs transition-all ${form.role === 'CANDIDATE' ? 'bg-white shadow-lg text-blue-600' : 'text-slate-500'}`}>Candidate</button>
                    <button type="button" onClick={() => setForm({...form, role: 'COMPANY'})} className={`flex-1 py-3 px-4 rounded-[20px] font-bold text-xs transition-all ${form.role === 'COMPANY' ? 'bg-white shadow-lg text-blue-600' : 'text-slate-500'}`}>Employer</button>
                </div>

                <button 
                  type="submit" disabled={loading}
                  className="w-full bg-slate-900 text-white py-4.5 rounded-2xl font-bold text-sm tracking-wide shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Creating Account..." : "Register Now"}
                </button>
            </form>

            <p className="text-center text-sm font-medium text-slate-400">
                Already have an account? <Link to="/login" className="text-blue-600 font-bold no-underline hover:underline">Log in</Link>
            </p>
        </div>
    </div>
  );
}
