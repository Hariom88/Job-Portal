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
  const [timer, setTimer] = useState(300); // Default 5 minutes
  const [canResend, setCanResend] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toasts, showToast } = useToast();
  const email = location.state?.email || localStorage.getItem('pending_verify_email');

  // Persist timer and email on reload
  useEffect(() => {
    if (email) {
      localStorage.setItem('pending_verify_email', email);
      
      const storedExpiry = localStorage.getItem(`otp_expiry_${email}`);
      const now = Date.now();
      
      if (storedExpiry) {
        const remaining = Math.floor((parseInt(storedExpiry) - now) / 1000);
        if (remaining > 0) {
          setTimer(remaining);
          setCanResend(false);
        } else {
          setTimer(0);
          setCanResend(true);
        }
      } else {
        // First time on this page for this email, set 5 min expiry
        const expiryTime = now + 300000; // 5 minutes
        localStorage.setItem(`otp_expiry_${email}`, expiryTime.toString());
        setTimer(300);
        setCanResend(false);
      }
    }
  }, [email]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
      localStorage.removeItem('pending_verify_email');
      localStorage.removeItem(`otp_expiry_${email}`);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errorMsg = typeof err.response?.data === 'string' ? err.response.data : (err.response?.data?.message || 'Invalid OTP');
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setResending(true);
    try {
      await authService.resendOtp({ email });
      showToast('New OTP sent to your email', 'success');
      const newExpiry = Date.now() + 300000;
      localStorage.setItem(`otp_expiry_${email}`, newExpiry.toString());
      setTimer(300);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      showToast('Failed to resend OTP', 'error');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070a] flex items-center justify-center px-6 py-12 font-['Outfit']">
      <ToastContainer toasts={toasts} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl p-10 border border-slate-100 dark:border-white/5 relative overflow-hidden"
      >
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

        <div className="text-center mb-10 relative z-10">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20">
            <span className="text-3xl text-white">📧</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Verify Account</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">We've sent a 6-digit code to <br/><span className="text-blue-600 dark:text-blue-400 font-bold">{email}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="flex justify-between gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-full aspect-square text-center text-2xl font-black text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-white/5 rounded-2xl focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all shadow-sm"
              />
            ))}
          </div>

          <div className="text-center">
             <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${timer > 0 ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'}`}>
                <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                {timer > 0 ? `Expires in ${formatTime(timer)}` : 'OTP Expired'}
             </div>
          </div>

          <button
            type="submit"
            disabled={loading || timer === 0}
            className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/10 disabled:opacity-50 active:scale-95"
          >
            {loading ? 'Verifying...' : 'Verify & Activate'}
          </button>
        </form>

        <div className="mt-10 text-center relative z-10">
          <p className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest mb-4">Didn't receive code?</p>
          <button 
            onClick={handleResend}
            disabled={resending || !canResend}
            className={`font-black uppercase tracking-tight transition-all ${canResend ? 'text-blue-600 dark:text-blue-400 hover:underline cursor-pointer' : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'}`}
          >
            {resending ? 'Sending...' : 'Resend OTP'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
