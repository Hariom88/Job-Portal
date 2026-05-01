import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Auto-login from localStorage on mount ──────────────────────────────────
  useEffect(() => {
    const savedUser  = localStorage.getItem('jobportal_user');
    const savedToken = localStorage.getItem('jobportal_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // ── Inactivity Timeout (10 minutes) ────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    let timeout;
    const resetTimer = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        alert("Session Expired due to inactivity. Please login again.");
        logout();
      }, 10 * 60 * 1000); // 10 minutes
    };

    // Events to track activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer(); // Initialize timer

    return () => {
      if (timeout) clearTimeout(timeout);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [user]);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const { data } = await authService.login({ email, password });
    localStorage.setItem('jobportal_token', data.token);
    localStorage.setItem('jobportal_refreshToken', data.refreshToken);
    localStorage.setItem('jobportal_user',  JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  // ── Signup ─────────────────────────────────────────────────────────────────
  const signup = async (formData) => {
    const { data } = await authService.signup(formData);
    return data; // Will contain the message about OTP
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('jobportal_token');
    localStorage.removeItem('jobportal_refreshToken');
    localStorage.removeItem('jobportal_user');
    setUser(null);
  };

  // ── Role helpers ───────────────────────────────────────────────────────────
  const userRole   = user?.role?.name?.toUpperCase();
  const isAdmin     = userRole === 'ADMIN';
  const isCompany   = userRole === 'COMPANY';
  const isCandidate = userRole === 'CANDIDATE';

  const dashboardPath = isAdmin ? '/admin' : isCompany ? '/company' : '/dashboard';

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAdmin, isCompany, isCandidate, dashboardPath }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
