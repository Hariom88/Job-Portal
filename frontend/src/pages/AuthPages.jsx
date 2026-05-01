import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../hooks/useHooks';
import { motion } from 'framer-motion';

export function LoginPage() {
  const { user, login } = useAuth();
  const { loading, run } = useAsync();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [apiErr, setApiErr] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      const role = user.role?.name;
      const path = role === 'ADMIN' ? '/admin' : role === 'COMPANY' ? '/company' : '/dashboard';
      navigate(path, { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiErr('');
    try {
      await run(() => login(form.email, form.password));
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data;
      setApiErr(typeof msg === 'string' ? msg : 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#05070a] font-['Outfit'] overflow-hidden relative">
      {/* BACKGROUND DECORATIONS (Floating Glows) */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Left Panel - Brand / Visual (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 overflow-hidden flex-col justify-center p-16">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <Link to="/" className="absolute top-16 left-16 z-10 flex items-center gap-3 no-underline text-white">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/30">J</div>
          <span className="text-2xl font-black tracking-tight">PrimeJobs</span>
        </Link>
        <div className="relative z-10 space-y-8">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-6xl font-black text-white leading-tight tracking-tighter">
            Elevate your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">Career.</span>
          </motion.h2>
          <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed">The modern platform for elite professionals and world-class companies.</p>
        </div>
      </div>

      {/* Right Panel - Form (Mobile Optimized Premium) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-between p-6 sm:p-12 relative min-h-screen">
        
        {/* MOBILE TOP SECTION */}
        <div className="lg:hidden w-full pt-8 text-center space-y-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-100 dark:border-blue-800">
             <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Platform Online</span>
          </motion.div>
          <div className="space-y-1">
             <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">PrimeJobs</h1>
             <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.3em]">Next-Gen Hiring</p>
          </div>
        </div>

        {/* GLASS FORM CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px] bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl p-8 md:p-12 rounded-[40px] border border-white dark:border-white/10 shadow-2xl shadow-slate-200 dark:shadow-none space-y-8 relative"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Please enter your account details.</p>
          </div>

          {apiErr && (
            <motion.div initial={{ x: -10 }} animate={{ x: 0 }} className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-bold px-4 py-3 rounded-2xl">
              {apiErr}
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
               <div className="group">
                  <label className="text-[10px] font-black text-slate-400 group-focus-within:text-blue-600 transition-colors uppercase tracking-widest ml-1 mb-2 block">Email</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">📧</span>
                    <input 
                      type="email" required
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl pl-12 pr-4 py-4 text-slate-900 dark:text-white outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-semibold text-sm"
                      value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      placeholder="name@company.com"
                    />
                  </div>
               </div>
               <div className="group">
                  <div className="flex items-center justify-between ml-1 mb-2">
                    <label className="text-[10px] font-black text-slate-400 group-focus-within:text-blue-600 transition-colors uppercase tracking-widest">Password</label>
                    <Link to="/forgot-password" className="text-blue-600 text-[10px] font-black hover:underline no-underline">FORGOT?</Link>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">🔑</span>
                    <input 
                      type={showPassword ? "text" : "password"} required
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl pl-12 pr-12 py-4 text-slate-900 dark:text-white outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-semibold text-sm"
                      value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10px] hover:text-blue-600">
                      {showPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>
               </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4.5 rounded-2xl font-black text-sm shadow-2xl shadow-slate-200 dark:shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 h-[56px] flex items-center justify-center gap-2"
            >
              {loading ? "Authenticating..." : "Sign In to PrimeJobs"}
            </button>
          </form>

          <p className="text-center text-[13px] font-bold text-slate-400">
            New here? <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-black no-underline hover:underline ml-1">Create Account</Link>
          </p>
        </motion.div>

        {/* MOBILE FOOTER (Minimalist) */}
        <div className="lg:hidden w-full py-8 text-center">
           <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.4em] opacity-40">© 2026 PrimeJobs Ecosystem</p>
        </div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const { signup } = useAuth();
  const { loading, run } = useAsync();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', role: 'CANDIDATE' });
  const [apiErr, setApiErr] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiErr('');
    setSuccess(false);
    try {
      await run(() => signup(form));
      setSuccess(true);
      // Navigate to OTP verification after account creation
      setTimeout(() => navigate('/verify-otp', { state: { email: form.email } }), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data;
      setApiErr(typeof msg === 'string' ? msg : 'An error occurred during registration');
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#05070a] font-['Outfit'] relative overflow-hidden">
      
      {/* Left Panel - Brand / Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 overflow-hidden flex-col justify-center p-16">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        {/* Brand - Fixed top */}
        <Link to="/" className="absolute top-16 left-16 z-10 flex items-center gap-3 no-underline text-white">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/30">J</div>
          <span className="text-2xl font-black tracking-tight">PrimeJobs</span>
        </Link>

        <div className="relative z-10 space-y-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-5xl font-black text-white leading-[1.1] tracking-tight"
          >
            Start building your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">dream team today.</span>
          </motion.h2>
        </div>
      </div>

      {/* Right Panel - Form (Enhanced) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24 relative bg-white dark:bg-[#05070a]">
        
        <Link to="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-2 no-underline text-slate-900 dark:text-white">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white shadow-md">J</div>
          <span className="text-xl font-black tracking-tight">PrimeJobs</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-[400px] space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Create Account</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Join the platform to unlock your potential.</p>
          </div>

          {apiErr && (
            <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
              {apiErr}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
              Account created! Redirecting to login...
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
               <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" required
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-semibold shadow-sm"
                    value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})}
                    placeholder="John Doe"
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" required
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-semibold shadow-sm"
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="name@company.com"
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Phone Number</label>
                  <input 
                    type="tel"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-semibold shadow-sm"
                    value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    placeholder="+91 00000 00000"
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} required
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-semibold shadow-sm"
                      value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-xs"
                    >
                      {showPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>
               </div>

               <div className="space-y-2 pt-2">
                 <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">I am a...</label>
                 <div className="flex p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                   <button 
                     type="button" 
                     onClick={() => setForm({...form, role: 'CANDIDATE'})} 
                     className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${form.role === 'CANDIDATE' ? 'bg-white dark:bg-slate-800 shadow-md text-blue-600 border border-slate-200/10' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                     Candidate
                   </button>
                   <button 
                     type="button" 
                     onClick={() => setForm({...form, role: 'COMPANY'})} 
                     className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${form.role === 'COMPANY' ? 'bg-white dark:bg-slate-800 shadow-md text-blue-600 border border-slate-200/10' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                     Employer
                   </button>
                 </div>
               </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-slate-200 dark:shadow-blue-900/20 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center h-[52px]"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
            Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline no-underline ml-1">Log in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
