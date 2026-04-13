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

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const { data } = await authService.login({ email, password });
    localStorage.setItem('jobportal_token', data.token);
    localStorage.setItem('jobportal_user',  JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  // ── Signup ─────────────────────────────────────────────────────────────────
  const signup = async (formData) => {
    await authService.signup(formData);
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('jobportal_token');
    localStorage.removeItem('jobportal_user');
    setUser(null);
  };

  // ── Role helpers ───────────────────────────────────────────────────────────
  const userRole   = user?.role?.name;
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
