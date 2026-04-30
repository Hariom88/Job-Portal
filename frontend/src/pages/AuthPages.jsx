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
    <div className="min-h-screen flex bg-white font-['Outfit']">
      {/* Left Panel - Brand / Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 overflow-hidden flex-col justify-between p-16">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px,transparent 1px),linear-gradient(90deg,#ffffff 1px,transparent 1px)', backgroundSize: '40px 40px' }}></div>

        {/* Brand */}
        <Link to="/" className="relative z-10 flex items-center gap-3 no-underline text-white">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/30">J</div>
          <span className="text-2xl font-black tracking-tight">PrimeJobs</span>
        </Link>

        {/* Center Graphic / Text */}
        <div className="relative z-10 space-y-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-5xl font-black text-white leading-[1.1] tracking-tight"
          >
            The fastest way to <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">hire top talent.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-slate-400 text-lg font-medium max-w-md leading-relaxed"
          >
            Join thousands of modern companies and ambitious professionals building the future together.
          </motion.p>

          {/* Social Proof */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="pt-8 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm relative z-[4] hover:z-10 hover:-translate-y-1 transition-transform cursor-default">
                   {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-sm font-semibold text-slate-400">
              Trusted by 10,000+ teams
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24 relative bg-white">
        
        <Link to="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-2 no-underline text-slate-900">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white shadow-md">J</div>
          <span className="text-xl font-black tracking-tight">PrimeJobs</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-[400px] space-y-10"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Log In</h1>
            <p className="text-slate-500 font-medium text-sm">Enter your credentials to access your account.</p>
          </div>

          {apiErr && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold px-4 py-3 rounded-xl flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              {apiErr}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
               <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" name="email" required
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-semibold shadow-sm"
                    value={form.email} onChange={handleChange}
                    placeholder="name@company.com"
                  />
               </div>
               <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                    <Link to="/forgot-password" className="text-blue-600 text-xs font-bold hover:underline no-underline">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} name="password" required
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-semibold shadow-sm"
                      value={form.password} onChange={handleChange}
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
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center h-[52px]"
            >
              {loading ? (
                 <span className="flex items-center justify-center gap-2">
                   <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   Authenticating...
                 </span>
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm font-semibold text-slate-500">
            Don't have an account? <Link to="/signup" className="text-blue-600 font-bold hover:underline no-underline ml-1">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const { signup } = useAuth();
  const { loading, run } = useAsync();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'CANDIDATE' });
  const [apiErr, setApiErr] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen flex bg-white font-['Outfit']">
      
      {/* Left Panel - Brand / Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 overflow-hidden flex-col justify-between p-16">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        <Link to="/" className="relative z-10 flex items-center gap-3 no-underline text-white">
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="space-y-6 pt-4"
          >
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 text-sm shadow-inner">✓</div>
                <div>
                   <h4 className="text-white font-bold">100% Free for Candidates</h4>
                   <p className="text-slate-400 text-sm mt-1 font-medium leading-relaxed">Apply to unlimited jobs with zero hidden fees.</p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 text-sm shadow-inner">✓</div>
                <div>
                   <h4 className="text-white font-bold">Advanced AI Matching</h4>
                   <p className="text-slate-400 text-sm mt-1 font-medium leading-relaxed">Our algorithms connect the right talent to the right roles instantly.</p>
                </div>
             </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24 relative bg-white">
        
        <Link to="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-2 no-underline text-slate-900">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white shadow-md">J</div>
          <span className="text-xl font-black tracking-tight">PrimeJobs</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-[400px] space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
            <p className="text-slate-500 font-medium text-sm">Join the platform to unlock your potential.</p>
          </div>

          {apiErr && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold px-4 py-3 rounded-xl flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              {apiErr}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
               <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" required
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-semibold shadow-sm"
                    value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})}
                    placeholder="John Doe"
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" required
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-semibold shadow-sm"
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="name@company.com"
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} required
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-semibold shadow-sm"
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
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest">I am a...</label>
                 <div className="flex p-1.5 bg-slate-50 border border-slate-100 rounded-xl">
                   <button 
                     type="button" 
                     onClick={() => setForm({...form, role: 'CANDIDATE'})} 
                     className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${form.role === 'CANDIDATE' ? 'bg-white shadow-md text-blue-600 border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                     Candidate
                   </button>
                   <button 
                     type="button" 
                     onClick={() => setForm({...form, role: 'COMPANY'})} 
                     className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${form.role === 'COMPANY' ? 'bg-white shadow-md text-blue-600 border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                     Employer
                   </button>
                 </div>
               </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center h-[52px]"
            >
              {loading ? (
                 <span className="flex items-center justify-center gap-2">
                   <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   Creating Account...
                 </span>
              ) : "Register"}
            </button>
          </form>

          <p className="text-center text-sm font-semibold text-slate-500">
            Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline no-underline ml-1">Log in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
