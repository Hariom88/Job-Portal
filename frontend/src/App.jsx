import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation, useNavigationType } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';

// Context & UI
import { AuthProvider, useAuth } from './context/AuthContext';
import { useToast } from './hooks/useHooks';
import { ToastContainer, ProtectedRoute } from './components/UI';

// Components & Layouts
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';

// Pages
import Home from './pages/Home';
import JobDetail from './pages/JobDetail';
import { CompanyDashboard, CandidateDashboard } from './pages/Dashboards';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageCompanies from './pages/ManageCompanies';
import ManageJobs from './pages/ManageJobs';
import ManageApplications from './pages/ManageApplications';
import AdminReports from './pages/AdminReports';
import { LoginPage, SignupPage } from './pages/AuthPages';
import { PostJobPage } from './pages/JobForms';
import { ForgotPassword, ResetPassword } from './pages/PasswordReset';

// SCROLL RESTORATION
function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  useEffect(() => {
    if (navType !== 'POP') window.scrollTo(0, 0);
  }, [pathname, navType]);
  return null;
}

// MAIN APP CONTENT
function AppContent() {
  const { user, loading, isAdmin, isCompany, isCandidate } = useAuth();
  const { toasts } = useToast();
  const { pathname } = useLocation();

  if (loading) return null;

  const isInsideAdmin = pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen font-['Outfit'] ${!isInsideAdmin ? 'bg-slate-50 pt-16' : 'bg-white'}`}>
      <ScrollToTop />
      
      {/* Hide global Navbar/Footer if inside Admin Panel */}
      {!isInsideAdmin && <Navbar />}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={isAdmin ? "/admin" : isCompany ? "/company" : "/dashboard"} replace />} />
        <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ADMIN ROUTES (Wrapped in AdminLayout) */}
        <Route path="/admin/*" element={
          <ProtectedRoute condition={isAdmin}>
            <AdminLayout>
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="companies" element={<ManageCompanies />} />
                <Route path="jobs" element={<ManageJobs />} />
                <Route path="applications" element={<ManageApplications />} />
                <Route path="reports" element={<AdminReports />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* OTHER PROTECTED ROUTES */}
        <Route path="/job/:id" element={<ProtectedRoute condition={!!user}><JobDetail /></ProtectedRoute>} />
        <Route path="/company" element={<ProtectedRoute condition={isCompany}><CompanyDashboard /></ProtectedRoute>} />
        <Route path="/post-job" element={<ProtectedRoute condition={isCompany}><PostJobPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute condition={isCandidate}><CandidateDashboard /></ProtectedRoute>} />

        {/* CATCH-ALL */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes>

      {!isInsideAdmin && (
        <footer className="mt-20 border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">J</div>
                <h3 className="text-xl font-bold">PrimeJobs</h3>
              </div>
              <p className="text-slate-400 text-sm max-w-sm mx-auto md:mx-0">Empowering the next generation of builders.</p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 py-6 border-t border-slate-100 flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-tighter">
            <p>&copy; 2026 PrimeJobs Inc.</p>
          </div>
        </footer>
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
