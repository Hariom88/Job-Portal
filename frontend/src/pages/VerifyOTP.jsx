import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';
import { useToast } from '../hooks/useHooks';
import { ToastContainer } from '../components/UI';
import { motion } from 'framer-motion';

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toasts, showToast } = useToast();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) {
      showToast('Please enter the full 6-digit OTP', 'error');
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOtp({ email, otp: otpString });
      showToast('Account verified successfully!', 'success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      showToast(err.response?.data || 'Invalid OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authService.resendOtp({ email });
      showToast('New OTP sent to your email', 'success');
    } catch (err) {
      showToast('Failed to resend OTP', 'error');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <ToastContainer toasts={toasts} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-slate-100"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📧</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Verify Account</h1>
          <p className="text-slate-500 font-medium">We've sent a 6-digit code to <br/><span className="text-blue-600 font-bold">{email}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-black text-blue-600 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-600 focus:bg-white outline-none transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify & Activate'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">Didn't receive code?</p>
          <button 
            onClick={handleResend}
            disabled={resending}
            className="text-blue-600 font-black uppercase tracking-tighter hover:underline disabled:opacity-50"
          >
            {resending ? 'Sending...' : 'Resend OTP'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
