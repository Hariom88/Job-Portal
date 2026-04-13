import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../hooks/useHooks';
import { FormField, PrimaryButton } from '../components/UI';

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

  // EFFECTIVE REDIRECT: If user state is detected, move to dashboard
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
      // Login will update the 'user' state in AuthContext, triggering the useEffect above
      await run(() => login(form.email, form.password));
    } catch (err) {
      setApiErr(err?.response?.data || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <div className="inline-flex w-12 h-12 bg-blue-600 rounded-2xl items-center justify-center text-white font-bold text-xl mb-4">J</div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Member Sign In</h1>
          <p className="text-slate-400 text-sm font-medium">Access your personalized dashboard</p>
        </div>

        {apiErr && <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase px-4 py-3 rounded-xl">{apiErr}</div>}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate autoComplete="off">
          <FormField label="Email" type="email" name="email" placeholder="you@example.com"
            value={form.email} onChange={handleChange} error={errors.email} autoComplete="off" />
          <FormField label="Password" type="password" name="password" placeholder="••••••••"
            value={form.password} onChange={handleChange} error={errors.password} autoComplete="new-password" />

          <div className="text-right">
            <Link to="/forgot-password" className="text-blue-600 text-xs font-bold hover:underline">Forgot password?</Link>
          </div>

          <PrimaryButton type="submit" loading={loading} className="w-full">
            LOGIN TO ACCOUNT
          </PrimaryButton>
        </form>

        <p className="text-center text-xs font-bold text-slate-500">
          NEW HERE?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">CREATE ACCOUNT</Link>
        </p>
      </div>
    </div>
  );
}

export function SignupPage() {
  const { signup } = useAuth();
  const { loading, run } = useAsync();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'CANDIDATE' });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await run(() => signup(form));
      navigate('/login');
    } catch (err) {}
  };

  return (
     <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 space-y-6 text-center">
            <h1 className="text-2xl font-black text-slate-900 uppercase">Create Account</h1>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <FormField label="Full Name" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
                <FormField label="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                <FormField label="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                <div className="flex gap-2">
                    <button type="button" onClick={() => setForm({...form, role: 'CANDIDATE'})} className={`flex-1 py-3 rounded-xl border-2 font-black text-xs uppercase ${form.role === 'CANDIDATE' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100'}`}>Candidate</button>
                    <button type="button" onClick={() => setForm({...form, role: 'COMPANY'})} className={`flex-1 py-3 rounded-xl border-2 font-black text-xs uppercase ${form.role === 'COMPANY' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100'}`}>Employer</button>
                </div>
                <PrimaryButton type="submit" loading={loading} className="w-full">Sign Up</PrimaryButton>
            </form>
        </div>
     </div>
  );
}
