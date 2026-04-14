import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../hooks/useHooks';
import { FormField, PrimaryButton } from '../components/UI';
import { motion } from 'framer-motion';

const validate = (fields) => {
  const errs = {};
  if (!fields.email) errs.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(fields.email)) errs.email = 'Enter a valid email';
  if (!fields.password) errs.password = 'Password is required';
  else if (fields.password.length < 6) errs.password = 'Min 6 characters';
  return errs;
};

export function LoginPage() {
  const { user, login } = useAuth();
  const { loading, run } = useAsync();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
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
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiErr('');
    try {
      await run(() => login(form.email, form.password));
    } catch (err) {
      setApiErr(err?.response?.data || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-3xl rounded-[48px] border border-white/10 shadow-2xl p-10 space-y-8 relative z-10"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 bg-blue-600 rounded-2xl items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-900/40 mb-4">J</div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Authentication</h1>
          <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Secure Node Access</p>
        </div>

        {apiErr && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase px-6 py-4 rounded-2xl text-center"
          >
            {apiErr}
          </motion.div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Identifier</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email sync address"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all font-bold placeholder:text-slate-700"
                  value={form.email} 
                  onChange={handleChange}
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Protocol Key</label>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Encryption key"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all font-bold placeholder:text-slate-700"
                  value={form.password} 
                  onChange={handleChange}
                />
             </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <Link to="/forgot-password" ***="text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-blue-400">Recovery</Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-900/20 hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Decrypting..." : "Initialize Session"}
          </button>
        </form>

        <p className="text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
          No account? <Link to="/signup" className="text-blue-500 hover:text-blue-400 transition-colors">Register Identity</Link>
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
      setApiErr(err?.response?.data || 'Protocol error. Verification failed.');
    }
  };

  return (
     <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4 py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-3xl rounded-[48px] border border-white/10 shadow-2xl p-10 space-y-10 relative z-10"
        >
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Registration</h1>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Create New Node</p>
            </div>
            
            {apiErr && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase px-6 py-4 rounded-2xl text-center">{apiErr}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <input 
                      placeholder="Full Name"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all font-bold text-sm placeholder:text-slate-700"
                      value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} 
                    />
                    <input 
                      placeholder="Email Sync"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all font-bold text-sm placeholder:text-slate-700"
                      value={form.email} onChange={e => setForm({...form, email: e.target.value})} 
                    />
                    <input 
                      type="password"
                      placeholder="Security Pin"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all font-bold text-sm placeholder:text-slate-700"
                      value={form.password} onChange={e => setForm({...form, password: e.target.value})} 
                    />
                </div>

                <div className="flex gap-3 bg-white/5 p-2 rounded-[24px] border border-white/10">
                    <button type="button" onClick={() => setForm({...form, role: 'CANDIDATE'})} className={`flex-1 py-3 rounded-[18px] font-black text-[10px] uppercase tracking-widest transition-all ${form.role === 'CANDIDATE' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 hover:text-slate-300'}`}>Candidate</button>
                    <button type="button" onClick={() => setForm({...form, role: 'COMPANY'})} className={`flex-1 py-3 rounded-[18px] font-black text-[10px] uppercase tracking-widest transition-all ${form.role === 'COMPANY' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 hover:text-slate-300'}`}>Employer</button>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-900/20 hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Injecting..." : "Finalize Protocol"}
                </button>
            </form>

            <p className="text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                Active ID? <Link to="/login" className="text-blue-500 hover:text-blue-400 transition-colors">Synchronize</Link>
            </p>
        </motion.div>
     </div>
  );
}
