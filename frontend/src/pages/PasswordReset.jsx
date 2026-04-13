import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAsync } from '../hooks/useHooks';
import { FormField, PrimaryButton } from '../components/UI';

export function ForgotPassword() {
  const { loading, run } = useAsync();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      await run(() => authService.forgotPassword(email));
      setSuccess('Reset link sent to your email! (Simulated) 📧');
    } catch (err) {
      setError(err?.response?.data || 'Failed to send reset link.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Reset Password</h1>
          <p className="text-slate-500 text-sm mt-2">Enter your email and we'll send you a recovery link.</p>
        </div>

        {success && <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm font-medium border border-emerald-100">{success}</div>}
        {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          <PrimaryButton type="submit" loading={loading} className="w-full">Send Reset Link</PrimaryButton>
        </form>

        <p className="text-center text-sm">
          <Link to="/login" className="text-blue-600 font-bold hover:underline">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export function ResetPassword() {
  const { loading, run } = useAsync();
  const [form, setForm] = useState({ token: '', newPassword: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await run(() => authService.resetPassword(form));
      setSuccess('Password updated successfully! 🚀');
    } catch (err) {
      setError(err?.response?.data || 'Invalid token or request.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-6">
        <h1 className="text-2xl font-black text-slate-900 uppercase text-center">New Password</h1>
        
        {success && <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm font-medium">{success} <Link to="/login" className="underline">Login here</Link></div>}
        {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Reset Token" placeholder="Enter token from email" value={form.token} onChange={e => setForm({...form, token: e.target.value})} required />
          <FormField label="New Password" type="password" placeholder="••••••••" value={form.newPassword} onChange={e => setForm({...form, newPassword: e.target.value})} required />
          <PrimaryButton type="submit" loading={loading} className="w-full">Update Password</PrimaryButton>
        </form>
      </div>
    </div>
  );
}
